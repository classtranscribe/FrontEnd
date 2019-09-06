/**
 * The Content of the Watch page
 * - including Players, settingbar, and transcription window
 */

import React from 'react'
import $ from 'jquery'
// UI
import { Spinner } from 'react-bootstrap'
import SubHeader from './SubHeader'
import ClassTranscribePlayer from './ClassTranscribePlayer'
import Transcription from './Transcription'
import './index.css'
// Vars
import { NORMAL_MODE, PS_MODE, /* EQUAL_MODE, NESTED_MODE */ } from './constants'
import { api, handleData } from 'utils'
import { findCurrLine, timeStrToSec, handleExpand } from './watchUtils'

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
      loadingCaptions: true,
      captions: [],

      // true if need to prevent caption sync scrolling
      readyToEdit: false,
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', ({keyCode, metaKey, ctrlKey, shiftKey}) => {
      if (!metaKey && !ctrlKey) return;
      // cmd/ctrl + 'U' == expand transcription container
      if (keyCode === 85) handleExpand()
      // shift + cmd/ctrl + space == search captions
      if (shiftKey && keyCode === 32) { 
        let alreadyFocused = $('#caption-search:focus').length
        if (alreadyFocused) $('#caption-search').blur()
        else $('#caption-search').focus()
      }
    })
  }

  componentDidUpdate(prevProps) {
    const { media } = this.props
    /** If media is loaded, set screen mode and get transcriptions */
    if (prevProps.media !== media) {
      // console.log('media', media)
      if (media.isTwoScreen) this.setState({ mode: PS_MODE })
      if (media.transcriptions) {
        const defaultTrans = handleData.find(media.transcriptions, {language: 'en-US'})
        if (!defaultTrans) return this.setState({ captions: ['NO CAPTIONS'], loadingCaptions: false })
        this.getCaptionsByTranscriptionId(defaultTrans.id)
      }
    }
  }

  /** Function for getting captions based on current transcription id */
  getCaptionsByTranscriptionId = id => {
    this.setState({ currTranscriptionId: id })
    api.getCaptionsByTranscriptionId(id)
      .then( ({data}) => {
        // console.log('captions', data)
        this.setState({ captions: data, loadingCaptions: false })
      })
  }

  /** Function for reloading captions, called before editing captions */
  reLoadCaption = callBack => {
    const { currTranscriptionId } = this.state
    api.getCaptionsByTranscriptionId(currTranscriptionId)
      .then( ({data}) => {
        // console.log('new captions', data)
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
  setPlaybackRate = playbackRate => {
    this.setState({ playbackRate })
  }
  /** Function called when transcription of videos changed */
  setTrackSrc = trackSrc => {
    if (trackSrc === this.state.trackSrc) return;
    this.setState({ trackSrc })
    const { media } = this.props
    let currTranscription = handleData.find(media.transcriptions, { src: trackSrc })
    if (currTranscription) this.getCaptionsByTranscriptionId(currTranscription.id)
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
        target.parentNode.scrollTop = document.pictureInPictureElement ? target.offsetTop - 200 : target.offsetTop - 50
    }
  }

  render() {
    const { media, playlist, sendUserAction } = this.props
    const { mode, primary, captions, loadingCaptions } = this.state
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
          propsForSettingBar={propsForSettingBar}
        />
  
        <div className={`player-container ${orderClassName}`} id={mode}>
          <div className="loading-wrapper">
            <Spinner animation="border" />
            {/* <div class="lds-facebook"><div></div><div></div><div></div></div> */}
          </div>
          <div className="video-col">
            <ClassTranscribePlayer 
              {...this}
              {...this.state}
              media={media} 
              isPrimary={primary} 
              sendUserAction={sendUserAction}
              video1
            />
          </div>
          <div className="video-col" >
            <ClassTranscribePlayer 
              {...this}
              {...this.state}
              media={media} 
              isPrimary={!primary}  
              sendUserAction={sendUserAction}
            />
          </div>
        </div>
  
        <Transcription 
          media={media}
          captions={captions} 
          setCurrTime={this.setCurrTime}
          reLoadCaption={this.reLoadCaption}
          setReadyToEdit={this.setReadyToEdit} 
          loadingCaptions={loadingCaptions}
          sendUserAction={sendUserAction}
        />
      </div>
    )
  }  
  
}