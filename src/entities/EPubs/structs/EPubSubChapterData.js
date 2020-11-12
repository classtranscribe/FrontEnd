import EPubChapterLikeData from './EPubChapterLikeData';

class EPubSubChapterData extends EPubChapterLikeData {
  constructor(subChapterLike, resetText) {
    super(subChapterLike, resetText, () => 'Untitled Sub-Chapter');
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

