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
    PlayerEventPlay,
    PlayerEventPause,
    PlayerEventRewind,
    PlayerEventForward,
    PlayerEventMute,
    PlayerEventVolumeUp,
    PlayerEventVolumeDown,
  } = CTPlayerConstants;

  let eventIconMap = {
    [PlayerEventPlay]: 'play_arrow',
    [PlayerEventPause]: 'pause',
    [PlayerEventRewind]: 'replay_5',
    [PlayerEventForward]: 'forward_5',
    [PlayerEventMute]: 'volume_off',
    [PlayerEventVolumeUp]: 'volume_up',
    [PlayerEventVolumeDown]: 'volume_down'
  };

  const showVolume = [PlayerEventVolumeUp, PlayerEventVolumeDown].includes(event);
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

