import React from 'react'
import { Link } from 'react-router-dom'
import { MenuItem } from '@material-ui/core'
import { Divider } from 'semantic-ui-react'
import { util, api } from 'utils'


export default function VideosView({ medias, currMedia, courseNumber, selectedPlaylist, playlists, backToPlaylists }) {
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
        &ensp;<h5>{fittedName}</h5>
      </MenuItem>
      <Divider style={{width: '25em', margin: '0'}} inverted />
      <div className="video-list">
        {!medias.length && <MenuItem disabled>No Videos</MenuItem>}
        {medias.map( media => 
            <VideoItem 
              key={media.id || media.media.id} 
              media={media.media || media } 
              currMedia={currMedia} 
              playlists={playlists}
              courseNumber={courseNumber} 
              selectedPlaylist={selectedPlaylist}
            />
        )}
      </div>
    </div>
  )
}

function VideoItem({ media, currMedia, courseNumber, selectedPlaylist, playlists }) {
  const { mediaName, id } = api.parseMedia(media)
  const watchVideo = () => window.location.reload()
  return (
    <MenuItem 
      id={id} 
      className="video-item" 
      selected={id === currMedia.id}
      title={mediaName}
      aria-label={`Watch video ${mediaName}`}
      onClick={watchVideo}
    >
      <Link className="pl-item-link" to={{
        pathname: util.links.watch(courseNumber, id),
        state: {
          media: media, playlist: selectedPlaylist, playlists: playlists
        }
      }}>
        <i className="material-icons">play_arrow</i>
        <p>&ensp;{mediaName}</p>
      </Link>
    </MenuItem>
  )
}
