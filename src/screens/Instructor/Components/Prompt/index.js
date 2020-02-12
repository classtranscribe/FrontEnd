import React, { useEffect } from 'react'
import { connectWithRedux } from '../../../../_redux/instructor'
import './index.css'
import { promptControl } from '../../Utils'

function PromptsWithRedux({
  prompt=null,
}) {

  const {
    status='success',
    type='',
    text='test',
    position='bottom right',
    timeout=-1,
  } = prompt || {}

  useEffect(() => {
    if (Boolean(prompt) && timeout > 0) {
      promptControl.close(timeout)
    }
  }, [prompt])

  const onClose = () => {
    promptControl.close()
  }

  return Boolean(prompt) ? (
    <div className={`ip-prompt ${status} ${position}`}>
      <div className="ip-pt-box">
        <div className="ip-pt-text">
          {text}
        </div>
        <button className="plain-btn ip-pt-close-btn" onClick={onClose}>
          <i className="material-icons">close</i>
        </button>
      </div>
    </div>
  ) : null
}

export const Prompts = connectWithRedux(
  PromptsWithRedux,
  ['prompt'],
  []
)
