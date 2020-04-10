import React from 'react'
import BraftEditor from 'braft-editor'
import { controls } from './controls'

export function RichTextEditor({
  text
}) {

  const editorState = BraftEditor.createEditorState(text)

  return (
    <div id="msp-ee-editor" className="msp-ee-editor">
      <BraftEditor
        language="en"
        className="msp-ee-braft-editor"
        controls={controls}
        contentStyle={{height: 'auto', paddingTop: '7px'}}
        defaultValue={editorState}
      />
    </div>
  )
}
