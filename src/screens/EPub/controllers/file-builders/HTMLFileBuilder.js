import _ from 'lodash';
import AdmZip from 'adm-zip';
import { EPubData } from 'entities/EPubs';
import EPubParser from './EPubParser';
import { KATEX_MIN_CSS, PRISM_CSS } from './file-templates/styles';
import {
  INDEX_HTML_LIVE,
  INDEX_HTML_LOCAL,
  STYLE_CSS,
  PRISM_JS
} from './file-templates/html';

/**
 * File buffer builder for .epub
 */
class HTMLFileBuilder {
  /**
   * Create an HTMLFileBuilder
   * @param {EPubData} ePubData 
   * @param {Boolean} forPreview
   */
  constructor() {
    this.zip = new AdmZip();
  }

  async init(ePubData, forPreview = false) {
    this.data = await EPubParser.parse(ePubData, !forPreview);
  }

  /**
   * Convert an EPubData object to a downloadable html zipped combo buffer
   * @param {EPubData} ePubData 
   * @returns {Buffer} html zipped combo buffer
   */
  static async toBuffer(ePubData) {
    const builder = new HTMLFileBuilder(ePubData);
    await builder.init(ePubData, true)
    const buffer = await builder.getHTMLBuffer();
    return buffer;
  }

  async insertImagesToZip() {
    // We embeded images in the html file, so this function is no longer needed
    /*
    const { chapters, cover } = this.data;
    const { coverBuffer, images } 
      = await EPubParser.loadEPubImageBuffers({ chapters, cover });
  
    this.zip.addFile(`images/cover.jpeg`, coverBuffer);
  
    _.forEach(images, (img) => {
      this.zip.addFile(`${img.relSrc}`, img.buffer);
    });
    */
  }

  getIndexHTML(withStyles = false, print = false) {
    const { title, author, chapters, cover } = this.data; 
    const navContents = _.map(
      chapters,
      (ch, chIndex) => `
          <h3><a href="#${ch.id}">${chIndex + 1} - ${ch.title}</a></h3>
          <ol>
              ${_.map(
                ch.subChapters,
                (subch, subIndex) =>`
            <li>
              <a href="#${subch.id}">${chIndex + 1}.${subIndex + 1} - ${subch.title}</a>
            </li>`,).join('\n')}
          </ol>
      `,
    ).join('\n');
  
    const content = _.map(
      chapters,
      (ch) => `
        <div class="ee-preview-text-con">
          ${ch.text/** .replace(/\n/g, '\n\t\t\t\t\t') */}
        </div>
      `,
    ).join('\n');

    print = print && typeof print === 'boolean';
  
    return withStyles
      ? INDEX_HTML_LIVE({ title, navContents, content, cover, author, print })
      : INDEX_HTML_LOCAL({ title, navContents, content, author });
  }

  async getHTMLBuffer() {
    // const { filename } = this.data;
    const zip = this.zip;

    // cover.jpeg
    // images/xxx.jpeg
    await this.insertImagesToZip();

    // styles
    // styles/style.css
    zip.addFile('styles/style.css', Buffer.from(STYLE_CSS));
    // styles/katex.min.css
    zip.addFile('styles/katex.min.css', Buffer.from(KATEX_MIN_CSS));
    // styles/prism.css
    zip.addFile('styles/prism.css', Buffer.from(PRISM_CSS));
    
    // // scripts/prism.js
    // zip.addFile('scripts/prism.js', Buffer.from(PRISM_JS));

    // index.html
    const indexHTML = this.getIndexHTML();
    zip.addFile('index.html', Buffer.from(indexHTML));

    return zip.toBuffer();
  }
}

export default HTMLFileBuilder;