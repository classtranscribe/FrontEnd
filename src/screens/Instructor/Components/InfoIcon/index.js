import React from 'react'
import { Popup } from 'semantic-ui-react'
import './index.css'

export function InfoIcon({
  header,
  content=null,
}) {

  return (
    <div className="ip-info-icon-con">
      <Popup basic hoverable
        closeOnTriggerBlur
        openOnTriggerFocus
        openOnTriggerClick
        header={header}
        content={content}
        trigger={
          <div tabIndex="0" className="ip-info-icon">
            <i className="material-icons">info</i>
          </div>
        }
      />
    </div>
  )
}