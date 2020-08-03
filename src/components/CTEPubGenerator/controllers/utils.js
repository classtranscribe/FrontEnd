import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Languages } from '../../CTPlayer';
import { buildMarkdownFromItems } from './html-converters';

export function buildID(preflix, id) {
  return (preflix ? `${preflix}=` : '') + (id || uuid());
}

let untitledChapterNum = -1;
function createChapterTitle() {
  untitledChapterNum += 1;
  return `Untitled Chapter${untitledChapterNum > 0 
        ? ` (${untitledChapterNum})`
        : ''}`;
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
    id: id || buildID(),
    items,
    title: title || createChapterTitle(),
    image: resetText ? (items[0] ? items[0].image : '') : image,
    text: resetText ? buildMarkdownFromItems(items) : text,
    subChapters,
    start,
    end
  };
}

export function buildSubChapter(subChapterLike, resetText = true) {
  const {
    id,
    title,
    items,
    image,
    text
  } = subChapterLike;

  return {
    id: id || buildID(),
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

export function filterTrivalItems(epubData) {
  return _.filter(epubData, (item) => Boolean(_.trim(item.text)));
}

export function parseRawEPubData(rawEPubData) {
  return _.map(filterTrivalItems(rawEPubData), item => ({ ...item, id: buildID() }));
}

export function buildEPubDataFromArray(epubData) {
  return [
    buildChapter({
      items: filterTrivalItems(epubData),
      title: 'Default Chapter',
    })
  ];
}

export function getAllItemsInChapter(chapter) {
  return _.flatten([
    chapter.items,
    ..._.map(chapter.subChapters || [], (subChapter) => subChapter.items),
  ]);
}

export function getAllItemsInChapters(chapters) {
  return _.flatten(_.map(chapters, (chapter) => getAllItemsInChapter(chapter)));
}

export function getAllImagesInChapter(chapter) {
  const items = getAllItemsInChapter(chapter);
  return _.map(items, (item) => item.image);
}

export function getAllImagesInChapters(chapters) {
  return _.flatten(_.map(chapters, (chapter) => getAllImagesInChapter(chapter)));
}

export function getCompactText(chapter) {
  return _.map(getAllItemsInChapter(chapter), (item) => item.text)
    .filter((txt) => txt !== '')
    .join('. ')
    // .slice(0, 200);
}

export function getLanguageOptions(media) {
  if (!media || !media.transcriptions) {
    return [];
  }

  return _.map(media.transcriptions, trans => ({
    text: Languages.decode(trans.language),
    value: trans.language
  }));
}
