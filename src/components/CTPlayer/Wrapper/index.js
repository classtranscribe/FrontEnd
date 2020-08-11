import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import StartLayer from './StartLayer';
import InteractiveLayer from './InteractiveLayer';
import NonInteractiveLayer from './NonInteractiveLayer';

function Wrapper(props) {
  let {
    error,
    media,
    player,
    event,
    isTwoScreen,
    screenMode,
    videoReady,
    userReady,
    isEnded,
    isPaused,
    isFullscreen,
    beginAt,
    endAt,
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
    language,
    currCaption,
    hideWrapperOnMouseLeave,
  } = props;

  const startLayerProps = {
    videoReady,
    userReady,
    onTogglePause: player.togglePause
  };

  const nonInteractiveLayerProps = {
    error,
    event,
    volume,
    onTogglePause: player.togglePause
  };

  const interactiveLayerProps = {
    hideWrapperOnMouseLeave,
    error,
    media,
    player,
    isTwoScreen,
    screenMode,
    userReady,
    isEnded,
    isPaused,
    isFullscreen,
    beginAt,
    endAt,
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
    language,
    currCaption,
  };

  return (
    <div className="ctp wrapper main-wrapper">
      <NonInteractiveLayer {...nonInteractiveLayerProps} />
      <InteractiveLayer {...interactiveLayerProps} />
      {!error && <StartLayer {...startLayerProps} />}
    </div>
  );
}

Wrapper.propTypes = {
  /** The media data for this player */
  media: InteractiveLayer.propTypes.media,

  /** The player controller instance */
  player: InteractiveLayer.propTypes.player,

  /** The video playback event */
  event: NonInteractiveLayer.propTypes.event,

  isTwoScreen: InteractiveLayer.propTypes.isTwoScreen,
  screenMode: InteractiveLayer.propTypes.screenMode,
  videoReady: StartLayer.propTypes.videoReady,
  userReady: InteractiveLayer.propTypes.userReady,
  isEnded: InteractiveLayer.propTypes.isEnded,
  isPaused: InteractiveLayer.propTypes.isPaused,
  isFullscreen: InteractiveLayer.propTypes.isFullscreen,
  duration: InteractiveLayer.propTypes.duration,
  time: InteractiveLayer.propTypes.time,
  bufferedTime: InteractiveLayer.propTypes.bufferedTime,
  muted: InteractiveLayer.propTypes.muted,
  volume: InteractiveLayer.propTypes.volume,
  playbackRate: InteractiveLayer.propTypes.playbackRate,
  openCC: InteractiveLayer.propTypes.openCC,
  ccFontSize: InteractiveLayer.propTypes.ccFontSize,
  ccFontColor: InteractiveLayer.propTypes.ccFontColor,
  ccOpacity: InteractiveLayer.propTypes.ccOpacity,
  ccBackgroundColor: InteractiveLayer.propTypes.ccBackgroundColor,
  language: InteractiveLayer.propTypes.language,
  currCaption: InteractiveLayer.propTypes.currCaption,
  hideWrapperOnMouseLeave: InteractiveLayer.propTypes.hideWrapperOnMouseLeave
};

export default Wrapper;

