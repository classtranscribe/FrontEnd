import EPubListController from './EPubListController';
import { epubState } from './EPubState';
import { epubHistory } from './EPubHistory';
import { epubData } from './EPubDataController';
import EPubController from './EPubController';
import EPubConstants from './EPubConstants';
import EPubChapterNavigator from './EPubChapterNavigator';

const ePubCtrl = new EPubController();
const ePubNav = new EPubChapterNavigator();
const epubList = new EPubListController();

export const epub = {
  const: EPubConstants,
  state: epubState,
  list: epubList,
  history: epubHistory,
  data: epubData,
  ctrl: ePubCtrl,
  nav: ePubNav
};

export { default as CTEPubConstants } from './EPubConstants';
export { default as CTEPubData } from './EPubData';
export * from './utils';
export * from './html-converters';