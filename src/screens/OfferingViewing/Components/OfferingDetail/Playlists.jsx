import React, { useState } from 'react'
import { Accordion, Divider } from 'semantic-ui-react'
import { Card } from 'react-bootstrap'
import { ClassTranscribeFooter, Poster } from 'components'
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
    <div className="playlist-container">
      <Divider />
      <p className="title">Playlists</p>
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
      <ClassTranscribeFooter />
    </div>
  )
}

function Playlist({history, playlist, playlists, index, activeIndex, setActiveIndex, fullNumber}) {
  const { name, medias } = playlist
  const isActive = index === activeIndex
  return (
    <div className="playlist" key={playlist.id}>
      <Accordion.Title 
        className="pl-header"
        id={playlist.id}
        active={isActive}
        tabIndex={0}
        onClick={() => setActiveIndex(index)}
      >
        <p className="playlist-name"><strong>{name}</strong></p>
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
  const { ratio } = util.getStoredMediaInfo(id)
  if (mediaName === 'CS241-Lec02-Q01.mp4')console.log(util.getStoredMediaInfo(id))
  const pathname = util.links.watch(courseNumber, id, ratio)
  const videoState = {
    media: media,
    playlist: playlist,
    playlists: playlists
  }
  return (
    <Card className="video" key={id} as="button" onClick={()=>history.push(pathname, videoState)}>
      <Poster progress={ratio} width="9rem" />
      <Card.Title className="title">{mediaName}</Card.Title>
    </Card>
  )
}