import { epubState } from './setstate';
import * as epubUtils from './util';
import * as editor from './editor';
import * as chaperSplitter from './chapter-spiltter';
import * as downloader from './downloader';
import * as chapterHtmlConverter from './chapter-html-converter';

export const epub = {
    state: epubState,
    resetEpubData: () => epubState.setEpubData([]),

    ...epubUtils,
    ...editor,
    ...chaperSplitter,
    ...downloader,
    ...chapterHtmlConverter
};