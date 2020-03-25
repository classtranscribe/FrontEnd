import React, { useEffect } from 'react'
import ChapterView from './ChapterView'
import { connectWithRedux } from '../../Utils'

var lastChapterId = ''

function EpubPreviewWithRedux({
  currChapter,
  pickCoverImage,
  isEditingEpub=false,
}) {

  useEffect(() => {
    // Scroll the preview to top everytime the chapter changed
    if (currChapter.id !== lastChapterId) {
      let previewEl = document.getElementById('msp-ee-ep-con')
      if (previewEl) {
        previewEl.scrollTop = 0
      }
    }
    lastChapterId = currChapter.id
  }, [currChapter])

  return (
    <div 
      id="msp-ee-ep-con" 
      className="msp-ee-ep-con ct-a-fade-in"
      data-editing={isEditingEpub}
    >
      <ChapterView shadow round
        contentEditable={!isEditingEpub}
        chapter={currChapter} 
        imageOnClick={pickCoverImage}
        imageOnClickPrompt="Click to choose cover image"
      />
    </div>
  )
}

export default connectWithRedux(
  EpubPreviewWithRedux,
  ['isEditingEpub'],
  []
)
