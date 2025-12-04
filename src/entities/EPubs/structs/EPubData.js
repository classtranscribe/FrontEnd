/* eslint-disable complexity */
import { v4 as uuid } from 'uuid';
import CTError from 'utils/use-error';
import { buildMDFromChapters } from '../html-converters';
import EPubChapterData from './EPubChapterData';
import EPubImageData from './EPubImageData';

/**
 * The error which occurred when the required information
 * for creating an ePub file is invalid
 */
export const EPubDataValidationError = new CTError(
  'EPubDataValidationError',
  'Invalid I-Note data.',
);

/**
 * The class for an ePub data
 */
export default class EPubData {
  __data__ = {
    id: '',
    title: '',
    filename: '',
    language: 'en-US',
    author: 'Anonymous',
    publisher: 'ClassTranscribe',
    cover: null,
    chapters: [],
    h3: true,
    condition: { default: true },
    jsonMetadata: {},
  };

  /**
   * Create a ePub data instance
   * @param {Any} data - the initial data for the ePub
   */
  constructor(data) {
    if (!data || !data.sourceId) {
      throw EPubDataValidationError;
    }

    if (data instanceof EPubData) {
      this.__data__ = data.__data__;
    }
    // if the input data is the epub-like
    else if (typeof data === 'object') {
      this.__data__ = {
        ...this.__data__,
        ...data,
      };
    } else {
      throw EPubDataValidationError;
    }

    // Initialize/Validate ePub data
    if (!this.id) {
      this.id = uuid();
    }

    if (!this.sourceId) {
      this.sourceId = data.sourceId;
    }

    if (!this.sourceType) {
      this.sourceType = data.sourceType;
    }

    if (!this.isPublished) {
      this.isPublished = false;
    }
    if (!this.isH4) {
      this.h3 = true;
    }

    if (!this.jsonMetadata) {
      this.jsonMetadata = data.jsonMetadata;
    }

    // set up cover image
    if (!this.cover) {
      this.cover = new EPubImageData();
    } else {
      this.cover = new EPubImageData(this.cover);
    }
  }

  initFromRawData(rawEPubData) {
    this.chapters = [
      new EPubChapterData(
        {
          title: 'Default Chapter',
          items: rawEPubData,
        },
        true,
        this.sourceId,
      ).toObject(),
    ];
    // this.condition = ['default'];
    this.condition.default = true;
    this.items = rawEPubData.map((item) => EPubImageData.createWithTimestamp(item, this.sourceId));

    if (!this.cover.src && this.items.length > 0) {
      this.cover = { ...this.items[0], descriptions: [], alt: 'cover image' };
    }
  }

  set id(id) {
    this.__data__.id = id;
  }

  get id() {
    return this.__data__.id;
  }

  set sourceType(sourceType) {
    this.__data__.sourceType = sourceType;
  }

  get sourceType() {
    return this.__data__.sourceType;
  }

  set sourceId(sourceId) {
    this.__data__.sourceId = sourceId;
  }

  get sourceId() {
    return this.__data__.sourceId;
  }

  set isPublished(isPublished) {
    this.__data__.isPublished = isPublished;
  }

  get isPublished() {
    return this.__data__.isPublished;
  }

  set isH4(isH4) {
    this.__data__.h3 = !isH4;
  }

  get isH4() {
    return !this.__data__.h3;
  }

  set condition(condition) {
    this.__data__.condition = condition;
  }

  get condition() {
    return this.__data__.condition;
  }
  set filename(filename) {
    this.__data__.filename = filename;
  }

  get filename() {
    return this.__data__.filename;
  }

  set title(title) {
    this.__data__.title = title;
  }

  get title() {
    return this.__data__.title;
  }

  set author(author) {
    this.__data__.author = author;
  }

  get author() {
    return this.__data__.author;
  }

  set publisher(publisher) {
    this.__data__.publisher = publisher;
  }

  get publisher() {
    return this.__data__.publisher;
  }

  set cover(cover) {
    this.__data__.cover = cover;
  }

  get cover() {
    return this.__data__.cover;
  }

  set language(language) {
    this.__data__.language = language;
  }

  get language() {
    return this.__data__.language;
  }

  set items(items) {
    this.__data__.chapters[0].items = items;
  }

  get items() {
    return this.__data__.chapters[0].items;
  }

  set chapters(chapters) {
    this.__data__.chapters = chapters;
  }

  set jsonMetadata(jsonMetadata) {
    this.__data__.jsonMetadata = jsonMetadata;
  }

  get jsonMetadata() {
    return this.__data__.jsonMetadata;
  }

  /**
   * @returns {EPubChapterData[]}
   */
  get chapters() {
    return this.__data__.chapters;
  }

  toObject() {
    return {
      ...this.__data__,
      cover: this.cover instanceof EPubImageData ? this.cover.toObject() : this.cover,
      chapters: this.chapters.map((chapter) =>
        chapter instanceof EPubChapterData ? chapter.toObject() : chapter,
      ),
    };
  }

  toMD() {
    return buildMDFromChapters(this.chapters);
  }

  getChapter(chapterIndex) {
    const { epub } = window.temp_app._store.getState();
    if (!chapterIndex) {
      chapterIndex = epub.currChIndex;
    }
    return epub.chapters[chapterIndex];
  }

  rebuildChapter(chapterIndex, chapterLike, resetText) {
    let chapters = this.chapters;
    // if there is such a chapter in the epub data
    // update the subchapter item
    if (chapters[chapterIndex]) {
      let toBuild = chapterLike || chapters[chapterIndex];
      chapters[chapterIndex] = new EPubChapterData(toBuild, resetText);
    }
  }

  removeChapter(index) {
    let chapters = this.chapters;
    let chapter = chapters[index];
    this.chapters = [...chapters.slice(0, index), ...chapters.slice(index + 1)];

    return chapter;
  }

  static create(rawEPubData, data) {
    const newData = new EPubData({
      ...data,
    });
    newData.initFromRawData(rawEPubData);

    return newData;
  }

  // static copyChapterStructure(rawEPubData, chapters) {
  //   let lastIdx = 0;
  //   return _.map(chapters, (chapter) => {
  //     let chItems = rawEPubData.slice(lastIdx, lastIdx + chapter.items.length);
  //     lastIdx += chapter.items.length;

  //     return new EPubChapterData({
  //       title: chapter.title,
  //       items: chItems,
  //     })
  //   });
  // }
}
