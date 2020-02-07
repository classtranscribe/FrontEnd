import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Button } from 'pico-ui'
import { Poster } from 'components'
import { ListItem } from '../../ListItem'
import './index.scss'
import { api, util } from 'utils'
import { setup, mediaControl } from '../../../Utils'

function MediaDetail({ 
  media, 
  onClose,
}) {
  const { mediaName, id } = api.parseMedia(media)
  const history = useHistory()

  const [newName, setNewName] = useState('')
  const nameRef = useRef()
  const thisRef = useRef()
  const isEditing = Boolean(newName)

  const handleClose = () => {
    thisRef.current.classList.add('close')
    setTimeout(() => onClose(), 100);
  }

  const handleWatch = () => {
    let courseNumber = setup.offering().courseNumber
    let pathname = util.links.watch(courseNumber, id)
    history.push(
      pathname, 
      { 
        media, 
        playlist: setup.playlist(), 
        playlists: setup.playlists() 
      }
    )
  }

  const handleRename = async () => {
    let text = nameRef.current.innerText
    if (isEditing && text && text !== mediaName) {
      await mediaControl.renameMedia(
        media, 
        setup.playlist().sourceType, 
        text
      )
    }
    setNewName( isEditing ? '' : mediaName )
  }

  const handleDelete = async () => {
    await mediaControl.deleteMedia(media)
    handleClose()
  }

  const confirmDeletion = () => {
    setup.confirm({
      text: <div>Are you sure to delete the video <span>{mediaName}</span> ?</div>,
      onConfirm: handleDelete
    })
  }

  useEffect(() => {
    if (isEditing) nameRef.current.focus()
  }, [isEditing])

  const toMediaSettings = tab => () => {
    let pathname = util.links.instMediaSettings(id, tab)
    history.push(pathname, { media })
  }

  return (
    <div id="ip-p-md" ref={thisRef}>
      {/* Poster */}
      <div aria-hidden="true" className="w-100 h-auto position-relative">
        <Poster width="100%" height="200px" />
      </div>

      {/* Media Name */}
      <div id="ip-p-md-info">
        <button 
          className="plain-btn ip-goback" 
          onClick={handleClose}
        >
          <span tabIndex="-1">
            <i className="material-icons" aria-hidden="true">chevron_left</i> GO BACK
          </span>
        </button>

        <h3 
          ref={nameRef} 
          className={"ip-p-md-mname ct-d-r-center-v" + (isEditing ? " edit" : "")}
          contentEditable={ isEditing }
        >
          {mediaName}
        </h3>

        {/* Buttons */}
        <div className="ct-d-r-end">
          {
            isEditing
            ?
            <Button uppercase
              text="save"
              color="transparent teal"
              onClick={handleRename}
            />
            :
            <>
              <Button.Group>
                <Button uppercase
                  icon="play_circle_filled"
                  text="watch"
                  //color="transparent teal"
                  color="teal"
                  onClick={handleWatch}
                />
                <Button uppercase
                  icon="edit"
                  text="rename"
                  //color="transparent"
                  onClick={handleRename}
                />
                <Button uppercase round
                  icon="delete"
                  color="transparent"
                  onClick={confirmDeletion}
                />
              </Button.Group>
            </>
          }
        </div>
      </div>

      {/* Settings */}
      {/* <div className="mt-3">
        <div className="ip-sb-title ct-d-r-center-v mt-3">
          <i className="material-icons" aria-hidden="true">settings</i>
          <h3>SETTINGS</h3>
        </div>
        <ListItem dark
          icon="closed_caption"
          title="Edit Transcriptions"
          onClick={toMediaSettings('editTrans')}
        />
        <ListItem dark
          icon="menu_book"
          title="Manage ePub Chapters"
          onClick={toMediaSettings('epub')}
        />
      </div> */}
    </div>
  )
}

export default MediaDetail
