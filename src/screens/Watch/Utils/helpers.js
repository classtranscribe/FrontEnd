import { uurl, links } from 'utils';
import moment from 'moment';
import { cc_colorMap, CC_COLOR_BLACK } from './constants.util';

/**
 * Convert seconds to a readable time string `H:mm:ss`
 * @param {Number} sec - seconds
 * @returns {String} H:mm:ss
 */
export function parseSec(sec) {
  const formatter = sec < 3600 ? 'mm:ss' : 'H:mm:ss';
  return moment().startOf('day').seconds(sec).format(formatter);
}

/**
 * Parse time string H:mm:ss to seconds
 * @param {String} str - time string H:mm:ss
 * @returns {Number} seconds
 */
export function timeStrToSec(str) {
  if (typeof str !== 'string') return '';
  const strs = str.split(':');
  const len3 = strs.length > 2;
  const sec = (len3 ? parseFloat(strs[2]) : parseFloat(strs[1])) || 0;
  const min = (len3 ? parseFloat(strs[1]) : parseFloat(strs[0])) * 60 || 0;
  const hr = (len3 ? parseFloat(strs[0]) : 0) * 3600 || 0;
  return sec + min + hr;
}

/**
 * @param {Number} time current time
 * @returns {()=>Boolean}
 */
export function isEarlier(time) {
  return ({ begin }) => time >= timeStrToSec(begin);
}

/**
 * @param {Number} time current time
 * @returns {()=>Boolean}
 */
export function isLater(time) {
  return ({ begin }) => time <= timeStrToSec(begin);
}

export function prettierTimeStr(str) {
  if (typeof str !== 'string') return '';
  const strs = str.split(':');
  let mins = parseInt(strs[0], 10) * 60 + parseInt(strs[1], 10);
  mins = mins.toString();
  if (mins.length === 1) mins = `0${mins}`;
  let sec = parseInt(strs[2], 10);
  sec = sec.toString();
  if (sec.length === 1) sec = `0${sec}`;
  return `${mins}:${sec}`;
}

export function getCCSelectOptions(array = [], operation = (item) => item) {
  const options = [];
  array.forEach((item) => {
    const text = operation(item);
    options.push({ text, value: item });
  });
  return options;
}

export function colorMap(color = CC_COLOR_BLACK, opacity = 1) {
  const colorStr = cc_colorMap[color];
  if (!colorStr) return CC_COLOR_BLACK;
  return colorStr.replace('*', opacity);
}

/** handle Share */
// Get share url
export function getShareableURL(begin = 0) {
  const { origin } = window.location;
  const { id } = uurl.useSearch();
  const pathname = links.watch(id, { begin, from: 'sharedlink' });

  return origin + pathname;
}
