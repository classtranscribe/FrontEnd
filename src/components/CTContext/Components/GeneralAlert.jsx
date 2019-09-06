import React from 'react'
import { Alert } from 'react-bootstrap'

export default function GeneralAlert({ mesg, onClose }) {
  if (!mesg) return null

  const isString = typeof mesg === 'string'
  const header = isString ? null : mesg.header
  const text = isString ? mesg : mesg.text
  const isTop = mesg.position === 'top'
  return (
    <div className="context-alert">
      <Alert id={`alert-${isTop ? 'top' : 'bottom'}`} variant={mesg.type || "success"} dismissible={isTop} onClose={onClose}>
        {header && <Alert.Heading>{header}</Alert.Heading>}
        {text}
      </Alert>
    </div>
  )
}