import _ from 'lodash'
import $ from 'jquery'
const EXPAND_CLASS = 'trans-con-expand'

export function timeStrToSec(str) {
  const strs = str.split(':')
  return parseFloat(strs[0]) * 3600 + parseFloat(strs[1]) * 60 + parseFloat(strs[2])
}

export function timeBetterLook(str) {
  const strs = str.split(':')
  var mins = parseInt(strs[0]) * 60 + parseInt(strs[1])
  mins = mins.toString()
  if (mins.length === 1) mins = '0' + mins
  var sec  = parseInt(strs[2])
  sec = sec.toString()
  if (sec.length === 1) sec = '0' + sec
  return `${mins}:${sec}`
}

export function findCurrLine(time, {state: {captions}, lastCaptionIndex, lastEnd}) {
  if (!captions.length) return null
  if (lastEnd === 0) return captions[0]

  if (lastEnd <= time) {
    for (let i = lastCaptionIndex; i < captions.length; i++) {
      let line = captions[i]
      if (timeStrToSec(line.end) > time) return line
    }
    return captions[captions.length-1]
  } else {
    for (let i = lastCaptionIndex; i >= 0; i--) {
      let line = captions[i]
      if (timeStrToSec(line.begin) <= time) return line
    }
    return captions[0]
  }
}

export const capSearch = {
  getResult: function(captions, value) {
    if (!value) return []
    const tests = []
    // get test functions for each word
    value.split(' ').forEach( word => {
      const re = new RegExp(_.escapeRegExp(word), 'i')
      const test = result => re.test(result.text)
      tests.push(test)
    })
    // combine the test result
    const isMatch = result => {
      var match = true
      tests.forEach( test => match = match && test(result))
      return match
    }

    const re = _.filter(captions, isMatch)
    return re.length ? re : ['NOT FOUND']
  },
  highlight: function(value) {
    
  },
  toTop: function() {
    $('#captions').scrollTop(0)
  }
}

export const switchTrigger = html => {
  document.getElementById('expand-trigger').innerHTML = html
}

export const handleExpand = value => {
  const isExpanded = $(`.${EXPAND_CLASS}`).length
  if (document.pictureInPictureElement) exitPicInPic()
  else enterPicInPic()
  
  if (typeof value === 'boolean') {
    if (value) {
      $('.trans-container').addClass(EXPAND_CLASS)
      switchTrigger('expand_more')
    } else {
      $('.trans-container').removeClass(EXPAND_CLASS)
      switchTrigger('expand_less')
    }
  } else {
    if (isExpanded) {
      $('.trans-container').removeClass(EXPAND_CLASS)
      switchTrigger('expand_less')
    } else {
      $('.trans-container').addClass(EXPAND_CLASS)
      switchTrigger('expand_more')
    }
  } 
}

export const enterPicInPic = () => {
  $("video").each( (index, videoElem) => {
    if (index === 0) videoElem.requestPictureInPicture()
  })
}

export const exitPicInPic = () => {
  document.exitPictureInPicture()
}