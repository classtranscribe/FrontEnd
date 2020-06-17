import $ from 'jquery';
import { v4 as uuidv4 } from 'uuid';
import * as loggerToExport from './logger';

export { env } from './env';
export { api } from './cthttp';
export { user } from './user';
export { userAction } from './useraction';
export { CTEpubGenerator } from './epub-gen';
export { CTSearch, search } from './search';
export { CTPrompt, prompt } from './prompt';
export { CTPreference } from './user-preference';
export { CTUserGuide } from './user-guide';
export { html } from './2html';
export { elem } from './use-elem';
export { uurl } from './use-url';
export { uemail } from './use-email';
export { links } from './links';

export * from './constants';
export const logger = loggerToExport;

/**
 * Objects for switching pages and storing some general functions
 */
export const util = {
  genId(prefix = '') {
    return (prefix ? `${prefix}-` : '') + uuidv4();
  },

  refresh() {
    document.location.reload(true);
  },

  getSelectOptions(array = [], tag) {
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
  },

  getFittedName(name, charNum) {
    if (!name) return '';

    let fittedName = name.slice(0, charNum);
    if (fittedName !== name) fittedName += '...';
    return fittedName;
  },

  fixForAccessbitity(category) {
    switch (category) {
      case 'widgets/scripts':
        $('.default').each((index, el) => {
          el.removeAttribute('aria-live');
          el.removeAttribute('role');
        });
        break;
      case 'formSearchDropdown':
        $('.search').each((index, el) => {
          if (el.title) {
            // elem.setAttribute('aria-label', elem.title)
          } else {
            el.setAttribute('aria-label', el.parentElement.title);
          }
        });
        break;
      default:
        break;
    }
  },

  preventBreakLine(e = {}) {
    if (e.keyCode === 13) e.preventDefault();
  }
};
