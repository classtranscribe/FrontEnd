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
  toTop: function() {
    $('#captions').scrollTop(0)
  }
}

export const switchTrigger = html => {
  document.getElementById('expand-trigger').innerHTML = html
}

export const handleExpand = value => {
  const isExpanded = $(`.${EXPAND_CLASS}`).length
  const transContainer = $('.trans-container')
  const expandBtn = $('.expand-button')

  if (typeof value === 'boolean') {
    if (value) {
      transContainer.addClass(EXPAND_CLASS)
      expandBtn.attr('id', 'expand-less')
      switchTrigger('expand_more')
      enterPicInPic()
    } else {
      transContainer.removeClass(EXPAND_CLASS)
      expandBtn.attr('id', 'expand-more')
      switchTrigger('expand_less')
      exitPicInPic()
    }
  } else {
    if (isExpanded) {
      transContainer.removeClass(EXPAND_CLASS)
      expandBtn.attr('id', 'expand-more')
      switchTrigger('expand_less')
      exitPicInPic()
    } else {
      transContainer.addClass(EXPAND_CLASS)
      expandBtn.attr('id', 'expand-less')
      switchTrigger('expand_more')
      enterPicInPic()
    }
  } 
}

export const hasPIPFeature = () => {
  if ($("video").length > 0)
    return typeof $("video")[0].requestPictureInPicture === 'function'
  return false
}

export const enterPicInPic = () => {
  $("video").each( (index, videoElem) => {
    if (index === 0 && typeof videoElem.requestPictureInPicture === 'function') 
      videoElem.requestPictureInPicture()
  })
}

export const exitPicInPic = () => {
  if (typeof document.exitPictureInPicture === 'function') document.exitPictureInPicture()
}
