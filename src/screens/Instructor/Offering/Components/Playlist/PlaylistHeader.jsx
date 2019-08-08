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
  const newVideoButtonName =
          <><i className="fas fa-cloud-upload-alt"></i>&ensp;Upload Video</>

  return (
    <div className="playlist-btn">
      {
        type === 2
        &&
        <Button 
          color='grey'
          className="new-btn" 
          onClick={()=>1} 
          aria-label="new video"
          compact
        >
          {newVideoButtonName}
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