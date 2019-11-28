import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../../WatchCtrlButton'
import { videoControl } from '../../../Utils'

export function SwitchScreenButtonWithRedux({
  isSwitched=false,
}) {

  const handleSwitch = () => {
    videoControl.switchVideo()
  }

  return (
    <WatchCtrlButton 
      onClick={handleSwitch}
      label="Switch Screens (SHIFT+<)"
      id="switch-screen-btn"
      ariaTags={{
        'aria-label': 'Switch Screens',
        //'aria-keyshortcuts': 'SHIFT+,'
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">compare_arrows</i>       
      </span>
    </WatchCtrlButton>
  )
}

export const SwitchScreenButton = connectWithRedux(
  SwitchScreenButtonWithRedux,
  ['isSwitched'],
  []
)