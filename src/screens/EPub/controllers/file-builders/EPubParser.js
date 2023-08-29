import _ from 'lodash';
import Prism from 'prismjs';
import { uurl, api, CTError } from 'utils';
import { EPubData, EPubDataValidationError, EPubChapterData } from 'entities/EPubs';

const buildHTMLFromChapter = EPubChapterData.__buildHTMLFromChapter;

/**
 * The error which occurred while loading the images for an ePub
 */
export const LoadImageError = new CTError('LoadImageError', 'Failed to load images.');

/**
 * EPubData parser for file builders
 */
class EPubParser {
  static blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    })
  };

  /**
  * Create an EPubParser
  * @param {EPubData} ePubData 
  * @param {Boolean} replaceImageSrc
  */
  async init(epubData, replaceImageSrc) {
    const data = JSON.parse(JSON.stringify(epubData)); // deep copy
    const img = await EPubParser.loadImageBuffer(uurl.getMediaUrl(data.cover.src))
    const img_blob = new Blob([img]);
    data.cover.src = await EPubParser.blobToDataUrl(img_blob); // URL.createObjectURL(img_blob)
    data.chapters = await this.parseChapters(data.chapters, replaceImageSrc);
    this.data = data;
  }

  /**
   * Create an EPubParser
   * @param {EPubData} ePubData 
   * @param {Boolean} replaceImageSrc
   * @returns {Any} parsed epubData
   */
  static async parse(ePubData, replaceImageSrc) {
    const parser = new EPubParser();
    await parser.init(ePubData.epub, replaceImageSrc)
    return parser.data;
  }

  /**
   * load media buffer
   * @param {String} src path to the src
   * @returns {Promise<Buffer>} the loaded src buffer
   */

  static async loadImageBuffer(src) {
    try {
      /*
      if(src.startsWith('blob')) {
        return await (await fetch(src)).arrayBuffer()
      }
      */
      const buffer = await api.getBuffer(uurl.getMediaUrl(src));
      return buffer;
    } catch (error) {
      throw LoadImageError;
    }
  }

  static async loadEPubImageBuffers({ cover, chapters }) {
    const coverBuffer = await EPubParser.loadImageBuffer(cover.src);

    const images = [];
    for (let i = 0; i < chapters.length; i += 1) {
      const ch = chapters[i];
      if (ch.images) {
        /* eslint-disable no-await-in-loop */
        for (let j = 0; j < ch.images.length; j += 1) {
          const img = ch.images[j];
          const buffer = await EPubParser.loadImageBuffer(img.src);
          images.push({ ...img, buffer });
        }
        /* eslint-enable no-await-in-loop */
      }
    }

    return { coverBuffer, images };
  }

  /**
   * Change all the subchapters' id
   * @param {Any[]} subChapters 
   * @param {String} chapterId 
   * @returns {Any[]}
   */
  parseSubChapters(subChapters, chapterId) {
    return _.map(subChapters, (subChapter, schIdx) => ({
      ...subChapter,
      id: `${chapterId}-sch-${schIdx + 1}`
    }));
  }

  /**
   * Create dom for chapter
   * @param {Any} chapter 
   * @returns {Document}
   */
  async createChapterDOM(chapter) {
    // Remove invalid syntax for xhtml
    const htmlLike = (await buildHTMLFromChapter(chapter))
      .replace(/&nbsp;/g, '&#160;')
      .replace(/<br>/g, '<br/>');
    return new DOMParser().parseFromString(htmlLike, 'text/html');
  }

  /**
   * get all images from dom
   * @param {Document} dom 
   * @returns {Any[]}
   */
  extractImagesFromDOM(dom, chapterId, replaceSrc) {
    const imgEls = dom.getElementsByTagName('img');
    return _.map(imgEls, (imgEl, imgIdx) => {
      const imgID = `${chapterId}-img-${imgIdx + 1}`;
      const src = uurl.getMediaUrl(imgEl.src);
      const relSrc = `images/${imgID}.jpeg`; // relative src path for an image
      if (replaceSrc) {
        imgEl.src = relSrc;
      }

      return { src, relSrc, id: imgID };
    });
  }

  /**
   * get body text from dom
   * @param {Document} dom 
   * @returns {String}
   */
  extractBodyTextFromDom(dom) {
    // Serialize xhtml
    const xhtml = new XMLSerializer().serializeToString(dom);

    // Only keep codes inside the <body>..</body>
    return xhtml
      .replace('<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>', '')
      .replace('</body></html>', '');
  }

  /**
   * get parsed EPubData chapters
   * @param {Any[]} chapters 
   * @param {Boolean} replaceImageSrc 
   */
  async parseChapters(chapters, replaceImageSrc = true) {
    return Promise.all(_.map(chapters, async (chapter, chIdx) => {
      const chapterId = `chapter-${chIdx + 1}`;

      const subChapters = this.parseSubChapters(chapter.subChapters, chapterId);

      const dom = await this.createChapterDOM({ ...chapter, id: chapterId, subChapters });
      Prism.highlightAllUnder(dom);
      const chapterText = this.extractBodyTextFromDom(dom);
      const chapterImages = this.extractImagesFromDOM(dom, chapterId, replaceImageSrc=false); 
      return {
        id: chapterId,
        title: chapter.title,
        condition: chapter.condition,
        start: chapter.start,
        link: chapter.link,
        text: chapterText,
        images: chapterImages,
        subChapters,
      };
    }));
  }
}

export default EPubParser;