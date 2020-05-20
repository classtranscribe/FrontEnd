import { epubState } from './epub-state';

import * as epubConstants from './constants';
import * as epubUtils from './util';
import * as chapterHtmlConverter from './chapter-html-converter';
import * as chapterNavigator from './chapter-navigator';
import * as chaperSplitter from './chapter-spiltter';
import * as chapterEditor from './chapter-editor';
import * as epubDownloader from './epub-downloader';

export const epub = {
  state: epubState,
  resetEpubData: () => epubState.setEpubData([]),

  ...epubConstants,
  ...epubUtils,
  ...chapterHtmlConverter,
  ...chapterNavigator,
  ...chaperSplitter,
  ...chapterEditor,
  ...epubDownloader,
};

export { epubStore, epubContext, connectWithRedux } from 'redux/media-settings/epub';
