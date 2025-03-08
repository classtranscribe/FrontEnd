/* eslint-disable no-console */
/* eslint-disable complexity */
import _ from 'lodash';
import AdmZip from 'adm-zip';
import { dedent } from 'dentist';
// import { EPubData } from 'entities/EPubs';
import { links } from 'utils';
import EPubParser from './EPubParser';
import { KATEX_MIN_CSS, PRISM_CSS } from './file-templates/styles';
import {
  getGlossaryData,
  glossaryToHTMLString,
  getChapterGlossaryAndTextHighlight,
} from './GlossaryCreator';
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
    this.glossaryData = parsedData.glossary;
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
    const contentItems = _.map(
      chapters,
      (ch) => `<item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml" />`,
    ).join('\n\t\t');

    // content itemrefs
    const contentItemsRefs = _.map(chapters, (ch) => `<itemref idref="${ch.id}"/>`
    ).join('\n\t\t');

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
    const toc_xhtml = OEBPS_TOC_XHTML({ title: this.data.title, language: this.language, navContents });
    this.zip.addFile('OEBPS/toc.xhtml', toc_xhtml);
  }

  buildVisualTocXHTML(visualTOC) {
    console.log("epub visualTOC chapters", this.data);
    let navContents = _.map(visualTOC, (ch, chIdx) => {
      return _.map(ch, (img) => {
        console.log("id", this.data.chapters[chIdx].id);
        return `
          <dt class="table-of-content">  
          <a href="${this.data.chapters[chIdx].id}.xhtml"> <img src="${img.src}" alt="${img.alt}"/> </a>
          </dt>
        `
      }).join("\n")
    }).join("\n");
    const toc_xhtml = OEBPS_TOC_XHTML({ title: this.data.title, language: this.language, navContents });
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
  convertChapter(chapter) {
    const text = HTMLFileBuilder.convertChapter(chapter);
    let content = dedent(`
      <div class="epub-ch">            
        ${text}
      </div>
      `);

    return OEBPS_CONTENT_XHTML({ title: chapter.title, content, language: this.language })
  }

  convertEPub() {
    _.forEach(this.data.chapters, (ch) => {
      const contentXHTML = this.convertChapter(ch);
      this.zip.addFile(`OEBPS/${ch.id}.xhtml`, Buffer.from(contentXHTML));
    });
  }

  getEPubBuffer() {
    const { title, author, language, chapters, cover } = this.data;
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
    // OEBPS/chapter-id.xhtml
    this.convertEPub();
    this.convertTableOfContents();

    return zip.toBuffer();
  }

  static getOptions(options) {
    options.replaceImageSrc = true;
    options.replaceLatex = false;
    return options;
  }
}

export default EPubFileBuilder;
