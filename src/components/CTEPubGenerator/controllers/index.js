import { epubState } from './EPubState';
import { epubHistory } from './EPubHistory';
import EPubDataController from './EPubDataController';
import EPubController from './EPubController';

export const epub = {
  state: epubState,
  history: epubHistory,
  data: new EPubDataController(),
  ctrl: new EPubController()
};

export { default as CTEPubConstants } from './EPubConstants';