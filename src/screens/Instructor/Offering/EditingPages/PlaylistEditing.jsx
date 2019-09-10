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
export function PlaylistEditing ({match: {params: {id, type}}, history}) {
  // determine whether is going to create or edit a playlist
  const isNew = type === 'new' 
  const [loading, setLoading] = useState(true)

  /**
   * playlist Info - the object for recording the inputs
   */
  const [offeringId, setOfferingId] = useState(id)
  const [name, setName] = useState('')
  const [sourceType, setSourceType] = useState(2)
  const [playlistIdentifier, setPlaylistIdentifier] = useState('')
  const [isValidPlID, setIsValidPlID] = useState('empty')

  /**
   * Used while editinf a playlist
   * GET all the needed info based on the playlist Id
   */
  useEffect(()=> {
    if (!isNew) {
      api.getPlaylistById(id)
        .then( ({data}) => {
          setLoading(false)
          setName(data.name)
          setOfferingId(data.offeringId)
          setSourceType(data.sourceType)
          setPlaylistIdentifier(data.playlistIdentifier)
        })
    }
  }, [history, isNew, id])

  /**
   * Functions for http requests
   */
  const callBacks = {
    onCreate: () => {
      setIsValidPlID('creating')
      var validPlID = playlistIdentifier
      if (sourceType === 1) {
        const { list } = util.parseSearchQuery(playlistIdentifier)
        if (list) {
          validPlID = list
        } else {
          setIsValidPlID('')
          return;
        }
      } else if (sourceType === 0) {
        if (!playlistIdentifier.includes('https://echo360.org/section/') || !playlistIdentifier.includes('/public')) {
          setIsValidPlID('')
          return;
        }
      }
      
      api.createPlaylist({
        name, sourceType, playlistIdentifier: validPlID, offeringId
      })
        .then(() => window.location = util.links.offering(offeringId))
    },
    onUpdate: () => {
      api.updatePlaylist({
        name, sourceType, playlistIdentifier, offeringId, id
      })
        .then(() => callBacks.onClose())
    },
    onDelete: () => {
      api.deletePlaylist(id)
        .then(() => window.location = util.links.offering(offeringId))
    },
    onClose: () => {
      history.goBack()
    },
    onCancel: () => {
      history.goBack()
    }
  }

  const handlePlIDInput = ({target: {value}}) => {
    setPlaylistIdentifier(value)
    if (!isValidPlID) {
      if (sourceType === 1) {
        const { list } = util.parseSearchQuery(playlistIdentifier)
        if (list) {
          setIsValidPlID('valid')
        } 
      } else if (sourceType === 0) {
        if (playlistIdentifier.includes('https://echo360.org/section/') && playlistIdentifier.includes('/public')) {
          setIsValidPlID('valid')
        }
      }
    }
  }

  const header = isNew ? 'New Playlist' : 'Rename the Playlist'
  const modalSize = isNew ? 'small' : 'tiny'
  const urlEntered = sourceType === 2 || playlistIdentifier
  const button = isNew ? 
    <SaveButtons 
      {...callBacks}
      canSave={name && urlEntered}
    />
    : 
    <EditButtons 
      {...callBacks}
      canDelete={name}
      canSave={name}
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
        name={name}
        setName={setName}
        sourceType={sourceType}
        setSourceType={setSourceType}
        playlistIdentifier={playlistIdentifier}
        handlePlIDInput={handlePlIDInput}
        isValidPlID={isValidPlID}
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
          For Example<br/>
          <span className="link">https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3</span>
        </p>
      } 
      trigger={<span> PLAYLIST URL </span>} 
    />
    of your YouTube Playlist
  </p>,
  <p>
    <strong><Icon name='video play'/> {api.playlistTypes[0].name}:<br/></strong>
    Enter the 
    <Popup 
      content={
        <p>
          For Example<br/>
          <span className="link">https://echo360.org/section/59cc95a1-b088-46e3-80a3-7e3c6921a40f/public</span>
        </p>
      } 
      trigger={<span> ACCESS LINK </span>} 
    />
    of your Echo360 course
  </p>
]

/**
 * Form Component
 * @todo need to add type selection
 */
function PlaylistForm({isNew, loading, name, setName, sourceType, setSourceType, playlistIdentifier, handlePlIDInput, isValidPlID}) {
  const playlistTypeOptions = util.getSelectOptions(api.playlistTypes)
  const isCreating = isValidPlID === 'creating'
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
                value={name}
                onChange={({target: {value}}) => setName(value)}
                loading={isCreating}
                disabled={isCreating}
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
                  value={sourceType}
                  options={playlistTypeOptions}
                  onChange={(event, {value})=> setSourceType(value)}
                  loading={isCreating}
                  disabled={isCreating}
                />
              </Grid.Column>
            </Grid.Row>
            </>
          }
          {
            (isNew && sourceType !== 2)
            &&
            <Grid.Row>
              <Grid.Column>
                <Form.Field
                  fluid required
                  id='playlist-url'
                  control={Input}
                  value={playlistIdentifier}
                  label={sourceType === 0 ? 'Access Link' : 'Playlist Identifier'}
                  placeholder={sourceType === 0 ? 'Enter the course ACCESS LINK here...' : 'Enter your playlist identifier here ...'}
                  onChange={handlePlIDInput}
                  error={!isValidPlID}
                  loading={isCreating}
                  disabled={isCreating}
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
