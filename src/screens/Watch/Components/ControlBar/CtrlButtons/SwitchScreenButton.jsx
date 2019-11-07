import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
import { videoControl } from '../../../Utils'

export function SwitchScreenButtonWithRedux({
  isSwitched=false,
}) {

  const handleSwitch = () => {
    if (isSwitched) {
      videoControl.switchVideo(false)
    } else {
      videoControl.switchVideo(true)
    }
  }

  return (
    <WatchCtrlButton 
      onClick={handleSwitch}
      label="Switch Screens"
    >
      <span className="watch-btn-content" tabIndex="-1">
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