import React from 'react'
import videojs from 'video.js'
import axios from 'axios'
// UIs

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      vtt: null
    }
  }

  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });
    
    // let that = this;
    // axios.get(' https://ruihuasui.github.io/_files/transcriptions/temp.vtt')
    //   .then(responce => {
    //     console.log(responce)
    //     that.setState({vtt: responce.data})
    //     console.log(that.state.vtt)
    //   })
    //   .catch( error => {
    //     console.log(error)
    //   })
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  ref = player => {
    this.player = player
  }

  render() {
    var that = this
    const setStateandFocusPlugin = function (options) {
      this.on('play', function (e) {
        console.log('playback has started!')
        // console.log(that)
        this.setState({
          state: 'playing'
        })
      })

      this.on('pause', function (e) {
        console.log('playback has paused')
        this.setState({
          state: 'pause'
        })
      })

      // this.on('timeupdate', function(e){
      //   that.refs.videoPlayerRef.focus()
      // })

      this.on('ended', function (e) {
        console.log('this episode ends now!!!')
        // some code to navigate to next episode page
      })
    }

    

    // Registering A Plugin
    videojs.registerPlugin('setStateandFocusPlugin', setStateandFocusPlugin)

    var vtt = require('./vtts/temp.vtt');
    console.log(this.state.vtt)
    return (
      <div className="player-container" >	
        <div data-vjs-player>
          
          <video ref={ node => this.videoNode = node } className="video-js">
            <track src={vtt} kind="caption" label="English" srcLang="en" default/>
          </video>
        </div>
      </div>
    )
  }
}