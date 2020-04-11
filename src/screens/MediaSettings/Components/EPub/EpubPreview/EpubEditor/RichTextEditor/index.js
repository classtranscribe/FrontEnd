import React, { useState, useEffect } from 'react'
import BraftEditor from 'braft-editor'
import { setup } from 'screens/MediaSettings/Utils'
import { controls, getExtendControls } from './controls'

export function RichTextEditor({
  text
}) {

  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullscreen(fullscreen => !fullscreen)
      let editorEl = document.getElementById('msp-ee-editor')
      if (editorEl) {
        editorEl.scrollIntoView()
      }
    })
  }, [])

  const editorState = BraftEditor.createEditorState(text)

  return (
    <div id="msp-ee-editor" className="msp-ee-editor ct-a-fade-in">
      <BraftEditor
        language="en"
        className="msp-ee-braft-editor"
        controls={controls}
        controlBarStyle={{borderRadius: '5px 5px 0 0'}}
        contentStyle={{height: fullscreen ? '90vh' : '500px', paddingTop: '7px'}}
        defaultValue={editorState}
        extendControls={getExtendControls(fullscreen)}
      />
    </div>
  )
}
