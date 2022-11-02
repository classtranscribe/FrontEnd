import _ from 'lodash';
import AdmZip from 'adm-zip';
import { EPubData } from 'entities/EPubs';
import EPubParser from './EPubParser';
import {INDEX_LATEX} from './file-templates/latex'

class ScreenshotsBuilder {
  /**
   * Create an ScreenshotsBuilder
   * @param {EPubData} ePubData 
   */
  constructor(ePubData) {
    this.zip = new AdmZip();
    this.screenshots = ePubData.images;
  }
  
  async init(ePubData) {
    this.data = await EPubParser.parse(ePubData);
  }

  /**
   * Insert all the screenshots of an EPubData object to a zipped file buffer
   * @param {EPubData} ePubData 
   * @returns {Buffer} zipped file buffer
   */
  static async toBuffer(ePubData) {
    const builder = new ScreenshotsBuilder(ePubData);
    await builder.init(ePubData);
    const buffer = await builder.getScreenshotBuffers();
    return buffer;
  }

  async generateLatex(epub) {
    const { chapters, condition, title, author } = epub;
    let selectedChapters = [];
    for (let i = 0; i < chapters.length; i+= 1) {
        for (const [key, value] of Object.entries(condition)) {
            if (key === 'default') {
              if (value === true && (!chapters[i].condition || chapters[i].condition.find(elem => elem === key) !== undefined)) {
                selectedChapters.push(chapters[i]);
                break;
              }
            } else if (value === true && (chapters[i].condition && chapters[i].condition.find(elem => elem === key) !== undefined)) {
              selectedChapters.push(chapters[i]);
              break;
            }
        }
    }
    let content = '';
    for (let i = 0; i < selectedChapters.length; i += 1) {
      let chapter = selectedChapters[i];
      let chapterContent = `\\section{${chapter.title}}\n`;
      let imgName = `images/image-${i + 1}.jpeg`
      let imageInfo = `\\includegraphics[scale=0.2]{${imgName}}\\newline\n`;
      chapterContent = chapterContent.concat(imageInfo);
      let transcriptStart = chapter.text.indexOf("<p>");
      let transcriptEnd = chapter.text.indexOf("</p>");
      let transcript = '';
      if (transcriptStart !== -1) {
        transcript = chapter.text.substring(transcriptStart+3, transcriptEnd);
        transcript = transcript.replaceAll("%", "\\%");
        chapterContent = chapterContent.concat(transcript, '\n');
      }
      for (let j = 0; j < chapter.subChapters.length; j += 1) {
        let subChapter = chapter.subChapters[j];
        let subContent = `\\subsection{${subChapter.title}}`;
        for (let k = 0; k < subChapter.contents.length; k += 1) {
          let subContents = subChapter.contents[k];
          // unwrap __data__ for correct image loading in subchapters 
          if (typeof subContents === 'object' && "__data__" in subContents) {
            subContents = JSON.parse(JSON.stringify(subContents.__data__));
          }
          if (typeof subContents === 'string') {
            subContents = subContents.replace('#### Transcript', '');
            subContents = subContents.trim(); 
            subContents = subContents.replaceAll("%", "\\%");
            subContent = subContent.concat(subContents, '\n');
          } else if (subContents.src) {
            imgName = `images/image-${i + 1}.jpeg`
            imageInfo = `\\includegraphics[scale=0.3]{${imgName}}\\newline\n`;
            subContent = subContent.concat(imageInfo);
          }
        }
        chapterContent = chapterContent.concat(subContent, '\\newpage\n');
      }
      content = content.concat(chapterContent, '\\newpage\n');
    }
    return INDEX_LATEX({title, content, author});
  }

  async getScreenshotBuffers() {
    const images = this.screenshots;
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < images.length; i += 1) {
      let data = await EPubParser.loadImageBuffer(images[i]);
      this.zip.addFile(`images/image-${i + 1}.jpeg`, data);
    }
    /* eslint-enable no-await-in-loop */
    const latex = await this.generateLatex(this.data);
    this.zip.addFile('index.tex', Buffer.from(latex));
    return this.zip.toBuffer();
  }
}

export default ScreenshotsBuilder;