/**
 * Playlist Page for instructors
 */

import React, { useState, useEffect, createRef } from 'react'
import { Link } from 'react-router-dom'
import { List, Image, Sticky } from 'semantic-ui-react'
import { ClassTranscribeFooter } from 'components'
import { VideoListPlaceHolder } from './Placeholders'
import PlaylistHeader from './PlaylistHeader'
import EditVideoBtn from './EditVideoBtn'
import './index.css'
import { api, util } from 'utils'
const profileImg = require('images/Video-Placeholder.jpg')


export function Playlist({ match }) {
  const playlistId = match.params.id
  const courseNumber = match.params.courseNumber
  const [playlist, setPlaylist] = useState({})
  const [medias, setMedias] = useState(null)
  const ref = createRef()

  /**
   * GET data based on playlistId
   */
  useEffect(() => {
    localStorage.setItem('playlistUrl', window.location.pathname)
    api.getPlaylistById(playlistId)
      .then( ({data}) => {
        setPlaylist(() => data.playlist)
        setMedias(() => data.medias)//.sort(sortFunc.sortVideosByCreatedDate))
        console.log(data)
      })
  }, [playlistId])

  // console.log(medias[0])

  return (
    <div className="csp-videos" ref={ref}>
      <Sticky context={ref}>
        <PlaylistHeader {...playlist} />
      </Sticky>
      <List verticalAlign='middle' className="vlist" role="list">
        {
          medias ? 
          medias.map( (media, index) =>
            <Video {...media} sourceType={playlist.sourceType} key={media.media.id} courseNumber={courseNumber}/>
          )
          :
          <VideoListPlaceHolder />
        }
      </List>
      <ClassTranscribeFooter />
    </div>
  )
}

/**
 * Video List Item
 */
function Video({media, sourceType, courseNumber}) {
  const { mediaName, id } = api.parseMedia(media)
  return (
    <List.Item className="video-card">
      <EditVideoBtn show={sourceType === 2} {...media}/>
      <Link to={util.links.watch(courseNumber, id)} className="d-flex flex-row">
        <Image 
          alt="Video Poster"
          className="poster" 
          src={profileImg}
          aria-label={`see video ${mediaName}`}
          title={`see video ${mediaName}`}
        />
        <List.Content>
          <div className="info">
            <p 
              className="title" 
              aria-label={`see video ${mediaName}`}
              title={`see video ${mediaName}`}
            >
              {mediaName} 
            </p>
            {/* <p className="text-muted">0:5:35</p> */}
          </div>
        </List.Content>
      </Link>
    </List.Item>
  )
}