import React, { useState, useEffect } from 'react'
import { GeneralModal, GeneralLoader } from '../../../components'
import { Grid, Form, Input } from 'semantic-ui-react'
import { EditButtons } from './buttons'
// Vars
import { api, handleData } from '../../../util'

export function VideoEditingPage ({match: {params: {id}}, history}) {
  const path = '??'
  console.log(id)
  const [video, setVideo] = useState(null)
  const [videoInfo, setVideoInfo] = useState(video)

  useEffect(()=> {
    // api.getData(path, id)
    // .then( response => {
    //   setVideo(response.data)
    //   setVideoInfo(response.data)
    // })
  }, [])

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

function VideoForm({videoInfo, setVideoInfo}) {
  return (
    <Form className="ap-form">
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
