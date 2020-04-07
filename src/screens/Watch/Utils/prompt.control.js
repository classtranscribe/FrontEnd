import { prompt } from 'utils'

/**
 * Functions for controlling prompts
 */

export const promptControl = {

  closePrompt: function() {
    prompt.closeAll()
  },

  editCaptionUsingKeyboard: function() {
    prompt.addOne({
      status: 'success',
      text: 'You are editing the current caption! Hit return to save changes.',
      offset: [70, 70]
    })
  },

  savingCaption: function() {
  },

  savedCaption: function(bool=true) {
    prompt.addOne({
      status: bool ? 'success' : 'primary',
      text: bool ? 'Caption Saved!' : "Couldn't save the caption.",
      offset: [70, 70],
      timeout: 3000
    })
  },

  hideSecondaryScreen: function() {
    prompt.addOne({
      text: 'Click <i class="material-icons">video_label</i> to see more screen options.',
      offset: [70, 70],
      timeout: 5000
    })
  },

  error: function(target='media data') {
    let { search, pathname } = window.location
    prompt.addOne({
      text: `Couldn't load ${target}. Please&ensp;<a href="${pathname+search}">refresh</a>&ensp;to retry.`,
      offset: [70, 70],
      status: 'error'
    })
  }
}