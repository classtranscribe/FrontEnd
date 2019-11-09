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

  const currMode = _.find(screenModes, { type: mode })
  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_SCREEN_MODE}
      label={<>Screen Mode: <strong>{currMode.name}</strong></>}
      ariaLabel="Screen Mode Menu"
      id={MENU_SCREEN_MODE}
    >
      <span className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">{currMode.icon}</i>     
      </span>
    </WatchCtrlButton>
  )
}

export const ScreenModeSettingButton = connectWithRedux(
  ScreenModeSettingButtonWithRedux,
  ['menu', 'mode'],
  []
)

