export function getControlPlugin(syncFunctions) {
  const { syncPlay, syncPause, setCurrTime, setPlaybackRate, setTrackSrc } = syncFunctions
  return function(options) {
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

    this.textTracks().on('change', function (e) {
      const currTrack = this.tracks_.filter(track => track.mode === "showing")[0]
      setTrackSrc(currTrack ? currTrack.src : '')
    })
  }
}