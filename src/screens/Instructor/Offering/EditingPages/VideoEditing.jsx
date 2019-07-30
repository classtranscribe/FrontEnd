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
  const path = '??' // TBD
  console.log(id)

  // original video data
  const [video, setVideo] = useState(api.initialData.initialVideo)
  // videoInfo for recording inputs
  const [videoInfo, setVideoInfo] = useState(video)

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
    onUpdate: function () {
      var data = handleData.updateJson(videoInfo, video)
      data.id = id
      console.log(data)
      // api.updateData(path, data, () => this.onClose())
    },
    onDelete: function () {
      api.deleteData(path, id, () => this.onClose())
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
      canDelete={videoInfo}
      canSave={videoInfo && videoInfo.description}
    />)

  return(
    <GeneralModal 
      header={header}
      open={true} size='tiny'
      onClose={callBacks.onClose}
      button={button}
    >
      <VideoForm 
        videoInfo={videoInfo}
        setvideoInfo={setVideoInfo}
      />
    </GeneralModal>
  )
  
}

/**
 * Form Component
 */
function VideoForm({videoInfo, setVideoInfo}) {
  return (
    <Form className="general-form">
      {
        videoInfo ? 
        <Grid columns='equal' verticalAlign="middle">
          <Grid.Row >
            <Grid.Column>
              <Form.Field
                fluid required
                id='paylist-description'
                control={Input}
                label='Video Name'
                placeholder='E.g. Lecture 1'
                defaultValue={videoInfo.description}
                onChange={({target: {value}})=> setVideoInfo({...videoInfo, description: value})}
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
