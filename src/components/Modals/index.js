import React from 'react'
import { Modal } from 'semantic-ui-react'
import { Button } from 'pico-ui'
import './index.scss'

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

export function CTModal({
  show=false,
  title='',
  large=false,
  children,
  // actions
  actions,
  onClose,
  onSave,
  saveBtnText='Save',
  cancelBtnText='Cancel'
}) {

  let modalStyle = large ? ' large' : ''
  return show ? (

    <div className="ct-modal ct-d-c-center ct-a-fade-in">
      <div className={"ct-mdl-con" + modalStyle}>
        {/* Header */}
        <div className="ct-mdl-h-con">
          <h3>{title}</h3>
          <Button round
            icon="close"
            color="transparent"
            onClick={onClose} 
          />
        </div>

        {/* Content */}
        <div className="ct-mdl-text-con">
          {children}
        </div>

        <div className="ct-mdl-act">
          {
            actions 
            ?
            actions
            :
            <Button.Group>
              <Button uppercase compact
                text={saveBtnText}
                color="transparent teal"
                onClick={onSave}
              />
              <Button uppercase compact
                text={cancelBtnText}
                color="teal"
                onClick={onClose}
              />
            </Button.Group>
          }
        </div>
      </div>
    </div>
  ) : null
}
