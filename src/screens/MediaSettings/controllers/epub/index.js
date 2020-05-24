import { epubState } from './epub.state';
import { epubHistory } from './epub.history';

import { chapterNavigator } from './chapter.navigator.js';
import { chapterSplitter } from './chapter.splitter.js';
import { chapterEditor } from './chapter.editor.js';
import { epubDownloader } from './epub.downloader.js';

import * as epubConstants from './constants';
import * as epubUtils from './util';
import * as chapterHtmlConverter from './chapter.html-converter.js';

export const epub = {
  state: epubState,
  history: epubHistory,
  resetEpubData: () => epubState.setEpubData([]),

  nav: chapterNavigator,
  sch: chapterSplitter,
  ech: chapterEditor,
  download: epubDownloader,

  ...epubConstants,
  ...epubUtils,
  ...chapterHtmlConverter,
};

export { epubStore, epubContext, connectWithRedux } from 'redux/media-settings/epub';
