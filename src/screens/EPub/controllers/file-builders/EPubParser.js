/* eslint-disable no-console */
import _ from 'lodash';
import { uurl, api, CTError, html } from 'utils';
import { getGlossaryData } from './GlossaryCreator';
import { placeholderImg } from './file-templates/pdf';

/**
 * The error which occurred while loading the images for an ePub
 */
export const LoadImageError = new CTError('LoadImageError', 'Failed to load images.');

/**
 * EPubData parser for file builders
 */
class EPubParser {
  /**
  * Create an EPubParser
  * @param {EPubData} ePubData 
  * @param {Boolean} replaceImageSrc
  */
  async init(epubData, options) {
    this.options = options
    const data = JSON.parse(JSON.stringify(epubData));

    this.parseChapters(data);
    data.glossary = await getGlossaryData(data.sourceId);
    data.cover = await this.parseContent(data.cover);

    this.data = data;
  }

  parseChapters(epubData) {
    _.forEach(epubData.chapters, (ch) => this.parseChapter(ch));
  }
  async parseChapter(chapter) {
    _.forEach(chapter.contents, async (content, idx, contents) => { contents[idx] = await this.parseContent(content) });
    if (this.options.imagesFirst) {
      let image_contents = _.filter(chapter.contents, (c) => typeof c !== "string");
      let other_contents = _.filter(chapter.contents, (c) => typeof c === "string");
      chapter.contents = _.concat(image_contents, other_contents);
    }
  }

  async parseContent(content) {
    if (typeof content !== "string") {
      let a = await this.parseImage(content);
      return a;
    } if (typeof content === "string") {
      // handle string parsing here. right now, we don't do anything
    }
    return content;
  }

  async parseImage(content) {
    let img_buffer = await EPubParser.loadImageBuffer(content.src);
    let img_blob = new Blob([img_buffer]);

    if (this.options.invertColors) {
      img_blob = await EPubParser.invertImage(img_blob);
      const arr_buf = await img_blob.arrayBuffer();
      img_buffer = new Uint8Array(arr_buf);
    }
    // console.log("AAA blob", img_blob)
    if (this.options.replaceImageSrc) {
      content.src = await EPubParser.blobToDataUrl(img_blob);
    } else {
      content.blob = img_blob;
      content.buffer = img_buffer;
    }


    if (content.src !== "") {
      const { height, width } = await EPubParser.getImageDimensions(img_blob);
      content.height = height;
      content.width = width;
    }
    content.descriptions = _.filter(content.descriptions, (desc) => desc.trim() !== "");
    return content;
  }

  /**
   * Create an EPubParser
   * @param {EPubData} ePubData 
   * @param {Boolean} replaceImageSrc Replace the image src from a url to a data url.
   * If false, attaches the buffer of the image without changing src.
   * @param {Boolean} invertColors Invert the colors of the images
   * @param {Boolean} imagesFirst Rearrange chapter contents to place all images before any text
   * @param {Boolean} replaceLatex Attempts to replace any latex expressions in md ($$latex$$) with images
   * @returns {Any} parsed epubData
   */
  static async parse(ePubData, { replaceImageSrc = true, invertColors = false, imagesFirst = false, replaceLatex = false }) {
    const parser = new EPubParser();
    console.log("parser options", replaceImageSrc, invertColors, imagesFirst, replaceLatex);
    await parser.init(ePubData.epub, { replaceImageSrc, invertColors, imagesFirst, replaceLatex })

    console.log("Parsed data", parser.data);
    return parser.data;
  }

  static async imageUrlToDataUrl(url) {
    const img = await EPubParser.loadImageBuffer(uurl.getMediaUrl(url))
    if (img === "") {
      return ""
    }
    const img_blob = new Blob([img]);
    return EPubParser.blobToDataUrl(img_blob);
  }
  /**
   * load media buffer
   * @param {String} src path to the src
   * @returns {Promise<Buffer>} the loaded src buffer
   */
  static async loadImageBuffer(src) {
    try {
      const buffer = await api.getBuffer(uurl.getMediaUrl(src));
      return buffer;
    } catch (error) {
      this.hasImageError = true;
      return "";
      // return "";
      // throw LoadImageError;
    }
  }

  static async getImageDimensions(blob) {
    const { width, height } = await createImageBitmap(blob);
    return { width, height }
  }

  static blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    })
  };

  static async invertImage(blob) {
    console.log("pre inv", blob);
    // Create an ImageBitmap from the Blob
    const imageBitmap = await createImageBitmap(blob);

    // Create an off-screen canvas
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext("2d");

    // Draw the image onto the canvas
    ctx.drawImage(imageBitmap, 0, 0);

    // Get image data
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Invert colors
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];       // Red
      data[i + 1] = 255 - data[i + 1]; // Green
      data[i + 2] = 255 - data[i + 2]; // Blue
      // Alpha (data[i + 3]) remains unchanged
    }

    // Put modified data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert to Blob and clean up
    const invertedBlob = await canvas.convertToBlob({ type: "image/png" });

    // Cleanup (not needed for OffscreenCanvas, but good practice)
    imageBitmap.close();
    console.log("post inv", invertedBlob);

    return invertedBlob;
  }
}

export default EPubParser;