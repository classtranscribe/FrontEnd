import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import ClosedCaption from './ClosedCaption';

import Progress from './Progress';

import PlayButton from './PlayButton';
import Volume from './Volume';
import TimeDisplay from './TimeDisplay';

import ClosedCaptionButton from './ClosedCaptionButton';
import SettingsButton from './SettingsButton';
import EnterFullScreenButton from './EnterFullScreenButton';
import ExitFullScreenButton from './ExitFullScreenButton';

function ControlBar(props) {
  let {
    player,
    userReady,
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
    ccFontSize,
    ccFontColor,
    ccOpacity,
    ccBackgroundColor,
    currCaption,
    openSettings,
    onOpenSettings
  } = props;

  const playButtonProps = {
    isEnded,
    isPaused,
    onPlay: player.play,
    onPause: player.pause,
    onReplay: player.replay
  };

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
  };

  const volumeProps = {
    muted,
    volume,
    onVolumeChange: player.setVolume,
    onToggleMute: player.toggleMute,
  };

  const closedCaptionProps = {
    open: openCC,
    ccFontSize,
    ccFontColor,
    ccOpacity,
    ccBackgroundColor,
    currCaption,
  };

  return userReady ? (
    <div className="ctp control-bar ct-a-fade-in">
      <div className="ctp center-area" onClick={player.togglePause}>
        <div className="ctp cc-con">
          <ClosedCaption {...closedCaptionProps} />
        </div>
      </div>

      <div className="ctp bottom-bar">
        <Progress {...progressProps} />

        <div className="ctp control-btns ct-d-r-center-v">
          <div className="left ct-d-r-center-v">
            <PlayButton {...playButtonProps} />

            <Volume {...volumeProps} />

            <TimeDisplay duration={duration} time={time} />
          </div>
          <div className="right ct-d-r-center-v">
            <ClosedCaptionButton openCC={openCC} onClick={player.toggleCC} />

            <SettingsButton onClick={onOpenSettings} active={openSettings} />

            {fullscreenToggleElement}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

ControlBar.propTypes = {

};

export default ControlBar;

