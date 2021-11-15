import _ from 'lodash';
import AdmZip from 'adm-zip';
import { dedent } from 'dentist';
import { EPubData } from 'entities/EPubs';
import EPubParser from './EPubParser';
import { KATEX_MIN_CSS, PRISM_CSS } from './file-templates/styles';
import {
  MIMETYPE,
  META_INF_CONTAINER_XML,
  OEBPS_STYLE_CSS,
  OEBPS_TOC_NCX,
  OEBPS_TOC_XHTML,
  OEBPS_CONTENT_OPF,
  OEBPS_CONTENT_XHTML
} from './file-templates/epub';

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

  async init(ePubData) {
    this.data = await EPubParser.parse(ePubData);
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

  async insertImagesToZip() {
    // we embeded image into html
    /*
    const { cover, chapters } = this.data;
    const { coverBuffer, images } = 
      await EPubParser.loadEPubImageBuffers({ chapters, cover });

    this.zip.addFile(`OEBPS/cover.jpeg`, coverBuffer);
    _.forEach(images, (img) => {
      this.zip.addFile(`OEBPS/${img.relSrc}`, img.buffer);
    });
    */
  }

  getTocNCX() {
    const { title, author, chapters } = this.data;
    let navPoints = '';
    let playOrder = 0;
  
    const getPlayOrder = () => {
      playOrder += 1;
      return playOrder;
    };
  
    _.forEach(chapters, (ch, index) => {
      navPoints += `
        <navPoint id="${ch.id}" playOrder="${getPlayOrder()}" class="chapter">
            <navLabel>
                <text>${index + 1} - ${ch.title}</text>
            </navLabel>
            <content src="${ch.id}.xhtml"/>

            ${_.map(
              ch.subChapters,
              (subCh, subIndex) => `
            <navPoint id="${subCh.id}" playOrder="${getPlayOrder()}">
                <navLabel>
                    <text>${index + 1}.${subIndex + 1} - ${subCh.title}</text>
                </navLabel>
                <content src="${ch.id}.xhtml#${subCh.id}" />
            </navPoint>`,
            ).join('\n\t\t\t\t')}
        </navPoint>
        `;
    });
  
    return OEBPS_TOC_NCX({ title, author, navPoints });
  }

  getTocXHTML() {
    const { title, language, chapters } = this.data;
    let navContents = '';

    _.forEach(chapters, (ch, index) => {  
      // get image from chapter text 
      let divStart = ch.text.indexOf('<div'); 
      let altTextIndex = ch.text.indexOf('alt=')
      let image = ch.text.substring(divStart, altTextIndex);

      // set image size and alt text 
      image += 'alt="' + ch.title + '" ';
      image += 'width="70%"'
      image += '/>'
      image += '</div>'

      navContents += `
        <dt class="table-of-content">  
          <a href="${ch.id}.xhtml">${index + 1} - ${ch.title} ${image} </a>
        </dt>
        ${_.map(
          ch.subChapters,
          (subCh, subIndex) => `
            <dd>
                <a href="${ch.id}.xhtml#${subCh.id}">
                    ${index + 1}.${subIndex + 1} - ${subCh.title}
                </a>
            </dd>`,
        ).join('\n\t\t\t')}
        `;

    });
  
    return OEBPS_TOC_XHTML({ title, language, navContents });
  }

  getContentOPF() {
    const { title, author, language, publisher, chapters } = this.data;
    // image items
    const images = _.flatten(_.map(chapters, (ch) => ch.images));
    const imageItems = _.map(
      images,
      (img) => `<item id="${img.id}" href="images/${img.id}.jpeg" media-type="image/jpeg" />`,
    ).join('\n\t\t');
  
    // content items
    const contentItems = _.map(
      chapters,
      (ch) => `<item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml" />`,
    ).join('\n\t\t');
  
    // content itemrefs
    const contentItemsRefs = _.map(chapters, (ch) => `<itemref idref="${ch.id}"/>`).join('\n\t\t');
  
    return OEBPS_CONTENT_OPF({
      title,
      author,
      language,
      publisher,
      date: new Date(),
      imageItems,
      contentItems,
      contentItemsRefs
    });
  }

  getContentXHTML(chapter) {
    const { language } = this.data;
    const { title, text } = chapter;
  
    const content = dedent(`
        <div class="epub-ch">
            ${text}
        </div>
      `);
    return OEBPS_CONTENT_XHTML({ title, content, language });
  }
  
  async getEPubBuffer() {
    const { title, author, language, chapters, cover } = this.data;
    const zip = this.zip;

    // OEBPS/cover.jpeg
    // OEBPS/images/image-id.jpeg
    await this.insertImagesToZip(chapters, cover);

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

    // OEBPS/toc.ncx
    const toxNCX = this.getTocNCX(title, author, chapters);
    zip.addFile('OEBPS/toc.ncx', Buffer.from(toxNCX));
    // OEBPS/toc.xhtml
    const tocXHTML = this.getTocXHTML(title, language, chapters);
    zip.addFile('OEBPS/toc.xhtml', Buffer.from(tocXHTML));

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
    _.forEach(chapters, (ch) => {
      const contentXHTML = this.getContentXHTML(ch, language);
      zip.addFile(`OEBPS/${ch.id}.xhtml`, Buffer.from(contentXHTML));
    });

    return zip.toBuffer();
  }
}

export default EPubFileBuilder;