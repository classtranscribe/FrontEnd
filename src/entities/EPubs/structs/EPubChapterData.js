import { _buildID } from 'utils';
import _ from 'lodash';
import { buildHTMLFromChapter } from '../html-converters';
import EPubImageData from './EPubImageData';

class EPubChapterData {
  __data__ = {
    id: '',
    title: '',
    start: '00:00:00',
    end: '00:00:00',
    timemerge: '00:00:00',
    condition: ['default'],
    subChapters: [],
    contents: []
  };

  constructor(data, resetText = true, sourceId) {
    if (data instanceof EPubChapterData) {
      this.__data__ = data.__data__;
      return;
    }

    let {
      id,
      title,
      items,
      contents = []
    } = data;

    // const { start, end } = findChapterTimeSpan(data); // TODO 

    this.__data__ = {
      ...this.__data__,
      id: id || _buildID(),
      title: title || EPubChapterData.createChapterTitle(),
      condition: ['default'],
      contents: resetText
        ? EPubChapterData.buildContentsFromItems(items, sourceId)
        : contents.map(con => typeof con === 'string' ? con : { ...con })
    };
  }

  contentToObject(content) {
    return content instanceof EPubImageData ? content.toObject() : content;
  }

  contentsToObject(contents) {
    return contents.map(this.contentToObject);
  }

  toObject() {
    return {
      ...this.__data__,
      contents: this.contentsToObject(this.__data__.contents),
    };
  }

  toHTML() {
    return buildHTMLFromChapter(this.__data__);
  }

  static untitledChapterNum = 0;
  static buildContentsFromItems(items, sourceId) {
    const content = [];
    for (const item of items) {
      if (item !== undefined) {
        if (item.image) { // if there is an image 
          const imageData = (sourceId ? EPubImageData.createWithTimestamp(item, sourceId) : EPubImageData.create(item));
          content.push(imageData)
        }
        if (item.text) { // if there is text 
          const text = item.text
          if (_.trim(text)) {
            content.push(text);
          }
        }
      }
    }
    return content;
  }
  static createChapterTitle() {
    EPubChapterData.untitledChapterNum += 1;
    let chapterNum = EPubChapterData.untitledChapterNum > 0 ? ` (${EPubChapterData.untitledChapterNum})` : '';
    return `Untitled Chapter${chapterNum}`;
  }
}

export default EPubChapterData;
