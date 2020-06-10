import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerController } from '../../controllers';

function EventIcon(props) {
  let { icon } = props;
  return (
    <div className="e-v-popup-icon ct-d-c-center">
      <i className="material-icons">{icon}</i>
    </div>
  )
}

EventIcon.propTypes = {
  icon: PropTypes.string
};

function EventVisualPopup(props) {
  let { event } = props;

  const {
    E_PLAY,
    E_PAUSE,
    E_REWIND,
    E_FORWARD,
    E_VOLUME_UP,
    E_VOLUME_DOWN,
  } = CTPlayerController;

  let eventIconMap = {
    [E_PLAY]: 'play_arrow',
    [E_PAUSE]: 'pause',
    [E_REWIND]: 'replay_5',
    [E_FORWARD]: 'forward_5',
    [E_VOLUME_UP]: 'volume_up',
    [E_VOLUME_DOWN]: 'volume_down'
  };

  return (
    <div className="ctp wrapper e-v-popup-con ct-d-c-center">
      <div className="e-v-popup">
        {event ? (
          <EventIcon icon={eventIconMap[event]} />
        ) : null}
      </div>
    </div>
  );
}

EventVisualPopup.propTypes = {
  event: PropTypes.string
};

export default EventVisualPopup;

