export class CTPrompt {
  constructor() {
    
  }

  createPromptElem(text) {
    // Text
    const promptTxtEl = document.createElement('div')
    promptTxtEl.className = 'ct-prompt-text'
    promptTxtEl.innerText = text
    // Close Button
    const promptCloseBtnEl = document.createElement('button')
    promptCloseBtnEl.className = 'plain-btn ct-prompt-close-btn'
    promptCloseBtnEl.innerHTML = '<i class="material-icons">close</i>'
    const that = this
    promptCloseBtnEl.addEventListener('click', e => {
      that.closePrompt()
    })
    // Prompt Box
    const promptBoxEl = document.createElement('div')
    promptBoxEl.className = 'ct-prompt-box'
    promptBoxEl.appendChild(promptTxtEl)
    promptBoxEl.appendChild(promptCloseBtnEl)
    // Prompt
    const promptEl = document.createElement('div')
    promptEl.id = 'ct-prompt'
    promptEl.appendChild(promptBoxEl)
    // insert prompt elem after root
    const rootEl = document.getElementById('root')
    rootEl.parentNode.insertBefore(promptEl, rootEl.nextSibling)
  }

  closePrompt() {

  }

  prompt({

  }) {
    if (this.setPrompt) {
      this.prompt_ = prompt_
      this.setPrompt(this.prompt_)
    }
  }
}