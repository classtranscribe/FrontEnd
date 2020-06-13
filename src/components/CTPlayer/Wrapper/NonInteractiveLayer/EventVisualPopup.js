import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerController } from '../../controllers';

function EventIcon(props) {
  let { icon } = props;
  return (
    <div className="ctp e-v-popup-icon ct-d-c-center">
      <i className="material-icons">{icon}</i>
    </div>
  )
}

EventIcon.propTypes = {
  icon: PropTypes.string
};

function EventVisualPopup(props) {
  let { event, volume } = props;

  const {
    E_PLAY,
    E_PAUSE,
    E_REWIND,
    E_FORWARD,
    E_MUTE,
    E_VOLUME_UP,
    E_VOLUME_DOWN,
  } = CTPlayerController;

  let eventIconMap = {
    [E_PLAY]: 'play_arrow',
    [E_PAUSE]: 'pause',
    [E_REWIND]: 'replay_5',
    [E_FORWARD]: 'forward_5',
    [E_MUTE]: 'volume_off',
    [E_VOLUME_UP]: 'volume_up',
    [E_VOLUME_DOWN]: 'volume_down'
  };

  const showVolume = [E_VOLUME_UP, E_VOLUME_DOWN].includes(event);
  const icon = eventIconMap[event];

  return (
    <div className="ctp wrapper e-v-popup-con ct-d-c-center">
      {
        showVolume 
        && 
        <div className="ctp e-v-volume-con ct-d-r-center">
          <div className="ctp e-v-volume ct-d-r-center">
            <i className="material-icons" aria-hidden="true">{icon}</i>
            <span>{Math.round(volume * 100)}%</span>
          </div>
        </div>
      }
      <div className="ctp e-v-popup">
        {event ? (
          <EventIcon icon={icon} />
        ) : null}
      </div>
    </div>
  );
}

EventVisualPopup.propTypes = {
  event: PropTypes.string
};

export default EventVisualPopup;

