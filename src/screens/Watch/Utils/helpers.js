import $ from 'jquery'
import _ from 'lodash'
import autosize from 'autosize'
import { cc_colorMap, CC_COLOR_BLACK } from './constants.util'
import { util } from 'utils';
// import { videoControl } from './player.control'

export function parseSec(d) {
  if (d === undefined) return '';
  d = Number(d);
  if ( d < 0 ) return ''
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + ":" : "";
  var mDisplay = m > 0 ? m > 9 ? m + ":" : "0" + m + ":" : "00:";
  var sDisplay = s > 9 ? s : "0" + s;
  return hDisplay + mDisplay + sDisplay; 
}

export function timeStrToSec(str) {
  if (typeof str !== "string") return ''
  const strs = str.split(':')
  let len3 = strs.length > 2
  let sec = (len3 ? parseFloat(strs[2]) : parseFloat(strs[1])) || 0
  let min = (len3 ? parseFloat(strs[1]) : parseFloat(strs[0])) * 60 || 0
  let hr = (len3 ? parseFloat(strs[0]) : 0) * 3600 || 0
  return sec + min + hr
}

export function prettierTimeStr(str) {
  if (typeof str !== "string") return ''
  const strs = str.split(':')
  var mins = parseInt(strs[0]) * 60 + parseInt(strs[1])
  mins = mins.toString()
  if (mins.length === 1) mins = '0' + mins
  var sec  = parseInt(strs[2])
  sec = sec.toString()
  if (sec.length === 1) sec = '0' + sec
  return `${mins}:${sec}`
}

export function getCCSelectOptions(array=[], operation=item => item) {
  const options = []
  array.forEach( item => {
    let text = operation(item)
    options.push({ text, value: item })
  })
  return options
}

export function colorMap(color=CC_COLOR_BLACK, opacity=1) {
  const colorStr = cc_colorMap[color]
  if (!colorStr) return CC_COLOR_BLACK
  return colorStr.replace('*', opacity)
}

export function autoSize(e) {
  let elem = e.target || e
  autosize(elem);
}

export function autoSizeAllTextAreas(timeout=0) {
  return;
}


/** handle Share */
// Get share url
export function getShareableURL(begin=0) {
  const { origin } = window.location
  const { id } = util.links.useSearch()
  let pathname = util.links.watch(id, { begin, from: 'sharedlink' })

  return origin + pathname
}