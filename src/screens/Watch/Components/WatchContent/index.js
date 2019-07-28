/**
 * The Content of the Watch page
 * - including Players, settingbar, and transcription window
 */

import React from 'react'
import _ from 'lodash'
import $ from 'jquery'
// UI
import SubHeader from './SubHeader'
import ClassTranscribePlayer from './ClassTranscribePlayer'
import Transcription from './Transcription'
import './index.css'
// Vars
import { NORMAL_MODE, PS_MODE, /* EQUAL_MODE, NESTED_MODE */ } from './constants'
import { api, handleData } from 'utils'

function timeStrToSec(str) {
  const strs = str.split(':')
  return parseFloat(strs[0]) * 3600 + parseFloat(strs[1]) * 60 + parseFloat(strs[2])
}

export class WatchContent extends React.Component {
  constructor(props) {
    super(props) 
    this.lastCaptionIndex = 0
    this.state = {
      primary: true,
      mode: NORMAL_MODE,

      playbackRate: -1,
      trackSrc: '',

      captions: [],
      readyToEdit: false,
    }
  }

  componentDidUpdate(prevProps) {
    const { media } = this.props
    if (prevProps.media !== media) {
      if (media.isTwoScreen) this.setState({ mode: PS_MODE })
      if (media.transcriptions) {
        this.getCaptionsByTranscriptionId(media.transcriptions[0].id)
      }
    }
  }

  getCaptionsByTranscriptionId = id => {
    api.getCaptionsByTranscriptionId(id)
      .then( ({data}) => {
        console.log('captions', data)
        this.setState({ captions: data })
      })
  }

  switchScreen = () => this.setState({ primary: !this.state.primary })
  switchToPrimary = () => this.setState({ primary: true })
  switchToSecondary = () => this.setState({ primary: false })

  setMode = mode => this.setState({ mode })
  setReadyToEdit = () => this.setState({ readyToEdit: !this.state.readyToEdit })

  findCurrLine = (time) => {
    const { captions } = this.state
    if (!captions.length) return null
    for (let i = 0; i < captions.length; i++) {
      let line = captions[i]
      if (timeStrToSec(line.end) > time) return line
    }
    return captions[captions.length-1]
  }

  setTimeUpdate = time => {
    const currLine = this.findCurrLine(time)
    if (!currLine) return;
    if (this.lastCaptionIndex && this.lastCaptionIndex === currLine.index) return;
    console.log(currLine.text)
    let prevTarget = $('.curr-line')
    prevTarget.removeClass('curr-line')
    let target = document.getElementById(`line-${currLine.index}`)
    if (target) {
      this.lastCaptionIndex = currLine.index
      target.classList.add('curr-line')
      if (this.state.readyToEdit) return;
      target.parentNode.scrollTop = target.offsetTop - 60
    }
  }

  setPlaybackRate = playbackRate => this.setState({ playbackRate })
  setTrackSrc = trackSrc => {
    this.setState({ trackSrc })
    const { media } = this.props
    let currTranscription = handleData.find(media.transcriptions, { src: trackSrc })
    this.getCaptionsByTranscriptionId(currTranscription.id)
  }

  render() {
    const { media, playlist, courseNumber } = this.props
    const { mode, primary, captions } = this.state
    const orderClassName = primary ? '' : 'switch-player'
    const propsForSettingBar = {
      ...this,
      mode: mode,
      show: media.isTwoScreen
    }

    return (
      <div className="watch-content">
        <SubHeader 
          media={media} 
          playlist={playlist} 
          courseNumber={courseNumber} 
          propsForSettingBar={propsForSettingBar}
        />
  
        <div className={`player-container ${orderClassName}`} id={mode}>
          <div className="video-col">
            <ClassTranscribePlayer 
              {...this}
              {...this.state}
              media={media} 
              isPrimary={primary} 
              video1
            />
          </div>
  
          <div className="video-col" >
            <ClassTranscribePlayer 
              {...this}
              {...this.state}
              media={media} 
              isPrimary={!primary}  
            />
          </div>
        </div>
  
        <Transcription 
          captions={captions} 
          setReadyToEdit={this.setReadyToEdit} 
        />
      </div>
    )
  }  
  
}