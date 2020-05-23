import { epubState } from './epub.state';
import { epubHistory } from './epub.history';

import { chapterSplitter } from './chapter.splitter.js';
import { chapterEditor } from './chapter.editor.js';
import { epubDownloader } from './epub.downloader.js';

import * as epubConstants from './constants';
import * as epubUtils from './util';
import * as chapterHtmlConverter from './chapter-html-converter';
import * as chapterNavigator from './chapter-navigator';

export const epub = {
  state: epubState,
  history: epubHistory,
  resetEpubData: () => epubState.setEpubData([]),

  sch: chapterSplitter,
  ech: chapterEditor,
  download: epubDownloader,

  ...epubConstants,
  ...epubUtils,
  ...chapterHtmlConverter,
  ...chapterNavigator,
};

export { epubStore, epubContext, connectWithRedux } from 'redux/media-settings/epub';
