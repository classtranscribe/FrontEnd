import { epubState } from './EPubState';
import { epubHistory } from './EPubHistory';
import EPubDataController from './EPubDataController';
import EPubController from './EPubController';
import EPubConstants from './EPubConstants';

export const epub = {
  const: EPubConstants,
  state: epubState,
  history: epubHistory,
  data: new EPubDataController(),
  ctrl: new EPubController(),
};

export { default as CTEPubConstants } from './EPubConstants';
export * from './utils';