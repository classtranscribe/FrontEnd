import EPubChapterDataLike from './EPubChapterDataLike';

class EPubSubChapterData extends EPubChapterDataLike {
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

