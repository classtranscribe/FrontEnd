import _ from 'lodash';
import { v4 as uuid } from 'uuid';

export class EPubData {
  __data__ = require('./epub-data.json');

  /**
   * Create a ePub data instance
   * @param {Any} data - the initial data for the ePub
   */
  constructor(data) {
    // if the input data is the raw data
    if (Array.isArray(data)) {
      this.chapters = _.map(data, this.initializeRawEPubData);
    }

    // if the input data is the "valid" epub data 
    else if (Object.isObject(data)) {
      this.__data__ = data;
    }

    else {
      throw Error('Invalid ePub data');
    }
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

  setChapter(chapterIndex, chapterLike, resetText) {
    let chapters = this.chapters;
    // if there is such a chapter in the epub data
    // update the subchapter item
    if (chapters[chapterIndex]) {
      chapters[chapterIndex] = this.buildChapter(chapterLike, resetText);
    }
  }

  setSubChapter(chapterIndex, subChapterIndex, subChapterLike, resetText) {
    let chapters = this.chapters;
    let currChapter = chapters[chapterIndex];
    if (currChapter) {
      let subChapters = currChapter.subChapters;
      // if there is such a subchapter in the epub data
      // update the subchapter item
      if (subChapters[subChapterIndex]) {
        subChapters[subChapterIndex] = this.buildSubChapter(subChapterLike, resetText);
      }
    }
  }

  insertChapter(index, chapterLike) {
    const chapters = this.chapters;
    let newChapter = this.buildChapter(chapterLike);

    this.chapters = [
      ...chapters.slice(0, index + 1),
      newChapter,
      ...chapters.slice(index + 1)
    ];

    return newChapter;
  }

  insertSubChapter(chapterIndex, subChapterIndex, subChapterLike) {
    let newSubChapter = this.buildSubChapter(subChapterLike);
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



  untitledChapterNum = -1;
  createChapterTitle() {
    this.untitledChapterNum += 1;
    return `Untitled Chapter${
           this.untitledChapterNum}` > 0 
          ? ` (${this.untitledChapterNum})`
          : '';
  }

  buildChapter(chapterLike, resetText = true) {
    const {
      id,
      items,
      title,
      image,
      text,
      subChapters
    } = chapterLike;
  
    return {
      id: id || uuid(),
      items: Array.isArray(items) ? items : [],
      title: title || this.createChapterTitle(),
      image,
      text: resetText ? '' : text,
      subChapters: Array.isArray(subChapters) ? subChapters : []
    };
  }

  buildSubChapter(subChapterLike, resetText) {
    const {
      id,
      title,
      items,
      image,
      text
    } = subChapterLike;
  
    return {
      id: id || uuid(),
      items: Array.isArray(items) ? items : [],
      title: title || 'Untitled Sub-Chapter',
      image,
      text: resetText ? '' : text
    };
  }

  initializeRawEPubData(epubData) {
    return [
      this.buildChapter({
        items: _.filter(epubData, (item) => Boolean(_.trim(item.text))),
        title: 'Default Chapter',
      })
    ];
  }
}