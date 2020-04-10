import React from 'react'
import BraftEditor from 'braft-editor'
import { controls } from './controls'

export function RichTextEditor({
  text
}) {

  const editorState = BraftEditor.createEditorState(text)

  return (
    <div id="msp-ee-editor" className="msp-ee-editor ct-a-fade-in">
      <BraftEditor
        language="en"
        className="msp-ee-braft-editor"
        controls={controls}
        controlBarStyle={{borderRadius: '5px 5px 0 0'}}
        contentStyle={{height: '500px', paddingTop: '7px'}}
        defaultValue={editorState}
      />
    </div>
  )
}
