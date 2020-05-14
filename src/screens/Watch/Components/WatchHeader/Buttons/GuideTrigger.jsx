import React from 'react'
import WatchCtrlButton from '../../WatchCtrlButton'
import { 
  MENU_HIDE, MENU_DOWNLOAD, 
  connectWithRedux,
  menuControl,
  generateWatchUserGuide
} from '../../../Utils'

import { IconButton } from '@material-ui/core'
import { Icon } from 'semantic-ui-react'


function GuideTrigger({handleClick}) {

  const handleGuideTrigger = () => {
    let watchUserGuide = generateWatchUserGuide()
    watchUserGuide.start()
  }


  return (
    <WatchCtrlButton 
      onClick={handleGuideTrigger}
      position="top"
      label="Guide"
      id={'GuideButton'}
      ariaTags={{
        'aria-label': `Guide`,
        //'aria-keyshortcuts': 'Shift+D',
        // 'aria-controls': 'watch-download-menu',
        // 'aria-expanded' : menu === MENU_DOWNLOAD ? 'false' : 'true',
      }}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
        <i className="material-icons">not_listed_location</i>         
      </span>
    </WatchCtrlButton>
  )
}

export default GuideTrigger
 

{/* <div className="profile-menu">
  <IconButton 
      onClick={handleClick}
      className="trigger"
  >
      <Icon name='question circle' circular/>
  </IconButton>
</div> */}
    