/**
 * VideoJS Plugin function for key down events
 */

export const keyDownPlugin = function() {
  this.on('keydown', function(e) {
    const { keyCode, metaKey, ctrlKey, shiftKey } = e
    if (metaKey || ctrlKey || shiftKey) return;
    console.log(keyCode)
    // press space or 'k' to pause or play
    if (keyCode === 32 || keyCode === 75) { 
      if (this.paused()) this.play()
      else this.pause()
    }

    // press '0' to jump to beginning
    else if (keyCode === 48) { 
    }
    // press arrow right forward 5 secs
    else if (keyCode === 39) { 
      let time = this.currentTime() + 5;
      this.currentTime(time)
    }
    // press arrow left backward 5 secs
    else if (keyCode === 37) { 
      let time = this.currentTime() - 5;
      this.currentTime(time)
    }

    // press 'm' to mute
    else if (keyCode === 77) { 
      if (this.muted()) this.muted(false)
      else this.muted(true)
    }
    // press arrow up volume up 10%
    else if (keyCode === 38) { 
      let volume = this.volume() + 0.1
      this.volume(volume)
    }
    // press arrow down volume down 10%
    else if (keyCode === 40) { 
      let volume = this.volume() - 0.1
      this.volume(volume)
    }

    // press 'f' to enter fullscreen
    else if (keyCode === 70) {
      if (!this.isFullscreen()) this.requestFullscreen()
      else this.exitFullscreen()
    }
  })
}