import React from 'react'
import { Button } from 'semantic-ui-react'
import { util } from '../../../../../util'
import TypeIcon from '../TypeIcon'

export default function PlaylistHeader({name, sourceType}) {
  const className = sourceType === 1 ? 'youtube' : sourceType === 2 ? 'echo360' : ''
  return (
    <div className="pl-info-header d-inline">
      <h1 className={`name ${className}`}>
        <TypeIcon size="big" type={sourceType} />
        &ensp;{name}
      </h1> 
      {/* <EditPlaylistBtns type={sourceType}/> */}
    </div>
  )
}

/**
 *  Buttons for editing current playlist 
 */
function EditPlaylistBtns({ type }) {
  const newVideoButtonName = type === 'Echo360' ? 
          <><i class="fas fa-link"></i>&ensp;Add New Video from Echo360</> :
          <><i class="fas fa-cloud-upload-alt"></i>&ensp;Upload Video</>

  return (
    <div className="playlist-btn">
      {
        type !== 'YouTube'
        &&
        <Button 
          color='grey'
          className="new-btn" 
          onClick={()=>1} 
          aria-label="new video"
        >
          {newVideoButtonName}
        </Button>
      }
      <Button 
        className="edit-btn" 
        onClick={()=>util.editPlaylist('fakeid')} 
        aria-label="edit playlist"
      >
        <i class="fas fa-edit"></i>&ensp;Edit Playlist
      </Button>
    </div>
  )
}