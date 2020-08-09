import EPubChapterLike from './EPubChapterLike';
import EPubSubChapter from './EPubSubChapter';

let untitledChapterNum = -1;
function _createChapterTitle() {
  untitledChapterNum += 1;
  let chapterNum = untitledChapterNum > 0 ? ` (${untitledChapterNum})` : '';
  return `Untitled Chapter${chapterNum}`;
}

class EPubChapter extends EPubChapterLike {
  constructor(chapterLike, resetText) {
    super(chapterLike, resetText, _createChapterTitle);
    const { subChapters = [] } = chapterLike;
    this.subChapters = subChapters;
  }

  toObject() {
    return {
      ...this.__data__,
      items: this.itemsToObject(),
      contents: this.contentsToObject(),
      subChapters: this.subChapters.map(subChapter => subChapter.toObject())
    };
  }

  /**
   * @returns {EPubSubChapter[]}
   */
  get subChapters() {
    return this.__data__.id;
  }

  set subChapters(subChapters) {
    this.__data__.subChapters = subChapters;
  }
}

export default EPubChapter;