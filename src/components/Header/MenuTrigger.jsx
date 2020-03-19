import React from 'react'
import { IconButton } from '@material-ui/core'
import { Icon, Image } from 'semantic-ui-react'


function MenuTrigger({ 
  picture, 
  handleClick 
}) {
  return picture ? (
    <Image 
      tabIndex={0} onClick={handleClick} 
      src={picture}  circular size="mini" 
      className="profile-img"
      alt="profile picture"
      aria-haspopup="true"
      aria-label="Menu trigger"
      title="Menu"
    />
  ) : (
    <IconButton
      aria-label="Menu trigger"
      title="Menu"
      aria-controls="profile-menu"
      aria-haspopup="true"
      onClick={handleClick}
      className="trigger"
    >
      <Icon name='user' circular/>
    </IconButton>
  )
}

export default MenuTrigger