import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'pico-ui'
import { PlaylistIcon } from '../PlaylistIcon'
import { setup } from '../../Utils'

import {  
  plControl
} from '../../Utils'

function PlaylistInfo({
  playlist,
  isTop=true,
}) {

  const [newName, setNewName] = useState('')
  const plnameRef = useRef()

  const isEditing = Boolean(newName)

  useEffect(() => {
    if (isEditing) setNewName('')
  }, [playlist])

  useEffect(() => {
    if (newName) plnameRef.current.focus()
  }, [newName])

  const onDelete = () => {
    setup.confirm({
      text: <div>Are you sure to delete the playlist <span>{playlist.name}</span> ?</div>,
      onConfirm: () => plControl.deletePlaylist(playlist)
    })
  }

  const handleRename = async () => {
    if (isEditing && newName !== playlist.name) {
      await plControl.renamePlaylist(playlist, newName)
    }
    setNewName( isEditing ? '' : playlist.name )
  }

  const handleNameChange = ({ target: { value } }) => {
    setNewName(value)
  }

  return (
    <div className={"ip-p-title ct-d-r-center-v ip-sticky-top" + (isTop ? '' : ' sticking')}>
      {
        isEditing ?
        <div className="ip-p-pl-name-edit ct-a-fade-in">
          <div className="ip-p-pl-name-edit-con ip-filter-con">
            <input 
              ref={plnameRef}
              value={newName}
              onChange={handleNameChange}
            />
          </div>
        </div>
        :
        <h3 className="ip-p-pl-name ct-d-r-center-v ct-a-fade-in">
          <PlaylistIcon type={playlist.sourceType} size="large" svgSize="big" /> <span>{playlist.name}</span>
        </h3>
      }

      {/* Button Group */}
      {
        isTop
        &&
        <div className="ct-btn-group ct-a-fade-in">
          <Button.Group>
            <Button compact
              icon={isEditing ? undefined : "edit"}
              text={isEditing ? "Save" : undefined}
              color={isEditing ? "transparent teal" : "primary"}
              plain={isEditing}
              round={!isEditing}
              onClick={handleRename}
              popup={isEditing ? undefined : 'Rename'}
            />
            {
              !isEditing
              &&
              <Button round compact
                icon="delete"
                color="primary"
                popup="Delete Playlist"
                onClick={onDelete}
              />
            }
          </Button.Group>
        </div>
      }

    </div>
  )
}

export default PlaylistInfo