import React, { useEffect, useState, useRef } from 'react'
import { CTButton } from 'components'
import { PlaylistIcon } from '../PlaylistIcon'

import {  
  plControl
} from '../../Utils'

function PlaylistInfo({
  playlist,

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
    plControl.deletePlaylist(playlist)
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
    <div className="ip-p-title ct-d-r-center-v">
      {
        isEditing ?
        <div className="ip-p-pl-name-edit ct-a-fade-in">
          <div className="ip-p-pl-name-edit-con ip-filter-con">
            <input 
              ref={plnameRef}
              value={newName}
              className="ip-filter-input" 
              onChange={handleNameChange}
            />
          </div>
        </div>
        :
        <h3 className="ip-p-pl-name ct-d-r-center-v ct-a-fade-in">
          <PlaylistIcon type={playlist.sourceType} size="large" /> <span>{playlist.name}</span>
        </h3>
      }
      <div className="ct-btn-group">
        <CTButton
          icon={isEditing ? undefined : "edit"}
          text={isEditing ? "Save" : undefined}
          size="normal bold"
          color={isEditing ? "text-green" : "green"}
          onClick={handleRename}
          popup={isEditing ? undefined : 'Rename'}
        />
        {
          !isEditing
          &&
          <CTButton
            icon="delete"
            color="light"
            popup="Delete Playlist"
            onClick={onDelete}
          />
        }
      </div>
    </div>
  )
}

export default PlaylistInfo