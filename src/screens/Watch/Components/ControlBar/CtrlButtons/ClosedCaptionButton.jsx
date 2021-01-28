import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { connect } from 'dva'

export function ClosedCaptionButtonWithRedux({ openCC = false, captions = [], dispatch }) {
  const handleCCTrigger = () => {
    dispatch({ type: 'playerpref/toggleOpenCC' })
  };

  let disabled = captions.length <= 0;

  let isOpen = openCC && !disabled;

  return (
    <WatchCtrlButton
      onClick={handleCCTrigger}
      label={disabled ? `No Closed Caption` : `Closed Caption: ${isOpen ? 'ON' : 'OFF'} (c)`}
      id="closed-caption-btn"
      colored={isOpen}
      disabled={disabled}
      ariaTags={{
        'aria-label': `${isOpen ? 'Open' : 'Close'} Closed Caption`,
        // 'aria-keyshortcuts': 'c',
        'aria-controls': 'watch-cc-container',
        'aria-expanded': openCC ? 'false' : 'true',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="fas fa-closed-captioning" />
      </span>
    </WatchCtrlButton>
  );
}

export const ClosedCaptionButton = connect(({ watch : { captions}, playerpref: { openCC }, loading }) => ({
  openCC, captions
}))(ClosedCaptionButtonWithRedux)
