import React from 'react'
import { MenuItem } from '@material-ui/core'
import { Divider } from 'semantic-ui-react'
import { util } from 'utils'


export default function VideosView({ medias, currMedia, courseNumber, selectedPlaylist, backToPlaylists }) {
  const { name } = selectedPlaylist
  let fittedName = name.slice(0, 30)
  if (fittedName !== name) fittedName += '...'
  return (
    <>
      <MenuItem className="header" onClick={backToPlaylists}>
        <i class="material-icons">arrow_back_ios</i>
        <h5>{fittedName}</h5>
      </MenuItem>
      <Divider style={{width: '25em', margin: '0'}} inverted />
      {medias.map( media => (
        <VideoItem media={media.media} currMedia={currMedia} courseNumber={courseNumber} />
      ))}
    </>
  )
}

function VideoItem({ media, currMedia, courseNumber }) {
  const { jsonMetadata, id } = media
  return (
    <MenuItem 
      className="pl-item" 
      selected={id === currMedia.id}
      id={currMedia.id}
      href={util.links.watch(courseNumber, id)}
    >
      <i class="material-icons">video_library</i>
      &ensp;{jsonMetadata.title}
    </MenuItem>
  )
}
