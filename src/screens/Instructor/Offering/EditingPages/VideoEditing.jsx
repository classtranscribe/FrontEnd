/**
 * Edit Video Page
 * sub page for editing a video info, i.e. name
 */

import React, { useState, useEffect } from 'react'
// Layouts
import { GeneralModal, GeneralLoader } from 'components'
import { Grid, Form, Input } from 'semantic-ui-react'
import { SaveButtons } from './Buttons'
// Vars
import { api } from 'utils'

/**
 * @param id videoId
 * @param history for goBack
 */
export function VideoEditing ({match: {params: { mediaId }}, history}) {
  const [filename, setFilename] = useState('undefined')

  /**
   * GET all the needed info based on the videoId
   */
  useEffect(()=> {
    api.getMediaById(mediaId)
      .then( ({data}) => {
        const { mediaName } = api.parseMedia(data)
        setFilename(mediaName)
      })
  }, [])

  /**
   * Functions for http requests
   */
  const callBacks = {
    onUpdate: ({target: {value}}) => {
      setFilename(value)
    },
    onCreate: function () {
      setFilename('undefined')
      api.renameMedia(mediaId, filename)
        .then(() => history.goBack())
    },
    onClose: function () {
      history.goBack()
    }
  }

  const header = 'Rename the Video'
  const button = <SaveButtons {...callBacks} onCancel={callBacks.onClose} canSave={filename && filename !== 'undefined'}/>

  return(
    <GeneralModal 
      header={header}
      open={true} size='tiny'
      onClose={callBacks.onClose}
      button={button}
    >
      <VideoForm {...callBacks} filename={filename} />
    </GeneralModal>
  )
  
}

/**
 * Form Component
 */
function VideoForm({filename, onUpdate}) {
  return (
    <Form className="general-form">
      {
        filename !== 'undefined' ? 
        <Grid columns='equal' verticalAlign="middle">
          <Grid.Row >
            <Grid.Column>
              <Form.Field
                fluid required
                id='media-name'
                control={Input}
                label='Name'
                placeholder='E.g. Lecture 1'
                value={filename}
                onChange={onUpdate}
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
