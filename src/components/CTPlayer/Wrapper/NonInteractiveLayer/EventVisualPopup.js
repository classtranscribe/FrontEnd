import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants } from '../../controllers';

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
    CTPE_PLAY,
    CTPE_PAUSE,
    CTPE_REWIND,
    CTPE_FORWARD,
    CTPE_MUTE,
    CTPE_VOLUME_UP,
    CTPE_VOLUME_DOWN,
  } = CTPlayerConstants;

  let eventIconMap = {
    [CTPE_PLAY]: 'play_arrow',
    [CTPE_PAUSE]: 'pause',
    [CTPE_REWIND]: 'replay_5',
    [CTPE_FORWARD]: 'forward_5',
    [CTPE_MUTE]: 'volume_off',
    [CTPE_VOLUME_UP]: 'volume_up',
    [CTPE_VOLUME_DOWN]: 'volume_down'
  };

  const showVolume = [CTPE_VOLUME_UP, CTPE_VOLUME_DOWN].includes(event);
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
  event: PropTypes.string,
  volume: PropTypes.number
};

export default EventVisualPopup;

