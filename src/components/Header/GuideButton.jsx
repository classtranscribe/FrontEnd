import React from 'react'
import { IconButton } from '@material-ui/core'
import { Icon } from 'semantic-ui-react'


function GuideButton({handleClick}) {
  return (
    <div className="profile-menu">
        <IconButton 
            onClick={handleClick}
            className="trigger"
        >
            <Icon name='question circle' circular/>
        </IconButton>
    </div>
  )
}

export default GuideButton