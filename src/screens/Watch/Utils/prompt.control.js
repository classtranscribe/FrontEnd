/**
 * Functions for controlling prompts
 */

export const promptControl = {
  // setPrompt
  prompt: null,
  setPrompt: function() {}, 

  init: function({ setPrompt }) {
    if (setPrompt) this.setPrompt = setPrompt
  },

  openPrompt: function(prompt) {
    this.setPrompt(prompt)
    this.prompt = prompt
  },

  closePrompt: function() {
    if (Boolean(this.prompt)) this.setPrompt(null)
  },

  editCaptionUsingKeyboard: function() {
    this.setPrompt({
      type: 'edit-caption-guide',
      text: 'You are editing on current caption! Hit return to save changes.',
      position: 'bottom-right',
    })
  },

  savingCaption: function() {
    this.setPrompt({
      type: 'saving-caption',
      text: 'Saving Caption...',
      position: 'bottom-right',
    })
  },

  savedCaption: function(bool=true) {
    this.setPrompt({
      status: bool ? 'success' : 'failed',
      type: 'saved-caption',
      text: bool ? 'Caption Saved!' : "Couldn't save the caption :(",
      position: 'bottom-right',
      timeout: 3000,
    })
  },

  hideSecondaryScreen: function() {
    this.setPrompt({
      status: 'success',
      type: 'hide-sec-screen',
      text: 'Click <i class="material-icons">video_label</i> to see more screen options.',
      position: 'bottom-right',
      timeout: 5000,
    })
  },

  error: function(target='media data') {
    let { search, pathname } = window.location
    this.setPrompt({
      status: 'failed',
      type: 'error',
      text: `Couldn't load ${target}. Please&ensp;<a href="${pathname+search}">refresh</a>&ensp;to retry.`,
      position: 'bottom-right',
      timeout: -1,
    })
  }
}