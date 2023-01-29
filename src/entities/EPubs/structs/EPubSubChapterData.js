import EPubChapterLikeData from './EPubChapterLikeData';

let untitledSubChapterNum = 0;
function _createSubChapterTitle() {
  untitledSubChapterNum += 1;
  let chapterNum = untitledSubChapterNum > 0 ? ` (${untitledSubChapterNum})` : '';
  return `Untitled Sub-Chapter${chapterNum}`;
}

class EPubSubChapterData extends EPubChapterLikeData {
  constructor(subChapterLike, resetText) {
    super(subChapterLike, resetText, _createSubChapterTitle);
  }

  toObject() {
    return {
      ...this.__data__,
      items: this.itemsToObject(),
      contents: this.contentsToObject()
    };
  }
}

export default EPubSubChapterData;

