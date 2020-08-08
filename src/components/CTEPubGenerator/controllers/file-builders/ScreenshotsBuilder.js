import _ from 'lodash';
import AdmZip from 'adm-zip';
import EPubData from '../EPubData';
import { loadImageBuffer } from './utils';

class ScreenshotsBuilder {
  /**
   * Create an ScreenshotsBuilder
   * @param {EPubData} ePubData 
   */
  constructor(ePubData) {
    this.zip = new AdmZip();
    this.screenshots = ePubData.images;
  }

  /**
   * Insert all the screenshots of an EPubData object to a zipped file buffer
   * @param {EPubData} ePubData 
   * @returns {Buffer} zipped file buffer
   */
  static async toBuffer(ePubData) {
    const builder = new ScreenshotsBuilder(ePubData);
    const buffer = await builder.getScreenshotBuffers();
    return buffer;
  }

  async getScreenshotBuffers() {
    const images = this.screenshots;
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < images.length; i += 1) {
      let data = await loadImageBuffer(images[i]);
      this.zip.addFile(`image-${i + 1}.jpeg`, data);
    }
    /* eslint-enable no-await-in-loop */

    return this.zip.toBuffer();
  }
}

export default ScreenshotsBuilder;