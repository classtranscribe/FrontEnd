import React from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import './video.css'
import './index.css'
import { api } from '../../../../util'
const staticVJSOptions = require('./staticVJSOptions.json')

// ({primary, switchToPrimary, switchToSecondary, video1, id})
export default class CTPlayer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    // vars
    const { primary, play, media, video1, currTime, playbackRate } = this.props
    // Sync functions
    const { syncPlay, syncPause, setCurrTime, setPlaybackRate } = this.props

    /**
     * Register videojs after the media is loaded
     */
    if (prevProps.media !== media) {
      const videos = media.videos
      const srcPath = videos ? api.baseUrl() + videos[0].video1.path : ''
      console.log(srcPath)
      const videoJsOptions = {
        ...staticVJSOptions,
        controls: primary,
        muted: !video1,
        sources: [{
          src: video1 ? srcPath : 'https://sysprog.ncsa.illinois.edu:4443/Data/temp486a182e-39b7-4099-aacf-86e68e17d477_mrb.mp4',
          type: 'video/mp4'
        }],
        // poster: 'http://videojs.com/img/logo.png',
      }
      const setStateandFocusPlugin = function (options) {
        this.on('play', function (e) {
          syncPlay()
          console.log('play')
        })

        this.on('pause', function (e) {
          syncPause()
          console.log('pause')
        })

        this.on('seeking', function(e) {
          setCurrTime(this.currentTime())
          console.log('seek to', this.currentTime())
        })

        this.on('ratechange', function (e) {
          setPlaybackRate(this.playbackRate())
          console.log('set rate to', this.playbackRate())
        })

        this.on('ended', function (e) {
          console.log('end')
        })
      }

      // Registering A Plugin
      videojs.registerPlugin('setStateandFocusPlugin', setStateandFocusPlugin)

      this.player = videojs(this.videoNode, videoJsOptions, function onPlayerReady() {
        console.log('ready', this)
      })
    }

    if (this.player) {
      if (prevProps.primary !== primary) {
        this.player.controls(primary)
      }
      /**
       * Dealing with sync playing of the secondary player
       */
      if (!primary) {
        if (prevProps.play !== play) {
          if (play) this.player.play()
          else this.player.pause()
        }
        if (prevProps.currTime !== currTime) {
          this.player.currentTime(currTime)
        }
        if (prevProps.playbackRate !== playbackRate) {
          this.player.playbackRate(playbackRate)
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  ref = player => {
    this.player = player
  }

  render() {
    const { primary, video1, switchToPrimary, switchToSecondary } = this.props

    
    /**
     * Handle player switching
     */
    const size = primary ? 'primary' : 'secondary'
    const switchTrigger = video1 ? switchToPrimary : switchToSecondary

    return (
      <div className="ct-player" id={size}>
        <div className={`${size}`} onClick={switchTrigger}>
          <div data-vjs-player>
            <video ref={ node => this.videoNode = node } className="video-js"></video>
          </div>          
        </div>
      </div>
    )
  }
}