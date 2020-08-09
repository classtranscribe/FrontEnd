import _ from 'lodash';
import { uurl, api, CTError } from 'utils';
import EPubData from '../EPubData';
import { buildHTMLFromChapter } from '../html-converters';

/**
 * The error which occurred while loading the images for an ePub
 */
export const LoadImageError = new CTError('LoadImageError', 'Failed to load images.');

/**
 * The error which occurred when the required information for creating an ePub file is invalid
 */
export const EPubValidationError = new CTError('EPubValidationError', 'Invalid ePub data.');

/**
 * EPubData parser for file builders
 */
class EPubParser {
  /**
   * Create an EPubParser
   * @param {EPubData} ePubData 
   * @param {Boolean} replaceImageSrc
   */
  constructor(epubData, replaceImageSrc) {
    if (!(epubData instanceof EPubData)) {
      throw EPubValidationError;
    }

    const data = epubData.toObject();
    data.cover = uurl.getMediaUrl(data.cover);
    data.chapters = this.parseChapters(data.chapters, replaceImageSrc);
    this.data = data;
  }

  /**
   * Create an EPubParser
   * @param {EPubData} ePubData 
   * @param {Boolean} replaceImageSrc
   * @returns {Any} parsed epubData
   */
  static parse(ePubData, replaceImageSrc) {
    const parser = new EPubParser(ePubData, replaceImageSrc);
    return parser.data;
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
      throw LoadImageError;
    }
  }

  static async loadEPubImageBuffers({ cover, chapters }) {
    const coverBuffer = await EPubParser.loadImageBuffer(cover);
  
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
  createChapterDOM(chapter) {
    // Remove invalid syntax for xhtml
    const htmlLike = buildHTMLFromChapter(chapter)
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
  parseChapters(chapters, replaceImageSrc = true) {
    return _.map(chapters, (chapter, chIdx) => {
      const chapterId = `chapter-${chIdx + 1}`;
      
      const subChapters = this.parseSubChapters(chapter.subChapters, chapterId);
      
      const dom = this.createChapterDOM({ ...chapter, id: chapterId, subChapters });
  
      return {
        id: chapterId,
        title: chapter.title,
        text: this.extractBodyTextFromDom(dom),
        images: this.extractImagesFromDOM(dom, chapterId, replaceImageSrc),
        subChapters,
      };
    });
  }
}

export default EPubParser;