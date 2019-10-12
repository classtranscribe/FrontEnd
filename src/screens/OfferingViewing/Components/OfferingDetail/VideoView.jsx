import React, { useEffect } from 'react'
import $ from 'jquery'
import { withRouter } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { VideoCard } from 'components'
import { api, util } from 'utils'

function VideoView({ playlist, history, goBack, courseNumber, watchHistoryJSON }) {
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
            courseNumber={courseNumber} 
            watchHistoryJSON={watchHistoryJSON}
          />
        ))}
      </div>
    </div>
  )
}

function Video({ media, courseNumber, watchHistoryJSON }) {
  const { mediaName, id } = api.parseMedia(media)
  const { timeStamp, ratio } = watchHistoryJSON[id] || {}
  
  const pathname = util.links.watch(courseNumber, id, timeStamp)

  return (
    <VideoCard row
      name={mediaName}
      link={pathname}
      ratio={ratio}
      posterSize="150px"
    />
    
  )
}

export default withRouter(VideoView)