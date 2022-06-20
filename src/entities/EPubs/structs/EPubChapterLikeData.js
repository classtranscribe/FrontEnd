import _ from 'lodash';
import { timestr, _buildID } from 'utils';
import { findChapterTimeSpan, getAllImagesInChapter, getAllItemsInChapter } from '../utils';
import { buildMDFromItems } from '../html-converters';
import EPubImageData from './EPubImageData';

function _buildContentsFromItems(items) {
  const content = [];
  if (items[0]) {
    content.push(new EPubImageData(items[0].image));
  }

  const text = buildMDFromItems(items);
  if (_.trim(text)) {
    content.push(text);
  }

  return content;
}

class EPubChapterLikeData {
  __data__ = {
    id: '',
    title: '',
    start: '00:00:00',
    end: '00:00:00',
    items: [],
    condition: ['default'],
    contents: []
  };

  constructor(data, resetText = true, getTitle) {
    if (data instanceof EPubChapterLikeData) {
      this.__data__ = data.__data__;
      return;
    }

    let {
      id,
      title,
      items,
      contents = []
    } = data;

    const { start, end } = findChapterTimeSpan(data);
    
    if (!title && typeof getTitle === 'function') {
      title = getTitle();
    }

    this.__data__ = {
      id: id || _buildID(),
      start,
      end,
      title: title || 'Untitled',
      items,
      condition: ['default'],
      contents: resetText 
        ? _buildContentsFromItems(items) 
        : contents.map(con => typeof con === 'string' ? con : new EPubImageData(con))
    };
  }

  toShallowObject() {
    return { ...this.__data__ };
  }

  /**
   * @returns {String}
   */
  get id() {
    return this.__data__.id;
  }

  set id(id) {
    this.__data__.id = id;
  }

  /**
   * @returns {String}
   */
  get title() {
    return this.__data__.title;
  }

  set title(title) {
    this.__data__.title = title;
  }

  /**
   * @returns {String}
   */
  get start() {
    return this.__data__.start;
  }

  set start(start) {
    this.__data__.start = start;
  }

  /**
   * @returns {Number}
   */
  get startSec() {
    return timestr.toSeconds(this.start);
  }

  /**
   * @returns {String}
   */
  get end() {
    return this.__data__.end;
  }

  set end(end) {
    this.__data__.end = end;
  }

  /**
   * @returns {Number}
   */
  get endSec() {
    return timestr.toSeconds(this.end);
  }

  /**
   * @returns {{image:string,id:string,start:string,end:string,text:string}[]}
   */
  get items() {
    return this.__data__.items;
  }

  set items(items) {
    this.__data__.items = items;
  }

  get condition() {
    return this.__data__.condition;
  }

  set condition(condition) {
    this.__data__.condition.add(condition);
  }

  itemsToObject() {
    return [...this.items];
  }

  get allItemsWithIn() {
    return getAllImagesInChapter(this.__data__);
  }

  get allImagesWithIn() {
    return getAllImagesInChapter(this.__data__);
  }

  /**
   * @returns {[String|EPubImageData]}
   */
  get contents() {
    return this.__data__.contents;
  }

  set contents(contents) {
    this.__data__.contents = contents;
  }

  contentToObject(content) {
    return content instanceof EPubImageData ? content.toObject() : content;
  }

  contentsToObject() {
    return this.contents.map(this.contentToObject);
  }

  /**
   * 
   * @param {Number} index 
   * @returns {String|EPubImageData} content at index
   */
  getContent(index) {
    return this.contents[index];
  }

  /**
   * 
   * @param {Number} index 
   * @param {String|EPubImageData} content 
   */
  setContent(index, content) {
    this.contents[index] = content;
  }

  /**
   * 
   * @returns {String|EPubImageData} content at index
   */
  get last() {
    return this.getContent(this.contents.length - 1);
  }

  /**
   * 
   * @param {String|EPubImageData} content 
   */
  push(content) {
    this.contents.push(content)
  }

  /**
   * @param {Number} index
   * @param {String|EPubImageData} content 
   */
  insert(index, content) {
    if (index >= this.contents.length) {
      this.push(content);
    } else {
      this.contents = [
        ...this.contents.slice(0, index),
        content,
        ...this.contents.slice(index)
      ];
    }
  }

  /**
   * 
   * @param {Number|String|EPubImageData} predictor 
   */
  

  static __getAllImagesInChapter = getAllImagesInChapter;
  static __getAllItemsInChapter = getAllItemsInChapter;
}

export default EPubChapterLikeData;