/**
 * 
 * Utilities for the ClassTranscribe FrontEnd
 * 
 */
import { v4 as uuid } from 'uuid';
// import * as loggerToExport from './logger';
// export const logger = loggerToExport;

export { env } from './env';
export { api } from './cthttp';
export { user } from './user';
export { CTSearch, search } from './search';
export { CTPrompt, prompt } from './prompt';
export { CTPreference } from './user-preference';
export { CTUserGuide } from './user-guide';
export { html } from './2html';
export { elem } from './use-elem';
export { uurl } from './use-url';
export { uemail } from './use-email';
export { links } from './links';
export { default as timestr } from './use-time';
export { default as CTError, InvalidDataError } from './use-error';

export * from './constants';

export function _buildID(preflix, id) {
  return (preflix ? `${preflix}=` : '') + (id || uuid());
}

/**
 * Function used to convert a data array to options for selections
 * @param {Any[]} array - source for the options
 * @param {String} tag - prefix tag for each item
 */
export function _getSelectOptions(array, tag) {
  if (!Array.isArray(array)) return [];
  const options = [];
  array.forEach((item) => {
    if (!item || !item.id) return;
    let text = '';
    if ((tag === 'depart' || tag === 'term') && item.uniName) {
      text = `${item.name} (${item.uniName})`;
    } else {
      text = item.name || tag + item.courseNumber;
    }
    options.push({ text, value: item.id });
  });
  return options;
}

