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
  getCCStyle,
  WEBVTT_SUBTITLES,
} from '../../../Utils';

let prevText = '';

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
}) {
  const { ccStyle, ccContainerStyle } = getCCStyle({
    cc_color,
    cc_bg,
    cc_size,
    cc_opacity,
    cc_font,
    cc_position,
  });

  const shouldDisplayCC = isPrimary && openCC && Boolean(currCaption && currCaption.id);

  if (shouldDisplayCC && currCaption.kind === WEBVTT_SUBTITLES) {
    prevText = currCaption.text;
  }

  return shouldDisplayCC && prevText ? (
    <div id="watch-cc-container" className={embedded ? "" : "watch-cc-container"} style={ccContainerStyle}>
      <div className="watch-cc-text" style={ccStyle}>
        {prevText}
      </div>
    </div>
  ) : null;
}

export const ClosedCaption = connect(({ watch: { currCaption, embedded },
  playerpref: { openCC, cc_color, cc_bg, cc_size,
    cc_opacity, cc_font, cc_position }, loading }) => ({
      embedded,
      currCaption, cc_color, cc_bg, cc_size, cc_opacity, cc_font, cc_position, openCC
    }))(ClosedCaptionWithRedux);
