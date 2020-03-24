import React, { useEffect } from 'react'
import ChapterView from './ChapterView'

var lastChapterId = ''

export default function EpubPreview({
  currChapter,
  pickCoverImage,
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
    <div id="msp-ee-ep-con" className="msp-ee-ep-con ct-a-fade-in">
      <ChapterView shadow round
        chapter={currChapter} 
        imageOnClick={pickCoverImage}
        imageOnClickPrompt="Click to choose cover image"
      />
    </div>
  )
}
