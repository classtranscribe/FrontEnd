import React from 'react'
import { Modal } from 'semantic-ui-react'
import './index.css'

/**
 * General modal
 */
export function GeneralModal({size, open, onClose, header, children, button, dimmer}) {
  return (
    <Modal 
      className="general-modal" 
      size={size || 'small'} 
      open={open} onClose={onClose}
      dimmer={dimmer}
    >
      {header && <Modal.Header className="gm-header">{header}</Modal.Header>}
      {
        children 
        && 
        <Modal.Content image className="gm-content">
          {children}
        </Modal.Content>
      }
      {button && <Modal.Actions className="gm-action">{button}</Modal.Actions>}
    </Modal>
  )
}
