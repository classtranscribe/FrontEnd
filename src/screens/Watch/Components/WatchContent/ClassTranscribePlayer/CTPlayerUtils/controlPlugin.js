/**
 * VideoJS Plugin function for basic mouse events
 * - Sync its (primary's) playing status with the secondary player
 */

export function getControlPlugin(props) {
  const { setPlaybackRate, setTrackSrc, sendUserAction, isPrimary } = props
  return function() {
    this.on('ratechange', function () {
      setPlaybackRate(this.playbackRate())
      // send user events to backend
      if (isPrimary) sendUserAction('changedspeed', { 
        playbackRate: this.playbackRate(),
        timeStamp: this.currentTime()
      })
    })

    this.textTracks().on('change', function () {
      const currTrack = this.tracks_.filter(track => track.mode === "showing")[0]
      const src = currTrack ? currTrack.src : ''
      setTrackSrc(src)
      // if (currTrack) console.log('track', currTrack.activeCues)
      // console.log('change src to', src)
    })

    this.on('fullscreenchange', function() {
      // send user events to backend
      sendUserAction('fullscreenchange', { 
        enterFullscreen: Boolean(document.fullscreenElement),
        timeStamp: this.currentTime()
      })
    })

    this.on('userinactive', function() { // 'useractive'
      if (isPrimary) sendUserAction('userinactive')
    })

    // this.on('ended', function () {
    //   console.log('end')
    // })
  }
}