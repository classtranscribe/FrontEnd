import React from 'react'
import { Button } from 'pico-ui'
import { connectWithRedux, setup } from '../../Utils'
import './index.css'
import { CTModal } from '../../../../components'

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
    <CTModal show closeOnBlur
      title={confirmation.title || 'delete confirmation'}
      saveBtnText="Confirm"
      onClose={onClose}
      onSave={onConfirm}
    >
      <div className="ip-cf-text">{confirmation.text}</div>
      <div className="ip-cf-text description">{confirmation.notice || DEFAULT_DESCRIP}</div>
    </CTModal>
  ) : null

  // return confirmation ? (
  //   <div className="ip-cf-bg ct-d-c-center">
  //     <div className="ip-cf-con">
  //       {/* Header */}
  //       <div className="ip-cf-h-con">
  //         <h3>{confirmation.title || 'delete confirmation'}</h3>
  //         <Button round
  //           icon="close"
  //           color="transparent"
  //           onClick={onClose} 
  //         />
  //       </div>

  //       {/* Content */}
  //       <div className="ip-cf-text-con">
  //         <div className="ip-cf-text">{confirmation.text}</div>
  //         <div className="ip-cf-text description">{confirmation.notice || DEFAULT_DESCRIP}</div>
  //       </div>

  //       <div className="ip-cf-act ct-btn-group">
  //         <Button.Group>
  //           <Button uppercase compact
  //             text="Confirm"
  //             color="transparent teal"
  //             onClick={onConfirm}
  //           />
  //           <Button uppercase compact
  //             text="Cancel"
  //             color="teal"
  //             onClick={onClose}
  //           />
  //         </Button.Group>
  //       </div>
  //     </div>
  //   </div>
  // ) : null
}

export const Confirmation = connectWithRedux(
  ConfirmationWithRedux,
  ['confirmation'],
  []
)