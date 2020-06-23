import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import EventVisualPopup from './EventVisualPopup';

function NonInteractiveLayer(props) {
  let {
    event,
    volume,
    onTogglePause,
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
  event: PropTypes.string,
  volume: PropTypes.number,
  onTogglePause: PropTypes.func,
};

export default NonInteractiveLayer;

