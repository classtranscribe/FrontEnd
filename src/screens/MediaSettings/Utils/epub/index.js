import { epubState } from './epub-state';
import { epubHistory } from './epub-history';

import { chapterSplitter } from './chapter.splitter.js'

import * as epubConstants from './constants';
import * as epubUtils from './util';
import * as chapterHtmlConverter from './chapter-html-converter';
import * as chapterNavigator from './chapter-navigator';
import * as chapterEditor from './chapter-editor';
import * as epubDownloader from './epub-downloader';

export const epub = {
  state: epubState,
  history: epubHistory,
  resetEpubData: () => epubState.setEpubData([]),

  sch: chapterSplitter,

  ...epubConstants,
  ...epubUtils,
  ...chapterHtmlConverter,
  ...chapterNavigator,
  ...chapterEditor,
  ...epubDownloader,
};

export { epubStore, epubContext, connectWithRedux } from 'redux/media-settings/epub';
