import _ from 'lodash';

// import stylesheet of prompt element
import 'components/stylesheets/ct-prompt.css';

import { PROMPT_ID, createPromptBoxElem, createPromptElem } from './prompt-creators';

const defaultPrompt = {
  text: '',
  header: '',
  status: 'primary',
  contact: false,
  refresh: false,
  timeout: -1,
  position: 'right bottom',
  offset: [-1, -1],
};

/**
 * Class used to create and handle prompt component
 */
export class CTPrompt {
  constructor() {
    this.promptIds = [];

    // Binding
    this.close = this.close.bind(this);
    this.closeAll = this.closeAll.bind(this);
    this.addOne = this.addOne.bind(this);
    this.addMany = this.addMany.bind(this);
  }

  /**
   * Close a prompt box
   * @param {String} boxId - the id of the prompt box; close all prompts if undefined
   * @returns {void}
   */
  close(boxId) {
    if (boxId === undefined) {
      this.closeAll();
    }
    const promptBoxEl = document.getElementById(boxId);
    if (promptBoxEl) {
      _.remove(this.promptIds, (id) => id === boxId);
      promptBoxEl.classList.add('ctp-close');
      setTimeout(() => promptBoxEl.remove(), 90);
    }

    if (this.promptIds.length === 0) {
      const promptEl = document.getElementById(PROMPT_ID);
      setTimeout(() => {
        if (promptEl) {
          promptEl.remove();
        }
      }, 100);
    }
  }

  /**
   * Close all the prompt boxes
   * @returns {void}
   */
  closeAll() {
    const closePrompt = this.close;
    _.forEach(this.promptIds, (promptId) => {
      closePrompt(promptId);
    });
  }

  /**
   * Add one prompt box
   * @param {Object} prompt - the prompt config | `text` of the prompt
   * @param {String} prompt.text - The text in prompt
   * @param {String} prompt.header - The header in prompt
   * @param {String} prompt.status - determines the color of the prompt box
   * @param {Boolean} prompt.contact - true if add a contact link
   * @param {Boolean} prompt.refresh - true if add a refresh page trigger
   * @param {Number} prompt.timeout - the close timeout : default `5000ms`
   * @param {String} prompt.position - The position of the prompt
   * @param {Number[]} prompt.offset - The offset of the position
   *      (pixels from the [bottom/top, right/left])
   * @param {Boolean} replace true if close other exisiting prompts
   *
   * @property status - determines the color of the prompt box
   * - in 'primary', 'success', 'error' (default 'primary')
   * @property position - The position of the prompt
   * - in 'bottom left', 'bottom right' (default 'bottom right')
   *
   * @returns {void}
   */
  addOne(prompt, replace = false) {
    if (typeof prompt === 'string') {
      this.addOne({ ...defaultPrompt, text: prompt });
    }

    const {
      text = '',
      header = '',
      status = 'primary',
      contact = false,
      refresh = false,
      timeout = 5000,
      position = 'right bottom',
      offset = [-1, -1],
    } = prompt;

    if (replace) this.closeAll();

    const onClose = this.close;
    const promptEl = document.getElementById(PROMPT_ID);
    let newBoxEl = null;

    if (promptEl) {
      newBoxEl = createPromptBoxElem(text, {
        header,
        status,
        contact,
        refresh,
        onClose,
        offset,
      });

      promptEl.appendChild(newBoxEl);
    } else {
      newBoxEl = createPromptElem(text, {
        header,
        status,
        contact,
        refresh,
        position,
        onClose,
        offset,
      });
    }

    this.promptIds.push(newBoxEl.id);
    if (timeout > 0) {
      setTimeout(() => onClose(newBoxEl.id), timeout);
    }
  }

  /**
   * Add one prompt box
   * @param {Object[]} prompts the prompt objects | texts
   * @param {String} prompts[].text - The text in prompt
   * @param {String} prompts[].header - The header in prompt
   * @param {String} prompts[].status - determines the color of the prompt box
   * @param {Boolean} prompts[].contact - true if add a contact link
   * @param {Boolean} prompts[].refresh - true if add a refresh page trigger
   * @param {Number} prompts[].timeout - the close timeout
   * @param {String} prompts[].position - The position of the prompt
   * @param {Number[]} prompts[].offset - The offset of the position
   *      (pixels from the [bottom/top, right/left])
   * @param {Boolean} replace true if close other exisiting prompts
   *
   * @property status - determines the color of the prompt box
   * - in 'primary', 'success', 'error' (default 'primary')
   * @property position - The position of the prompt
   * - in 'bottom left', 'bottom right' (default 'bottom right')
   *
   * @returns {void}
   */
  addMany(prompts = [], replace = false) {
    if (replace) this.closeAll();
    _.forEach(prompts, (prp) => this.addOne(prp));
  }

  /**
   * * Add one prompt box
   * @param {Object|Object[]} prompt - the prompt config | `text` of the prompt
   * @param {String} prompt.text - The text in prompt
   * @param {String} prompt.header - The header in prompt
   * @param {String} prompt.status - determines the color of the prompt box
   * @param {Boolean} prompt.contact - true if add a contact link
   * @param {Boolean} prompt.refresh - true if add a refresh page trigger
   * @param {Number} prompt.timeout - the close timeout
   * @param {String} prompt.position - The position of the prompt
   * @param {Number[]} prompt.offset - The offset of the position
   *      (pixels from the [bottom/top, right/left])
   * @param {Boolean} replace true if close other exisiting prompts
   */
  push(prompt, replace) {
    if (Array.isArray(prompt)) {
      this.addMany(prompt, replace);
    } else {
      this.addOne(prompt, replace);
    }
  }

  /**
   * * Add one prompt box
   * @param {Object} messages - the prompt config | `text` of the prompt
   * @param {String} messages.text - The text in prompt
   * @param {String} messages.header - The header in prompt
   * @param {String} messages.status - determines the color of the prompt box
   * @param {Boolean} messages.contact - true if add a contact link
   * @param {Boolean} messages.refresh - true if add a refresh page trigger
   * @param {Number} messages.timeout - the close timeout
   * @param {String} messages.position - The position of the prompt
   * @param {Number[]} messages.offset - The offset of the position
   *      (pixels from the [bottom/top, right/left])
   * @param {Number} timeout the close timeout
   */
  error(messages, timeout = -1) {
    if (Array.isArray(messages)) {
      messages.forEach((mesg) => this.error(mesg));
    } else {
      let prompt = messages;
      if (typeof prompt === 'string') {
        prompt = { text: prompt };
      }

      prompt = {
        ...defaultPrompt,
        ...prompt,
        timeout,
        status: 'error',
      };

      this.addOne(prompt, false);
    }
  }
}
