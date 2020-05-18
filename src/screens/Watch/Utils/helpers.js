import _ from 'lodash'
import { cc_colorMap, CC_COLOR_BLACK } from './constants.util'
import { util } from 'utils';
import moment from 'moment';
// import { videoControl } from './player.control'

/**
 * Convert seconds to a readable time string `H:mm:ss`
 * @param {Number} sec - seconds
 * @returns {String} H:mm:ss
 */
export function parseSec(sec) {
  let formatter = sec < 3600 ? 'mm:ss' : 'H:mm:ss'
  return moment().startOf('day')
                 .seconds(sec)
                 .format(formatter);
}

/**
 * Parse time string H:mm:ss to seconds
 * @param {String} str - time string H:mm:ss
 * @returns {Number} seconds
 */
export function timeStrToSec(str) {
  if (typeof str !== "string") return ''
  const strs = str.split(':')
  let len3 = strs.length > 2
  let sec = (len3 ? parseFloat(strs[2]) : parseFloat(strs[1])) || 0
  let min = (len3 ? parseFloat(strs[1]) : parseFloat(strs[0])) * 60 || 0
  let hr = (len3 ? parseFloat(strs[0]) : 0) * 3600 || 0
  return sec + min + hr
}

/**
 * @param {Number} time current time
 * @returns {()=>Boolean}
 */
export function isEarlier(time) {
  return ({ begin }) => time >= timeStrToSec(begin)
}

/**
 * @param {Number} time current time
 * @returns {()=>Boolean}
 */
export function isLater(time) {
  return ({ begin }) => time <= timeStrToSec(begin)
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

/** handle Share */
// Get share url
export function getShareableURL(begin=0) {
  const { origin } = window.location
  const { id } = util.links.useSearch()
  let pathname = util.links.watch(id, { begin, from: 'sharedlink' })

  return origin + pathname
}