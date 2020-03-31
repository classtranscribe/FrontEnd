import _ from 'lodash'
import { v4 as uuid4 } from 'uuid'
import { util } from 'utils'
import 'components/stylesheets/ct-prompt.css'


const PROMPT_ID = 'ct___prompt'

function createPromptBoxElem(text, options) {
  let { status, contact, refresh, onClose } = options
  // Prompt Box
  const promptBoxEl = document.createElement('div')
  promptBoxEl.className = 'ct-prompt-box ' + status
  promptBoxEl.id = 'ctp-box-' + uuid4()

  // Text
  const txtEl = document.createElement('div')
  txtEl.className = 'ct-prompt-text'
  txtEl.innerText = text
  promptBoxEl.appendChild(txtEl)

  // Contact Link
  if (contact) {
    const contactLinkEl = document.createElement('a')
    contactLinkEl.className = 'ct-prompt-link'
    contactLinkEl.href = util.links.contactUs()
    contactLinkEl.innerText = 'CONTACT US'
    promptBoxEl.appendChild(contactLinkEl)
  }
  // Refresh Link
  if (refresh) {
    const refreshLinkEl = document.createElement('a')
    refreshLinkEl.className = 'ct-prompt-link'
    refreshLinkEl.href = window.location.pathname
    refreshLinkEl.innerHTML = `<i class="material-icons">refresh</i><span>REFRESH</span>`
    
    promptBoxEl.appendChild(refreshLinkEl)
  }

  // Close Button
  const closeBtnEl = document.createElement('button')
  closeBtnEl.className = 'plain-btn ct-prompt-close-btn'
  closeBtnEl.innerHTML = '<i class="material-icons">close</i>'
  if (typeof onClose === "function") {
    closeBtnEl.addEventListener('click', e => {
      onClose(promptBoxEl.id)
    })
  }
  promptBoxEl.appendChild(closeBtnEl)

  return promptBoxEl
}

function createPromptElem(text, options) {
  let { position } = options
  let promptBoxEl = createPromptBoxElem(text, options)
  // Prompt
  const promptEl = document.createElement('div')
  promptEl.id = PROMPT_ID
  promptEl.appendChild(promptBoxEl)
  // promptEl.setAttribute('data-position', position)
  promptEl.className = position
  // insert prompt elem after root
  const rootEl = document.getElementById('root')
  rootEl.parentNode.insertBefore(promptEl, rootEl.nextSibling)

  return promptBoxEl
}

export class CTPrompt {
  constructor() {
    this.promptIds = []

    // Binding
    this.close = this.close.bind(this)
    this.closeAll = this.closeAll.bind(this)
    this.addOne = this.addOne.bind(this)
    this.addMany = this.addMany.bind(this)
  }


  /**
   * Close a prompt box
   * @param {String} boxId - the id of the prompt box; close all prompts if undefined
   */
  close(boxId) {
    if (boxId === undefined) {
      this.closeAll()
    }
    const promptBoxEl = document.getElementById(boxId)
    if (promptBoxEl) {
      _.remove(this.promptIds, id => id === boxId)
      promptBoxEl.classList.add('ctp-close')
      setTimeout(() => promptBoxEl.remove(), 90)
    }

    if (this.promptIds.length === 0) {
      const promptEl = document.getElementById(PROMPT_ID)
      setTimeout(() => promptEl.remove(), 100)
    }
  }

  /**
   * Close all the prompt boxes
   */
  closeAll() {
    const closePrompt = this.close
    _.forEach(this.promptIds, promptId => {
      closePrompt(promptId)
    })
  }

  /**
   * Add one prompt box
   * @param {Object} prompt - the prompt config 
   * @param {String} prompt.text - The text in prompt
   * @param {String} prompt.status - determines the color of the prompt box
   * @param {Boolean} prompt.contact - true if add a contact link
   * @param {Boolean} prompt.refresh - true if add a refresh page trigger
   * @param {Number} prompt.timeout - the close timeout
   * @param {String} prompt.position - The position of the prompt
   * 
   * @property status - determines the color of the prompt box
   * - in 'primary', 'success', 'error' (default 'primary')
   * @property position - The position of the prompt
   * - in 'bottom left', 'bottom right' (default 'bottom right')
   */
  addOne(prompt={
    text: '',
    status: 'primary',
    contact: false,
    refresh: false,
    timeout: -1,
    position: 'right bottom',
  }) {

    const {
      text='',
      status='primary',
      contact=false,
      refresh=false,
      timeout= -1,
      position='right bottom',
    } = prompt
    
    const onClose = this.close
    const promptEl = document.getElementById(PROMPT_ID)
    var newBoxEl = null

    if (promptEl) {
      newBoxEl = createPromptBoxElem(text, {
        status,
        contact,
        refresh,
        onClose,
      })

      promptEl.appendChild(newBoxEl)
    } else {
      newBoxEl = createPromptElem(text, {
        status,
        contact,
        refresh,
        position,
        onClose,
      })
    }

    this.promptIds.push(newBoxEl.id)
    if (timeout > 0) {
      setTimeout(() => onClose(newBoxEl.id), timeout)
    }
  }


  /**
   * Add one prompt box
   * @param {Object[]} prompts
   * @param {String} prompts[].text - The text in prompt
   * @param {String} prompts[].status - determines the color of the prompt box
   * @param {Boolean} prompts[].contact - true if add a contact link
   * @param {Boolean} prompts[].refresh - true if add a refresh page trigger
   * @param {Number} prompts[].timeout - the close timeout
   * @param {String} prompts[].position - The position of the prompt
   * 
   * @property status - determines the color of the prompt box
   * - in 'primary', 'success', 'error' (default 'primary')
   * @property position - The position of the prompt
   * - in 'bottom left', 'bottom right' (default 'bottom right')
   */
  addMany(prompts=[]) {
    _.forEach(prompts, prp => this.addOne(prp))
  }
}

export const prompt = new CTPrompt()