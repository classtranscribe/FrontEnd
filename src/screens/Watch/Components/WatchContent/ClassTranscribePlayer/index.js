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
import { api } from 'utils'
import { staticVJSOptions, keyDownPlugin, getControlPlugin, captionLangMap } from './CTPlayerUtils'
const tempPoster = require('images/tempPoster.png') // should be removed after having the real poster

export default class ClassTranscribePlayer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    const { isPrimary, play, media, video1, currTime, playbackRate, trackSrc } = this.props
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

      this.player = videojs(this.videoNode, videoJsOptions, function onPlayerReady() {
        this.prevTime = 0
        this.isPrimary = isPrimary
      })
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
        if (prevProps.play !== play) { // if the 'play' changed in isPrimary
          if (play) this.player.play()
          else this.player.pause()
        }
        if (prevProps.currTime !== currTime) { // if the 'seeking' changed in isPrimary
          this.player.currentTime(currTime)
        }
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
      <div className="ct-player">
        <div className={type} onClick={switchTrigger} id={mode}>
          <div data-vjs-player>
            <video ref={ node => this.videoNode = node } className="video-js">
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