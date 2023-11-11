import _ from 'lodash';
import { _buildID } from 'utils';

export function findChapterTimeSpan(chapterLike) {
  const { items, subChapters } = chapterLike;
  let start = '00:00:00';
  let end = '00:00:00';
  if (items && items.length > 0) {
    start = items[0].start;
  } else if (subChapters && subChapters.length > 0) {
    start = subChapters[0].start;
  }

  if (subChapters && subChapters.length > 0) {
    end = subChapters[subChapters.length - 1].end;
  } else if (items && items.length > 0) {
    end = items[items.length - 1].end;
  }

  return { start, end };
}

export function filterTrivalItems(epubData) {
  return _.filter(epubData, (item) => Boolean(_.trim(item.text)));
}

export function parseRawEPubData(rawEPubData) {
  return _.map(filterTrivalItems(rawEPubData), item => ({ ...item, id: _buildID() }));
}

export function getAllItemsInChapter(chapter) {
  return _.flatten([
    chapter.items,
    ..._.map(chapter.subChapters, (subChapter) => subChapter.items),
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

