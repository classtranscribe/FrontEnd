import React, { useEffect } from 'react'
import { connectWithRedux } from '../../../Utils'
import './index.css'

function PromptsWithRedux({
  prompt=null,
  setPrompt=null
}) {

  const {
    status='success',
    type='',
    text='test',
    position='bottom-right',
    timeout=-1,
  } = prompt || {}

  useEffect(() => {
    if (Boolean(prompt) && prompt.timeout > 0) {
      setTimeout(() => {
        setPrompt(null)
      }, prompt.timeout);
    }
  }, [prompt])

  const onClose = () => {
    // console.error(text)
    setPrompt(null)
  }

  return Boolean(prompt) ? (
    <div 
      className="watch-prompt"
      data-position={position}
    >
      <div className="prompt-box">
        <div className="prompt-text" dangerouslySetInnerHTML={{__html: text}}>
        </div>
        <button className="plain-btn prompt-close-btn" onClick={onClose}>
          <i className="material-icons">close</i>
        </button>
      </div>
    </div>
  ) : null
}

export const Prompts = connectWithRedux(
  PromptsWithRedux,
  ['prompt'],
  ['setPrompt']
)
