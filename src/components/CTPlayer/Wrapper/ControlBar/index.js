import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { getSettingsMenu } from '../../controllers/settings-menu';
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
    openCC,
    duration,
    time,
    bufferedTime,
    muted,
    volume,
    playbackRate,
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
    setCurrentTime: player.setCurrentTime
  };

  const volumeProps = {
    muted,
    volume,
    onVolumeChange: player.setVolume,
    onToggleMute: player.toggleMute,
  }

  return (
    <div className="ctp control-bar">
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

