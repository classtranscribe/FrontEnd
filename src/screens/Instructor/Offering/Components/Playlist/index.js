import React, { useState, useEffect, createRef } from 'react'
import { Link } from 'react-router-dom'
import { List, Image, Sticky } from 'semantic-ui-react'
import { ClassTranscribeFooter } from '../../../../../components'
import PlaylistHeader from './PlaylistHeader'
import EditVideoBtn from './EditVideoBtn'
import './index.css'
import { api, util } from '../../../../../util'
const profileImg = require('../../../../../images/Video-Placeholder.jpg')


export function Playlist({ match }) {
  const playlistId = match.params.id
  const [playlist, setPlaylist] = useState({})
  const [medias, setMedias] = useState([])
  const ref = createRef()

  /**
   * GET data based on playlistId
   */
  useEffect(() => {
    api.getPlaylistById(playlistId)
      .then( ({data}) => {
        setPlaylist(() => data.playlist)
        setMedias(() => data.medias)
        console.log(data)
      })
  }, [playlistId])

  console.log(medias[0])

  return (
    <div className="csp-videos" ref={ref}>
      <Sticky context={ref}>
        <PlaylistHeader {...playlist} />
      </Sticky>
      <List verticalAlign='middle' className="vlist" role="list">
        {medias.map( media =>
          <Video {...media} sourceType={playlist.sourceType}/>
        )}
      </List>
      <ClassTranscribeFooter />
    </div>
  )
}

function Video({media, sourceType}) {
  const className = sourceType === 1 ? 'youtube' : sourceType === 2 ? 'echo360' : ''
  const videoName = media.jsonMetadata.title
  return (
    <List.Item className="video-card" key={media.id}>
      <EditVideoBtn show={sourceType === 0} {...media}/>
      <Link to={util.links.watch(media.id)} className="d-flex flex-row">
        <Image 
          alt="Video Poster"
          className="poster" 
          src={profileImg}
          aria-label={`see video ${videoName}`}
          title={`see video ${videoName}`}
        />
        <List.Content>
          <div className="info">
            <p 
              className={`title ${className}`} 
              aria-label={`see video ${videoName}`}
              title={`see video ${videoName}`}
            >
              {videoName} 
            </p>
            <p className="text-muted">0:5:35</p>
          </div>
        </List.Content>
      </Link>
    </List.Item>
  )
}