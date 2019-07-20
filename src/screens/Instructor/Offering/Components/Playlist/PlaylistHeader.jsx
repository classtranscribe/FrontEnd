import React from 'react'
import { Button } from 'semantic-ui-react'
import { util } from '../../../../../util'
import { HeaderPlaceholder } from './Placeholders'
import TypeIcon from '../TypeIcon'

export default function PlaylistHeader({name, sourceType}) {
  if (!sourceType) return <HeaderPlaceholder />

  const className = sourceType === 1 ? 'youtube' : sourceType === 2 ? 'echo360' : ''
  return (
    <div className="pl-info-header">
      <h1 className={`name ${className}`}>
        <TypeIcon size="big" type={sourceType} />
        &ensp;{name}
      </h1> 
      {
        sourceType === 0
        &&
        <EditPlaylistBtns type={sourceType}/>
      }
    </div>
  )
}

/**
 *  Buttons for editing current playlist 
 */
function EditPlaylistBtns() {
  const newVideoButtonName =
          <><i class="fas fa-cloud-upload-alt"></i>&ensp;Upload Video</>

  return (
    <div className="playlist-btn">
      <Button 
        color='grey'
        className="new-btn" 
        onClick={()=>1} 
        aria-label="new video"
      >
        {newVideoButtonName}
      </Button>
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