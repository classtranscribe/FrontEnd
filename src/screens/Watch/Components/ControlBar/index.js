import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { 
  PlayButton,
  SettingButton,
  NextVideoButton,
  FullscreenButton,
  SwitchScreenButton,
  PlaybackRateButton,
  ClosedCaptionButton,
  LanguagePickerButton,
  AudioDescriptionButton,
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
        <NextVideoButton />
        {isTwoScreen && <SwitchScreenButton />}
        <VolumeControl />
        <TimeDisplay />
      </div>
      <div className="watch-ctrl-bar-right-elems">
        <PlaybackRateButton />
        <ClosedCaptionButton />
        <AudioDescriptionButton />
        <LanguagePickerButton />
        {isTwoScreen && <ScreenModeSettingButton isTwoScreen={isTwoScreen} />}
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