import React from 'react';
import { connect } from 'dva'
import './index.scss';
import {
  transControl,
  CC_COLOR_BLACK,
  CC_COLOR_WHITE,
  CC_SIZE_100,
  CC_OPACITY_100,
  CC_FONT_SANS_SERIF,
  CC_POSITION_TOP,
  getCCStyle
} from '../../../Utils';

function AudioDescriptionWithRedux({
  time = 0,
  openAD = false,
  isPrimary = false,

  cc_color = CC_COLOR_WHITE,
  cc_bg = CC_COLOR_BLACK,
  cc_size = CC_SIZE_100,
  cc_opacity = CC_OPACITY_100,
  cc_font = CC_FONT_SANS_SERIF,
  cc_position = CC_POSITION_TOP,
}) {
  const isOpen = isPrimary && openAD;
  const { text } = isOpen ? transControl.findDescription(time) || {} : {};

  const shouldDisplayAD = isOpen && text;

  const { ccStyle, ccContainerStyle } = getCCStyle({
    cc_color,
    cc_bg,
    cc_size,
    cc_opacity,
    cc_font,
    cc_position,
  });

  return shouldDisplayAD ? (
    <div id="watch-ad-container" className="watch-ad-container" style={ccContainerStyle}>
      <div className="watch-ad-text" style={ccStyle}>
        <i>(Description)</i> {text}
      </div>
    </div>
  ) : null;
}

export const AudioDescription = connect(({ watch : { time },
  playerpref: { openAD, cc_color, cc_bg, cc_size, cc_opacity }, loading }) => ({
  time, cc_color, cc_bg, cc_size, cc_opacity, openAD
}))(AudioDescriptionWithRedux);
