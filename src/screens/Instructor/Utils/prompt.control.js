import _ from 'lodash';
import { prompt } from 'utils';

export const promptControl = {
  message(text, timeout = -1) {
    prompt.addOne({
      text,
      timeout,
      position: 'right bottom',
      status: 'success',
    });
  },

  saving(action = 'Saving') {
    prompt.addOne({
      text: `${action}...`,
      position: 'right bottom',
      timeout: -1,
    });
  },

  saved(target = '', action = 'saved') {
    prompt.addOne({
      text: `${target} ${action}`,
      position: 'right bottom',
      timeout: 5000,
    });
  },

  failedToSave(target = '', action = 'save') {
    prompt.addOne({
      text: `Failed to ${action} the ${target}`,
      position: 'right bottom',
      status: 'error',
      timeout: 9000,
    });
  },

  updated(target = '') {
    this.saved(target, 'updated');
  },

  failedToUpdate(target = '') {
    this.failedToSave(target, 'update');
  },

  deleting() {
    this.saving('Deleting');
  },

  deleted(target = '') {
    this.saved(target, 'deleted');
  },

  failedToDelete(target = '') {
    this.failedToSave(target, 'delete');
  },

  error(errors) {
    if (typeof errors === 'string') {
      errors = [errors];
    } else if (errors.length === 0) return;

    prompt.addMany(
      _.map(errors, (errorMesg) => ({
        text: `Error: failed to ${errorMesg}`,
        position: 'right bottom',
        status: 'error',
        timeout: -1,
      })),
    );
  },
};
