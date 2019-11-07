import React from 'react'
import _ from 'lodash'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
import { 
  MENU_HIDE, MENU_SCREEN_MODE, NORMAL_MODE,
  screenModes,
  menuControl
} from '../../../Utils'

export function ScreenModeSettingButtonWithRedux({
  menu=MENU_HIDE,
  mode=NORMAL_MODE,
}) {

  const handleMenuTrigger = () => {
    if (menu !== MENU_SCREEN_MODE) {
      menuControl.open(MENU_SCREEN_MODE)
    } else {
      menuControl.close()
    }
  }

  const modeIcom = _.find(screenModes, { type: mode }).icon
  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_SCREEN_MODE}
      label="Screen Modes"
    >
      <span className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">{modeIcom}</i>     
      </span>
    </WatchCtrlButton>
  )
}

export const ScreenModeSettingButton = connectWithRedux(
  ScreenModeSettingButtonWithRedux,
  ['menu', 'mode'],
  []
)

