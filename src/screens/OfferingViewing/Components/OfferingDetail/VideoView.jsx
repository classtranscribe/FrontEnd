import React, { useEffect } from 'react'
import $ from 'jquery'
import { withRouter } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { VideoCard } from '../../../../components'
import { api, util } from '../../../../utils'

function VideoView({ playlist, playlists, history, goBack, courseNumber, watchHistoryJSON }) {
  const { name, medias=[] } = playlist

  useEffect(() => {
    $('.sp-content')[0].scrollTop = 0
  }, [history])

  return (
    <div className="videos">
      <div className="goback-container">
        <button className="del-icon" onClick={goBack} aria-label="Back to Playlists">
          <Icon name="chevron left" aria-hidden="true" /> Playlists
        </button>
      </div>

      <h2 className="title">
        <i className="material-icons" aria-hidden="true">video_library</i>
        {name}
      </h2>

      <div role="list">
        {(medias.slice() || []).reverse().map( media => (
          <Video 
            key={media.id} 
            media={media} 
            playlist={playlist}
            playlists={playlists}
            courseNumber={courseNumber} 
            watchHistoryJSON={watchHistoryJSON}
          />
        ))}
      </div>
    </div>
  )
}

function Video({ media, playlist, playlists, courseNumber, watchHistoryJSON }) {
  const { mediaName, id, isUnavailable } = api.parseMedia(media)
  const { timeStamp, ratio } = watchHistoryJSON[id] || {}

  return (
    <VideoCard row
      name={mediaName}
      link={util.links.watch(courseNumber, id, timeStamp)}
      ratio={ratio}
      mediaState={{ playlist, playlists }}
      posterSize="150px"
      isUnavailable={isUnavailable}
    />
    
  )
}

export default withRouter(VideoView)