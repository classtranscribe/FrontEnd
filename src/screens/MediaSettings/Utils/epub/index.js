import { epubState } from './setstate';
import * as epubConstants from './constants';
import * as epubUtils from './util';
import * as editor from './editor';
import * as chaperSplitter from './chapter-spiltter';
import * as downloader from './downloader';
import * as chapterHtmlConverter from './chapter-html-converter';
import * as chapterNavigator from './chapter-navigator';

export { connectWithRedux, epubStore, epubContext } from 'redux/media-settings/epub'

export const epub = {
    state: epubState,
    resetEpubData: () => epubState.setEpubData([]),

    ...epubConstants,
    ...epubUtils,
    ...editor,
    ...chaperSplitter,
    ...downloader,
    ...chapterHtmlConverter,
    ...chapterNavigator
};