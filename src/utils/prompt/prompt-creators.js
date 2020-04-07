import { v4 as uuid4 } from 'uuid'
import { util } from 'utils'

export const PROMPT_ID = 'ct___prompt'

/**
 * Create a Prompt Box HTML Div Element
 * @param {string} text the prompt text to display
 * @param {object} options the options of the prompt
 * @param {String} options.header - The header in prompt
 * @param {string} options.status 'success', 'error'
 * @param {boolean} options.contact 
 * @param {boolean} options.refresh
 * @param {function} options.onClose 
 * 
 * @returns {HTMLDivElement} the Prompt Box HTML Div Element
 */
export function createPromptBoxElem(text, options) {
  let { header, status, contact, refresh, onClose } = options
  // Prompt Box
  const promptBoxEl = document.createElement('div')
  promptBoxEl.className = 'ct-prompt-box ' + status
  promptBoxEl.id = 'ctp-box-' + uuid4()

  // Header
  if (header) {
    const headerEl = document.createElement('h2')
    headerEl.className = 'ct-prompt-header'
    headerEl.innerText = header + '\n'
    promptBoxEl.appendChild(headerEl)
  }
  

  // Text
  const txtEl = document.createElement('div')
  txtEl.className = 'ct-prompt-text' + (header ? ' ct-prompt-float' : '')
  txtEl.innerText = text
  promptBoxEl.appendChild(txtEl)

  // Contact Link
  if (contact) {
    const contactLinkEl = document.createElement('a')
    contactLinkEl.className = 'ct-prompt-link'
    contactLinkEl.href = util.links.contactUs()
    contactLinkEl.innerText = 'CONTACT US'
    txtEl.appendChild(contactLinkEl)
  }
  // Refresh Link
  if (refresh) {
    const refreshLinkEl = document.createElement('a')
    refreshLinkEl.className = 'ct-prompt-link'
    refreshLinkEl.href = window.location.pathname
    refreshLinkEl.innerHTML = `<i class="material-icons">refresh</i><span>REFRESH</span>`
    
    txtEl.appendChild(refreshLinkEl)
  }

  // Close Button
  const closeBtnEl = document.createElement('button')
  closeBtnEl.className = 'plain-btn ct-prompt-close-btn' + (header ? ' ct-prompt-float' : '')
  closeBtnEl.innerHTML = '<i class="material-icons">close</i>'
  if (typeof onClose === "function") {
    closeBtnEl.addEventListener('click', e => {
      onClose(promptBoxEl.id)
    })
  }
  promptBoxEl.appendChild(closeBtnEl)

  return promptBoxEl
}

/**
 * Create a Prompt HTML Div Element
 * @param {string} text the prompt text to display
 * @param {object} options the options of the prompt
 * @param {String} options.header - The header in prompt
 * @param {string} options.position 'bottom left', 'bottom right'
 * @param {string} options.status 'success', 'error'
 * @param {boolean} options.contact 
 * @param {boolean} options.refresh
 * @param {function} options.onClose function called on prompt close
 * 
 * @returns {HTMLDivElement} the Prompt HTML Div Element
 */
export function createPromptElem(text, options) {
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