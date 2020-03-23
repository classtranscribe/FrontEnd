import React from 'react'
import ChapterView from '../ChapterView'

export default function EpubPreview({
  currChapter,
  pickCoverImage,
  magnifiedImg,
}) {
  return (
    <div className="msp-ee-ep-con ct-a-fade-in">
      <ChapterView shadow round
        chapter={currChapter} 
        imageOnClick={pickCoverImage}
        imageOnClickPrompt="Click to choose cover image"
      />
    </div>
  )
}
