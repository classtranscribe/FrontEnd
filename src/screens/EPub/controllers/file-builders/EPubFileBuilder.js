import _ from 'lodash';
import AdmZip from 'adm-zip';
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

/**
 * File buffer builder for .epub
 */
class EPubFileBuilder {
  /**
   * Create an EPubFileBuilder
   * @param {EPubData} ePubData
   */
  constructor() {
    this.zip = new AdmZip();
  }

  async init(parsedData) {
    this.data = parsedData;
    this.language = this.data.language;
    this.glossary = parsedData.glossary;
    this.videoLinks = parsedData.videoLinks;
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

    // content itemrefs
    let contentItemsRefs = _.map(chapters, (ch) => `<itemref idref="${ch.id}"/>`
    ).join('\n\t\t');

    if (this.glossary && !_.isEmpty(this.glossary) && !this.data.chapterGlossary) {
      contentItems += `<item id="glossary" href="glossary.xhtml" media-type="application/xhtml+xml" />`;
      contentItemsRefs += `<itemref idref="glossary"/>`
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
    let navContents = "";
    _.forEach(chapters, (ch, index) => {
      navContents += `
      <dt class="table-of-content">  
        <a href="${ch.id}.xhtml">${index + 1} - ${ch.title} </a>
      </dt>
      `}
    )
    // eslint-disable-next-line no-console
    console.log("toc navcontents", navContents);

    const toc_xhtml = OEBPS_TOC_XHTML({ title: this.data.title, language: this.language, navContents });
    // eslint-disable-next-line no-console
    console.log("add toc xhtml");
    this.zip.addFile('OEBPS/toc.xhtml', toc_xhtml);
  }

  buildVisualTocXHTML(visualTOC) {
    let navContents = _.map(visualTOC, (ch, chIdx) => {
      return _.map(ch, (img) => {
        // eslint-disable-next-line no-console
        console.log(img);
        return `
          <dt class="table-of-content">  
          <a href="${this.data.chapters[chIdx].id}.xhtml"><img src="${img.src}"/></a>
          </dt>
        `
      }).join("\n")
    }).join("\n");

    // eslint-disable-next-line no-console
    console.log("vtoc navcontents", navContents);
    const toc_xhtml = OEBPS_TOC_XHTML({ title: this.data.title, language: this.language, navContents });
    // eslint-disable-next-line no-console
    console.log("add visual toc xhtml", toc_xhtml);

    this.zip.addFile('OEBPS/toc.xhtml', toc_xhtml);
  }
  buildTocNCX(chapters) {
    let navPoints = "";
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
    this.zip.addFile('OEBPS/toc.NCX', toc_ncx);
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
    return OEBPS_CONTENT_XHTML({ title: "Glossary", content: glossaryToHTMLString(glossary), language: this.language });
  }

  convertChapter(idx, chapter, chapterGlossary) {
    const text = HTMLFileBuilder.convertChapter(idx, chapter, chapterGlossary, this.data.includeRawLatex, this.videoLinks);
    let content = dedent(`
      <div class="epub-ch">            
        ${text}
      </div>
      `);

    return OEBPS_CONTENT_XHTML({ title: chapter.title, content, language: this.language })
  }

  convertEPub() {
    _.forEach(this.data.chapters, (ch, idx) => {
      const contentXHTML = this.convertChapter(idx, ch, this.data.chapterGlossary ? this.data.chapterGlossary[idx] : false);
      this.zip.addFile(`OEBPS/${ch.id}.xhtml`, Buffer.from(contentXHTML));
    });
    if (this.glossary && !_.isEmpty(this.glossary) && !this.data.chapterGlossary) {
      const glossaryXHTML = this.convertGlossary(this.glossary);
      this.zip.addFile(`OEBPS/glossary.xhtml`, Buffer.from(glossaryXHTML));
    }
  }

  getEPubBuffer() {
    const { title, author, language, chapters } = this.data;
    const zip = this.zip;

    // mimetype
    zip.addFile('mimetype', Buffer.from(MIMETYPE));
    // META-INF/container.xml
    zip.addFile('META-INF/container.xml', Buffer.from(META_INF_CONTAINER_XML));

    // OEBPS
    // OEBPS/style.css
    zip.addFile('OEBPS/style.css', Buffer.from(OEBPS_STYLE_CSS));
    // OEBPS/katex.min.css
    zip.addFile('OEBPS/katex.min.css', Buffer.from(KATEX_MIN_CSS));
    // OEBPS/prism.css
    zip.addFile('OEBPS/prism.css', Buffer.from(PRISM_CSS));

    // OEBPS/chapter-id.xhtml
    // Note: convertEPub populates the chapter ids, so it has to be done first
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
    zip.addFile('OEBPS/content.opf', Buffer.from(contentOPF));

    return zip.toBuffer();
  }

  static getOptions(options) {
    options.replaceImageSrc = true;
    options.replaceLatex = false;
    return options;
  }
}

export default EPubFileBuilder;
