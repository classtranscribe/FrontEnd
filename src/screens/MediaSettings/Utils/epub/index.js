import { epubState } from './setstate';
import * as epubUtils from './util';
import * as editor from './editor';
import * as chaperSplitter from './chapter-spiltter';
import * as downloader from './downloader';

export const epub = {
    init: epubState.init,
    register: epubState.registerSetStateFunc,
    setupEpub: epubState.setupEpub,
    changeChapter: epubState.changeChapter,
    requestEpub: epubState.requestEpub,
    resetEpubData: () => epubState.setEpubData([]),

    ...epubUtils,
    ...editor,
    ...chaperSplitter,
    ...downloader,
};