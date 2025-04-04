import _ from 'lodash';
import { uurl, api, CTError, html } from 'utils';
import html2canvas from 'html2canvas';
import { getGlossaryData } from './GlossaryCreator';
import { epubIsImage, epubIsText } from './utils';

/**
 * The error which occurred while loading the images for an ePub
 */
export const LoadImageError = new CTError('LoadImageError', 'Failed to load images.');

/**
 * EPubData parser for file builders. The parser should handle all necessary async functions, not just
 * the functions common to all four downloaders
 */
class EPubParser {
  /**
  * Create an EPubParser
  * @param {EPubData} ePubData 
  */
  async init(epubData, options) {
    this.img_id = 1
    this.options = options
    this.data = JSON.parse(JSON.stringify(epubData));
    this.data.chapters = await this.parseChapters(epubData.chapters);
    this.data.glossary = {}
    if (this.options.includeGlossary) {
      let glossaryData = await getGlossaryData(epubData.sourceId);
      if (this.options.chapterGlossary) {
        this.data.chapterGlossary = this.getChapterGlossary(glossaryData, epubData.chapters);
      } else {
        this.data.glossary = glossaryData;
      }
    }

    if (this.options.visualTOC) {
      this.data.visualTOC = this.getVisualTOC(this.data.chapters);
    }

    this.data.cover = await this.parseContent(epubData.cover);
    this.data.includeRawLatex = options.includeRawLatex;
    this.data.videoLinks = options.videoLinks;
  }
  getVisualTOC(chapters) {
    let visualTOC = _.map(chapters, (chapter) => {
      return _.filter(chapter.contents, (content) => {
        return epubIsImage(content);
      })
    })
    return visualTOC;
  }
  getChapterGlossary(glossary, chapters) {
    return _.map(chapters, (chapter) => {
      const chapter_text = _.filter(chapter.contents, epubIsText).join("\n").toLowerCase();
      const desc_text = _.filter(chapter.contents, epubIsImage)
        .map((content) => content.descriptions.join("\n") + content.alt)
        .join("\n")
        .toLowerCase();
      return _.pickBy(glossary, (value, word) =>
        chapter_text.includes(word.toLowerCase()) || desc_text.includes(word.toLowerCase())
      );
    })
  }
  async parseChapters(chapters) {
    let new_chapters = await Promise.all(_.map(chapters, async (ch) => {
      return this.parseChapter(ch)
    }));
    return new_chapters;
  }

  async parseChapter({ contents, title }) {
    let new_contents = await Promise.all(_.map(contents, async (content) => {
      return this.parseContent(content);
    }));
    // _.forEach(chapter.contents, async (content, idx, contents) => { contents[idx] = await this.parseContent(content) });
    // chapter.contents = await Promise.all(chapter.contents);
    if (this.options.imagesFirst) {
      let image_contents = _.filter(new_contents, (c) => typeof c !== "string");
      let other_contents = _.filter(new_contents, (c) => typeof c === "string");
      new_contents = _.concat(image_contents, other_contents);
    }
    return { contents: new_contents, title }
  }

  async parseContent(content) {
    if (epubIsImage(content)) {
      return this.parseImage(content);
    } if (epubIsText(content)) {
      return this.parseText(content);
    }
    return content;
  }

  async parseImage(content) {
    let new_content = JSON.parse(JSON.stringify(content));
    let img_buffer = await EPubParser.loadImageBuffer(content.src);
    let img_blob = new Blob([img_buffer]);

    if (this.options.invertColors) {
      img_blob = await EPubParser.invertImageIfDim(img_blob);
      const arr_buf = await img_blob.arrayBuffer();
      img_buffer = new Uint8Array(arr_buf);
    }

    if (this.options.replaceImageSrc) {
      new_content.src = await EPubParser.blobToDataUrl(img_blob);
    } else {
      new_content.blob = img_blob;
      new_content.buffer = img_buffer;
    }


    if (new_content.src !== "") {
      const { height, width } = await EPubParser.getImageDimensions(img_blob);
      new_content.height = height;
      new_content.width = width;
    }
    new_content.descriptions = _.filter(content.descriptions, (desc) => desc.trim() !== "");
    new_content.id = this.img_id;
    this.img_id += 1;
    return new_content;
  }

  async parseText(text) {
    if (!this.options.replaceLatex) {
      return text;
    }
    const regex = /\$\$(.*?)\$\$/g
    const latexElems = text.match(regex);
    let latex_parsed = await Promise.all(_.map(latexElems, async (val) => {
      let img_blob = await this.htmlToImageBlob(html.markdown(val));
      let data_src = await EPubParser.blobToDataUrl(img_blob);
      let { height, width } = await EPubParser.getImageDimensions(img_blob);
      return { src: data_src, height, width };
    }))
    return { text, latex: latex_parsed };
  }
  async htmlToImageBlob(htmlString) {
    if (!htmlString) {
      throw new Error("HTML string is required");
    }

    try {
      // Create a temporary container to render the HTML string
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.innerHTML = htmlString;
      document.body.appendChild(container);

      // Render the container to canvas
      const canvas = await html2canvas(container, { scale: 20 });

      // Remove the container from the DOM
      document.body.removeChild(container);

      // Convert canvas to blob
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas to Blob conversion failed"));
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error("Error rendering HTML to image:", error);
      throw error;
    }
  }

  /**
   * Create an EPubParser
   * @param {EPubData} ePubData 
   * 
   * The following are fields of options
   * @param {Boolean} replaceImageSrc Replace the image src from a url to a data url. If false, attaches the buffer of the image.
   * @param {Boolean} replaceLatex Attempts to replace any latex expressions in md ($$latex$$) with images
   * 
   * @param {Boolean} invertColors Invert the colors of images that are overly dark.
   * @param {Boolean} visualTOC Place images as a table of contents, with links to the relevant chapters
   * @param {Boolean} includeGlossary Prints the associated glossary
   * @param {Boolean} includeRawLatex Includes the raw, unparsed latex after rendered image. Does nothing to .tex files.
   * 
   * @returns {Any} parsed epubData
   */
  static async parse(ePubData, options) {
    const parser = new EPubParser();
    await parser.init(ePubData.epub, options)

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

  static async invertImageIfDim(blob, threshold = 100) {
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

    // quit if below brightness
    let avg_brightness = _.mean(_.filter(data, (val, idx) => { return idx % 4 !== 3 }));
    if (avg_brightness > threshold) {
      imageBitmap.close();
      return blob;
    }

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

    imageBitmap.close();

    return invertedBlob;
  }
}

export default EPubParser;