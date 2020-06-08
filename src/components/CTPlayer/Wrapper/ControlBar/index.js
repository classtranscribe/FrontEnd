import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import Progress from './Progress';

import PauseButton from './PauseButton';
import PlayButton from './PlayButton';
import ReplayButton from './ReplayButton';
import TimeDisplay from './TimeDisplay';

import ClosedCaptionButton from './ClosedCaptionButton';
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
    player,
    duration,
    time,
    bufferedTime,
    playbackRate,
  };

  return (
    <div className="ctp control-bar">
      <Progress {...progressProps} />

      <div className="ctp action-bar">
        <div className="right">
          {pauseToggleElement}

          <TimeDisplay duration={duration} time={time} />
        </div>
        <div className="left">
          <ClosedCaptionButton openCC={openCC} onClick={player.toggleCC} />

          {fullscreenToggleElement}
        </div>
      </div>
    </div>
  );
}

ControlBar.propTypes = {

};

export default ControlBar;

