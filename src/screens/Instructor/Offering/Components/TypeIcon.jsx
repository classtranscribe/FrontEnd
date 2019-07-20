import React from 'react'
import { Icon } from 'semantic-ui-react'

const getColor = type => {
  return type === 1 ? 'red' : 2 ? 'blue' : 'black'
}

const getIcon = type => {
  return type === 1 ? 'youtube' : 
         type === 2 ? 'video play' : 'file video'
}

export default function TypeIcon({ size, type }) {
  return (
    <Icon size={size} color={getColor(type)} name={getIcon(type)}/>
  )
}