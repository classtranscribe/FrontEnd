import { epubState } from './EPubState';
import { epubHistory } from './EPubHistory';
import EPubDataController from './EPubDataController';
import EPubController from './EPubController';
import EPubConstants from './EPubConstants';
import EPubChapterNavigator from './EPubChapterNavigator';

export const epub = {
  const: EPubConstants,
  state: epubState,
  history: epubHistory,
  data: new EPubDataController(),
  ctrl: new EPubController(),
  nav: new EPubChapterNavigator()
};

export { default as CTEPubConstants } from './EPubConstants';
export * from './utils';
export * from './html-converters';