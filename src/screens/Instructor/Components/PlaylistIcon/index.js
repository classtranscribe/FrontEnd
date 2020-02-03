import React from 'react'
import { Icon } from 'semantic-ui-react'

export function PlaylistIcon({ 
  size, 
  type // 0 - Echo360, 1 - YouTube, 2 - file
}) {

  const getColor = type => {
    switch (type) {
      case 0  : return 'blue'
      case 1  : return 'red'
      default : return 'black'
    }
  }
  const getIcon = type => {
    switch (type) {
      case 0  : return 'play circle outline'
      case 1  : return 'youtube'
      default : return 'file video'
    }
  }

  const otherAttributes = {}
  if (type === 0) otherAttributes.flipped = 'horizontally'

  return (
    <Icon 
      className="mr-2 pt-0"
      size={size} 
      color={getColor(type)} 
      name={getIcon(type)} 
      aria-hidden="true"
      {...otherAttributes}
    />
  )
}