/**
 * Edit Video Page
 * sub page for editing a video info, i.e. name
 */

import React, { useState, useEffect } from 'react'
// Layouts
import { GeneralModal, GeneralLoader } from 'components'
import { Grid, Form, Input } from 'semantic-ui-react'
import { EditButtons } from './Buttons'
// Vars
import { api, handleData } from 'utils'

/**
 * @param id videoId
 * @param history for goBack
 */
export function VideoEditing ({match: {params: {id}}, history}) {
  const [filename, setFilename] = useState('')

  /**
   * GET all the needed info based on the videoId
   */
  useEffect(()=> {
    api.contentLoaded()
    // api.getData(path, id)
    // .then( response => {
    //   setVideo(response.data)
    //   setVideoInfo(response.data)
    // })
  }, [])

  /**
   * Functions for http requests
   */
  const callBacks = {
    onUpdate: function (name) {
      setFilename(name)
    },
    onDelete: function () {
      // api.deleteData(path, id).then(() => this.onClose())
    },
    onClose: function () {
      history.goBack()
    }
  }

  const header = 'Rename the Video'
  const button = 
    (<EditButtons 
      {...callBacks}
      onCancel={callBacks.onClose}
      canDelete
      canSave={filename}
    />)

  return(
    <GeneralModal 
      header={header}
      open={true} size='tiny'
      onClose={callBacks.onClose}
      button={button}
    >
      <VideoForm 
        filename={filename}
        {...callBacks}
      />
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
        filename ? 
        <Grid columns='equal' verticalAlign="middle">
          <Grid.Row >
            <Grid.Column>
              <Form.Field
                fluid required
                id='paylist-description'
                control={Input}
                label='Video Name'
                placeholder='E.g. Lecture 1'
                value={filename}
                onChange={({target: {value}})=> onUpdate(value)}
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
