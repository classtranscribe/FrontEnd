import React, { useEffect } from 'react'
import $ from 'jquery'
import { withRouter } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { Poster } from 'components'
import { api, util } from 'utils'

function VideoView({ playlist, playlists, history, goBack, courseNumber }) {
  const { name, medias=[] } = playlist

  useEffect(() => {
    $('.sp-content')[0].scrollTop = 0
  }, [history])

  return (
    <div className="videos">
      <div className="goback-container">
          <button className="del-icon" onClick={goBack} aria-label="Back to Playlists">
            <Icon name="chevron left" /> Playlists
          </button>
        </div>
      <p className="title"><i className="material-icons">video_library</i>{name}</p>
      <div role="list">
        {medias.slice().reverse().map( media => (
          <Video 
            key={media.id} 
            media={media} 
            history={history} 
            playlist={playlist}
            playlists={playlists}
            courseNumber={courseNumber} 
          />
        ))}
      </div>
    </div>
  )
}

function Video({ media, playlist, playlists, courseNumber, history }) {
  const { mediaName, id } = api.parseMedia(media)
  const { ratio } = util.getStoredMediaInfo(id)
  
  const pathname = util.links.watch(courseNumber, id, ratio)
  const videoState = { media, playlist, playlists }

  return (
    <button 
      className="video-item" 
      onClick={()=>history.push(pathname, videoState)} 
      aria-label={`Watch video ${mediaName}`}
    >
      <Poster progress={ratio} width="120px" />
      <p className="media-name">{mediaName}</p>
    </button>
  )
}

export default withRouter(VideoView)