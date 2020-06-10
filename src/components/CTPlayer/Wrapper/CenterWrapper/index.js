import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import BigCenterButton from './BigCenterButton';
import EventVisualPopup from './EventVisualPopup';

function CenterWrapper(props) {
  let {
    userReady,
    event,
    isPaused,
    isEnded,
    volume,
    onTogglePause,
    onReplay,
  } = props;

  const icon = isEnded 
              ? 'replay' 
              : userReady 
              ? null 
              : isPaused 
              ? 'play_arrow' 
              : null;

  const onClick = isEnded ? onReplay : null;

  const buttonElement = icon
                      ? <BigCenterButton icon={icon} onClick={onClick} />
                      : null;

  return (
    <div 
      className="ctp center-wrapper ct-d-c-center"
      onClick={onTogglePause}
    >
      <EventVisualPopup event={event} volume={volume} />
      {buttonElement}
    </div>
  );
}

CenterWrapper.propTypes = {
  isPaused: PropTypes.bool,
  isEnded: PropTypes.bool,
  onTogglePause: PropTypes.func,
  onReplay: PropTypes.func,
};

export default CenterWrapper;

