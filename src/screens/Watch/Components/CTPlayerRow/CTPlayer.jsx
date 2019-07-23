import React from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import './video.css'
import './index.css'
import { api } from '../../../../util'
import { staticVJSOptions, keyDownPlugin, getControlPlugin } from './CTPlayerUtil'
const tempPoster = require('../../../../images/tempPoster.png')

// ({primary, switchToPrimary, switchToSecondary, video1, id})
export default class CTPlayer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    const { primary, play, media, video1, currTime, playbackRate, trackSrc } = this.props
    /**
     * Register videojs after the media is loaded
     */
    if (prevProps.media !== media) {
      // console.log('caption', media.transcriptions)
      const videos = media.videos
      const srcPath = videos ? api.baseUrl() + videos[0].video1.path : ''
      const videoJsOptions = {
        ...staticVJSOptions,
        controls: primary,
        muted: !video1,
        sources: [{               // test the two video mode
          src: video1 ? srcPath : 'https://sysprog.ncsa.illinois.edu:4443/Data/temp486a182e-39b7-4099-aacf-86e68e17d477_mrb.mp4',
          type: 'video/mp4'
        }],
        poster: tempPoster,
      }
 
      // Registering Plugins
      const controlPlugin = getControlPlugin(this.props)
      videojs.registerPlugin('controlPlugin', controlPlugin)
      videojs.registerPlugin('KeyDownPlugin', keyDownPlugin)

      this.player = videojs(this.videoNode, videoJsOptions, function onPlayerReady() {
        // console.log('ready', this)
      })
    }

    if (this.player) {
      if (prevProps.primary !== primary) {
        this.player.controls(primary)
        if (trackSrc) {
          const currTrack = this.player.textTracks().tracks_.filter(track => track.src === trackSrc)
          if (currTrack.length && primary) setTimeout(() => {
            currTrack[0].mode = 'showing'
          }, 300)
          if (currTrack.length && !primary) currTrack[0].mode = 'disabled'
        }
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