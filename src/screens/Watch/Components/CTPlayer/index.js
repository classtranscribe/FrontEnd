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
    }
  }

  componentDidUpdate(prevProps) {
    const { 
      media, watchHistory, offeringId,
      // to be registered
      setMode, switchScreen, setVolume, setPause, 
      setPlaybackrate, setMute, setTrans, setFullscreen,
      setDuration, setBufferedTime, setTime, setCurrTrans
    } = this.props

    if (prevProps.media !== media) {
      // set src for videos
      const { videos, transcriptions, isTwoScreen } = media
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
          setVolume, setPause, setPlaybackrate, 
          setTime, setMute, setTrans, 
          setMode, switchScreen, setBufferedTime, 
          setFullscreen, setCurrTrans, setDuration,
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
          onClick={() => control.handlePause()}
        >
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
            <track 
              src="https://classtranscribe.ncsa.illinois.edu/data/temptemp_zge_da15f9c7-d587-4244-b8df-b1a13a1b89d8_es.vtt"
              kind="subtitles"
              srcLang="english"
              label="english"
              id="english"
            />
          </video>
        </div>
        {
          isTwoScreen
          &&
          <div 
            className={`ct-video-contrainer ${player2Position}`} 
            mode={mode}
            onClick={() => control.handlePause()}
          >
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
    'setCurrTrans',
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