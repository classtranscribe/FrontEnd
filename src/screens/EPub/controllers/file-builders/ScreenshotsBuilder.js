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
    const { title, author } = epub;
    const content = '';
    return INDEX_LATEX({title, content, author});
  }

  async getScreenshotBuffers() {
    const images = this.screenshots;
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < images.length; i += 1) {
      let data = await EPubParser.loadImageBuffer(images[i]);
      this.zip.addFile(`image-${i + 1}.jpeg`, data);
    }
    /* eslint-enable no-await-in-loop */
    const latex = this.generateLatex(this.data);
    this.zip.addFile('index.tex', Buffer.from(latex));
    return this.zip.toBuffer();
  }
}

export default ScreenshotsBuilder;