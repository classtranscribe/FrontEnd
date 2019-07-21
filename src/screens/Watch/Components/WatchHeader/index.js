import React from 'react'
import { ClassTranscribeHeader } from '../../../../components'
import { Icon } from 'semantic-ui-react'
import './index.css'

export function WatchHeader({ playlistTrigger }) {
  return (
    <ClassTranscribeHeader darkMode>
      <div tabIndex="0" className="playlist-trigger">
        <Icon name="list" />
      </div>
    </ClassTranscribeHeader>
  )
}