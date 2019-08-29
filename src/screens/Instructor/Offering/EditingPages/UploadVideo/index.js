/**
 * Upload Video Page
 */

import React, { useState } from 'react'
// Layouts
import { GeneralModal } from 'components'
import { Grid, Form } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { SaveButtons } from '../Buttons'
import UploadBtn from './UploadBtn'
import './index.css'
// Vars
import { api, util } from 'utils'

export function UploadVideo({match: {params: { playlistId }}, history}) {
  // original video data
  const [videos, setVideos] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [creatingIndex, setCreatingIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const onUploadProgress = progressEvent => {
    let percentCompleted = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
    setProgress(percentCompleted)
  }
  /**
   * Functions for http requests
   */
  const callBacks = {
    onUpload: function(videoFiles) {
      if (videoFiles.length > 2) return;
      setVideos(videos => [...videos, {video1: videoFiles[0], video2: videoFiles[1]}])
    },
    onSwitch: function(index) {
      let temp = videos[index].video1
      videos[index].video1 = videos[index].video2
      videos[index].video2 = temp
      setVideos(() => videos)
    },
    onRemove: function(index) {
      videos[index] = null
      setVideos(() => videos)
    },
    onClose: function () {
      history.goBack()
    },
    onCreate: async function () {
      setIsCreating(true)
      for (let i = 0; i < videos.length; i++) {
        if (!videos[i]) continue;
        setCreatingIndex(i)
        const { video1, video2 } = videos[i]
        await api.uploadVideo(playlistId, video1, video2, onUploadProgress)
      }
      setCreatingIndex(videos.length)
      setTimeout(() => {
        window.location = util.getWindowStates().goBackURL
      }, 700);
    }
  }
  
  const canSave = () => {
    if (!videos.length) return false
    for (let i = 0; i < videos.length; i++) {
      if (videos[i] !== null) return true
    }
    return false
  }

  const button = isCreating ? null :
    (<SaveButtons 
      {...callBacks}
      onCancel={callBacks.onClose}
      canSave={canSave()}
    />)

  return(
    <GeneralModal 
      open={true} size="small"
      onClose={isCreating ? null : callBacks.onClose}
      button={button}
    >
      {
        !isCreating
        &&
        <div className="upload-video">
          <p className="description" id="upload-guide">
            <i className="material-icons">picture_in_picture_alt</i>&emsp;
            For each lecture you can upload either one video or a pair of synchronized videos
          </p>
          <UploadForm {...callBacks} />
          {videos.map( (videoPair, index) => (
            videoPair ? <UploadedVideoPair key={videoPair.video1.name + index} videoPair={videoPair} index={index} {...callBacks} /> : null
          ))}
        </div>
      }
      {
        isCreating
        &&
        <div className="uploading">
          {videos.map( (videoPair, index) => videoPair ? (
            <div className="uploading-video">
              <div>{videoPair.video1.name}</div>
              {videoPair.video2 && <div>{videoPair.video2.name}</div>}
              <div className="status">{creatingIndex < index ? 'Waiting' : creatingIndex > index ? <i className="material-icons">done_outline</i> : progress+'%'/*<Spinner variant="info" animation="border" />*/}</div>
            </div>
          ) : null )}
        </div>
      }
    </GeneralModal>
  )
}

/**
 * Form Component
 */
function UploadForm({ onUpload }) {
  return (
    <Form className="upload-form">
      <Grid columns='equal' verticalAlign="middle">
        <Grid.Row>
          <Grid.Column>
            <h4>
              Upload Video<br/>
              <span className="description">Upload either one video or a pair of videos each time</span>
            </h4>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <UploadBtn onUpload={onUpload} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  )
}

function UploadedVideoPair({ videoPair, index, onSwitch, onRemove }) {
  const [video1, setVideo1] = useState(videoPair ? videoPair.video1 : {})
  const [video2, setVideo2] = useState(videoPair ? videoPair.video2 : {})
  const [isRemoved, setIsRemoved] = useState(false)
  const handleSwitch = () => {
    let temp = video1
    setVideo1(video2)
    setVideo2(temp)
    onSwitch(index)
  }

  const handleRemove = () => {
    onRemove(index)
    setIsRemoved(true)
  }

  return isRemoved ? null : (
    <div className="video-pair">
      <div className="video1" id={video2 ? 'two-video' : 'one-video' }>{video1.name}</div>
      {
        video2 
        && 
        <button className="switch" onClick={handleSwitch} title="Switch" aria-label="Switch">
          <span tabIndex="-1"><i className="material-icons">compare_arrows</i></span>
        </button>
      }
      {video2 && <div className="video2">{video2.name}</div>}
      <button className="delete" onClick={handleRemove} title="Delete" aria-label="Delete">
        <span tabIndex="-1"><i className="material-icons">delete</i></span>
      </button>
    </div>
  )
}
