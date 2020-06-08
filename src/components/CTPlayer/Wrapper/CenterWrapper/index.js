import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import BigCenterButton from './BigCenterButton';

function CenterWrapper(props) {
  let {
    isPaused,
    isEnded,
    onTogglePause,
    onReplay,
  } = props;

  const icon = isEnded ? 'replay' : isPaused ? 'play_arrow' : null;
  const onClick = isEnded ? onReplay : null;

  const buttonElement = icon
                      ? <BigCenterButton icon={icon} onClick={onClick} />
                      : null;

  return (
    <div 
      className="ctp center-wrapper"
      onClick={onTogglePause}
    >
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

