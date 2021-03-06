import React from 'react';
import PropTypes from 'prop-types';
import {
  SecondaryPlayerWrapper,
  BigPlayButton,
  ClosedCaption,
  AudioDescription,
} from 'screens/Watch/Components/Overlays';
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
        <BigPlayButton isPrimary />
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


            