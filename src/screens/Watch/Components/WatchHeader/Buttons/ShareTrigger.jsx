import React from 'react'
// import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../../WatchCtrlButton'
import { 
  
} from '../../../Utils'

function ShareTrigger({}) {

  const handleShare = () => {

  }

  return (
    <WatchCtrlButton 
      onClick={handleShare}
      active={false}
      position="top"
      label="Share"
      id="watch-share-btn"
      ariaTags={{
        'aria-label': `Share`,
        //'aria-keyshortcuts': 'Shift+D',
        //'aria-controls': 'watch-shortcuts-menu',
        //'aria-haspopup': 'true'
      }}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
        <i className="material-icons">share</i>     
      </span>
    </WatchCtrlButton>
  )
}

export default ShareTrigger