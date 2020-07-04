import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerController } from '../../../controllers';
import './index.scss';

import ClosedCaption from './ClosedCaption';

import Progress from './Progress';

import PlayButton from './PlayButton';
import SwapScreenButton from './SwapScreenButton';
import Volume from './Volume';
import TimeDisplay from './TimeDisplay';

import ClosedCaptionButton from './ClosedCaptionButton';
import SettingsButton from './SettingsButton';
import EnterFullScreenButton from './EnterFullScreenButton';
import ExitFullScreenButton from './ExitFullScreenButton';

function ControlBar(props) {
  const {
    player,
    isTwoScreen,
    userReady,
    isPaused,
    isEnded,
    isFullscreen,
    duration,
    time,
    bufferedTime,
    muted,
    volume,
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

            {isTwoScreen && <SwapScreenButton onClick={player.swapScreens} />}

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
  player: PropTypes.instanceOf(CTPlayerController),
  isTwoScreen: PropTypes.bool,
  userReady: PropTypes.bool,
  isPaused: PropTypes.bool,
  isEnded: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  duration: Progress.propTypes.duration,
  time: Progress.propTypes.time,
  bufferedTime: Progress.propTypes.bufferedTime,
  muted: Volume.propTypes.muted,
  volume: Volume.propTypes.volume,
  openCC: ClosedCaption.propTypes.open,
  ccFontSize: ClosedCaption.propTypes.ccFontSize,
  ccFontColor: ClosedCaption.propTypes.ccFontColor,
  ccOpacity: ClosedCaption.propTypes.ccOpacity,
  ccBackgroundColor: ClosedCaption.propTypes.ccBackgroundColor,
  currCaption: ClosedCaption.propTypes.currCaption,
  openSettings: PropTypes.bool,
  onOpenSettings: PropTypes.func
};

export default ControlBar;

