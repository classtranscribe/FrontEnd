import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './index.scss';

import ActionBar from './ActionBar';
import CenterWrapper from './CenterWrapper';
import ControlBar from './ControlBar';

function Wrapper(props) {
  let {
    media,
    player,
    isEnded,
    isPaused,
    isFullscreen,
    openCC,
    duration,
    time,
    bufferedTime,
    muted,
    volume,
    playbackRate,
  } = props;

  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    // setTimeout(() => {
    //   setHover(false);
    // }, 1000);
    setHover(false);
  };

  const wrapperClasses = cx('ctp', 'main-wrapper', {
    show: hover || isPaused || isEnded
  });

  const actionBarProps = {
    media,
    player,
  };

  const centerWrapperProps = {
    isEnded,
    isPaused,
    onTogglePause: player.togglePause
  };

  const controlBarProps = {
    player,
    isEnded,
    isPaused,
    isFullscreen,
    openCC,
    duration,
    time,
    bufferedTime,
    muted,
    volume,
    playbackRate,
  };

  return (
    <div 
      className={wrapperClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="ctp action-bar-con dismissible">
        <ActionBar {...actionBarProps} />
      </div>
      <div className="ctp center-con dismissible">
        <CenterWrapper {...centerWrapperProps} />
      </div>
      <div className="ctp ctrl-bar-con">
        <ControlBar {...controlBarProps} />
      </div>
    </div>
  );
}

Wrapper.propTypes = {

};

export default Wrapper;

