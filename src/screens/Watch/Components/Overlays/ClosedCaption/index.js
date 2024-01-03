/* eslint-disable complexity */
import React from 'react';
import { connect } from 'dva'
import './index.scss';
import {
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_OPACITY_100,
  CC_POSITION_BOTTOM,
  CC_FONT_SANS_SERIF,
  CC_SIZE_100,
  CC_SPACING_DEFAULT,
  getCCStyle,
  WEBVTT_SUBTITLES,
} from '../../../Utils';

let theText = '';
// if caption is long and only one line, break it into two lines
const rebalanceCaption = (text) => {
  let result = text;
  if(text && text.indexOf('\n') === -1 && text.length > 30){
    const words = text.split(' ');
    result = '';
    while(result.length < text.length / 2 ){
      result += `${result.length > 0?' ':''}${words.shift() }`;
    }
    result += '\n';
    while(words.length > 0){
      result += `${words.shift() }${words.length===0?'':' '}`;
    }
  }
  return result;
}

function ClosedCaptionWithRedux({
  openCC = false,
  currCaption = null,
  isPrimary = false,
  embedded = false,

  cc_color = CC_COLOR_WHITE,
  cc_bg = CC_COLOR_BLACK,
  cc_size = CC_SIZE_100,
  cc_opacity = CC_OPACITY_100,
  cc_font = CC_FONT_SANS_SERIF,
  cc_position = CC_POSITION_BOTTOM,
  cc_spacing = CC_SPACING_DEFAULT,
}) {
  const { ccStyle, ccContainerStyle } = getCCStyle({
    cc_color,
    cc_bg,
    cc_size,
    cc_opacity,
    cc_font,
    cc_position,
    cc_spacing,
  });

  const shouldDisplayCC = isPrimary && openCC && Boolean(currCaption && currCaption.id);

  if (shouldDisplayCC && currCaption.kind === WEBVTT_SUBTITLES) {
    theText = rebalanceCaption(currCaption.text);
  } 

  return shouldDisplayCC && theText ? (
    <div id="watch-cc-container" className={embedded ? "" : "watch-cc-container"} style={ccContainerStyle}>
      <div className="watch-cc-text" style={ccStyle}>
        {theText}
      </div>
    </div>
  ) : null;
}

export const ClosedCaption = connect(({ watch: { currCaption, embedded },
  playerpref: { openCC, cc_color, cc_bg, cc_size,
    cc_opacity, cc_font, cc_position, cc_spacing } }) => ({
      embedded,
      currCaption, cc_color, cc_bg, cc_size, cc_opacity, cc_font, cc_position, cc_spacing, openCC
    }))(ClosedCaptionWithRedux);
