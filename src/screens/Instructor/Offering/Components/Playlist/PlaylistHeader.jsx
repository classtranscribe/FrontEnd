import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { util } from 'utils'
import { HeaderPlaceholder } from './Placeholders'
import TypeIcon from '../TypeIcon'

export default function PlaylistHeader({name, sourceType, id, offeringId}) {
  if (sourceType === undefined) return <HeaderPlaceholder />
  return (
    <div className="pl-info-header">
      <h1 className="name">
        <TypeIcon size="big" type={sourceType} />
        &ensp;{name}
        <EditPlaylistBtns type={sourceType} playlistId={id} offeringId={offeringId} />
      </h1> 
    </div>
  )
}

/**
 *  Buttons for editing current playlist 
 */
function EditPlaylistBtns({ type, playlistId, offeringId }) {
  return (
    <div className="playlist-btn">
      {
        type === 2
        &&
        <Button 
          color='grey'
          className="new-btn" 
          as={Link} 
          to={util.links.uploadVideo(offeringId, playlistId)} 
          aria-label="new video"
          compact
        >
          <i className="fas fa-cloud-upload-alt"></i>&ensp;Upload Video
        </Button>
      }
      <Button 
        as={Link}
        className="edit-btn" 
        to={util.links.editPlaylist(offeringId, playlistId)} 
        aria-label="edit playlist"
        compact
      >
        <i className="fas fa-edit"></i>
      </Button>
    </div>
  )
}