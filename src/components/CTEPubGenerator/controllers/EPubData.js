import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { buildEPubDataFromArray, buildChapter, buildSubChapter } from './utils';

export default class EPubData {
  __data__ = require('./epub-data.json');

  /**
   * Create a ePub data instance
   * @param {Any} data - the initial data for the ePub
   */
  constructor(data) {
    // if the input data is the raw epub data
    if (Array.isArray(data)) {
      this.chapters = buildEPubDataFromArray(data);
      this.id = uuid();
    }

    // if the input data is the epub-like
    else if (Object.isObject(data)) {
      this.__data__ = {
        ...this.__data__,
        ...data
      };
    }

    else {
      throw Error('Invalid ePub data');
    }
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

  set chapters(chapters) {
    this.__data__.chapters = chapters;
  }

  /**
   * @returns {Any[]}
   */
  get chapters() {
    return this.__data__.chapters;
  }

  toObject() {
    return _.cloneDeep(this.__data__);
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
      chapters[chapterIndex] = buildChapter(toBuild, resetText);
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
        subChapters[subChapterIndex] = buildSubChapter(toBuild, resetText);
      }
    }
  }

  insertChapter(index, chapterLike) {
    const chapters = this.chapters;
    let newChapter = buildChapter(chapterLike);

    this.chapters = [
      ...chapters.slice(0, index + 1),
      newChapter,
      ...chapters.slice(index + 1)
    ];

    return newChapter;
  }

  insertSubChapter(chapterIndex, subChapterIndex, subChapterLike) {
    let newSubChapter = buildSubChapter(subChapterLike);
    let chapter = this.getChapter(chapterIndex);
    chapter.subChapters = [
      ...chapter.subChapters.slice(0, subChapterIndex + 1),
      newSubChapter,
      ...chapter.subChapters.slice(subChapterIndex + 1)
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