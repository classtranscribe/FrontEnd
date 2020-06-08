import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import PauseButton from './PauseButton';
import PlayButton from './PlayButton';
import ReplayButton from './ReplayButton';
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

  return (
    <div className="ctp control-bar">
      <div className="ctp action-bar">
        <div className="right">
          {pauseToggleElement}
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

