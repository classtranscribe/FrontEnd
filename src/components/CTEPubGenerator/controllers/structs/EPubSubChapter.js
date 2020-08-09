import EPubChapterLike from './EPubChapterLike';

class EPubSubChapter extends EPubChapterLike {
  // constructor(subChapterLike, resetText) {
  //   super(subChapterLike, resetText);
  // }

  toObject() {
    return {
      ...this.__data__,
      items: this.itemsToObject(),
      contents: this.contentsToObject()
    };
  }
}

export default EPubSubChapter;

