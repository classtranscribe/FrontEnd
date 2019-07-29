/**
 * The SubHeader of the WatchContent
 * - including setting bar, up next and video info
 */
import React, { useState, useEffect } from 'react'
// UI
import { Icon } from 'semantic-ui-react'
import { VideoSettingBar } from './VideoSettingBar'
import './index.css'

export default function SubHeader({ playlist, media, courseNumber, propsForSettingBar }) {
  const [playlistName, setPlaylistName] = useState('')

  /** If playlist is loaded */
  useEffect(() => {
    if (playlist.playlist && playlist.medias) {
      setPlaylistName(() => playlist.playlist.name)
    }
  }, [playlist])

  return (
    <div 
      className="subheader-container" 
    >
      <div className="header">
        <p tabIndex={1}>
          <strong>
            <span>{courseNumber.replace('-', '/')}</span>
            &ensp;{playlistName}
          </strong><br/>
          <Icon name="play" />&ensp;{media.mediaName}
        </p>

        <VideoSettingBar propsForSettingBar={propsForSettingBar} />
      </div>
    </div>
  )
}