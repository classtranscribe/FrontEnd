import $ from 'jquery'
import _ from 'lodash'
import autosize from 'autosize'
import { cc_colorMap, CC_COLOR_BLACK } from './constants.util'

export function findUpNextMedia({
  playlist={ medias: [] },
  currMediaId='',
  playlists=[{ medias: [] }],
  currPlaylistId='',
}) {
  const { medias } = playlist;
  const currMediaIndex = _.findIndex(medias, { id: currMediaId });

  if (currMediaIndex > -1) {
    // if is the last video of the medias
    if (currMediaIndex <= 0) {
      const currPlaylistIndex = _.findIndex(playlists, { id: currPlaylistId });
      // if this is this last playlist
      // return the 1st video in the 1st playlist
      let nextPlaylistMedias = []
      if (currPlaylistIndex + 1 >= playlists.length) {
        nextPlaylistMedias = playlists[0].medias
      // return the first video of the next playlist
      } else {
        nextPlaylistMedias = playlists[currPlaylistIndex + 1].medias
      }
      return nextPlaylistMedias[nextPlaylistMedias.length - 1] || null;
    // return next video
    } else {
      return medias[currMediaIndex - 1];
    }
  // if no such media
  } else {
    return null;
  }
}

export function parseSec(d) {
  if (d === undefined) return '';
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + ":" : "";
  var mDisplay = m > 0 ? m > 9 ? m + ":" : "0" + m + ":" : "00:";
  var sDisplay = s > 9 ? s : "0" + s;
  return hDisplay + mDisplay + sDisplay; 
}

export function timeStrToSec(str) {
  const strs = str.split(':')
  return parseFloat(strs[0]) * 3600 + parseFloat(strs[1]) * 60 + parseFloat(strs[2])
}

export function prettierTimeStr(str) {
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

async function autoHelper () {
  let textareas = $('textarea')
    for (let i = 0; i < textareas.length; i++) {
      await setTimeout(() => {
        // autosize(document.querySelectorAll('textarea'));
        autosize(textareas[i]);
      }, 200);
    }
}
export function autoSizeAllTextAreas(timeout=0) {
  return;
  setTimeout(() => {
    autoHelper()
  }, timeout);
}

