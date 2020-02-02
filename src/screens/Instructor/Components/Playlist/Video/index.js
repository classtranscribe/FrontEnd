import _ from 'lodash'
import React, { useState, useEffect, useRef } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { Button } from 'pico-ui'
import { api } from 'utils'
import { mediaControl, setup } from '../../../Utils'
import './index.scss'

import MediaName from './MediaName'
import InlineButtons from './InlineButtons'


function VideoItemWithRedux({ 
  media=null, 
  isSelectingVideos=false,
  selectedVideos={},
}) {
  const { id, mediaName, isUnavailable } = api.parseMedia(media)

  const [newName, setNewName] = useState('')
  const [isDeleted, setIsDeleted] = useState(false)
  const nameRef = useRef()

  const isEditing = Boolean(newName) && !isSelectingVideos
  const isSelected = Boolean(selectedVideos[id])

  useEffect(() => {
    if (isEditing) nameRef.current.focus()
  }, [newName])


  const handleSelect = () => {
    if (isSelectingVideos) {
      if (isSelected) {
        mediaControl.handleRemove(media)
      } else {
        mediaControl.handleSelect(media)
      }
    } 
  }

  const handleKeydownSelect = ({ keyCode }) => {
    if (keyCode === 13) {
      handleSelect()
    }
  }

  const handleRename = async () => {
    if (isEditing && nameRef.current.innerText !== mediaName) {
      console.log(nameRef.current.innerText)
      await mediaControl.renameMedia(
        media, 
        setup.playlist().sourceType, 
        nameRef.current.innerText
      )
      // await plControl.renamePlaylist(playlist, newName)
    }
    setNewName( isEditing ? '' : mediaName )
  }

  const vClassName = 'ip-video-card' 
                   + (isEditing ? ' edit' : '') 
                   + (isSelectingVideos ? ' selecting' : '')

  return isDeleted ? null : (
    <div 
      id={`media-${id}`} 
      className={vClassName} 
      tabIndex={ isSelectingVideos ? 0 : -1 }
      onClick={handleSelect}
      onKeyDown={handleKeydownSelect}
    >
      <MediaName 
        nameRef={nameRef}
        mediaName={mediaName}
        isEditing={isEditing}
        isSelected={isSelected}
        isSelectingVideos={isSelectingVideos}
      />

      <InlineButtons 
        show={!isSelectingVideos && !isEditing}
        media={media}
        mediaName={mediaName}
        isUnavailable={isUnavailable}
        handleRename={handleRename}
        setIsDeleted={setIsDeleted}
      />

      {
        isEditing
        &&
        <div className="ip-video-opts ct-btn-group">
          <Button compact uppercase
            text="Save"
            color="teal transparent"
            onClick={handleRename}
          />
        </div>
      }
    </div>
  )
}

export default connectWithRedux(
  VideoItemWithRedux,
  [
    'isSelectingVideos',
    'selectedVideos'
  ],
  []
)

