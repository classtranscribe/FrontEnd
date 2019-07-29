/**
 * The Player which supports different screen modes
 */

import React from 'react'
import $ from 'jquery'
import videojs from 'video.js'
// UI
import 'video.js/dist/video-js.css'
import './video.css' // modified stylesheet for the vjs player
import './index.css'
// Vars
import { api } from 'utils'
import { staticVJSOptions, keyDownPlugin, getControlPlugin, captionLangMap } from './CTPlayerUtils'
const tempPoster = require('images/tempPoster.png') // should be removed after having the real poster

export default class ClassTranscribePlayer extends React.Component {
  constructor(props) {
    super(props)
    this.prevTime = 0
    this.lastSyncTime = 0
  }

  componentDidUpdate(prevProps) {
    const { isPrimary, media, video1, playbackRate, trackSrc } = this.props
    /**
     * Register videojs after the media is loaded
     */
    if (prevProps.media !== media) {
      const currVideo = media.videos[0]
      const srcPath1 = api.getMediaFullPath(currVideo.video1.path)
      const srcPath2 = media.isTwoScreen ? api.getMediaFullPath(currVideo.video2.path) : null
      const videoJsOptions = {
        ...staticVJSOptions,
        controls: isPrimary, // only the isPrimary video player has the controls
        muted: !isPrimary,    // only the isPrimary player has the audio
        sources: [{               
          src: video1 ? srcPath1 : srcPath2,
          type: 'video/mp4'       // test the two video mode, should be removed in the future
        }],
        poster: tempPoster,
      }
 
      // Registering Plugins
      const controlPlugin = getControlPlugin(this.props)
      videojs.registerPlugin('controlPlugin', controlPlugin) // plugin for mouse controls
      videojs.registerPlugin('keyDownPlugin', keyDownPlugin) // plugin for keyboard controls

      this.player = videojs(this.videoNode, videoJsOptions, function onPlayerReady() {})
    }

    if (this.player) {
      /**
       * If Switching happened...
       */
      if (prevProps.isPrimary !== isPrimary) { 
        /**
         * 1. Switch the controls to current isPrimary player
         */
        this.player.controls(isPrimary)
        /**
         * 2. Switch transcription to the current isPrimary player 
         */
        if (trackSrc) {
          // Find the current showing transcription
          const currTrack = this.player.textTracks().tracks_.filter(track => track.src === trackSrc)
          // Give it to the curr isPrimary one
          if (currTrack.length && isPrimary) setTimeout(() => {
            currTrack[0].mode = 'showing'
          }, 300)
          // Remove it from the curr secondary one
          if (currTrack.length && !isPrimary) currTrack[0].mode = 'disabled'
        }
        /**
         * Switch the audio controls
         */
        if (isPrimary) this.player.muted(false)
        else this.player.muted(true)
      }
      /**
       * If it is the secondary player, sync with the isPrimary one...
       */
      if (!isPrimary) {
        if (prevProps.playbackRate !== playbackRate) { // if the 'playbackrate' changed in isPrimary
          this.player.playbackRate(playbackRate)
        }
      }
    }
  }

  componentWillUnmount() {
    // Dispose the player when the node is unmounted
    if (this.player) {
      this.player.dispose()
    }
  }

  syncPlay = e => {
    if (!this.props.media.isTwoScreen) return;
    let a = $("video")
    for (let i = 0; i < a.length; i++) {
      if (e.target !== a[i]) a[i].play()
    }
  }
  syncPause = e => {
    if (!this.props.media.isTwoScreen) return;
    let a = $("video")
    for (let i = 0; i < a.length; i++) {
      if (e.target !== a[i]) a[i].pause()
    }
  }

  onTimeUpdate = e => {
    if (!this.props.isPrimary) return;
    let currTime = e.target.currentTime
    // console.log(this.prevTime)
    if (Math.abs(currTime - this.prevTime) > .5 ) {
      this.props.setTimeUpdate(currTime)
      this.prevTime = currTime
    }
    // if (Math.abs(currTime - this.lastSyncTime) > 10 ) {
    //   this.props.setCurrTime(e)
    //   this.lastSyncTime = currTime
    // }
  }

  onPause = e => {
    if (!this.props.isPrimary) return;
    this.syncPause(e)
  }

  onPlay = e => {
    if (!this.props.isPrimary) return;
    this.syncPlay(e)
  }

  onSeeking = e => {
    if (!this.props.isPrimary) return;
    this.props.setCurrTime(e)
  }

  onSeeked = e => {
    this.syncPlay(e)
  }

  onWaiting = e => {
    this.syncPause(e)
  }

  onPlaying = e => {
    this.syncPlay(e)
  }

  ref = player => {
    this.player = player
  }

  render() {
    const { isPrimary, video1, switchToPrimary, switchToSecondary, media, mode } = this.props
    const { transcriptions, isTwoScreen } = media
    if (!transcriptions) return null
    /**
     * Handle player switching
     */
    var type = isPrimary ? 'primary' : 'secondary'    
    const switchTrigger = video1 ? switchToPrimary : switchToSecondary

    return (
      <div className="ct-player" id={mode}>
        <div className={type} onClick={switchTrigger} id={mode}>
          <div data-vjs-player>
            <video 
              ref={ node => this.videoNode = node } 
              className="video-js" 
              onTimeUpdate={this.onTimeUpdate}
              onPause={this.onPause}
              onPlay={this.onPlay}
              onSeeking={this.onSeeking}
              onSeeked={this.onSeeked}
              onWaiting={this.onWaiting}
              onPlaying={this.onPlaying}
            >
              {transcriptions.map( trans => 
                <track 
                  key={trans.id}
                  kind="captions" 
                  label={captionLangMap[trans.language]}
                  srclang={trans.language} 
                  src={trans.src} 
                />
              )}
            </video>
          </div>          
        </div>
      </div>
    )
  }
}