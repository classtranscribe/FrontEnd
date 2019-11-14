import React from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import { 
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_OPACITY_100,
  CC_POSITION_BOTTOM,
  CC_FONT_SANS_SERIF,
  CC_SIZE_100,
  MENU_SETTING,
  videoControl,
  menuControl,
  transControl,
} from '../../../Utils'

function ClosedCaptionWithRedux({
  openCC=false,
  currCaption=null,
  isPrimary=false,

  cc_color=CC_COLOR_WHITE,
  cc_bg=CC_COLOR_BLACK,
  cc_size=CC_SIZE_100,
  cc_opacity=CC_OPACITY_100,
  cc_font=CC_FONT_SANS_SERIF,
  cc_position=CC_POSITION_BOTTOM,
}) {  

  const { ccStyle, ccContainerStyle } = transControl.getCCStyle({ 
    cc_color, 
    cc_color,
    cc_bg,
    cc_size,
    cc_opacity,
    cc_font,
    cc_position,
  })

  const shouldDisplayCC = isPrimary && openCC && Boolean(currCaption && currCaption.id)

  return shouldDisplayCC ? (
    <div className="watch-cc-container" style={ccContainerStyle}>
      <div className="watch-cc-text" style={ccStyle}>
        {currCaption.text}
      </div>
    </div>
  ) : null
}

export const ClosedCaption = connectWithRedux(
  ClosedCaptionWithRedux,
  ['currCaption', 'openCC', 'cc_color', 'cc_bg', 'cc_size', 'cc_opacity', 'cc_font', 'cc_position'],
  []
)