import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import EventVisualPopup from './EventVisualPopup';

function NonInteractiveLayer(props) {
  let {
    userReady,
    event,
    isPaused,
    isEnded,
    volume,
    onTogglePause,
    onReplay,
  } = props;

  return (
    <div 
      className="ctp wrapper non-interact ct-d-c-center"
      onClick={onTogglePause}
    >
      <EventVisualPopup event={event} volume={volume} />
    </div>
  );
}

NonInteractiveLayer.propTypes = {
  isPaused: PropTypes.bool,
  isEnded: PropTypes.bool,
  onTogglePause: PropTypes.func,
  onReplay: PropTypes.func,
};

export default NonInteractiveLayer;

