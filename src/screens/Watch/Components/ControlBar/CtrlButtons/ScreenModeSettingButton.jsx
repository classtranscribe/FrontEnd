import React from 'react'
import _ from 'lodash'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../../WatchCtrlButton'
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
      label={<>Screen Mode: <strong>{currMode.name}</strong> (SHIFT+S)</>}
      id={MENU_SCREEN_MODE}
      ariaTags={{
        'aria-label': 'Screen Mode Menu',
        //'aria-keyshortcuts': 'SHIFT+S',
        'aria-controls': 'watch-screen-mode-menu',
        'aria-haspopup': 'true'
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
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

