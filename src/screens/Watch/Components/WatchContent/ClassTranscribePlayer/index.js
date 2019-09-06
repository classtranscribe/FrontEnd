/**
 * The Player which supports different screen modes
 */

import React from 'react'
import videojs from 'video.js'
// UI
import 'video.js/dist/video-js.css'
import './video.css' // modified stylesheet for the vjs player
import './index.css'
// Vars
import { util } from 'utils'
import { staticVJSOptions, keyDownPlugin, getControlPlugin, captionLangMap, ctVideo } from './CTPlayerUtils'
// const tempPoster = require('images/tempPoster.png') // should be removed after having the real poster

export default class ClassTranscribePlayer extends React.Component {
  constructor(props) {
    super(props)
    this.prevTime = 0
    this.lastSyncTime = 0
    this.lastTimeupdate = 0
    ctVideo.setSendUserAction(props.sendUserAction)
  }

  componentDidUpdate(prevProps) {
    const { isPrimary, media, video1, playbackRate, trackSrc } = this.props
    /**
     * Register videojs after the media is loaded
     */
    if (prevProps.media !== media) {
      const { videos, isTwoScreen } = media
      if (!video1 && !isTwoScreen) return;
      const { srcPath1, srcPath2 } = videos[0]
      const videoJsOptions = {
        ...staticVJSOptions,
        controls: isPrimary, // only the isPrimary video player has the controls
        muted: !isPrimary,    // only the isPrimary player has the audio
        sources: [{               
          src: video1 ? srcPath1 : srcPath2,
          type: 'video/mp4'       // test the two video mode, should be removed in the future
        }],
        // poster: tempPoster,
      }
 
      // Registering Plugins
      const controlPlugin = getControlPlugin(this.props)
      videojs.registerPlugin('controlPlugin', controlPlugin) // plugin for mouse controls
      videojs.registerPlugin('keyDownPlugin', keyDownPlugin) // plugin for keyboard controls

      this.player = videojs(this.videoNode, videoJsOptions, function onPlayerReady() {
        const iniTime = util.parseSearchQuery().begin
        if (iniTime) this.currentTime(iniTime)
        ctVideo.setVideoLoading(false)
      })
    }

    if (this.player) {
      /** If Switching happened... */
      if (prevProps.isPrimary !== isPrimary) { 
        /** Switch the controls to current isPrimary player */
        this.player.controls(isPrimary)
        /** Switch transcription to the current isPrimary player */
        if (trackSrc) {
          // Find the current showing transcription
          const currTrack = this.player.textTracks().tracks_.filter(track => track.src === trackSrc)
          // Give it to the curr isPrimary one
          if (currTrack.length && isPrimary) currTrack[0].mode = 'showing'
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

  onTimeUpdate = e => {
    if (!this.props.isPrimary) return;
    let currTime = e.target.currentTime
    // console.log(this.prevTime)
    if (Math.abs(currTime - this.prevTime) > 1 ) {
      this.props.setTimeUpdate(currTime)
      this.prevTime = currTime
    }
    // if (Math.abs(currTime - this.lastSyncTime) > 5 ) {
    //   this.props.setCurrTime(e)
    //   this.lastSyncTime = currTime
    // }
    /** sent user action events to backend */
    if (Math.abs(currTime - this.lastTimeupdate) > 15 ) {
      this.props.sendUserAction('timeupdate', { timeStamp: currTime })
      this.lastTimeupdate = currTime
    }
  }

  onLoaded = e => {
    ctVideo.onLoaded(e)
  }

  onPause = e => {
    ctVideo.onPause(e, this.props.isPrimary)
  }

  onPlay = e => {
    ctVideo.onPlay(e, this.props.isPrimary)
  }

  onSeeking = e => {
    ctVideo.onSeeking(e, this.props.isPrimary)
  }

  onSeeked = e => {
    ctVideo.onSeeked(e, this.props.isPrimary)
  }

  onWaiting = e => {
    ctVideo.onWaiting(e)
  }

  onPlaying = e => {
    ctVideo.onPlaying(e)
  }

  ref = player => {
    this.player = player
  }

  render() {
    const { isPrimary, video1, switchToPrimary, switchToSecondary, media, mode } = this.props
    const { transcriptions, isTwoScreen } = media
    if (!transcriptions || (!video1 && !isTwoScreen)) return null
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
              preload="metadata"
              onPause={this.onPause}
              onPlay={this.onPlay}
              onSeeking={this.onSeeking}
              onSeeked={this.onSeeked}
              onWaiting={this.onWaiting}
              onPlaying={this.onPlaying}
              onTimeUpdate={isPrimary ? this.onTimeUpdate : undefined}
              onLoadedMetadata={this.onLoaded}
            >
              {transcriptions.map( trans => 
                <track 
                  key={trans.id}
                  kind="captions" 
                  label={captionLangMap[trans.language]}
                  srcLang={trans.language} 
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