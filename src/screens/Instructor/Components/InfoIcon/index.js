import React from 'react';
import { Popup } from 'semantic-ui-react';
import './index.css';

export function InfoIcon({ header, content = null, important = false }) {
  return (
    <div className="ip-info-icon-con">
      <Popup
        basic
        hoverable
        wide
        closeOnTriggerBlur
        openOnTriggerFocus
        openOnTriggerClick
        content={
          <div>
            <h3>{header}</h3>
            <div>{content}</div>
          </div>
        }
        trigger={
          <div tabIndex="0" className={`ip-info-icon${important ? ' important' : ''}`}>
            <i className="material-icons">info</i>
          </div>
        }
      />
    </div>
  );
}
