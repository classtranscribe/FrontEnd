/**
 * Upload Video Page
 */

import React, { useState } from 'react'
// Layouts
import { GeneralModal, GeneralLoader } from 'components'
import { Grid, Form, Input } from 'semantic-ui-react'
import { SaveButtons } from '../Buttons'
import UploadBtn from './UploadBtn'
import './index.css'
// Vars
import { api } from 'utils'

/**
 * @param id videoId
 * @param history for goBack
 */
export function UploadVideo({match: {params: {playlistId}}, history}) {
  // original video data
  const [video, setVideo] = useState({ video1Name: '', video2Name: '', video1: null, video2: null })
  /**
   * Functions for http requests
   */
  const callBacks = {
    onChange: function(key, value) {
      setVideo(prevVideo => ({...prevVideo, [key]: value}))
    },
    onClose: function () {
      history.goBack()
    }
  }

  const button = 
    (<SaveButtons 
      {...callBacks}
      onCancel={callBacks.onClose}
      canDelete={true}
      canSave={true}
    />)

  return(
    <GeneralModal 
      open={true} size="small"
      onClose={callBacks.onClose}
      button={button}
    >
      <UploadForm 
        video={video}
        onChange={callBacks.onChange}
      />
    </GeneralModal>
  )
}

/**
 * Form Component
 */
function UploadForm({video, onChange}) {
  const videoForms = [
    {title: 'Primary Video', name: 'Video1Name'},
    {title: 'Secondary Video (Optional)', name: 'Video2Name'}
  ]
  return (
    <Form className="upload-form">
      <Grid columns='equal' verticalAlign="middle">
        {videoForms.map( videoForm => (
          <>
          <Grid.Row>
            <Grid.Column>
              <h4>{videoForm.title}</h4>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid required
                control={Input}
                label='Name'
                placeholder='Name'
                value={video[videoForm.name]}
                onChange={({target: {value}}) => onChange(videoForm.name, value)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <UploadBtn video1 />
            </Grid.Column>
          </Grid.Row>
          </>
        ))}
      </Grid>
    </Form>
  )
}
