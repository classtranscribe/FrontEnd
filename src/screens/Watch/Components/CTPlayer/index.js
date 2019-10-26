/**
 * The Player which supports different screen modes
 */

import React from 'react'
import PropTypes from 'prop-types'
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

const mode = PS_MODE

export class ClassTranscribePlayer extends React.Component {
  constructor(props) {
    super(props)
    this.mediaId = util.parseSearchQuery().id
    this.state = {
      srcPath1: null,
      srcPath2: null,
      trans: null,
      playbackrate: 1,
    }
  }

  componentDidUpdate(prevProps) {
    const { media, watchHistory, offeringId } = this.props

    if (prevProps.media !== media) {
      // set src for videos
      const { videos, transcriptions } = media
      const { srcPath1, srcPath2 } = videos[0]
      this.setState({ 
        srcPath1, 
        srcPath2,
        trans: transcriptions[0]
      })
      // register video elem for ctrlor
      control.init(this.videoNode1, this.videoNode2)
    }
  }

  switchScreen = () => {
    this.setState({ isSwitched: !this.state.isSwitched })
  }

  render() {
    const { srcPath1, srcPath2, trans } = this.state
    const { media, playlist, playlists } = this.props
    const { isTwoScreen } = media

    return (
      <>
          <div className={`ct-video-contrainer ${PRIMARY}`} mode={mode} >
            <video
              className="ct-video"
              ref={node => this.videoNode1 = node}
            >
              {Boolean(srcPath1) && <source src={srcPath1} type="video/mp4"/>}
            </video>
          </div>
          {
            isTwoScreen
            &&
            <div className={`ct-video-contrainer ${SECONDARY}`} mode={mode}>
              <video muted
                className="ct-video"
                ref={node => this.videoNode2 = node}
              >
                {Boolean(srcPath2) && <source src={srcPath2} type="video/mp4"/>}
              </video>
            </div>
          }
      </>
    )
  }
}

ClassTranscribePlayer.propTypes = {
  media: PropTypes.object,
}
ClassTranscribePlayer.defaultProps = {
  media: api.parseMedia()
}