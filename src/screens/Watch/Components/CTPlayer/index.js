/**
 * The Player which supports different screen modes
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connectWithRedux } from '_redux/watch'
// UI
import './index.css'
// Vars
import { util, api } from 'utils'
import { 
  videoControl as control, 
  playerOptions, 
  PRIMARY, 
  SECONDARY,
  PS_MODE,
  NORMAL_MODE,
  NESTED_MODE,
  THEATRE_MODE,
} from '../../Utils'

export class ClassTranscribePlayerWithRedux extends React.Component {
  constructor(props) {
    super(props)
    this.mediaId = util.parseSearchQuery().id
    this.state = {
      srcPath1: null,
      srcPath2: null,
      trans: null,
    }
  }

  componentDidUpdate(prevProps) {
    const { 
      media, watchHistory, offeringId,
      // to be registered
      setMode, switchScreen, setVolume, setPause, 
      setPlaybackrate, setMute, setTrans, setFullscreen,
      setDuration, setBufferedTime, setTime
    } = this.props

    if (prevProps.media !== media) {
      // set src for videos
      const { videos, transcriptions, isTwoScreen } = media
      const { srcPath1, srcPath2 } = videos[0]
      if (isTwoScreen) this.props.setMode(PS_MODE)
      this.setState({ 
        srcPath1, 
        srcPath2,
        trans: transcriptions[0]
      })
      // register video elem for ctrlor
      control.init(
        this.videoNode1, this.videoNode2,
        { 
          setVolume, setPause, setPlaybackrate, setTime, setMute, setTrans, 
          setMode, switchScreen, setBufferedTime, setDuration, setFullscreen
        }
      )
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

  render() {
    const { srcPath1, srcPath2, trans } = this.state
    const { media, mode, isSwitched, paused } = this.props
    const { isTwoScreen } = media

    const player1Position = isSwitched ? SECONDARY : PRIMARY
    const player2Position = isSwitched ? PRIMARY : SECONDARY
    const handlePause = paused ? () => control.play() : () => control.pause()

    return (
      <>
        <div 
          className={`ct-video-contrainer ${player1Position}`} 
          mode={mode} 
          onClick={handlePause}
        >
          <video
            className="ct-video"
            ref={node => this.videoNode1 = node}
            onDurationChange={this.onDurationChange}
            onTimeUpdate={this.onTimeUpdate}
            onProgress={this.onProgress}
            onCanPlay={this.onCanPlay}
          >
            {Boolean(srcPath1) && <source src={srcPath1} type="video/mp4"/>}
          </video>
        </div>
        {
          isTwoScreen
          &&
          <div 
            className={`ct-video-contrainer ${player2Position}`} 
            mode={mode}
            onClick={handlePause}
          >
            <video muted
              className="ct-video"
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
    'setTrans',
    'switchScreen',
    'setDuration',
    'setBufferedTime',
    'setFullscreen'
  ]
)