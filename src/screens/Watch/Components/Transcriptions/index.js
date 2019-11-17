import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/watch'
import {
  transControl
} from '../../Utils'
import './index.css'
import CaptionLine from './CaptionLine'
import PlaceHolder from './PlaceHolder'

function TranscriptionsWithRedux({
  captions=[],
  currCaption={},
  currEditing=null,
}) {

  const [loadingCaptions, setLoadingCaptions] = useState(true)
  useEffect(() => {
    if (captions[0]) {
      setLoadingCaptions(false)
    }
  }, [captions])

  const handleMourseOver = bool => () => {
    transControl.handleMourseOver(bool)
  }


  return (
    <div 
      id="watch-trans-container" 
      className="watch-trans-container"
    >
      <div 
        className="trans-list-box"
        onMouseEnter={handleMourseOver(true)}
        onMouseLeave={handleMourseOver(false)}
      >
        <div className="trans-list">
          {
            loadingCaptions ? 
            <PlaceHolder />
            :
            captions.map( (caption, index) => (
              <CaptionLine
                key={caption.id}
                caption={caption}
                isCurrent={Boolean(currCaption) && currCaption.id === caption.id}
                isEditing={Boolean(currEditing) && currEditing.id === caption.id}
                captionIndex={index}
                shouldHide={Boolean(currCaption) && (index - currCaption.index > 50)}
              />
            ))
          }
        </div>
        {/* @TODO Add prompt 'Only 50 lines after current caption are displayed' */}
      </div>
    </div>
  )
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  ['captions', 'currCaption', 'currEditing'],
  []
)