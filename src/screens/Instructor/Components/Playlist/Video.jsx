import _ from 'lodash'
import React, { useState, useEffect, useRef } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import { CTButton } from 'components'
import { api, util } from 'utils'
import { mediaControl } from '../../Utils'
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
  const { id, mediaName } = api.parseMedia(media)

  const [newName, setNewName] = useState('')
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
  
  const handleDelete = e => {
    mediaControl.deleteMedia(media)
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

  return (
    <div 
      id={`media-${id}`} 
      className="ip-video-card" 
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
              <Icon name="file video outline" size="big"/>
            </div>
          }


          {/* Media Name */}
          <div 
            ref={nameRef}
            className="ip-video-name"
            data-edit={isEditing}
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
          <CTButton //circle
            icon="play_circle_filled"
            text="Watch"
            color="green"
            onClick={handleWatch}
          />

          <CTButton //circle
            popup="Rename"
            icon="edit"
            color="text-green"
            onClick={handleRename}
          />

          <CTButton //circle
            popup="Delete"
            icon="delete"
            color="light"
            onClick={handleDelete}
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

