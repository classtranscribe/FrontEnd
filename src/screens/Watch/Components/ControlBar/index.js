import React from 'react'
import { connectWithRedux } from '../../Utils'
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
import { isMobile } from 'react-device-detect'

export function ControlBarWithRedux({
  media={},
  bulkEditing=false,
}) {
  const { isTwoScreen } = media

  const showScreenModes = isTwoScreen && !bulkEditing && !isMobile
  return (
    <div id="watch-ctrl-bar" className="watch-ctrl-bar-container">
      <ProgressBar />
      <div className="watch-ctrl-bar-left-elems">

        <NextVideoButton nextBtn={false} />
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
        {
          showScreenModes 
          && 
          <ScreenModeSettingButton isTwoScreen={isTwoScreen} />
        }
        <SettingButton />
        <FullscreenButton />
      </div>
    </div>
  )
}

export const ControlBar = connectWithRedux(
  ControlBarWithRedux,
  ['media', 'bulkEditing'],
  []
)