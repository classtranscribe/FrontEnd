import React from 'react';

function NoVideoHolder({ type }) {
  return type === 2 ? (
    <div className="ct-d-r-center w-100">
      <div className="mt-5 text-muted">NO VIDEO</div>
    </div>
  ) : (
    <div className="ct-d-c-center w-100">
      <div className="mt-5">
        <div className="sk-wave">
          <div className="sk-wave-rect" />
          <div className="sk-wave-rect" />
          <div className="sk-wave-rect" />
          <div className="sk-wave-rect" />
          <div className="sk-wave-rect" />
        </div>
      </div>
      <div className="mt-5 text-muted text-center">
        We are preparing your videos.
        <br />
        It may require up to 2 hours to process.{' '}
        <a href={window.location.pathname}>Refresh Here</a>
        <br />
        <br />
      </div>
      <div className="mt-2 text-muted text-center">
        QUESTIONS? <a href="mailto:classtranscribe@illinois.edu">Email us at ClassTranscribe</a>
      </div>
    </div>
  );
}

export default NoVideoHolder;
