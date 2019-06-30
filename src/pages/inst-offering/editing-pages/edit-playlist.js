import React, { useState, useEffect } from 'react'
import { GeneralModal, GeneralLoader } from '../../../components'
import { Grid, Form, Input } from 'semantic-ui-react'
import { SaveButtons, EditButtons } from './buttons'
// Vars
import { api, handleData, util } from '../../../util'
const initialPlaylist = api.initialData.initialPlaylist

export function PlaylistEditingPage ({match: {params: {id, type}}, history}) {
  const isNew = type === 'new'
  const path = '??'

  const [playlist, setPlaylist] = useState(null)
  const [playlistInfo, setPlaylistInfo] = useState(isNew ? initialPlaylist : playlist)

  useEffect(()=> {
    if (!isNew) {
      // api.getData(path, id)
      // .then( response => {
      //   setPlaylist(response.data)
      //   setPlaylistInfo(response.data)
      // })
    }
  }, [])

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
