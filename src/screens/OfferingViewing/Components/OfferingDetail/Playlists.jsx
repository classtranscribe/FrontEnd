import React, { useState } from 'react'
import { Accordion } from 'semantic-ui-react'
import { Card } from 'react-bootstrap'
import PlaylistPlaceholder from './PlaylistPlaceholder'
import { util, api } from 'utils'
const imgHolder = require('images/Video-Placeholder.jpg')


export default function Playlists({ playlists, fullNumber, history }) {
  const [activeIndex, setActiveIndex] = useState(-1)

  if (!playlists) return <PlaylistPlaceholder />
  if (playlists.length === 0) return <PlaylistPlaceholder noPlaylist />
  
  const handleClick = index => {
    if (index === activeIndex) setActiveIndex(() => -1)
    else setActiveIndex(() => index)
  }

  return (
    <Accordion className="playlists">
      {playlists.map( (playlist, index) => (
        <Playlist 
          key={playlist.id}
          history={history}
          playlist={playlist} index={index}
          playlists={playlists}
          activeIndex={activeIndex} setActiveIndex={handleClick}
          fullNumber={fullNumber}
        />
      ))}
    </Accordion>
  )
}

function Playlist({history, playlist, playlists, index, activeIndex, setActiveIndex, fullNumber}) {
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
        {medias.slice().reverse().map( media => (
          <Video media={media} playlist={playlist} playlists={playlists} fullNumber={fullNumber} key={media.id} history={history} />
        ))}
      </Accordion.Content>
    </div>
  )
}

function Video({media, fullNumber, playlist, playlists, history}) {
  const { mediaName, id } = api.parseMedia(media)
  const courseNumber = api.getValidURLFullNumber(fullNumber)
  const pathname = util.links.watch(courseNumber, id)
  const videoState = {
    media: media,
    playlist: playlist,
    playlists: playlists
  }
  return (
    <Card className="video" key={id} as="button" onClick={()=>history.push(pathname, videoState)}>
      <img 
        className="img" variant="top" 
        src={imgHolder} style={{pointerEvents: 'none'}}
        alt="poster"
      />
      <Card.Title className="title">{mediaName}</Card.Title>
    </Card>
  )
}