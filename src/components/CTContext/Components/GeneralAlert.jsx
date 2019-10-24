import React from 'react'
import { Icon } from 'semantic-ui-react'
import { Alert } from 'react-bootstrap'
import { util } from '../../../utils'
import './GeneralAlert.css'

/**
 * 
 * mesg { 
 *  position['top', 'bottom'], 
 *  type=['success', 'danger'], 
 *  header = string, 
 *  text = string, 
 *  contactUs = boolean,
 *  refresh,
 *  onRefresh
 * }
 */
export default function GeneralAlert({ mesg, onClose }) {
  if (!mesg) return null

  const isString = typeof mesg === 'string'
  const header = isString ? null : mesg.header
  const text = isString ? mesg : mesg.text
  const isTop = mesg.position === 'top'

  // const onRefresh = mesg.onRefresh || history.push(window.location.pathname)
  return (
    <div className="context-alert">
      <Alert id={`alert-${isTop ? 'top' : 'bottom'}`} variant={mesg.type || "success"} dismissible={isTop} onClose={onClose}>
        {header && <Alert.Heading>{header}</Alert.Heading>}
        <span>
          {text}&ensp;
          {mesg.contactUs && <a href={util.links.contactUs()}>Contact Us</a>}
          {mesg.refresh && <a href={window.location.pathname}>Refresh <Icon name="redo" /></a>}
        </span>
      </Alert>
    </div>
  )
}