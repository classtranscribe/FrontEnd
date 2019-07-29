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

export class WatchContent extends React.Component {
  constructor(props) {
    super(props) 
    this.lastCaptionIndex = 0
    this.lastEnd = 0
    this.state = {
      primary: true,
      mode: NORMAL_MODE,

      playbackRate: -1,
      trackSrc: '',

      currTranscriptionId: '',
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
    this.setState({ currTranscriptionId: id })
    api.getCaptionsByTranscriptionId(id)
      .then( ({data}) => {
        console.log('captions', data)
        this.setState({ captions: data })
      })
  }

  reLoadCaption = callBack => {
    const { currTranscriptionId } = this.state
    api.getCaptionsByTranscriptionId(currTranscriptionId)
      .then( ({data}) => {
        console.log('new captions', data)
        this.setState({ captions: data })
        if (callBack) callBack()
      })
  }

  switchScreen = () => this.setState({ primary: !this.state.primary })
  switchToPrimary = () => this.setState({ primary: true })
  switchToSecondary = () => this.setState({ primary: false })

  setMode = mode => this.setState({ mode })
  setReadyToEdit = () => this.setState({ readyToEdit: !this.state.readyToEdit })

  setCurrTime = (e, time) => {
    // if (!this.props.media.isTwoScreen) return;
    let currTime = time || e.target.currentTime
    // console.log(currTime)
    let a = $("video")
    for (let i = 0; i < a.length; i++) {
      if (time || e.target !== a[i]) a[i].currentTime = currTime
    }
  }

  findCurrLine = (time) => {
    const { captions } = this.state
    if (!captions.length) return null
    if (this.lastEnd === 0) return captions[0]

    if (this.lastEnd <= time) {
      for (let i = this.lastCaptionIndex; i < captions.length; i++) {
        let line = captions[i]
        if (handleData.timeStrToSec(line.end) > time) return line
      }
      return captions[captions.length-1]
    } else {
      for (let i = this.lastCaptionIndex; i >= 0; i--) {
        let line = captions[i]
        if (handleData.timeStrToSec(line.begin) <= time) return line
      }
      return captions[0]
    }
  }

  setTimeUpdate = time => {
    const currLine = this.findCurrLine(time)
    if (!currLine) return;
    if (this.lastCaptionIndex && this.lastCaptionIndex === currLine.index) return;
    // console.log(handleData.timeBetterLook(currLine.begin))
    let prevTarget = $('.curr-line')
    prevTarget.removeClass('curr-line')
    let target = document.getElementById(`line-${currLine.index}`)
    if (target) {
      this.lastCaptionIndex = currLine.index-1
      this.lastEnd = handleData.timeStrToSec(currLine.end)
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
          setCurrTime={this.setCurrTime}
          reLoadCaption={this.reLoadCaption}
          setReadyToEdit={this.setReadyToEdit} 
        />
      </div>
    )
  }  
  
}