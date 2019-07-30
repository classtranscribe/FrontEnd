import React from 'react';
// UIs
import { Modal, Button } from 'semantic-ui-react'
import './index.css'

/**
 * General modal
 */
export function GeneralModal({size, open, onClose, header, children, button}) {
  return (
    <Modal 
      className="general-modal" 
      size={size || 'small'} dimmer='inverted'
      open={open} onClose={onClose}
    >
      <Modal.Header className="gm-header">{header}</Modal.Header>
      {
        children 
        && 
        <Modal.Content image className="gm-content">
          {children}
        </Modal.Content>
      }
      <Modal.Actions className="gm-action">
        {button}
      </Modal.Actions>
    </Modal>
  )
}

/**
 * General Modal used to confirm the deletion
 */
export function DeleteModal({open, target, onSave, onClose}) {
  return (
    <Modal 
      className="general-modal"
      size="tiny" dimmer
      open={open} onClose={onClose}
    >
      <Modal.Header>Are you sure you want to delete the 
        <strong className="delete-target"> {target}</strong>?<br/>
        (This action cannot be undone)
      </Modal.Header>
      <Modal.Actions>
        <Button 
          color='black' 
          onClick={onClose}
          content="Cancel"
          title="cancel"
          aria-label="cancel"
        />
        <Button
          negative
          icon='trash'
          labelPosition='right'
          content="Delete Forever"
          onClick={onSave}
          title="delete forever"
          aria-label="delete forever"
        />
      </Modal.Actions>
    </Modal>
  )
}


