import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';

import VideoLoader from './VideoLoader';

function Video(props) {
  let {
    id,
    className,
    src,
    trackSrc,
    muted = false,
    getVideoNode,
    onLoadStart,
    onLoadedData,
    onDurationChange,
    onCanPlay,
    onPause,
    onWaiting,
    onPlaying,
    onEnded,
    onSeeking,
    onSeeked,
    onError,
    onProgress,
    onTimeUpdate
  } = props;

  const [isWaiting, setIsWaiting] = useState(true);

  const handleWaiting = (e) => {
    if (typeof onWaiting === 'function') {
      onWaiting(e);
    }

    if (!isWaiting) setIsWaiting(true);
  };

  const handlePlaying = (e) => {
    if (typeof onPlaying === 'function') {
      onPlaying(e);
    }

    if (isWaiting) setIsWaiting(false);
  };

  const handleLoadStart = (e) => {
    if (typeof onLoadStart === 'function') {
      onLoadStart(e);
    }

    if (!isWaiting) setIsWaiting(true);
  };

  const handleLoadedData = (e) => {
    if (typeof onLoadedData === 'function') {
      onLoadedData(e);
    }

    if (isWaiting) setIsWaiting(false);
  };


  const videoContainerClasses = cx('ctp', 'ct-video-con', className);
  const videoProps = {
    id,
    ref: getVideoNode,
    className: 'ctp ct-video',
    playsInline: true,
    muted,
    onLoadStart: handleLoadStart,
    onLoadedData: handleLoadedData,
    onDurationChange,
    onCanPlay,
    onPause,
    onWaiting: handleWaiting,
    onPlaying: handlePlaying,
    onEnded,
    onSeeking,
    onSeeked,
    onError,
    onProgress,
    onTimeUpdate
  };

  const wrapperClasses = cx('ctp', 'ct-video-wrapper', 'blur', {
    show: isWaiting
  });

  return (
    <div className={videoContainerClasses}>
      <video {...videoProps}>
        {Boolean(src) && <source src={src} type="video/mp4" />}
        {Boolean(trackSrc) && <track src={trackSrc} lang="english" />}
        Your browser does not support video tag.
      </video>

      <div className={wrapperClasses}>
        <VideoLoader />
      </div>
    </div>
  );
}

Video.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  src: PropTypes.string,
  trackSrc: PropTypes.string,
  muted: PropTypes.bool,
  getVideoNode: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadedData: PropTypes.func,
  onDurationChange: PropTypes.func,
  onCanPlay: PropTypes.func,
  onPause: PropTypes.func,
  onWaiting: PropTypes.func,
  onPlaying: PropTypes.func,
  onEnded: PropTypes.func,
  onSeeking: PropTypes.func,
  onSeeked: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onTimeUpdate: PropTypes.func
};

export default Video;

