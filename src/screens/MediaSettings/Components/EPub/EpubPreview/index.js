import React, { useEffect, useState } from 'react'
import ChapterView from './ChapterView'
import Toolbar from './Toolbar'
import { connectWithRedux, epub, EDITOR_HTML, EDITOR_NONE } from '../../../Utils'
import './index.scss'

var lastChapterId = ''

function EpubPreviewWithRedux({
  language,
  currChapter,
  isEditingEpub=false,
}) {

  const { editorType } = epub.parseText(currChapter.text)

  const [editor, setEditor] = useState(EDITOR_NONE)

  useEffect(() => {
    // Scroll the preview to top everytime the chapter changed
    if (currChapter.id !== lastChapterId) {
      let previewEl = document.getElementById('msp-ee-ep-con')
      if (previewEl) {
        previewEl.scrollTop = 0
      }
      setEditor(EDITOR_NONE)
    }
    lastChapterId = currChapter.id
  }, [currChapter])

  useEffect(() => {
    setEditor(EDITOR_NONE)
  }, [isEditingEpub])

  const otherProps = {}
  if (!isEditingEpub) otherProps['data-scroll'] = true

  return (
    <div 
      id="msp-ee-ep-con" 
      className="msp-ee-ep-con ct-a-fade-in"
      data-editing={isEditingEpub}
      {...otherProps}
    >
      <ChapterView round
        editor={editor}
        shadow={isEditingEpub} 
        contentEditable={!isEditingEpub}
        chapter={currChapter} 
        imageOnClick={() => epub.pickCoverImage()}
        imageOnClickPrompt="Click to choose cover image"
      />

      {
        !isEditingEpub
        &&
        <Toolbar 
          chapter={currChapter} 
          language={language} 
          editor={editor}
          setEditor={setEditor}
          defaultEditor={editorType}
        />
      }
    </div>
  )
}

export default connectWithRedux(
  EpubPreviewWithRedux,
  ['isEditingEpub'],
  []
)
