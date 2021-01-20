import React from 'react';
import PropTypes from 'prop-types';
import ErrorWrapper from './ErrorWrapper';
import EventVisualPopup from './EventVisualPopup';
import './index.scss';


function NonInteractiveLayer(props) {
  let {
    error,
    event,
    volume,
    onTogglePause,
  } = props;

  return (
    <div 
      className="ctp wrapper non-interact ct-d-c-center"
      onClick={error ? onTogglePause : null}
    >
      {error ? (
        <ErrorWrapper error={error} />
      ) : (
        <EventVisualPopup event={event} volume={volume} />
      )}
    </div>
  );
}

NonInteractiveLayer.propTypes = {
  event: PropTypes.string,
  volume: PropTypes.number,
  onTogglePause: PropTypes.func,
};

export default NonInteractiveLayer;

