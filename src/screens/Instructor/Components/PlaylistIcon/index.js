import React from 'react'
import { Icon } from 'semantic-ui-react'

export function PlaylistIcon({ 
  size, 
  type 
}) {

  const getColor = type => type === 1 ? 'red' : type === 0 ? 'blue' : 'black'
  const getIcon = type => type === 1 ? 'youtube' : type === 0 ? 'play circle outline' : 'file video'

  const otherAttributes = {}
  if (type === 0) otherAttributes.flipped = 'horizontally'

  return (
    <Icon 
      size={size} 
      color={getColor(type)} 
      name={getIcon(type)} 
      {...otherAttributes}
    />
  )
}