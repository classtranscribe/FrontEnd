import React from 'react'
import ChapterView from '../ChapterView'

export default function EpubPreview({
  currChapter
}) {
  return (
    <div className="msp-ee-ep-con ct-a-fade-in">
      <ChapterView shadow round
        chapter={currChapter} 
      />
    </div>
  )
}
