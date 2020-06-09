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
    duration,
    time,
    bufferedTime,
    muted,
    volume,
    playbackRate,
    openCC,
    currCaption,
    allowRangePicker,
    openRange,
    range,
    onRangeChange,
  } = props;

  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseMove = () => {
    if (player.mouseOverTimer !== null) {
      clearTimeout(player.mouseOverTimer);
      player.mouseOverTimer = null;
    }
    
    if (!hover) {
      setHover(true);
    }

    player.mouseOverTimer = setTimeout(() => {
      setHover(false);
      player.mouseOverTimer = null;
    }, 3000);
  }

  const handleMouseLeave = () => {
    setHover(false);
  };

  const wrapperClasses = cx('ctp', 'main-wrapper', {
    show: hover || isPaused || isEnded,
    'bottom-bar': openRange,
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
    duration,
    time,
    bufferedTime,
    muted,
    volume,
    playbackRate,
    openCC,
    currCaption,
    allowRangePicker,
    openRange,
    range,
    onRangeChange,
  };

  return (
    <div 
      className={wrapperClasses}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
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

