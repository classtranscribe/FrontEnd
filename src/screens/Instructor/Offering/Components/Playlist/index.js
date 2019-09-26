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
import { videoPosterImg } from 'images'


export function Playlist({ match, history, location }) {
  const playlistId = match.params.id
  const courseNumber = match.params.courseNumber
  const [playlist, setPlaylist] = useState({})
  const [medias, setMedias] = useState(null)
  const ref = createRef()

  useEffect(() => {
    // if (location.state && location.state.playlist) {
    //   setPlaylist(() => location.state.playlist)
    //   setMedias(() => location.state.playlist.medias)
    //   window.history.pushState({}, null, null)
    // } else {
      api.getPlaylistById(playlistId)
        .then( ({data}) => {
          // console.log('pl', data)
          setPlaylist(() => data)
          setMedias(() => data.medias)//.sort(sortFunc.sortVideosByCreatedDate))
        })
    // }
  }, [location, playlistId])

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
          !medias ? 
          <VideoListPlaceHolder />
          :
          !medias.length ?
          <VideoListPlaceHolder isEmpty playlist={playlist} />
          :
          medias.map( media =>
            <Video 
              media={media}
              sourceType={playlist.sourceType} 
              key={media.id} 
              courseNumber={courseNumber} 
              playlist={playlist} 
              history={history}
            />
          )
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
  const { mediaName, id, videos } = api.parseMedia(media)
  const pathname = util.links.watch(courseNumber, id)
  const videoState = {media: media, playlist: playlist}
  const videosInProcess = !videos || !videos.length
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
      <button disabled={videosInProcess} className="d-flex flex-row video-link" tabIndex={0} onClick={() => history.push(pathname, videoState)}>
        <Image 
          alt="Video Poster"
          className="poster" 
          src={videoPosterImg}
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
            {videosInProcess && <p className="text-muted">This video is current unavailable. Please check it later.</p>}
          </div>
        </List.Content>
      </button>
    </List.Item>
  )
}