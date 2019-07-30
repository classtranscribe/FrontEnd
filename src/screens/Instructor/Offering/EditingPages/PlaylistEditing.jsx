/**
 * Edit Playlist Page
 * sub page for creating or editing a playlist
 */

import React, { useState, useEffect } from 'react'
// UI & Layouts
import { Grid, Form, Input, Select, Message, Icon, Divider } from 'semantic-ui-react'
import { GeneralModal, GeneralLoader } from '../../../../components'
import { SaveButtons, EditButtons } from './Buttons'
// Vars
import { api, handleData, util } from '../../../../util'

/**
 * @param type 'new' for creating, 'id' for editing
 * @param id   type is new: offeringId, type is id: playlistId
 * @param history for goBack
 */
export function PlaylistEditing ({match: {params: {id, type}}, history}) {
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
  const [loading, setLoading] = useState(true)

  /**
   * Used while editinf a playlist
   * GET all the needed info based on the playlist Id
   */
  useEffect(()=> {
    api.contentLoaded(500)
    if (!isNew) {
      // setLoading(true)
      // api.getData(path, id)
      // .then( response => {
      //   setPlaylist(response.data)
      //   setPlaylistInfo(response.data)
      //   setLoading(false)
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
  const modalSize = isNew ? 'small' : 'tiny'
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
      open={true} 
      size={modalSize}
      onClose={callBacks.onCancel}
      button={button}
    >
      <PlaylistForm 
        isNew={isNew}
        loading={loading}
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
function PlaylistForm({isNew, loading, playlistInfo, setPlaylistInfo}) {
  const playlistTypeGuide = [
    <p><strong><Icon name='cloud upload'/> {api.playlistTypes[0].name}:<br/></strong>Upload your own videos!</p>,
    <p><strong><Icon name='youtube'/> {api.playlistTypes[1].name}:<br/></strong>Enter the sharable URL of your YouTube Playlist</p>,
    <p><strong><Icon name='video play'/> {api.playlistTypes[2].name}:<br/></strong>Add new videos by URL from echo360</p>
  ]
  const playlistTypeOptions = util.getSelectOptions(api.playlistTypes)
  return (
    <Form className="general-form">
      {
        !loading || isNew ? 
        <Grid columns='equal' verticalAlign="middle">
          <Grid.Row >
            <Grid.Column>
              <Form.Field
                fluid required
                id='playist-description'
                control={Input}
                label='Playlist Name'
                placeholder='E.g. Lecture 1'
                defaultValue={playlistInfo.description}
                onChange={({target: {value}})=> setPlaylistInfo({...playlistInfo, description: value})}
              />
            </Grid.Column>
          </Grid.Row>
          {
            isNew 
            &&
            <>
            <Grid.Row>
              <Grid.Column>
                <Message>
                  <Message.Header>
                    <Icon name='info circle' size='big' color='grey' />&ensp;
                    Playlist Type Guide
                  </Message.Header>
                  <Divider horizontal />
                  <Message.List items={playlistTypeGuide} />
                </Message>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row >
              <Grid.Column>
                <Form.Field
                  fluid required
                  id='playist-type'
                  control={Select}
                  label='Playlist Type'
                  placeholder='Playlist Type'
                  defaultValue={api.playlistTypes[0].id}
                  options={playlistTypeOptions}
                  onChange={(event, {value})=> setPlaylistInfo({...playlistInfo, type: value})}
                />
              </Grid.Column>
            </Grid.Row>
            </>
          }
          {
            playlistInfo.type === 'YouTube'
            &&
            <Grid.Row>
              <Grid.Column>
                <Form.Field
                  fluid required
                  id='youtube-playlist-url'
                  control={Input}
                  label='Public URL'
                  placeholder='Paste your public URL here...'
                  onChange={({target: {value}})=> 1}
                />
              </Grid.Column>
            </Grid.Row>
          }
        </Grid> 
        : 
        <GeneralLoader loading inverted height='10rem' />
      }
    </Form>
  )
}
