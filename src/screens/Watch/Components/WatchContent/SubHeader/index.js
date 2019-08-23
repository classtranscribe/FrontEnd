/**
 * The SubHeader of the WatchContent
 * - including setting bar, up next and video info
 */
import React, { useState, useEffect, lazy, Suspense } from 'react'
// UI
import { Icon } from 'semantic-ui-react'
import { api } from 'utils'
import './index.css'

const ModeSetting = lazy(() => import('./ModeSetting'))

export default function SubHeader({ playlist, media, courseNumber, propsForSettingBar }) {
  const [playlistName, setPlaylistName] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 650 ? true : false)
  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 650 && isMobile) {
      setIsMobile(() => false)
    } else if (window.innerWidth <= 650 && !isMobile) {
      setIsMobile(() => true)
    }
  })

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
            <span>{api.parseURLFullNumber(courseNumber)}</span>
            &ensp;{playlistName}
          </strong><br/>
          <Icon name="play" />&ensp;{media.mediaName}
        </p>

        <div className="video-setting-bar">
          <Suspense fallback={<div>Loading...</div>}>
            <ModeSetting {...propsForSettingBar} isMobile={isMobile} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}