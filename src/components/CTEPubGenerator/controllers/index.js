import { epubState } from './EPubState';
import { epubHistory } from './EPubHistory';
import { epubData } from './EPubDataController';
import EPubController from './EPubController';
import EPubConstants from './EPubConstants';
import EPubChapterNavigator from './EPubChapterNavigator';

const ePubCtrl = new EPubController();
const ePubNav = new EPubChapterNavigator();

export const epub = {
  const: EPubConstants,
  state: epubState,
  history: epubHistory,
  data: epubData,
  ctrl: ePubCtrl,
  nav: ePubNav
};

export { default as CTEPubConstants } from './EPubConstants';
export * from './utils';
export * from './html-converters';