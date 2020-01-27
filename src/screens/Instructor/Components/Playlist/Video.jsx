import _ from 'lodash'
import React, { useState, useEffect, useRef } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import { CTButton } from 'components'
import { api, util } from 'utils'
import { mediaControl, setup } from '../../Utils'
import { Icon } from 'semantic-ui-react'


function VideoWithRedux({ 
  media=null, 
  playlist={},
  playlists=[],
  courseNumber='',
  isSelectingVideos=false,
  selectedVideos={},

  history,
}) {
  const { id, mediaName, isUnavailable } = api.parseMedia(media)

  const [newName, setNewName] = useState('')
  const [isDeleted, setIsDeleted] = useState(false)
  const nameRef = useRef()
  const isEditing = Boolean(newName) && !isSelectingVideos

  useEffect(() => {
    if (isEditing) nameRef.current.focus()
  }, [newName])

  const handleRename = async () => {
    if (isEditing && nameRef.current.innerText !== mediaName) {
      console.log(nameRef.current.innerText)
      await mediaControl.renameMedia(
        media, 
        playlist.sourceType, 
        nameRef.current.innerText
      )
      // await plControl.renamePlaylist(playlist, newName)
    }
    setNewName( isEditing ? '' : mediaName )
  }
  
  const handleDelete = async () => {
    await mediaControl.deleteMedia(media)
    setIsDeleted(true)
  }

  const confirmDeletion = () => {
    setup.confirm({
      text: <span>Are you sure to delete the video<br/><strong><i>{mediaName}</i></strong> ?</span>,
      onConfirm: handleDelete
    })
  }

  const handleWatch = () => {
    let pathname = util.links.watch(courseNumber, id)
    history.push(pathname, { media, playlist, playlists })
  }

  const isSelected = Boolean(selectedVideos[id])

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

  return isDeleted ? null : (
    <div 
      id={`media-${id}`} 
      className={"ip-video-card" + (isEditing ? ' edit' : '')} 
      data-select={isSelectingVideos}
      tabIndex={ isSelectingVideos ? 0 : -1}
      onClick={handleSelect}
      onKeyDown={handleKeydownSelect}
    >
      <div className="plain-btn ip-video">
        <div tabIndex="-1" className="ip-video-con">

          {/* Icon */}
          {
            
            isSelectingVideos 
            ?
            <div className="ip-v-check">
              <div className="ip-v-check-box" data-checked={isSelected.toString()}>
                {
                  isSelected
                  &&
                  <i className="material-icons">check</i>
                }
              </div>
            </div>
            :
            <div className="ip-v-file-icon">
              <Icon name="file video" size="big"/>
            </div>
          }


          {/* Media Name */}
          <div 
            ref={nameRef}
            className="ip-video-name"
            contentEditable={isEditing}
          >
            {mediaName}
          </div>
        </div>
      </div>

      {
        (!isSelectingVideos && !isEditing)
        &&
        <div className="ip-video-opts ct-btn-group">
          <CTButton circle
            popup={isUnavailable ? "" : 'Watch'}
            icon="play_circle_filled"
            color={isUnavailable ? 'light' : "text-green"}
            onClick={handleWatch}
            disabled={isUnavailable}
          />

          <CTButton circle
            popup="Rename"
            icon="edit"
            color="light"
            onClick={handleRename}
          />

          <CTButton circle
            popup="Delete"
            icon="delete"
            color="light"
            onClick={confirmDeletion}
          />
        </div>
      }

      {
        isEditing
        &&
        <div className="ip-video-opts ct-btn-group">
          <CTButton //circle
            text="Save"
            color="green"
            onClick={handleRename}
          />
        </div>
      }
    </div>
  )
}

export default withRouter(connectWithRedux(
  VideoWithRedux,
  [
    'playlist', 
    'playlists',
    'isSelectingVideos',
    'selectedVideos'
  ],
  []
))

