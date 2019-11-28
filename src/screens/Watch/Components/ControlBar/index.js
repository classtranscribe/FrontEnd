import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { 
  PlayButton,
  DownloadButton,
  SettingButton,
  FullscreenButton,
  SwitchScreenButton,
  PlaybackRateButton,
  ClosedCaptionButton,
  LanguagePickerButton,
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
    <div id="watch-ctrl-bar" className="watch-ctrl-bar-container">
      <ProgressBar />
      <div className="watch-ctrl-bar-left-elems">
        <PlayButton />
        {isTwoScreen && <SwitchScreenButton />}
        <VolumeControl />
        <TimeDisplay />
      </div>
      <div className="watch-ctrl-bar-right-elems">
        <PlaybackRateButton />
        <ClosedCaptionButton />
        <LanguagePickerButton />
        <ScreenModeSettingButton isTwoScreen={isTwoScreen} />
        {/* <DownloadButton /> */}
        <SettingButton />
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