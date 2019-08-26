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
import { api, util } from 'utils'

export function UploadVideo({match: {params: {playlistId}}, history}) {
  // original video data
  const [video, setVideo] = useState({ video1Name: '', video2Name: '', video1: null, video2: null })
  const [video1, setVideo1] = useState(null)
  const [video2, setVideo2] = useState(null)
  /**
   * Functions for http requests
   */
  const callBacks = {
    onChange: function(key, value) {
      if (key === 'video1') setVideo1(value)
      else if (key === 'video2') setVideo2(value)
      else setVideo(prevVideo => ({...prevVideo, [key]: value}))
    },
    onClose: function () {
      history.goBack()
    },
    onCreate: function () {
      console.log({video1, video2})
      api.uploadVideo(playlistId, video1, video2)
        .then(({data}) => {
          console.log('success upload', data)
          callBacks.onClose()
        })
    }
  }
  
  const button = 
    (<SaveButtons 
      {...callBacks}
      onCancel={callBacks.onClose}
      canSave={video1}
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
    {title: 'Primary Video', name: 'video1Name'},
    {title: 'Secondary Video (Optional)', name: 'video2Name'}
  ]
  return (
    <Form className="upload-form">
      <Grid columns='equal' verticalAlign="middle">
        {videoForms.map( (videoForm, index) => (
          <>
          <Grid.Row>
            <Grid.Column>
              <h4>{videoForm.title}</h4>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <UploadBtn video1={index === 0} onUpload={onChange} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid 
                control={Input}
                label='Name'
                placeholder='Name'
                value={video[videoForm.name]}
                onChange={({target: {value}}) => onChange(videoForm.name, value)}
              />
            </Grid.Column>
          </Grid.Row>
          </>
        ))}
      </Grid>
    </Form>
  )
}
