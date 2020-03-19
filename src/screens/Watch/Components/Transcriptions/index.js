import React, { useEffect, useState } from 'react'
import {
  connectWithRedux,
  transControl, 
  NORMAL_MODE, 
  SEARCH_INIT, SEARCH_HIDE, 
  TRANSCRIPT_VIEW, LINE_VIEW, 
  ARRAY_EMPTY,
} from '../../Utils'
import './index.css'

import CaptionLine from './CaptionLine'
import TranscriptText from './TranscriptText'
import BulkEdit from './BulkEdit'

import PlaceHolder from './PlaceHolder'

function TranscriptionsWithRedux({
  transcript=[],
  currCaption={},
  bulkEditing=false,
  mode=NORMAL_MODE,
  transView=LINE_VIEW,
  currEditing=null,
  search=SEARCH_INIT
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

  const displayTrans = search.status === SEARCH_HIDE || true

  return displayTrans ? (
    <div 
      id="watch-trans-container" 
      className="watch-trans-container"
      mode={mode}
    >
      <div 
        className="trans-box"
        onMouseEnter={handleMourseOver(true)}
        onMouseLeave={handleMourseOver(false)}
      >
        {
          transcript.length === 0 ? 
          <PlaceHolder />
          :
          transcript === ARRAY_EMPTY ?
          <div className="w-100 d-flex justify-content-center text-muted text-uppercase">
            No Transcriptions
          </div>
          :
          bulkEditing ?
          <BulkEdit transcript={transcript} />
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
          transView === TRANSCRIPT_VIEW ?
          <div className="trans-article">
            {transcript.map( (caption, index) => (
              <TranscriptText
                key={caption.id}
                caption={caption}
                isCurrent={isCurrent(caption.id)}
              />
            ))}
          </div>
          : null
        }
        {/* @TODO Add prompt 'Only 50 lines after current caption are displayed' */}
      </div>
    </div>
  ) : null
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  [
    'transcript', 'currCaption', 'currEditing', 'bulkEditing',
    'mode', 'transView', 'search'
  ],
  []
)