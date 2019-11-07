import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
import { 
  MENU_HIDE, MENU_CAPTIONS, 
  menuControl
} from '../../../Utils'

export function CCSettingButtonWithRedux({
  menu=MENU_HIDE,
}) {

  const handleMenuTrigger = () => {
    if (menu !== MENU_CAPTIONS) {
      menuControl.open(MENU_CAPTIONS)
    } else {
      menuControl.close()
    }
  }

  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_CAPTIONS}
      label="Closed Caption Setting"
    >
      <span className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">closed_caption</i>     
      </span>
    </WatchCtrlButton>
  )
}

export const CCSettingButton = connectWithRedux(
  CCSettingButtonWithRedux,
  ['menu'],
  []
)