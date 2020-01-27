import React from 'react'
import { connectWithRedux } from '_redux/instructor'
import { CTButton } from 'components'
import { setup } from '../../Utils'
import './index.css'

const DEFAULT_DESCRIP = 'This action cannot be undone.'

function ConfirmationWithRedux({
  confirmation=null
}) {  

  const onClose = () => {
    setup.confirm(null)
  }

  const onConfirm = () => {
    if (confirmation) {
      confirmation.onConfirm()
    }

    onClose()
  }

  return confirmation ? (
    <div className="ip-cf-bg ct-d-c-center">
      <div className="ip-cf-con">
        {/* Header */}
        <div className="ip-cf-h-con">
          <h3>{confirmation.title || ' '}</h3>
          <button 
            className="plain-btn ip-cf-close-btn" 
            onClick={onClose} 
          >
            <span tabIndex="-1">
              <i className="material-icons">close</i>
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="ip-cf-text-con">
          <div className="ip-cf-text">{confirmation.text}</div>
          <div className="ip-cf-text description">{confirmation.notice || DEFAULT_DESCRIP}</div>
        </div>

        <div className="ip-cf-act ct-btn-group">
          <CTButton 
            text="Confirm"
            color="green"
            onClick={onConfirm}
          />
          <CTButton 
            text="Cancel"
            color="text-green"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  ) : null
}

export const Confirmation = connectWithRedux(
  ConfirmationWithRedux,
  ['confirmation'],
  []
)