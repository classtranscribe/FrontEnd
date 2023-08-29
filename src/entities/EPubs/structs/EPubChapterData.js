import { buildHTMLFromChapter } from '../html-converters';
import EPubChapterLikeData from './EPubChapterLikeData';
import EPubSubChapterData from './EPubSubChapterData';

let untitledChapterNum = 0;
function _createChapterTitle() {
  untitledChapterNum += 1;
  let chapterNum = untitledChapterNum > 0 ? ` (${untitledChapterNum})` : '';
  return `Untitled Chapter${chapterNum}`;
}

class EPubChapterData extends EPubChapterLikeData {
  constructor(chapterLike, resetText) {
    super(chapterLike, resetText, _createChapterTitle);

    const { subChapters = [] } = chapterLike;
    this.subChapters = subChapters.map(sch => {
        const subchapter = new EPubSubChapterData(sch, resetText);
        return subchapter.__data__ ? subchapter.__data__ : subchapter.toObject();
    });
  }

  toObject() {
    return {
      ...this.__data__,
      items: this.itemsToObject(),
      contents: this.contentsToObject(),
      subChapters: this.subChapters.map(subChapter => subChapter.__data__ ? subChapter.__data__ : subChapter)
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
