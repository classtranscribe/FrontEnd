import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { connect } from 'dva'

export function AudioDescriptionButtonWithRedux({ openAD = false, descriptions = [], dispatch }) {
  const handleADTrigger = () => {
    dispatch({ type: 'playerpref/toggleOpenAD' })
  };

  return descriptions.length > 0 ? (
    <WatchCtrlButton
      onClick={handleADTrigger}
      label={`Audio Description: ${openAD ? 'ON' : 'OFF'} (d)`}
      id="audio-description-btn"
      colored={openAD}
      ariaTags={{
        'aria-label': `${openAD ? 'Open' : 'Close'} Audio Description`,
        // 'aria-keyshortcuts': 'c',
        'aria-controls': 'watch-ad-container',
        'aria-expanded': openAD ? 'false' : 'true',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="fas fa-audio-description" />
      </span>
    </WatchCtrlButton>
  ) : null;
}

export const AudioDescriptionButton = connect(({ watch: { descriptions }, playerpref: { openAD }, loading }) => ({
  openAD, descriptions
}))(AudioDescriptionButtonWithRedux);