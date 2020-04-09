import _ from 'lodash'
import { prompt } from 'utils'

export const promptControl = {
  message: function(text, timeout=-1) {
    prompt.addOne({
      text, timeout,
      position: 'right bottom',
      status: 'success',
    })
  },

  saving: function(action='Saving') {
    prompt.addOne({
      text: `${action}...`,
      position: 'right bottom',
      timeout: -1,
    })
  },

  saved: function(target='', action='saved') {
    prompt.addOne({
      text: `${target} ${action}`,
      position: 'right bottom',
      timeout: 5000,
    })
  },

  failedToSave: function(target='', action='save') {
    prompt.addOne({
      text: `Failed to ${action} the ${target}`,
      position: 'right bottom',
      status: 'error',
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

    prompt.addMany(_.map(errors, errorMesg => ({
      text: `Error: failed to ${errorMesg}`,
      position: 'right bottom',
      status: 'error',
      timeout: -1,
    })))
  }
}