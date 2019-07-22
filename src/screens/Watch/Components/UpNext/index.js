import React, { useState, useEffect } from 'react'
import './index.css'
import { Icon } from 'semantic-ui-react'
import { Card } from 'react-bootstrap'
import { util } from '../../../../util'
const imgHolder = require('../../../../images/Video-Placeholder.jpg')

export function UpNext({ playlist, media, courseNumber }) {
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

  const showVideos = e => {
    console.log('show upnext')
    if (media.id) {
      const currMedia = document.getElementById(media.id)
      if (currMedia && !currMedia.classList.contains('curr-media')) {
        currMedia.classList.add('curr-media')
        currMedia.scrollIntoView({ inline: "center" })
      }
    }
  }

  return (
    <div 
      className="upnext-container" 
      onMouseEnter={showVideos}
    >
      <p className="header" tabIndex={1}>
        <strong><span>{courseNumber.replace('-', '/')}</span>
        &ensp;{playlistName}</strong><br/>
        <Icon name="play" />&ensp;{mediaName}
        &ensp;&ensp;<span><Icon name="chevron down" />Up Next</span>
      </p>
      <div className="videos">
        {medias.map( media2 => (
          <Card 
            className="vcard" 
            key={media2.media.id} 
            id={media2.media.id}
            as="a"
            href={util.links.watch(courseNumber, media2.media.id)}
            title={media2.media.jsonMetadata.title}
            aria-label={media2.media.jsonMetadata.title}
          >
            <Card.Img 
              className="img" variant="top" 
              src={imgHolder} style={{pointerEvents: 'none'}}
            />
            <Card.Body style={{margin: 'none'}}>
              <Card.Title className="title">
                {media2.media.jsonMetadata.title}
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}