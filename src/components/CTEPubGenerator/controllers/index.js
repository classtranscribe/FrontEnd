import { epubState } from './EPubState';
import { epubHistory } from './EPubHistory';
import EPubController from './EPubController';

export const epub = {
  state: epubState,
  history: epubHistory,
  ctrl: new EPubController(),
};