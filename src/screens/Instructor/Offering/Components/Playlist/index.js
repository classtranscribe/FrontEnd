/**
 * Playlist Page for instructors
 */

import React, { useState, useEffect, createRef } from 'react'
import { List, Image, Sticky } from 'semantic-ui-react'
import { ClassTranscribeFooter } from 'components'
import { VideoListPlaceHolder } from './Placeholders'
import PlaylistHeader from './PlaylistHeader'
import EditVideoBtn from './EditVideoBtn'
import './index.css'
import { api, util } from 'utils'
const profileImg = require('images/Video-Placeholder.jpg')


export function Playlist({ match, history, location }) {
  const playlistId = match.params.id
  const courseNumber = match.params.courseNumber
  const [playlist, setPlaylist] = useState({})
  const [medias, setMedias] = useState(null)
  const ref = createRef()

  useEffect(() => {
    // if (location.state) {
    //   setPlaylist(() => location.state.playlist)
    //   setMedias(() => location.state.playlist.medias)
    // } else {
      api.getPlaylistById(playlistId)
        .then( ({data}) => {
          setPlaylist(() => data.playlist)
          setMedias(() => data.playlist.medias)//.sort(sortFunc.sortVideosByCreatedDate))
        })
    // }
  }, [location])

  /**
   * GET data based on playlistId
   */
  useEffect(() => {
    
  }, [playlistId])

  // console.log(medias[0])

  return (
    <div className="csp-videos" ref={ref}>
      <Sticky context={ref}>
        <PlaylistHeader {...playlist} courseNumber={courseNumber} />
      </Sticky>
      <List verticalAlign='middle' className="vlist" role="list">
        {
          medias ? 
          medias.map( (media, index) =>
            <Video 
              media={media}
              sourceType={playlist.sourceType} 
              key={media.id} 
              courseNumber={courseNumber} 
              playlist={playlist} 
              history={history}
            />
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
function Video({media, playlist, sourceType, courseNumber, history}) {
  const [isDelete, setIsDelete] = useState(false)
  const { mediaName, id } = api.parseMedia(media)
  const pathname = util.links.watch(courseNumber, id)
  const videoState = {media: media, playlist: playlist}
  return isDelete ?  null : (
    <List.Item className="video-card">
      <EditVideoBtn 
        show
        sourceType={sourceType}
        mediaName={mediaName} 
        mediaId={id} 
        setIsDelete={setIsDelete} 
        offeringId={playlist.offeringId} 
      />
      <button className="d-flex flex-row video-link" tabIndex={0} onClick={() => history.push(pathname, videoState)}>
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
      </button>
    </List.Item>
  )
}