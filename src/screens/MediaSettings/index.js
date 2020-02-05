import React from 'react'
import { useParams, useLocation } from 'react-router-dom'

export function MediaSettings() {

  let mediaId = useParams().id
  let tab = useLocation().hash

  return (
    <div>
      {mediaId} - tab {tab}
    </div>
  )
}