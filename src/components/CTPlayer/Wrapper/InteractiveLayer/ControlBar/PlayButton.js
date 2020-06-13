import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function PlayButton(props) {
  let {
    isEnded,
    isPaused,
    onPlay,
    onPause,
    onReplay
  } = props;

  let label = 'Pause';
  let icon = 'pause';
  let handleClick = onPause;
  if (isEnded) {
    label = 'Replay';
    icon = 'replay';
    handleClick = onReplay;
  } else if (isPaused) {
    label = 'Play';
    icon = 'play_arrow';
    handleClick = onPlay;
  }

  return (
    <ActionButton
      icon={icon}
      label={label}
      onClick={handleClick}
      playButton
    />
  );
}

PlayButton.propTypes = {
  isEnded: PropTypes.bool,
  isPaused: PropTypes.bool,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onReplay: PropTypes.func
};

export default PlayButton;
