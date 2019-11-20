import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/watch'
import {
  transControl, 
  NORMAL_MODE, LINE_VIEW
} from '../../Utils'
import './index.css'
import { TransCtrlButtons } from '../Overlays'
import CaptionLine from './CaptionLine'
import TranscriptText from './TranscriptText'
import PlaceHolder from './PlaceHolder'

function TranscriptionsWithRedux({
  transcript=[],
  currCaption={},
  mode=NORMAL_MODE,
  transView=LINE_VIEW,
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
      mode={mode}
    >
      <TransCtrlButtons />
      <div 
        className="trans-box"
        onMouseEnter={handleMourseOver(true)}
        onMouseLeave={handleMourseOver(false)}
      >
        {
          loadingtranscript ? 
          <PlaceHolder />
          :
          transView === LINE_VIEW ?
          <div className="trans-list">
            {transcript.map( (caption, index) => (
              <CaptionLine
                key={caption.id}
                caption={caption}
                isCurrent={isCurrent(caption.id)}
                isEditing={Boolean(currEditing) && currEditing.id === caption.id}
                shouldHide={Boolean(currCaption) && (index - currCaption.index > 50)}
              />
            ))}
          </div>
          :
          <div className="trans-article">
            {transcript.map( (caption, index) => (
              <TranscriptText
                key={caption.id}
                caption={caption}
                isCurrent={isCurrent(caption.id)}
              />
            ))}
          </div>
        }
        {/* @TODO Add prompt 'Only 50 lines after current caption are displayed' */}
      </div>
    </div>
  )
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  ['transcript', 'currCaption', 'currEditing', 'mode', 'transView'],
  []
)