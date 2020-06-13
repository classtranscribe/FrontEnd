import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './index.scss';

import BigCenterButton from './BigCenterButton';

function StartLayer(props) {
  let {
    userReady,
    onTogglePause,
  } = props;

  const startLayerClasses = cx(
    'ctp', 
    'wrapper', 
    'start', 
    'ct-d-c-center', 
    { show: !userReady }
  );

  return (
    <div className={startLayerClasses}>
      <BigCenterButton icon="play_arrow" onClick={onTogglePause} />
    </div>
  );
}

StartLayer.propTypes = {
  userReady: PropTypes.bool,
  onTogglePause: PropTypes.func,
};

export default StartLayer;

