import React from 'react'
import { Icon } from 'semantic-ui-react'

const getColor = type => {
  return type === 1 ? 'red' : type === 0 ? 'blue' : 'black'
}

const getIcon = type => {
  return type === 1 ? 'youtube' : 
         type === 0 ? 'play circle outline' : 'file video'
}

export default function TypeIcon({ size, type }) {
  const otherAttributes = {}
  if (type === 0) otherAttributes.flipped = 'horizontally'
  return (
    <Icon size={size} color={getColor(type)} name={getIcon(type)} {...otherAttributes}/>
  )
}