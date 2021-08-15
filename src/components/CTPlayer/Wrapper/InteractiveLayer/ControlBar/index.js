import React from 'react';
import { connect } from 'dva'
import './index.scss';
import {
  PlayButton,
  SettingButton,
  FullscreenButton,
  SwitchScreenButton,
  ClosedCaptionButton,
  ScreenModeSettingButton,
} from 'screens/Watch/Components/ControlBar/CtrlButtons';
import VolumeControl from 'screens/Watch/Components/ControlBar/VolumeControl';
import TimeDisplay from 'screens/Watch/Components/ControlBar/TimeDisplay';
import {
  ClosedCaption,
} from 'screens/Watch/Components/Overlays';
import Progress from './Progress';
import ClosedCaptionMenu from '../SettingsMenu/ClosedCaptionMenu';

function ControlBar(props) {
  const {
    dispatch,
    isTwoScreen,
    userReady = true,
    duration,
    time,
  } = props;

  // ctp act-btn

  return userReady ? (
    <div className="ctp control-bar ct-a-fade-in">
      <div className="ctp center-area" onClick={() => dispatch({ type: 'watch/onPlayPauseClick' })}>
        <div className="ctp cc-con">
          <ClosedCaption isPrimary />
        </div>
      </div>

      <div className="ctp bottom-bar">
        <Progress />

        <div className="ctp control-btns ct-d-r-center-v">
          <div className="left ct-d-r-center-v">
            <PlayButton />
            {isTwoScreen && <SwitchScreenButton />}
            <VolumeControl />
            <TimeDisplay duration={duration} time={time} />
          </div>
          <div className="right ct-d-r-center-v">
            <ScreenModeSettingButton />
            <ClosedCaptionButton />
            <SettingButton />
            <FullscreenButton />
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default connect()(ControlBar);

