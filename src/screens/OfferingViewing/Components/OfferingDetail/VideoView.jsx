import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import { Icon } from 'semantic-ui-react'
import { VideoCard, PlaceHolder } from '../../../../components'
import { api, util } from '../../../../utils'

function VideoView({ 
  playlistId, 
  goBack, 
}) {
  const history = useHistory()
  const [playlist, setPlaylist] = useState({})

  useEffect(() => {
    util.scrollToTop('.sp-content')
    api.getPlaylistById(playlistId)
      .then(({ data }) => {
        _.reverse(data.medias)
        setPlaylist(data)
      })
      .catch(error => console.error(error, 'Failed to load playlist.'))
  }, [])

  useEffect(() => {
    if (playlist.id) {
      const { mid } = util.links.useSearch()
      if (mid) {
        util.scrollToCenter('#' + mid)
        history.replace(history.location.pathname)
      }
    }
  }, [playlist])

  const { name, medias=[] } = playlist

  return name ? (
    <div className="videos ct-a-fade-in">
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
        {(medias || []).slice().reverse().map( media => (
          <Video 
            key={media.id} 
            media={media} 
          />
        ))}
      </div>
    </div>
  ) : <PlaceHolder />
}

function Video({ media }) {
  const { mediaName, id, isUnavailable, watchHistory } = api.parseMedia(media)

  return (
    <VideoCard row
      id={id}
      name={mediaName}
      link={util.links.watch(id)}
      ratio={watchHistory.ratio}
      posterSize="150px"
      isUnavailable={isUnavailable}
    />
    
  )
}

export default VideoView