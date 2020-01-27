import _ from 'lodash'

export const promptControl = {
  setPrompt: function() {},
  init: function(props) {
    this.setPrompt = props.setPrompt

    // For test
    // this.error(['load offerings', 'departments', 'and terms'])
  },

  prompt_: null,
  prompt: function(prompt_) { // { text, position, status, type, timeout }
    if (this.setPrompt) {
      this.prompt_ = prompt_
      this.setPrompt(this.prompt_)
    }
  },

  close: function(timeout=0) {
    setTimeout(() => {
      this.prompt(null)
    }, timeout);
  },

  message: function(text, timeout=-1) {
    this.prompt({
      text, timeout,
      position: 'right bottom',
      status: 'success',
    })
  },

  saving: function(action='Saving') {
    this.prompt({
      text: `${action}...`,
      position: 'right bottom',
      status: 'success',
      timeout: -1,
    })
  },

  saved: function(target='', action='saved') {
    this.prompt({
      text: `${target} ${action}`,
      position: 'right bottom',
      status: 'success',
      timeout: 5000,
    })
  },

  failedToSave: function(target='', action='save') {
    this.prompt({
      text: `Failed to ${action} the ${target}`,
      position: 'right bottom',
      status: 'failed',
      timeout: 9000,
    })
  },

  updated: function(target='') {
    this.saved(target, 'updated')
  },

  failedToUpdate: function(target='') {
    this.failedToSave(target, 'update')
  },

  deleting: function() {
    this.saving('Deleting')
  },

  deleted: function(target='') {
    this.saved(target, 'deleted')
  },

  failedToDelete: function(target='') {
    this.failedToSave(target, 'delete')
  },

  error: function(errors) {
    if (typeof errors === 'string') {
      errors = [errors]
    } else {
      if (errors.length === 0) return;
    }

    let errMesg = _.join(errors, ', ')
    this.prompt({
      text: `Error(s): failed to ${errMesg}`,
      position: 'right bottom',
      status: 'failed',
      timeout: -1,
    })
  }
}