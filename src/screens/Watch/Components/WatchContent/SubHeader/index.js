/**
 * The SubHeader of the WatchContent
 * - including setting bar, up next and video info
 */
import React  from 'react'
// UI
import { Icon } from 'semantic-ui-react'
import { api } from 'utils'
import './index.css'

export default function MediaDetails({ playlist, media }) {
  return (
    <div className="subheader-container" >
      <div className="header">
        <p tabIndex={1}>
          <strong>
            <span>{api.parseURLFullNumber()}</span>
            &ensp;{playlist.name}
          </strong><br/>
          <Icon name="play" />
          &ensp;{media.mediaName}
        </p>
      </div>
    </div>
  )
}