/**
 * The Player which supports different screen modes
 */

import React from 'react'
import { isMobile } from 'react-device-detect'
import './index.css'
import './playerModes.css'
import PlayerWrapper from './PlayerWrapper'
// Vars
import { util } from '../../../../utils'
import { 
  connectWithRedux,
  videoControl as control, 
  PRIMARY, 
  SECONDARY,
  PS_MODE,
  NESTED_MODE,
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
    const { media, /** watchHistory, offeringId, */ setMode, } = this.props

    if (prevProps.media !== media) {
      // set src for videos
      const { videos, isTwoScreen } = media
      const { srcPath1, srcPath2 } = videos[0]
      // set src paths
      this.setState({ srcPath1, srcPath2 })

      // if not a mobile device and is two-screen media, 
      // choose a mode according to the window's width
      if (isTwoScreen && !isMobile) setMode(window.innerWidth <= 900 ? NESTED_MODE : PS_MODE)

      // register video elem for ctrlor
      control.init(this.videoNode1, this.videoNode2, this.props)
    }
  }

  handlePause = position => () => {
    if (position === PRIMARY) {
      control.handlePause()
    }
  }

  // Event handlers for primary video
  onPause = e => {
    control.onPause(e)
  }
  onTimeUpdate = e => {
    control.onTimeUpdate(e)
  }
  onDurationChange = e => {
    control.onDurationChange(e)
    let { begin, courseNumber, id } = util.parseSearchQuery()
    if (Boolean(begin)) {
      control.currTime(Number(begin))
      util.replacePathname( util.links.watch(courseNumber, id) )
    }
  }
  onProgress = e => {
    control.onProgress(e)
  }
  onLoadStartPri = e => {
    control.onLoadStart(e, true)
  }
  onLoadedDataPri = e => {
    control.onLoadedData(e, true)
  }
  onCanPlayPri = e => {
    control.onCanPlay(e, true)
  }
  onWaitingPri = e => {
    control.onWaiting(e, true)
  }
  onPlayingPri = e => {
    control.onPlaying(e, true)
  }
  onEndedPri = e => {
    control.onEnded(e)
  }
  onSeekingPri = e => {
    control.onSeeking(e)
  }
  onSeekedPri = e => {
    control.onSeeked(e)
  }
  onErrorPri = e => {
    control.onError(e, true)
  }

  // Event handlers for secondary video
  onLoadStartSec = e => {
    control.onLoadStart(e, false)
  }
  onLoadedDataSec = e => {
    control.onLoadedData(e, false)
  }
  onCanPlaySec = e => {
    control.onCanPlay(e, false)
  }
  onWaitingSec = e => {
    control.onWaiting(e, false)
  }
  onPlayingSec = e => {
    control.onPlaying(e, false)
  }
  onErrorSec = e => {
    control.onError(e, false)
  }

  render() {
    const { srcPath1, srcPath2 } = this.state
    const { media, mode, isSwitched, transView } = this.props
    const { isTwoScreen, /** transcriptions */ } = media

    const player1Position = isSwitched ? SECONDARY : PRIMARY
    const player2Position = isSwitched ? PRIMARY : SECONDARY

    return (
      <>
        <div 
          className={`ct-video-row ${player1Position}`} 
          mode={mode} 
          data-trans-view={transView}
        >
          <div className="ct-video-contrainer">
            <PlayerWrapper isPrimary={!isSwitched} />
            <video playsInline autoPlay={isMobile}
              className="ct-video"
              id="ct-video-1"
              ref={node => this.videoNode1 = node}
              onDurationChange={this.onDurationChange}
              onTimeUpdate={this.onTimeUpdate}
              onProgress={this.onProgress}
              onCanPlay={this.onCanPlayPri}
              onPause={this.onPause}
              onLoadStart={this.onLoadStartPri}
              onLoadedData={this.onLoadedDataPri}
              onWaiting={this.onWaitingPri}
              onPlaying={this.onPlayingPri}
              onEnded={this.onEndedPri}
              onSeeking={this.onSeekingPri}
              onSeeked={this.onSeekedPri}
              onError={this.onErrorPri}
            >
              {Boolean(srcPath1) && <source src={srcPath1} type="video/mp4"/>}
              Your browser doesn't support video tag
            </video>
          </div>
        </div>
        {
          isTwoScreen
          &&
          <div 
            className={`ct-video-row ${player2Position}`} 
            mode={mode}
            data-trans-view={transView}
          >
            <div className="ct-video-contrainer">
              <PlayerWrapper isPrimary={isSwitched} />
              <video muted playsInline
                className="ct-video"
                id="ct-video-2"
                ref={node => this.videoNode2 = node}
                onCanPlay={this.onCanPlaySec}
                onLoadStart={this.onLoadStartSec}
                onLoadedData={this.onLoadedDataSec}
                onWaiting={this.onWaitingSec}
                onPlaying={this.onPlayingSec}
                onError={this.onErrorSec}
              >
                {Boolean(srcPath2) && <source src={srcPath2} type="video/mp4"/>}
                Your browser doesn't support video tag
              </video>
            </div>
          </div>
        }
      </>
    )
  }
}

export const ClassTranscribePlayer = connectWithRedux(
  ClassTranscribePlayerWithRedux,
  ['media', 'mode', 'isSwitched', 'paused', 'transView'],
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
    'setFullscreen',
    'setCTPPriEvent',
    'setCTPSecEvent',

    'timeUpdate',
    'changeVideo'
  ]
)