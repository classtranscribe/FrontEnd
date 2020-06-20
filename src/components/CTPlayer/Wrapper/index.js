import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './index.scss';

import StartLayer from './StartLayer';
import InteractiveLayer from './InteractiveLayer';
import NonInteractiveLayer from './NonInteractiveLayer';

function Wrapper(props) {
  let {
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
    // allowRangePicker,
    // openRange,
    // range,
    // onRangeChange,
  } = props;

  const startLayerProps = {
    videoReady,
    userReady,
    onTogglePause: player.togglePause
  };

  const nonInteractiveLayerProps = {
    event,
    userReady,
    isEnded,
    isPaused,
    volume,
    onTogglePause: player.togglePause
  };

  const interactiveLayerProps = {
    hideWrapperOnMouseLeave,
    media,
    player,
    isTwoScreen,
    screenMode,
    userReady,
    isEnded,
    isPaused,
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
    language,
    currCaption,
  };

  return (
    <div className="ctp wrapper main-wrapper">
      <NonInteractiveLayer {...nonInteractiveLayerProps} />
      <InteractiveLayer {...interactiveLayerProps} />

      <StartLayer {...startLayerProps} />
    </div>
  );
}

Wrapper.propTypes = {

};

export default Wrapper;
