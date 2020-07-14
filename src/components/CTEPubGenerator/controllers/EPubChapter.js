import { buildEPubChapterFromRaw, buildChapter } from './utils';

class EPubSubChapter {
  constructor(chapterLike) {
    this.__data__ = buildEPubChapterFromRaw(chapterLike);
  }

  get items() {
    return this.__data__.items;
  }

  set items(items) {
    this.__data__.items = items;
  }

  rebuild() {
    this.__data__ = buildChapter(this.__data__);
  }
}