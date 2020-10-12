import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import CTError from 'utils/use-error';
import { LanguageConstants } from 'components/CTPlayer';
import {
  buildEPubDataFromArray,
  getAllImagesInChapters 
} from '../utils';
import EPubChapterData from './EPubChapterData';
import EPubSubChapterData from './EPubSubChapterData';
import EPubImageData from './EPubImageData';

/**
 * The error which occurred when the required information 
 * for creating an ePub file is invalid
 */
export const EPubDataValidationError = 
  new CTError('EPubDataValidationError', 'Invalid ePub data.');

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
    chapters: []
  };

  images = [];

  /**
   * Create a ePub data instance
   * @param {Any} data - the initial data for the ePub
   */
  constructor(data) {
    if (data instanceof EPubData) {
      this.__data__ = data.__data__;
    }
    // if the input data is the raw epub data
    else if (Array.isArray(data)) {
      this.chapters = buildEPubDataFromArray(data);
    }
    // if the input data is the epub-like
    else if (typeof data === 'object') {
      this.__data__ = {
        ...this.__data__,
        ...data
      };
    }
    else {
      throw EPubDataValidationError;
    }

    // create an id if there's no id in the epub data
    if (!this.id) {
      this.id = uuid();
    }

    // extract all the images from the chapters
    this.images = getAllImagesInChapters(this.chapters);

    // set up cover image
    if (!this.cover) {
      if (this.images.length > 0) {
        this.cover = new EPubImageData({ src: this.images[0], alt: `Cover for ${ this.title}` });
      } else {
        this.cover = new EPubImageData();
      }
    } else if (!(this.cover instanceof EPubImageData)) {
      this.cover = new EPubImageData(this.cover);
    }
  }

  static create(rawEPubData, language, mediaName) {
    return new EPubData({
      language,
      title: `${mediaName} (${LanguageConstants.decode(language)})`,
      filename: `${mediaName} (${LanguageConstants.decode(language)})`,
      chapters: buildEPubDataFromArray(rawEPubData)
    });
  }

  set id(id) {
    this.__data__.id = id;
  }

  get id() {
    return this.__data__.id;
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

  set chapters(chapters) {
    this.__data__.chapters = chapters;
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
      chapters: this.chapters.map(chapter => chapter.toObject())
    };
  }

  getChapter(chapterIndex) {
    return this.chapters[chapterIndex];
  }

  getSubChapter(chapterIndex, subChapterIndex) {
    let currChapter = this.getChapter(chapterIndex);
    if (currChapter) {
      return currChapter.subChapters[subChapterIndex];
    }

    return null;
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

  rebuildSubChapter(chapterIndex, subChapterIndex, subChapterLike, resetText) {
    let chapters = this.chapters;
    let currChapter = chapters[chapterIndex];
    if (currChapter) {
      let subChapters = currChapter.subChapters;
      // if there is such a subchapter in the epub data
      // update the subchapter item
      if (subChapters[subChapterIndex]) {
        let toBuild = subChapterLike || subChapters[subChapterIndex];
        subChapters[subChapterIndex] = new EPubSubChapterData(toBuild, resetText);
      }
    }
  }

  insertChapter(index, chapterLike) {
    const chapters = this.chapters;
    let newChapter = new EPubChapterData(chapterLike);

    this.chapters = [
      ...chapters.slice(0, index),
      newChapter,
      ...chapters.slice(index)
    ];

    return newChapter;
  }

  insertSubChapter(chapterIndex, subChapterIndex, subChapterLike) {
    let newSubChapter = new EPubSubChapterData(subChapterLike);
    let chapter = this.getChapter(chapterIndex);
    chapter.subChapters = [
      ...chapter.subChapters.slice(0, subChapterIndex),
      newSubChapter,
      ...chapter.subChapters.slice(subChapterIndex)
    ];

    return newSubChapter;
  }

  removeChapter(index) {
    let chapters = this.chapters;
    let chapter = chapters[index];
    this.chapters = [
      ...chapters.slice(0, index),
      ...chapters.slice(index + 1)
    ];

    return chapter;
  }

  removeSubChapter(chapterIndex, subChapterIndex) {
    let chapter = this.getChapter(chapterIndex);
    let subChapter = chapter.subChapters[subChapterIndex];
    chapter.subChapters = [
      ...chapter.subChapters.slice(0, subChapterIndex),
      ...chapter.subChapters.slice(subChapterIndex + 1)
    ];
    
    return subChapter;
  }
}