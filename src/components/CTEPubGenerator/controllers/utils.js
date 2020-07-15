import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import Constants from './EPubConstants';

export function buildID(preflix, id) {
  return (preflix ? `${preflix }-` : '') + (id || uuid());
}

export class EPubIDs {
  static chID(chId) {
    return buildID(Constants.CH_ID_PREFIX, chId);
  }

  static schID(schId) {
    return buildID(Constants.SCH_ID_PREFIX, schId);
  }

  static navChID(chId) {
    return buildID(Constants.NAV_CH_ID_PREFIX, chId);
  }

  static navSChID(schId) {
    return buildID(Constants.NAV_SCH_ID_PREFIX, schId);
  }
}

let untitledChapterNum = -1;
function createChapterTitle() {
  untitledChapterNum += 1;
  return `Untitled Chapter${untitledChapterNum}` > 0 
        ? ` (${untitledChapterNum})`
        : '';
}

export function buildMarkdownFromItems(items) {
  const subTitle = items.length > 0 ? '\n#### Transcript\n\n' : '';

  return subTitle + _.map(items, (item) => _.trim(item.text)).join('\n\n');
}

export function buildChapter(chapterLike, resetText = true) {
  const {
    id,
    items = [],
    title,
    image,
    text,
    subChapters = []
  } = chapterLike;

  let start = '';
  let end = '';
  if (items.length > 0) {
    start = items[0].start;
    end = items[items.length - 1].end;
  } else {
    start = subChapters[0].start;
    end = subChapters[subChapters.length - 1].end;
  }

  return {
    id: id || uuid(),
    items,
    title: title || createChapterTitle(),
    image: resetText ? (items[0] ? items[0].image : '') : image,
    text: resetText ? buildMarkdownFromItems(items) : text,
    subChapters,
    start,
    end
  };
}

export function buildSubChapter(subChapterLike, resetText) {
  const {
    id,
    title,
    items,
    image,
    text
  } = subChapterLike;

  return {
    id: id || uuid(),
    items: Array.isArray(items) ? items : [],
    title: title || 'Untitled Sub-Chapter',
    image: resetText ? items[0].image : image,
    text: resetText ? buildMarkdownFromItems(items) : text,
    start: items[0].start,
    end: items[items.length - 1].end
  };
}

export function buildEPubChapterFromRaw(rawChapter) {
  return buildChapter(rawChapter);
}

export function buildEPubDataFromArray(epubData) {
  return [
    buildChapter({
      items: _.filter(epubData, (item) => Boolean(_.trim(item.text))),
      title: 'Default Chapter',
    })
  ];
}