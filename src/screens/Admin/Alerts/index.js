import React from 'react';
import { Alert } from 'react-bootstrap';
import './index.css';

import alertMesgs from './AlertMesgs';

export function GeneralAlert({ width, fixed, open, type, onClose }) {
  const mesg = alertMesgs[type];
  return (
    <Alert
      show={open}
      dismissible={!fixed}
      className="general-alert"
      style={{ width: width ? `${width}%` : '100%' }}
      variant={mesg.status}
      onClose={onClose}
    >
      {mesg.header ? <Alert.Heading>{mesg.header}</Alert.Heading> : <></>}
      {mesg.detail ? <p>{mesg.detail}</p> : <></>}
    </Alert>
  );
}
