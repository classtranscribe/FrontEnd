import React from 'react'
import { Alert } from 'react-bootstrap'
import './index.css'

import alertMesgs from './AlertMesgs'

/**
 * General Alert Component 
 * @param width num || '100'
 * @param fixed true if the alert is not dismissible
 * @param open true if show the alert 
 * @param type enum - mapping to the alertMesgs object above
 * @param onClose function to close the alert
 */
export function GeneralAlert({width, fixed, open, type, onClose}) {
  const mesg = alertMesgs[type]
  return (
    <Alert 
      show={open} dismissible={!fixed}
      className="general-alert" style={{width: width ? width+'%' : '100%'}}
      variant={mesg.status} onClose={onClose} 
    >
      { mesg.header ? <Alert.Heading>{mesg.header}</Alert.Heading> : <></>}
      { mesg.detail ? <p>{mesg.detail}</p>: <></>}
    </Alert>
  )
}