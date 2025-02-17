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

export function prettierTimeStr(time, showMilliseconds = false) {
  if (typeof time !== 'string') return '';

  const parts = time.split(':').map((part) => parseFloat(part));
  let hours = 0;
  let mins = 0;
  let secs = 0;
  let millis = 0;

  if (parts.length === 3) {
    hours = parts[0];
    mins = parts[1];
    secs = Math.floor(parts[2]);
    millis = Math.round((parts[2] % 1) * 1000);
  } else if (parts.length === 2) {
    mins = parts[0];
    secs = Math.floor(parts[1]);
    millis = Math.round((parts[1] % 1) * 1000);
  } else if (parts.length === 1) {
    secs = Math.floor(parts[0]);
    millis = Math.round((parts[0] % 1) * 1000);
  }

  const format = (num, digits = 2) => String(num).padStart(digits, '0');
  const formattedTime = `${format(hours)}:${format(mins)}:${format(secs)}`;

  return showMilliseconds
    ? `${formattedTime}.${format(millis, 3)}`
    : formattedTime;
}



// export function prettierTimeStr(str) {
//   if (typeof str !== 'string') return '';
  
//   const strs = str.split(':');
//   if (strs.length !== 3) return ''; // Ensure the input is in HH:MM:SS format

//   let hours = parseInt(strs[0], 10);
//   let mins = parseInt(strs[1], 10);
//   let sec = parseInt(strs[2], 10);

//   // Format minutes and seconds to two digits
//   if (hours < 10) hours = `0${hours}`;
//   if (mins < 10) mins = `0${mins}`;
//   if (sec < 10) sec = `0${sec}`;

//   return `${hours}:${mins}:${sec}`;
// }


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
