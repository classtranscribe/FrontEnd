import { epubState } from './epub-state';
import { epubHistory } from './epub-history';

import { chapterSplitter } from './chapter.splitter.js';
import { chapterEditor } from './chapter.editor.js';

import * as epubConstants from './constants';
import * as epubUtils from './util';
import * as chapterHtmlConverter from './chapter-html-converter';
import * as chapterNavigator from './chapter-navigator';
import * as epubDownloader from './epub-downloader';

export const epub = {
  state: epubState,
  history: epubHistory,
  resetEpubData: () => epubState.setEpubData([]),

  sch: chapterSplitter,
  ech: chapterEditor,

  ...epubConstants,
  ...epubUtils,
  ...chapterHtmlConverter,
  ...chapterNavigator,
  ...epubDownloader,
};

export { epubStore, epubContext, connectWithRedux } from 'redux/media-settings/epub';
