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
}) {

  const ad = ''
  const shouldDisplayAD = isPrimary && openAD && ad

  const { ccStyle, ccContainerStyle } = transControl.getCCStyle({ 
    cc_color, 
    cc_color,
    cc_bg,
    cc_size,
    cc_opacity,
    CC_FONT_SANS_SERIF,
    CC_POSITION_TOP
  })

  return shouldDisplayAD ? (
    <div id="watch-ad-container" className="watch-ad-container" style={ccContainerStyle}>
      <div className="watch-ad-text" style={ccStyle}>
        {ad}
      </div>
    </div>
  ) : null
}

export const AudioDescription = connectWithRedux(
  AudioDescriptionWithRedux,
  ['time', 'openAD', 'cc_color', 'cc_bg', 'cc_size', 'cc_opacity'],
  []
)