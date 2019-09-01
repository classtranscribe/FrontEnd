/**
 * Edit Playlist Page
 * sub page for creating or editing a playlist
 */

import React, { useState, useEffect } from 'react'
// UI & Layouts
import { Grid, Form, Input, Select, Message, Icon, Divider, Popup } from 'semantic-ui-react'
import { GeneralModal, GeneralLoader } from 'components'
import { SaveButtons, EditButtons } from './Buttons'
// Vars
import { api, util } from 'utils'

/**
 * @param type 'new' for creating, 'id' for editing
 * @param id   type is new: offeringId, type is id: playlistId
 * @param history for goBack
 */
export function PlaylistEditing ({match: {params: {id, type}}, history, location}) {
  // determine whether is going to create or edit a playlist
  const isNew = type === 'new' 

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
    if (!isNew) {
      api.getPlaylistById(id)
        .then( ({data}) => {
          delete data['medias']
          setPlaylist(() => data)
          setPlaylistInfo(() => data)
          setLoading(() => false)
        })
    }
  }, [history])

  /**
   * Functions for http requests
   */
  const callBacks = {
    onCreate: () => {
      if ( isNew ) playlistInfo.offeringId = id
      api.createPlaylist(playlistInfo).then(() => callBacks.onClose())
    },
    onUpdate: () => {
      api.updatePlaylist(playlistInfo).then(() => callBacks.onClose())
    },
    onDelete: () => {
      api.deletePlaylist(playlistInfo.id).then(() => window.location = util.links.offering(playlistInfo.offeringId))
    },
    onClose: () => {
      history.goBack()
    },
    onCancel: () => {
      history.goBack()
    }
  }

  const header = isNew ? 'New Playlist' : 'Rename the Playlist'
  const modalSize = isNew ? 'small' : 'tiny'
  const urlEntered = playlistInfo.sourceType === 2 || playlistInfo.playlistIdentifier
  const button = isNew ? 
    <SaveButtons 
      {...callBacks}
      canSave={playlistInfo.name && urlEntered}
    />
    : 
    <EditButtons 
      {...callBacks}
      canDelete={playlistInfo}
      canSave={playlistInfo && playlistInfo.name}
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

const playlistTypeGuide = [
  <p>
    <strong><Icon name='cloud upload'/> {api.playlistTypes[2].name}:<br/></strong>
    Upload your own videos!
  </p>,
  <p>
    <strong><Icon name='youtube'/> {api.playlistTypes[1].name}:<br/></strong>
    Enter the 
    <Popup 
      content={
        <p>
          The playlist IDENTIFIER of <span className="link">https://www.youtube.com/watch?v=Uqs0GewlMkQ&
          <span className="id">list=PLLssT5z_DsK8Xwnh_0bjN4KNT81bekvtt</span></span><br/>
          is <span className="id">PLLssT5z_DsK8Xwnh_0bjN4KNT81bekvtt</span>
        </p>
      } 
      trigger={<span> IDENTIFIER </span>} 
    />
    of your YouTube Playlist
  </p>,
  <p><strong><Icon name='video play'/> {api.playlistTypes[0].name}:<br/></strong>
    Enter the PUBLIC URL of your Echo360 course
  </p>
]

/**
 * Form Component
 * @todo need to add type selection
 */
function PlaylistForm({isNew, loading, playlistInfo, setPlaylistInfo}) {
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
                id='playist-name'
                control={Input}
                label='Playlist Name'
                placeholder='E.g. Lecture 1'
                defaultValue={playlistInfo.name}
                onChange={({target: {value}})=> setPlaylistInfo({...playlistInfo, name: value})}
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
                  defaultValue={api.playlistTypes[2].id}
                  options={playlistTypeOptions}
                  onChange={(event, {value})=> setPlaylistInfo({...playlistInfo, sourceType: value})}
                />
              </Grid.Column>
            </Grid.Row>
            </>
          }
          {
            (isNew && playlistInfo.sourceType !== 2)
            &&
            <Grid.Row>
              <Grid.Column>
                <Form.Field
                  fluid required
                  id='playlist-url'
                  control={Input}
                  label={playlistInfo.sourceType === 0 ? 'Public URL' : 'Playlist Identifier'}
                  placeholder={playlistInfo.sourceType === 0 ? 'Paste your public URL here...' : 'Enter your playlist identifier here ...'}
                  onChange={({target: {value}})=> setPlaylistInfo({...playlistInfo, playlistIdentifier: value})}
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
