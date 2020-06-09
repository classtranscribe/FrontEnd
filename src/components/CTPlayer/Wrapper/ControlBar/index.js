import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { getSettingsMenu } from '../../controllers/settings-menu';

import ClosedCaption from './ClosedCaption';

import Progress from './Progress';

import PauseButton from './PauseButton';
import PlayButton from './PlayButton';
import ReplayButton from './ReplayButton';
import Volume from './Volume';
import TimeDisplay from './TimeDisplay';

import ClosedCaptionButton from './ClosedCaptionButton';
import Settings from './Settings';
import EnterFullScreenButton from './EnterFullScreenButton';
import ExitFullScreenButton from './ExitFullScreenButton';

function ControlBar(props) {
  let {
    player,
    isPaused,
    isEnded,
    isFullscreen,
    duration,
    time,
    bufferedTime,
    muted,
    volume,
    playbackRate,
    openCC,
    currCaption,
    openRange,
    range,
    onRangeChange,
  } = props;

  const pauseToggleElement = (
    isEnded
    ? <ReplayButton onClick={player.replay} />
    : isPaused
    ? <PlayButton onClick={player.play} />
    : <PauseButton onClick={player.pause} />
  );

  const fullscreenToggleElement = (
    isFullscreen
    ? <ExitFullScreenButton onClick={player.exitFullscreen} />
    : <EnterFullScreenButton onClick={player.enterFullscreen} />
  );

  const progressProps = {
    duration,
    time,
    bufferedTime,
    playbackRate,
    setCurrentTime: player.setCurrentTime,
    openRange,
    range
  };

  const volumeProps = {
    muted,
    volume,
    onVolumeChange: player.setVolume,
    onToggleMute: player.toggleMute,
  };

  const rangeSliderProps = {
    range,
    openRange,
    duration,
    onRangeChange,
  };

  const rangeCtrlProps = {
    range,
    openRange,
    onRangeChange,
    onPlayRange: player.playRange
  };

  const closedCaptionProps = {
    open: openCC,
    currCaption,
  };

  return (
    <div className="ctp control-bar">
      <div className="ctp cc-con">
        <ClosedCaption {...closedCaptionProps} />
      </div>

      <Progress {...progressProps} />

      <div className="ctp action-bar">
        <div className="right">
          {pauseToggleElement}

          <Volume {...volumeProps} />

          <TimeDisplay duration={duration} time={time} />
        </div>
        <div className="left">
          <ClosedCaptionButton openCC={openCC} onClick={player.toggleCC} />

          <Settings getSettingsMenu={() => getSettingsMenu(player)} />

          {fullscreenToggleElement}
        </div>
      </div>
    </div>
  );
}

ControlBar.propTypes = {

};

export default ControlBar;

