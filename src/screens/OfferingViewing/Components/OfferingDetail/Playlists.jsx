import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion } from 'semantic-ui-react'
import { Card } from 'react-bootstrap'
import PlaylistPlaceholder from './PlaylistPlaceholder'
import { util, api } from 'utils'
const imgHolder = require('images/Video-Placeholder.jpg')


export default function Playlists({playlists, fullNumber}) {
  const [activeIndex, setActiveIndex] = useState(-1)

  if (!playlists) return <PlaylistPlaceholder />
  
  const handleClick = index => {
    if (index === activeIndex) setActiveIndex(() => -1)
    else setActiveIndex(() => index)
  }

  return (
    <Accordion className="playlists">
      {playlists.map( (playlist, index) => (
        <Playlist 
          key={playlist.id}
          playlist={playlist} index={index}
          activeIndex={activeIndex} setActiveIndex={handleClick}
          fullNumber={fullNumber}
        />
      ))}
    </Accordion>
  )
}

function Playlist({playlist, index, activeIndex, setActiveIndex, fullNumber}) {
  const { name, medias } = playlist
  const isActive = index === activeIndex
  return (
    <div className="playlist" key={playlist.id}>
      <Accordion.Title 
        className="pl-header" tabIndex={1} 
        id={playlist.id}
        active={isActive}
        tabIndex={0}
        onClick={() => setActiveIndex(index)}
      >
        <h4><strong>{name}</strong></h4>
        <p>{medias.length} video(s)</p>
      </Accordion.Title>
      <Accordion.Content active={isActive} className="videos">
        {medias.map( media => (
          <Video media={media} fullNumber={fullNumber} key={media.id}/>
        ))}
      </Accordion.Content>
    </div>
  )
}

function Video({media, fullNumber}) {
  const { mediaName, id } = api.parseMedia(media)
  const courseNumber = fullNumber.replace('/', '-')
  return (
    <Card className="video" key={id} as={Link} to={util.links.watch(courseNumber, id)}>
      <img 
        className="img" variant="top" 
        src={imgHolder} style={{pointerEvents: 'none'}}
        alt="poster"
      />
      <Card.Title className="title">{mediaName}</Card.Title>
    </Card>
  )
}