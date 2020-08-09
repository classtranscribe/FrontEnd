import _ from 'lodash';
import timestr from 'utils/use-time';
import { findChapterTimeSpan, buildID } from '../utils';
import { buildMDFromItems } from '../html-converters';
import EPubImage from './EPubImage';

function _buildContentsFromItems(items) {
  const image = items[0] ? items[0].image : '';
  const text = buildMDFromItems(items);
  return [image, text];
}

class EPubChapterLike {
  __data__ = {
    id: '',
    title: '',
    start: '00:00:00',
    end: '00:00:00',
    items: [],
    contents: []
  };

  constructor(data, resetText = true, getTitle) {
    let {
      id,
      title,
      items,
      contents
    } = data;

    const { start, end } = findChapterTimeSpan(data);
    
    if (!title && typeof getTitle === 'function') {
      title = getTitle();
    }

    this.__data__ = {
      id: id || buildID(),
      start,
      end,
      title: title || 'Untitled',
      items,
      contents: resetText ? _buildContentsFromItems(items) : contents
    };
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

  itemsToObject() {
    return [...this.items];
  }

  /**
   * @returns {[String|EPubImage]}
   */
  get contents() {
    return this.__data__.contents;
  }

  set contents(contents) {
    this.__data__.contents = contents;
  }

  contentToObject(content) {
    return content instanceof EPubImage ? content.toObject() : content;
  }

  contentsToObject() {
    return this.contents.map(this.contentToObject);
  }

  /**
   * 
   * @param {Number} index 
   * @returns {String|EPubImage} content at index
   */
  getContent(index) {
    return this.contents[index];
  }

  /**
   * 
   * @param {Number} index 
   * @param {String|EPubImage} content 
   */
  setContent(index, content) {
    this.contents[index] = content;
  }

  /**
   * 
   * @returns {String|EPubImage} content at index
   */
  get last() {
    return this.getContent(this.contents.length - 1);
  }

  /**
   * 
   * @param {String|EPubImage} content 
   */
  push(content) {
    this.contents.push(content)
  }
}

export default EPubChapterLike;