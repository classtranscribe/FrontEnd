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
import { findCurrLine, timeStrToSec, addCaptionKeyDownListener } from './watchUtils'

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

      // true if need to prevent caption sync scrolling
      readyToEdit: false,
    }
  }

  componentDidUpdate(prevProps) {
    const { media } = this.props
    /** If media is loaded, set screen mode and get transcriptions */
    if (prevProps.media !== media) {
      if (media.isTwoScreen) this.setState({ mode: PS_MODE })
      if (media.transcriptions) {
        this.getCaptionsByTranscriptionId(media.transcriptions[0].id)
      }
      addCaptionKeyDownListener()
    }
  }

  /** Function for getting captions based on current transcription id */
  getCaptionsByTranscriptionId = id => {
    this.setState({ currTranscriptionId: id })
    api.getCaptionsByTranscriptionId(id)
      .then( ({data}) => {
        console.log('captions', data)
        this.setState({ captions: data })
      })
  }

  /** Function for reloading captions, called before editing captions */
  reLoadCaption = callBack => {
    const { currTranscriptionId } = this.state
    api.getCaptionsByTranscriptionId(currTranscriptionId)
      .then( ({data}) => {
        console.log('new captions', data)
        this.setState({ captions: data })
        if (callBack) callBack()
      })
  }

  /** Function called when mouseEnter and mouseLeave the caption window */
  setReadyToEdit = value => {
    value = typeof value === "boolean" ? value : !this.state.readyToEdit
    this.setState({ readyToEdit: value })
  }

  /** Functions for switching screens */
  switchScreen = () => this.setState({ primary: !this.state.primary })
  switchToPrimary = () => this.setState({ primary: true })
  switchToSecondary = () => this.setState({ primary: false })

  /** Function for setting screen mode */
  setMode = mode => this.setState({ mode })

  /** Function called when playbackRate of videos changed */
  setPlaybackRate = playbackRate => this.setState({ playbackRate })

  /** Function called when transcription of videos changed */
  setTrackSrc = trackSrc => {
    this.setState({ trackSrc })
    const { media } = this.props
    let currTranscription = handleData.find(media.transcriptions, { src: trackSrc })
    this.getCaptionsByTranscriptionId(currTranscription.id)
  }

  /** Function called when the video is seeking */
  setCurrTime = (e, time) => {
    let currTime = time || e.target.currentTime
    // console.log(currTime)
    $("video").each( (index, videoElem) => {
      if (time || e.target !== videoElem) videoElem.currentTime = currTime
    })
  }

  /** Function called when video timeupdate in order to sync the caption scrolling */
  setTimeUpdate = time => {
    const currLine = findCurrLine(time, this)
    if (!currLine) return;
    if (this.lastCaptionIndex && this.lastCaptionIndex === currLine.index) return;
    // console.log(handleData.timeBetterLook(currLine.begin))
    let prevTarget = $('.curr-line')
    prevTarget.removeClass('curr-line')
    let target = document.getElementById(`line-${currLine.index}`)
    if (target) {
      this.lastCaptionIndex = currLine.index-1
      this.lastEnd = timeStrToSec(currLine.end)
      target.classList.add('curr-line')
      if (!this.state.readyToEdit)
        target.parentNode.scrollTop = target.offsetTop - 50
    }
  }

  render() {
    const { media, playlist, courseNumber } = this.props
    const { mode, primary, captions } = this.state
    const orderClassName = primary ? '' : 'switch-player'
    /** Vars passed into setting bar */
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