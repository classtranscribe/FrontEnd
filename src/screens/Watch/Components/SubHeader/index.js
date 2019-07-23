import React, { useState, useEffect } from 'react'
import { Icon } from 'semantic-ui-react'
import { VideoSettingBar } from '../VideoSettingBar'
import './index.css'


export function SubHeader({ playlist, media, courseNumber, propsForSettingBar }) {
  const [mediaName, setMediaName] = useState('')
  const [playlistName, setPlaylistName] = useState('')
  const [medias, setMedias] = useState([])

  useEffect(() => {
    if (media.jsonMetadata) {
      setMediaName(() => media.jsonMetadata.title)
    }
  }, [media])

  useEffect(() => {
    if (playlist.playlist && playlist.medias) {
      setPlaylistName(() => playlist.playlist.name)
      setMedias(() => playlist.medias)
    }
  }, [playlist])

  const propsForUpNext = {
    media: media,
    mediaName: mediaName,
    playlistName: playlistName,
    medias: medias,
    courseNumber: courseNumber,
  }

  return (
    <div 
      className="subheader-container" 
    >
      <div className="header">
        <p tabIndex={1}>
          <strong><span>{courseNumber.replace('-', '/')}</span>
          &ensp;{playlistName}</strong><br/>
          <Icon name="play" />&ensp;{mediaName}
        </p>
        <VideoSettingBar 
          propsForSettingBar={propsForSettingBar} 
          propsForUpNext={propsForUpNext} 
        />
      </div>
    </div>
  )
}