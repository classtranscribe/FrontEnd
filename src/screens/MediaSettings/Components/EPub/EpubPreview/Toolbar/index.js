import React, { useEffect } from 'react'
import { Button } from 'pico-ui'
import { epub, EDITOR_NONE, EDITOR_RICHTEXT } from 'screens/MediaSettings/Utils'
import './index.scss'
import { LanguageMenuTrigger } from '../../LanguageMenuTrigger'
import EditorPicker from './EditorPicker'
import { util } from 'utils'


export default function Toolbar({
  language,
  editor,
  setEditor,
}) {

  const editEpubContent = () => {
    setEditor(EDITOR_RICHTEXT)
  }

  const saveEditing = () => {
    setEditor(EDITOR_NONE)
  }

  useEffect(() => {
    let editorEl = document.getElementById('msp-ee-editor')
    if (editorEl) {
      editorEl.scrollIntoView()
    }
  }, [editor])

  return (
    <div className="msp-ee-ep-tb ct-a-fade-in">
      <LanguageMenuTrigger
        language={language}
        classNames="ee-tb-btn"
      />

      <div className="ee-tb-btns">
        {
          editor === EDITOR_NONE
          ?
          <div className="ee-tb-edit-btns">
            <Button classNames="ee-tb-btn" color="transparent" icon="post_add">
              Add Audio Description
            </Button>
            <Button 
              classNames="ee-tb-btn" 
              color="transparent" 
              icon="edit"
              onClick={editEpubContent}
            >
              Edit Content
            </Button>
          </div>
          :
          <div className="ee-tb-edit-btns ct-a-fade-in">
            <EditorPicker
              editor={editor}
              setEditor={setEditor}
            />
            <Button 
              classNames="ee-tb-btn" 
              color="teal" 
              icon="check"
              onClick={saveEditing}
            >
              Save Changes
            </Button>
          </div>
        }

        <Button round
          classNames="ee-tb-btn ee-tb-btn-me" 
          color="black" 
          icon="edit"
          onClick={() => epub.isEditingEpub(true)}
        >
          Manage Chapters
        </Button>
        <Button round
          classNames="ee-tb-btn ee-tb-btn-me" 
          color="black" 
          icon="get_app"
          onClick={() => epub.download()}
        >
          Download ePub
        </Button>
      </div>
    </div>
  )
}
