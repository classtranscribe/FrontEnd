import React from 'react';
import './index.css';
import { videoPosterImg as defaultImg } from '../../assets/images';

export function Poster({
  src = defaultImg,
  progress = 0,
  borderRadius = false,
  width = '150px',
  height,
  round = false,
}) {
  progress = progress === 0 ? 0 : progress < 10 ? 10 : progress > 90 ? 100 : progress;

  return (
    <div
      className="video-poster"
      aria-hidden="true"
      style={{ width }}
      data-round={round.toString()}
    >
      <img
        width={width}
        height={height}
        className={`poster-img ${borderRadius ? 'with-br' : ''}`}
        src={src}
        alt="video poster"
      />
      {progress > 0 && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
