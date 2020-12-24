import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { videoPosterImg as defaultImg } from 'assets/images';
import timestr from 'utils/use-time';
import './index.scss';

function MediaPoster({
  src = defaultImg,
  progress = 0,
  width = '150px',
  height,
  round = false,
  duration,
}) {
  // calc displayed progress bar width
  let displayedProgress = progress;
  if (progress > 0 && progress < 10) displayedProgress = 10;
  else if (progress > 90) displayedProgress = 100;

  // calc second based duration
  let displayedDuration = duration;
  if (duration && typeof duration === 'number') {
    displayedDuration = timestr.toTimeString(duration); 
  } else if (duration && typeof duration === 'string') {
    displayedDuration = timestr.toPrettierTimeString(duration);
  }

  const hasWatched = displayedProgress > 0;

  return (
    <div
      className={cx('ct-media-poster', { round })}
      style={{ width, minWidth: width }}
      aria-hidden="true"
    >
      <img
        width={width}
        height={height}
        className="poster-img"
        src={src}
        alt="video poster"
      />
      {hasWatched && (
        <div className="progress-bar">
          <span className="progress" style={{ width: `${displayedProgress}%` }} />
        </div>
      )}
      {Boolean(displayedDuration) && (
        <div className={cx('duration-box', { watched: hasWatched })}>
          {displayedDuration}
        </div>
      )}
    </div>
  );
}

MediaPoster.propTypes = {
  /** path to the poster image */
  src: PropTypes.string,

  /** How many progress has watched */
  progress: PropTypes.number,

  /** Width of the poster */
  width: PropTypes.string,

  /** Height of the poster, default as 'auto' */
  height: PropTypes.string,

  /** Poster can be rounded */
  round: PropTypes.bool,

  /** Video duration */
  duration: PropTypes.oneOfType(PropTypes.number, PropTypes.string)
};

export default MediaPoster;