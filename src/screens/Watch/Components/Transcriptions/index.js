import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/watch'
import {
  transControl
} from '../../Utils'
import './index.css'
import CaptionLine from './CaptionLine'
import PlaceHolder from './PlaceHolder'

function TranscriptionsWithRedux({
  transcript=[],
  currCaption={},
  currDescription={},
  currEditing=null,
}) {

  const [loadingtranscript, setLoadingtranscript] = useState(true)
  useEffect(() => {
    if (transcript[0]) {
      setLoadingtranscript(false)
    }
  }, [transcript])

  const handleMourseOver = bool => () => {
    transControl.handleMourseOver(bool)
  }

  const isCurrent = id => {
    return (Boolean(currCaption) && currCaption.id === id)
        // || (Boolean(currDescription) && currDescription.id === id)
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
            loadingtranscript ? 
            <PlaceHolder />
            :
            transcript.map( (caption, index) => (
              <CaptionLine
                key={caption.id}
                caption={caption}
                isCurrent={isCurrent(caption.id)}
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
  ['transcript', 'currCaption', 'currDescription', 'currEditing'],
  []
)