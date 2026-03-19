import _ from 'lodash';
import JSZip from 'jszip';
import PlaylistTypes from 'entities/Playlists/PlaylistTypes';
import { dedent } from 'dentist';
import { KATEX_MIN_CSS, PRISM_CSS } from './file-templates/styles';
import { glossaryToHTMLString } from './GlossaryCreator';

import {
  MIMETYPE,
  META_INF_CONTAINER_XML,
  OEBPS_STYLE_CSS,
  OEBPS_TOC_NCX,
  OEBPS_TOC_XHTML,
  OEBPS_CONTENT_OPF,
  OEBPS_CONTENT_XHTML,
} from './file-templates/epub';
import HTMLFileBuilder from './HTMLFileBuilder';

function dataUrlParts(dataUrl) {
  // data:[<mime>][;charset=utf-8][;base64],<data>
  const m = /^data:([^;,]+)(?:;charset=[^;,]+)?(?:;(base64))?,(.*)$/i.exec(dataUrl || '');
  if (!m) return null;
  const [, mime, isB64, payload] = m;
  return { mime, isBase64: !!isB64, payload };
}
function mimeToExt(mime) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpg';
  if (mime === 'image/gif') return 'gif';
  if (mime === 'image/svg+xml') return 'svg';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}
function bufferFromDataUrl(dataUrl) {
  const parts = dataUrlParts(dataUrl);
  if (!parts) return null;
  const { isBase64, payload } = parts;
  if (isBase64) {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new TextEncoder().encode(decodeURIComponent(payload));
}

function toUint8Array(value) {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  return new Uint8Array(value);
}

/**
 * File buffer builder for .epub
 */
class EPubFileBuilder {
  /**
   * Create an EPubFileBuilder
   * @param {EPubData} ePubData
   */
  constructor() {
    this.zip = new JSZip();
  }

  async init(parsedData) {
    this.data = parsedData;
    this.language = this.data.language;
    this.glossary = parsedData.glossary;
    this.videoLinks = parsedData.videoLinks;
    this.imageItems = [];
  }

  /**
   * Convert an EPubData object to a downloadable epub file buffer
   * @param {EPubData} ePubData
   * @returns {Buffer} epub file buffer
   */
  static async toBuffer(ePubData) {
    const builder = new EPubFileBuilder();
    await builder.init(ePubData);
    const buffer = await builder.getEPubBuffer();
    return buffer;
  }

  getContentOPF() {
    const { title, author, language, publisher, chapters } = this.data;
    // content items
    let contentItems = _.map(
      chapters,
      (ch) => `<item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml" />`,
    ).join('\n\t\t');

    // IMAGES — add one <item> per embedded image
    if (Array.isArray(this.imageItems) && this.imageItems.length) {
      const temp = this.imageItems
        .map((img) => `<item id="${img.id}" href="${img.href}" media-type="${img.mediaType}" />`)
        .join('\n\t\t');
      contentItems += `\n\t\t${temp}`;
    }

    // content itemrefs
    let contentItemsRefs = _.map(chapters, (ch) => `<itemref idref="${ch.id}"/>`).join('\n\t\t');

    if (this.glossary && !_.isEmpty(this.glossary) && !this.data.chapterGlossary) {
      contentItems += `<item id="glossary" href="glossary.xhtml" media-type="application/xhtml+xml" />`;
      contentItemsRefs += `<itemref idref="glossary"/>`;
    }

    return OEBPS_CONTENT_OPF({
      title,
      author,
      language,
      publisher,
      date: new Date(),
      contentItems,
      contentItemsRefs,
    });
  }

  buildTocXHTML(chapters) {
    let navContents = '';
    _.forEach(chapters, (ch, index) => {
      navContents += `
      <dt class="table-of-content">  
        <a href="${ch.id}.xhtml">${index + 1} - ${ch.title} </a>
      </dt>
      `;
    });

    const toc_xhtml = OEBPS_TOC_XHTML({
      title: this.data.title,
      language: this.language,
      navContents,
    });
    this.zip.file('OEBPS/toc.xhtml', toc_xhtml);
  }

  buildVisualTocXHTML(visualTOC) {
    let navContents = _.map(visualTOC, (ch, chIdx) => {
      return _.map(ch, (img) => {
        // eslint-disable-next-line no-console
        return `
          <dt class="table-of-content">  
          <a href="${this.data.chapters[chIdx].id}.xhtml"><img src="${img.src}"/></a>
          </dt>
        `;
      }).join('\n');
    }).join('\n');

    const toc_xhtml = OEBPS_TOC_XHTML({
      title: this.data.title,
      language: this.language,
      navContents,
    });

    this.zip.file('OEBPS/toc.xhtml', toc_xhtml);
  }
  buildTocNCX(chapters) {
    let navPoints = '';
    _.forEach(chapters, (ch, index) => {
      navPoints += `
		<navPoint id="${ch.id}" playOrder="${index}" class="chapter">
			<navLabel>
				<text>${index + 1} - ${ch.title}</text>
			</navLabel>
			<content src="${ch.id}.xhtml"/>
		`;
    });
    const toc_ncx = OEBPS_TOC_NCX({ title: this.data.title, author: this.data.author, navPoints });
    this.zip.file('OEBPS/toc.NCX', toc_ncx);
  }
  convertTableOfContents() {
    const chapters = this.data.chapters;
    if (this.data.visualTOC) {
      this.buildVisualTocXHTML(this.data.visualTOC);
    } else {
      this.buildTocXHTML(chapters);
    }
    this.buildTocNCX(chapters);
  }
  convertGlossary(glossary) {
    return OEBPS_CONTENT_XHTML({
      title: 'Glossary',
      content: glossaryToHTMLString(glossary),
      language: this.language,
    });
  }

  convertChapter(idx, chapter, chapterGlossary) {
    let text = HTMLFileBuilder.convertChapter(
      idx,
      chapter,
      chapterGlossary,
      this.data.includeRawLatex,
      this.videoLinks,
      (this.data.sourceType === PlaylistTypes.BoxID) ? this.data.jsonMetadata.shared_link.url : this.data.sourceId,
      this.data.sourceType,
    );

    // --- Normalize HTML via DOM, strip risky attributes, then XHTML-tidy ---
    try {
      // normalize curly quotes that can break attrs
      text = text
        .replace(/[\u201C\u201D]/g, '"') // curly double quotes -> "
        .replace(/[\u2018\u2019]/g, "'"); // curly single quotes -> '

      // Use DOM to normalize attributes & spacing
      const wrapper = document.createElement('div');
      wrapper.innerHTML = text;

      // Strip ALL data-* attributes (optional in EPUB, often malformed)
      wrapper.querySelectorAll('*').forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (/^data-/.test(attr.name)) {
            el.removeAttribute(attr.name);
          }
        });
      });

      // Serialize back to HTML
      text = wrapper.innerHTML;
    } catch (_e) {
      // If DOM parsing fails, continue with the raw text
    }

    // Final XHTML safety passes:
    // - self-close <img> tags
    text = text.replace(/<img([^>]*?)>/g, '<img$1 />');
    const VOID = [
      'br',
      'hr',
      'meta',
      'link',
      'input',
      'source',
      'track',
      'area',
      'base',
      'col',
      'embed',
      'param',
      'wbr',
    ];
    const voidRe = new RegExp(`<(${VOID.join('|')})([^/>]*?)>`, 'gi');
    text = text.replace(voidRe, '<$1$2 />');
    const closeVoidRe = new RegExp(`</(?:${VOID.join('|')})\\s*>`, 'gi');
    text = text.replace(closeVoidRe, '');
    text = text.replace(/&(?!#\d+;|#x[0-9A-Fa-f]+;|amp;|lt;|gt;|quot;|apos;)/g, '&amp;');

    let content = dedent(`
      <div class="epub-ch">            
        ${text}
      </div>
      `);

    return OEBPS_CONTENT_XHTML({ title: chapter.title, content, language: this.language });
  }

  prepareAndEmbedImages() {
    const imagesDir = 'OEBPS/images/';
    const imageItems = [];

    // eslint-disable-next-line complexity
    const rewriteImageObject = (imgObj) => {
      if (!imgObj) return;
      let buffer = null;
      let mime = null;
      let ext = 'jpg';

      if (typeof imgObj.src === 'string' && imgObj.src.startsWith('data:')) {
        const parts = dataUrlParts(imgObj.src);
        if (parts) {
          mime = parts.mime;
          ext = mimeToExt(mime);
          buffer = bufferFromDataUrl(imgObj.src);
        }
      }
      if (!buffer && (imgObj.buffer instanceof Uint8Array || imgObj.buffer instanceof ArrayBuffer)) {
        buffer = toUint8Array(imgObj.buffer);
      }

      if (!buffer) return;

      const id = imgObj.id || `img${imageItems.length + 1}`;
      const filename = `${id}.${ext}`;
      const href = `images/${filename}`;
      const mediaType = mime || 'image/jpeg';

      this.zip.file(`${imagesDir}${filename}`, toUint8Array(buffer));

      imgObj.src = href;

      imageItems.push({ id, href, mediaType });
    };

    const scanChapterContent = (c) => {
      if (typeof c !== 'string' && c && typeof c === 'object') {
        if (c.src || c.buffer) {
          rewriteImageObject.call(this, c);
        }
        if (Array.isArray(c.latex)) {
          c.latex.forEach((limg) => rewriteImageObject.call(this, limg));
        }
      }
    };

    (this.data.chapters || []).forEach((ch) => {
      (ch.contents || []).forEach(scanChapterContent);
    });

    this.imageItems = imageItems;
  }

  convertEPub() {
    _.forEach(this.data.chapters, (ch, idx) => {
      const contentXHTML = this.convertChapter(
        idx,
        ch,
        this.data.chapterGlossary ? this.data.chapterGlossary[idx] : false,
      );
      this.zip.file(`OEBPS/${ch.id}.xhtml`, contentXHTML);
    });
    if (this.glossary && !_.isEmpty(this.glossary) && !this.data.chapterGlossary) {
      const glossaryXHTML = this.convertGlossary(this.glossary);
      this.zip.file(`OEBPS/glossary.xhtml`, glossaryXHTML);
    }
  }

  getEPubBuffer() {
    const { title, author, language, chapters } = this.data;
    const zip = this.zip;

    // mimetype
    zip.file('mimetype', MIMETYPE);
    // META-INF/container.xml
    zip.file('META-INF/container.xml', META_INF_CONTAINER_XML);

    // OEBPS
    // OEBPS/style.css
    zip.file('OEBPS/style.css', OEBPS_STYLE_CSS);
    // OEBPS/katex.min.css
    zip.file('OEBPS/katex.min.css', KATEX_MIN_CSS);
    // OEBPS/prism.css
    zip.file('OEBPS/prism.css', PRISM_CSS);

    // OEBPS/chapter-id.xhtml
    // Note: convertEPub populates the chapter ids, so it has to be done first
    this.prepareAndEmbedImages();
    this.convertEPub();
    this.convertTableOfContents();

    // OEBPS/content.opf
    const contentOPF = this.getContentOPF(
      title,
      author,
      language,
      'ClassTranscribe',
      new Date(),
      chapters,
    );
    zip.file('OEBPS/content.opf', contentOPF);

    return zip.generateAsync({ type: 'blob' });
  }

  static getOptions(options) {
    options.replaceImageSrc = true;
    options.replaceLatex = false;
    return options;
  }
}

export default EPubFileBuilder;
