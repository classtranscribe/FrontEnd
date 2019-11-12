/**
 * The Player which supports different screen modes
 */

import React from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import './playerModes.css'
import {
  SecondaryPlayerWrapper
} from '../Overlays'
// Vars
import { util } from 'utils'
import { 
  videoControl as control, 
  PRIMARY, 
  SECONDARY,
  PS_MODE,
} from '../../Utils'



export class ClassTranscribePlayerWithRedux extends React.Component {
  constructor(props) {
    super(props)
    this.mediaId = util.parseSearchQuery().id
    this.state = {
      srcPath1: null,
      srcPath2: null,
    }
  }

  componentDidUpdate(prevProps) {
    const { 
      media, watchHistory, offeringId,
      // to be registered
      setMode, switchScreen, setVolume, setPause, 
      setPlaybackrate, setMute, setFullscreen,
      setDuration, setBufferedTime, setTime,
    } = this.props

    if (prevProps.media !== media) {
      // set src for videos
      const { videos, isTwoScreen } = media
      const { srcPath1, srcPath2 } = videos[0]
      if (isTwoScreen) this.props.setMode(PS_MODE)
      this.setState({ 
        srcPath1, 
        srcPath2
      })
      // register video elem for ctrlor
      control.init(
        this.videoNode1, this.videoNode2,
        {  
          setMode, switchScreen, setFullscreen,
          setVolume, setMute, setPause, setPlaybackrate,
          setDuration, setTime, setBufferedTime, 
        }
      )
      // console.log('this.videoNode1.textTracks', this.videoNode1.textTracks)
    }
  }

  onCanPlay = e => {
    control.onCanPlay(e)
  }

  onDurationChange = e => {
    control.onDurationChange(e)
  }

  onTimeUpdate = e => {
    control.onTimeUpdate(e)
  }

  onProgress = e => {
    control.onProgress(e)
  }

  handlePause = position =>() => {
    if (position === PRIMARY) {
      control.handlePause()
    }
  }

  render() {
    const { srcPath1, srcPath2 } = this.state
    const { media, mode, isSwitched, paused } = this.props
    const { isTwoScreen, transcriptions } = media

    const player1Position = isSwitched ? SECONDARY : PRIMARY
    const player2Position = isSwitched ? PRIMARY : SECONDARY

    return (
      <>
        <div 
          className={`ct-video-contrainer ${player1Position}`} 
          mode={mode} 
          onClick={this.handlePause(player1Position)}
        >
          <SecondaryPlayerWrapper isPrimary={!isSwitched} />
          <video
            className="ct-video"
            id="ct-video-1"
            ref={node => this.videoNode1 = node}
            onDurationChange={this.onDurationChange}
            onTimeUpdate={this.onTimeUpdate}
            onProgress={this.onProgress}
            onCanPlay={this.onCanPlay}
          >
            {
              Boolean(srcPath1) 
              && 
              <source src={srcPath1} type="video/mp4"/>
            }
            {/* {
              transcriptions.map( trans => (
                <track 
                  className="watch-caption-track"
                  key={trans.language}
                  id={trans.language}
                  src={trans.src} 
                  kind="subtitles"
                  label={trans.language}
                  srcLang={trans.language}
                />
              ))
            } */}
            {/* <track 
              src="https://classtranscribe.ncsa.illinois.edu/data/temptemp_zge_da15f9c7-d587-4244-b8df-b1a13a1b89d8_es.vtt"
              kind="subtitles"
              srcLang="english"
              label="english"
              id="english"
            /> */}
          </video>
        </div>
        {
          isTwoScreen
          &&
          <div 
            className={`ct-video-contrainer ${player2Position}`} 
            mode={mode}
            onClick={this.handlePause(player2Position)}
          >
            <SecondaryPlayerWrapper isPrimary={isSwitched} />
            <video muted
              className="ct-video"
              id="ct-video-2"
              ref={node => this.videoNode2 = node}
              onCanPlay={this.onCanPlay}
            >
              {Boolean(srcPath2) && <source src={srcPath2} type="video/mp4"/>}
            </video>
          </div>
        }
      </>
    )
  }
}

export const ClassTranscribePlayer = connectWithRedux(
  ClassTranscribePlayerWithRedux,
  ['media', 'mode', 'isSwitched', 'paused'],
  [
    'setMode',
    'setVolume', 
    'setPause', 
    'setPlaybackrate', 
    'setTime', 
    'setMute',
    'switchScreen',
    'setDuration',
    'setBufferedTime',
    'setFullscreen'
  ]
)