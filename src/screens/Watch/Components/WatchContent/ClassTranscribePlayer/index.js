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
import { staticVJSOptions, keyDownPlugin, getControlPlugin } from './CTPlayerUtils'
const tempPoster = require('images/tempPoster.png') // should be removed after having the real poster

export default class ClassTranscribePlayer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    const { primary, play, media, video1, currTime, playbackRate, trackSrc } = this.props
    /**
     * Register videojs after the media is loaded
     */
    if (prevProps.media !== media) {
      const { videos } = media
      const srcPath = api.getMediaFullPath(videos[0].video1.path)
      const videoJsOptions = {
        ...staticVJSOptions,
        controls: primary, // only the primary video player has the controls
        muted: !video1,    // only the primary player has the audio
        sources: [{               
          src: video1 ? srcPath : 'https://sysprog.ncsa.illinois.edu:4443/Data/temp486a182e-39b7-4099-aacf-86e68e17d477_mrb.mp4',
          type: 'video/mp4'       // test the two video mode, should be removed in the future
        }],
        poster: tempPoster,
      }
 
      // Registering Plugins
      const controlPlugin = getControlPlugin(this.props)
      videojs.registerPlugin('controlPlugin', controlPlugin) // plugin for mouse controls
      videojs.registerPlugin('keyDownPlugin', keyDownPlugin) // plugin for keyboard controls

      this.player = videojs(this.videoNode, videoJsOptions, function onPlayerReady() {console.log('ready')})
    }

    if (this.player) {
      /**
       * If Switching happened...
       */
      if (prevProps.primary !== primary) { 
        /**
         * 1. Switch the controls to current primary player
         */
        this.player.controls(primary)
        /**
         * 2. Switch transcription to the current primary player 
         */
        if (trackSrc) {
          // Find the current showing transcription
          const currTrack = this.player.textTracks().tracks_.filter(track => track.src === trackSrc)
          // Give it to the curr primary one
          if (currTrack.length && primary) setTimeout(() => {
            currTrack[0].mode = 'showing'
          }, 300)
          // Remove it from the curr secondary one
          if (currTrack.length && !primary) currTrack[0].mode = 'disabled'
        }
      }
      /**
       * If it is the secondary player, sync with the primary one...
       */
      if (!primary) {
        if (prevProps.play !== play) { // if the 'play' changed in primary
          if (play) this.player.play()
          else this.player.pause()
        }
        if (prevProps.currTime !== currTime) { // if the 'seeking' changed in primary
          this.player.currentTime(currTime)
        }
        if (prevProps.playbackRate !== playbackRate) { // if the 'playbackrate' changed in primary
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
    const { primary, video1, switchToPrimary, switchToSecondary, media, mode } = this.props
    const { transcriptions } = media
    if (!transcriptions) return null
    /**
     * Handle player switching
     */
    var size = primary ? 'primary' : 'secondary'
    var id = primary ? 'primary' : 'secondary'
    
    const switchTrigger = video1 ? switchToPrimary : switchToSecondary

    return (
      <div className="ct-player" id={size + mode}>
        <div className={`${size} ${mode}`} onClick={switchTrigger}>
          <div data-vjs-player>
            <video ref={ node => this.videoNode = node } className="video-js" id={size+"-video"}>
              {transcriptions.map( trans => 
                  <track kind="captions" src={api.baseUrl()+trans.file.path} key={trans.id} srclang="en" label="English" />
              )}
            </video>
          </div>          
        </div>
      </div>
    )
  }
}