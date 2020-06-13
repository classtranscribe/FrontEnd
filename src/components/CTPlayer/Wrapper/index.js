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
    currCaption,
    hideWrapperOnMouseLeave,
    // allowRangePicker,
    // openRange,
    // range,
    // onRangeChange,
  } = props;

  const startLayerProps = {
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

