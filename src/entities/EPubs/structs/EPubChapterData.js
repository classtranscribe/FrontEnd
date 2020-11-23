import { buildHTMLFromChapter } from '../html-converters';
import EPubChapterLikeData from './EPubChapterLikeData';
import EPubSubChapterData from './EPubSubChapterData';

let untitledChapterNum = -1;
function _createChapterTitle() {
  untitledChapterNum += 1;
  let chapterNum = untitledChapterNum > 0 ? ` (${untitledChapterNum})` : '';
  return `Untitled Chapter${chapterNum}`;
}

class EPubChapterData extends EPubChapterLikeData {
  constructor(chapterLike, resetText = true) {
    super(chapterLike, resetText, _createChapterTitle);
    const { subChapters = [] } = chapterLike;
    this.subChapters = subChapters.map(sch => new EPubSubChapterData(sch, resetText));
  }

  toObject() {
    return {
      ...this.__data__,
      items: this.itemsToObject(),
      contents: this.contentsToObject(),
      subChapters: this.subChapters.map(subChapter => subChapter.toObject())
    };
  }

  toHTML() {
    return buildHTMLFromChapter(this.__data__);
  }

  /**
   * @returns {EPubSubChapterData[]}
   */
  get subChapters() {
    return this.__data__.subChapters;
  }

  set subChapters(subChapters) {
    this.__data__.subChapters = subChapters;
  }

  static __buildHTMLFromChapter = buildHTMLFromChapter;
}

export default EPubChapterData;