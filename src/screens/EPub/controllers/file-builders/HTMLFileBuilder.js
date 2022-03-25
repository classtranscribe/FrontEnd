import _ from 'lodash';
import AdmZip from 'adm-zip';
import { EPubData } from 'entities/EPubs';
import { doc } from 'prettier';
import { jsPDF as JsPDF } from "jspdf";
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
    await builder.init(ePubData, true);
    const buffer = await builder.getHTMLBuffer(!ePubData.epub.isH4);
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

  getIndexHTML(withStyles = false, print = false, pdf, h3=true) {
    const { title, author, chapters, cover } = this.data;
    const margin = 10;
    let w = pdf.internal.pageSize.getWidth() - 2*margin;
    let h = pdf.internal.pageSize.getHeight() - 2*margin;
    // console.log(w);
    // console.log(h);
    // console.log(cover);
    let metadata = `<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title><rdf:Alt><rdf:li xml:lang="x-default">${ title }</rdf:li></rdf:Alt></dc:title> </rdf:Description>`;
    // metadata = metadata + '<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier>' + title +'</dc:identifier> </rdf:Description>';
    pdf.addMetadata(metadata,"http://ns.adobe.com/pdf/1.3/");
    pdf.setProperties({title, author});
    pdf.setFont("times", "normal");
    pdf.addImage(cover.src,'JPEG', 25, 0, 160,100);
    pdf.text(title, w/2,130, 'center');
    pdf.text(author, w/2,140,'center');
    pdf.addPage();
    let navContents = _.map(
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
    if (!h3) {
      navContents = _.map(
        chapters,
        (ch, chIndex) => `
            <h4><a href="#${ch.id}">${chIndex + 1} - ${ch.title}</a></h4>
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
    }


    // console.log(navContents);
    chapters.forEach((chapter, i) => {
      let curText = chapter.text;
      pdf.text(`${i+1} ${chapter.title}`, margin, 10, 'left');
      let pageCurrent = pdf.internal.getCurrentPageInfo().pageNumber;
      pdf.outline.add(null, chapter.title, {pageNumber:pageCurrent});
      let imgStart = curText.indexOf("src=");
      let imgEnd = curText.indexOf("alt=");
      let imgData = curText.substring(imgStart+5, imgEnd-2);
      pdf.addImage(imgData, 'JPEG', 15, 20, 180, 100);
      // pdf.text("Transcript", 0, 130, 'left');
      let transcriptStart = curText.indexOf("<p>");
      let transcriptEnd = curText.indexOf("</p>");
      let y = 140;
      if (transcriptStart !== -1) {
        let transcript = curText.substring(transcriptStart+3, transcriptEnd);
        let splitted = pdf.splitTextToSize(transcript, parseInt(w,10));
        splitted.forEach(splitval => {
            if (y >= h-h%10) {
                y = 10;
                pdf.addPage();
            }
            pdf.text(splitval, margin, y);
            y += 10;
        });
      }
      chapter.subChapters.forEach((subchapter, j) => {
          // Print subchapter title
          y += 10;
          pdf.text(`${i+1}-${j+1} ${subchapter.title}`, margin, y, 'left');
          y += 10;

          // Add subchapter to outline
          pdf.outline.add(null, subchapter.title, {pageNumber:pageCurrent});

          // Parse subchapter contents to produce transcript of text
          subchapter.contents.forEach(subchText => {
              if (typeof subchText === 'string') {
                  // Add subchapter transcript
                  let transcript = subchText.replace('\n', '').replace('\r', '').replace('#### Transcript', '')
                  let splitted = pdf.splitTextToSize(transcript, parseInt(w,10));
                  splitted.forEach(splitval => {
                      if (y >= h-h%10) {
                          y = 10;
                          pdf.addPage();
                      }
                      pdf.text(splitval, margin, y);
                      y += 10;
                  });
              } else {
                  // TODO: should we insert/display images from subchapters?
                  // console.log('Skipping non-text subchapter content');
              }
          });
      });

      if (i !== chapters.length-1) {
          pdf.addPage();
      }
    });

    const content = _.map(
      chapters,
      (ch) => `
        <div class="ee-preview-text-con">
          ${ch.text/** .replace(/\n/g, '\n\t\t\t\t\t') */}
        </div>
        ${_.map(ch.subChapters, (subCh) =>
          _.map(subCh.contents, (contents) => (typeof contents === 'string') ? `
            <div class="ee-preview-text-con">
              ${contents.substring(16)}
            </div>
          ` : ``).join('\n')
        ).join('\n')}
      `
    ).join('\n');

    // console.log(content);
    print = print && typeof print === 'boolean';

    return withStyles
      ? INDEX_HTML_LIVE({ title, navContents, content, cover, author, print })
      : INDEX_HTML_LOCAL({ title, navContents, content, author });
  }

  async getHTMLBuffer(h3) {
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

    let PDF = new JsPDF();
    PDF.setLanguage("en-US");
    const indexHTML = this.getIndexHTML(false, false, PDF, h3);
    PDF.save();
    zip.addFile('index.html', Buffer.from(indexHTML));

    return zip.toBuffer();
  }
}

export default HTMLFileBuilder;
