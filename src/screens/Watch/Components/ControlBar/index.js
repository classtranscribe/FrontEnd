import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { 
  PlayButton,
  DownloadButton,
  CCSettingButton,
  FullscreenButton,
  SwitchScreenButton,
  PlaybackRateButton,
  ScreenModeSettingButton,
} from './CtrlButtons'
import VolumeControl from './VolumeControl'
import TimeDisplay from './TimeDisplay'
import ProgressBar from './ProgressBar'

import './index.css'

export function ControlBarWithRedux({
  media={}
}) {
  const { isTwoScreen } = media
  return (
    <div className="watch-ctrl-bar-container">
      <ProgressBar />
      <div className="watch-ctrl-bar-left-elems">
        <PlayButton />
        <VolumeControl />
        <TimeDisplay />
      </div>
      <div className="watch-ctrl-bar-right-elems">
        <PlaybackRateButton />
        <CCSettingButton />
        {isTwoScreen && <SwitchScreenButton />}
        <ScreenModeSettingButton isTwoScreen={isTwoScreen} />
        <DownloadButton />
        <FullscreenButton />
      </div>
    </div>
  )
}

export const ControlBar = connectWithRedux(
  ControlBarWithRedux,
  ['media'],
  []
)