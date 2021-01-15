import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { generateWatchUserGuide } from '../../../Utils';

function GuideTrigger({dispatch}) {
  const handleGuideTrigger = () => {
    dispatch({type: 'watch/media_pause', payload: true});
    let watchUserGuide = generateWatchUserGuide();
    watchUserGuide.start();
  };

  return (
    <WatchCtrlButton
      onClick={handleGuideTrigger}
      position="top"
      label="Help"
      id="help-guide-btn"
      ariaTags={{
        'aria-label': `Guide`,
      }}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
        <i className="material-icons">help_outline</i>
      </span>
    </WatchCtrlButton>
  );
}

export default GuideTrigger;
