import React from 'react'
import { connectWithRedux } from '../../../../../_redux/watch'
import WatchCtrlButton from '../../WatchCtrlButton'
import { 
  modalControl, MODAL_SHARE, MODAL_HIDE
} from '../../../Utils'

function ShareTrigger({
  modal=MODAL_HIDE
}) {

  const handleShare = () => {
    modalControl.open(MODAL_SHARE)
  }

  return (
    <WatchCtrlButton 
      onClick={handleShare}
      active={false}
      position="top"
      label="Share"
      id="watch-share-btn"
      active={modal === MODAL_SHARE}
      ariaTags={{
        'aria-label': `Share`,
        //'aria-keyshortcuts': 'Shift+D',
        'aria-controls': 'watch-share-modal',
        'aria-haspopup': 'true'
      }}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
        <i className="material-icons">share</i>
        {/* <i className="fas fa-share"></i> */}
      </span>
    </WatchCtrlButton>
  )
}

export default connectWithRedux(
  ShareTrigger,
  ['modal'],
  []
)