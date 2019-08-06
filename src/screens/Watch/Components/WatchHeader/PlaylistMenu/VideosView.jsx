import React from 'react'
import { MenuItem } from '@material-ui/core'
import { Divider } from 'semantic-ui-react'
import { util, api } from 'utils'


export default function VideosView({ medias, currMedia, courseNumber, selectedPlaylist, backToPlaylists }) {
  const { name } = selectedPlaylist
  let fittedName = name ? name.slice(0, 40) : 'unknown'
  if (fittedName !== name) fittedName += '...'
  return (
    <div className="video-view">
      <MenuItem 
        className="header" onClick={backToPlaylists}
        aria-label="Back to playlists"
        title="Back to playlists"
      >
        <i className="material-icons">arrow_back_ios</i>
        <h5>{fittedName}</h5>
      </MenuItem>
      <Divider style={{width: '25em', margin: '0'}} inverted />
      <div className="video-list">
        {!medias.length && <MenuItem disabled>No Videos</MenuItem>}
        {medias.map( media => 
            <VideoItem key={media.id || media.media.id} media={media.media || media } currMedia={currMedia} courseNumber={courseNumber} />
        )}
      </div>
    </div>
  )
}

function VideoItem({ media, currMedia, courseNumber }) {
  const { mediaName, id } = api.parseMedia(media)
  return (
    <MenuItem 
      id={id} 
      className="pl-item" 
      selected={id === currMedia.id}
      title={mediaName}
      aria-label={`Watch video ${mediaName}`}
      onClick={() => window.location = util.links.watch(courseNumber, id)}
    >
      <i className="material-icons">play_arrow</i>
      <span>&ensp;{mediaName}</span>
    </MenuItem>
  )
}
