import { videoControl } from './player.control'

export const keydownControl = {

  addKeyDownListener: function() {
    document.addEventListener('keydown', e => {
      const { keyCode, metaKey, ctrlKey, shiftKey, altKey } = e
      console.log({ keyCode, metaKey, ctrlKey, shiftKey, altKey })
      this.handleKeyDown(e)
    })
  },

  handleKeyDown: function(e) {
    const { keyCode, metaKey, ctrlKey, shiftKey, altKey } = e
    // `space` - pause or play
    if (keyCode === 32) {
      videoControl.handlePause()
    }
  }
}