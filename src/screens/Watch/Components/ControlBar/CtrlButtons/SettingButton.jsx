import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
import { 
  MENU_HIDE, MENU_SETTING, 
  menuControl
} from '../../../Utils'

export function SettingButtonWithRedux({
  menu=MENU_HIDE,
}) {

  const handleMenuTrigger = () => {
    if (menu !== MENU_SETTING) {
      menuControl.open(MENU_SETTING)
    } else {
      menuControl.close()
    }
  }

  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_SETTING}
      label="Settings"
      ariaLabel="Settings"
      id={MENU_SETTING}
    >
      <span className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">settings_applications</i>     
      </span>
    </WatchCtrlButton>
  )
}

export const SettingButton = connectWithRedux(
  SettingButtonWithRedux,
  ['menu'],
  []
)