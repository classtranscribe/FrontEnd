import React from 'react'
import { setup } from 'screens/MediaSettings/Utils'

export const controls = [
  'undo', 'redo', 'separator',
  'font-size', 'line-height', 'separator',
  'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
  'superscript', 'subscript', 'remove-styles',  'separator', 'text-indent', 'text-align', 'separator',
  'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
  'hr', 'separator'
]

const enterFullscreen = () => setup.enterFullscreen('msp-ee-editor')
const exitFullscreen = () => setup.exitFullscreen()

export const getExtendControls = fullscreen => ([
  'separator',
  {
    key: 'my-fullscreen',
    type: 'button',
    title: fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen',
    // className: 'my-button',
    text: <i className="material-icons">{fullscreen ? "fullscreen_exit" : "fullscreen"}</i>,
    onClick: fullscreen ? exitFullscreen : enterFullscreen,
  }
])
