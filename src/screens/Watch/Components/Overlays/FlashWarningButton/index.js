import React from 'react';
import { connect } from 'dva'
import { FLASH_DETECT_YES, FLASH_SET_YES } from 'utils/constants';

import './index.scss';


function FlashWarningButtonWithRedux(props) {
  const { isPrimary = false, paused, media, flashAcknowledged = false, dispatch } = props;
  
  const warningText = 'WARNING: This video may potentially trigger seizures for people with photosensitive epilepsy. Viewer discretion is advised.'
  
  const showFlash = paused && ! flashAcknowledged && 
  (media.flashWarning === FLASH_DETECT_YES || media.flashWarning === FLASH_SET_YES);
  const handleClick = () => {
      dispatch({ type: 'watch/acknowledgeflashwarning' });
  };

  return ( isPrimary && showFlash )? (
    <div className="ack-overlay">
      <div
        className="ack-button-container"
        aria-hidden="true"
        onClick={handleClick}
      > <span className="ack-text"><i className="material-icons">warning</i><i className="material-icons">bolt</i>
        {warningText}
      </span>
      
        <span className="ack-button-content" tabIndex="-1" />
      </div>
    </div>
      ) : null
}

export const FlashWarningButton = connect(({ watch: { paused, media, flashAcknowledged, ctpPriEvent } }) => ({
  media, flashAcknowledged, ctpPriEvent,paused
}))(FlashWarningButtonWithRedux);


