import React from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import { 
  transControl, 
  CC_COLOR_BLACK, CC_COLOR_WHITE, CC_SIZE_100, CC_OPACITY_100,
  CC_FONT_SANS_SERIF, CC_POSITION_TOP
} from '../../../Utils'

function AudioDescriptionWithRedux({
  time=0,
  openAD=false,
  isPrimary=false,

  cc_color=CC_COLOR_WHITE,
  cc_bg=CC_COLOR_BLACK,
  cc_size=CC_SIZE_100,
  cc_opacity=CC_OPACITY_100,
  cc_font=CC_FONT_SANS_SERIF,
  cc_position=CC_POSITION_TOP,
}) {

  const isOpen = isPrimary && openAD
  const { text } = isOpen ? (transControl.findDescription(time) || {}) : {}

  const shouldDisplayAD = isOpen && text

  const { ccStyle, ccContainerStyle } = transControl.getCCStyle({ 
    cc_color, 
    cc_color,
    cc_bg,
    cc_size,
    cc_opacity,
    cc_font,
    cc_position
  })

  return shouldDisplayAD ? (
    <div id="watch-ad-container" className="watch-ad-container" style={ccContainerStyle}>
      <div className="watch-ad-text" style={ccStyle}>
        <i>(Description)</i> {text}
      </div>
    </div>
  ) : null
}

export const AudioDescription = connectWithRedux(
  AudioDescriptionWithRedux,
  ['time', 'openAD', 'cc_color', 'cc_bg', 'cc_size', 'cc_opacity'],
  []
)