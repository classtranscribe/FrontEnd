/**
 * Edit Playlist Page
 * sub page for creating or editing a playlist
 */

import React, { useState, useEffect } from 'react'
// UI & Layouts
import { Grid, Form, Input } from 'semantic-ui-react'
import { GeneralModal, GeneralLoader } from '../../../components'
import { SaveButtons, EditButtons } from './buttons'
// Vars
import { api, handleData, util } from '../../../util'

/**
 * @param type 'new' for creating, 'id' for editing
 * @param id   type is new: offeringId, type is id: playlistId
 * @param history for goBack
 */
export function PlaylistEditingPage ({match: {params: {id, type}}, history}) {
  // determine whether is going to create or edit a playlist
  const isNew = type === 'new' 
  const path = '??' // TBD

  /** 
   * playlist - the original playlist info whiling editing the playlist 
   */
  const [playlist, setPlaylist] = useState(api.initialData.initialPlaylist)
  /**
   * playlistInfo - the object for recording the inputs
   */
  const [playlistInfo, setPlaylistInfo] = useState(playlist)

  /**
   * Used while editinf a playlist
   * GET all the needed info based on the playlist Id
   */
  useEffect(()=> {
    if (!isNew) {
      // api.getData(path, id)
      // .then( response => {
      //   setPlaylist(response.data)
      //   setPlaylistInfo(response.data)
      // })
    }
  }, [])

  /**
   * Functions for http requests
   */
  const callBacks = {
    onCreate: function () {
      if ( isNew ) playlistInfo.offeringId = id
      // api.postData(path, playlistInfo, response => {})
      console.log(playlistInfo)
    },
    onUpdate: function () {
      var data = handleData.updateJson(playlistInfo, playlist)
      data.id = id
      console.log(data)
      // api.updateData(path, data, () => this.onClose())
    },
    onDelete: function () {
      api.deleteData(path, id, () => this.onClose())
    },
    onClose: function () {
      if (isNew) util.toOfferingPage(id)
      else history.goBack()
    },
    onCancel: function () {
      history.goBack()
    }
  }

  const header = isNew ? 'New Playlist' : 'Rename the Playlist'
  const button = isNew ? 
    <SaveButtons 
      {...callBacks}
      canSave={playlistInfo.description}
    />
    : 
    <EditButtons 
      {...callBacks}
      canDelete={playlistInfo}
      canSave={playlistInfo && playlistInfo.description}
    />

  return(
    <GeneralModal 
      header={header}
      open={true} size='tiny'
      onClose={callBacks.onCancel}
      button={button}
    >
      <PlaylistForm 
        playlistInfo={playlistInfo}
        setPlaylistInfo={setPlaylistInfo}
      />
    </GeneralModal>
  )
}

/**
 * Form Component
 * @todo need to add type selection
 */
function PlaylistForm({playlistInfo, setPlaylistInfo}) {
  return (
    <Form className="ap-form">
      {
        playlistInfo ? 
        <Grid columns='equal' verticalAlign="middle">
          <Grid.Row >
            <Grid.Column>
              <Form.Field
                fluid required
                id='paylist-description'
                control={Input}
                label='Playlist Name'
                placeholder='E.g. Lecture 1'
                defaultValue={playlistInfo.description}
                onChange={({target: {value}})=> setPlaylistInfo({...playlistInfo, description: value})}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid> 
        : 
        <GeneralLoader loading inverted />
      }
    </Form>
  )
}
