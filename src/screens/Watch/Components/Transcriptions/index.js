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
  setCurrEditing=null
}) {

  const [loadingCaptions, setLoadingCaptions] = useState(true)
  useEffect(() => {
    if (captions[0]) {
      setLoadingCaptions(false)
    }
  }, [captions])

  useEffect(() => {
    // scroll to view
    if(Boolean(currCaption) && Boolean(currCaption.id))
    transControl.scrollTransToView(currCaption.id)
  }, [currCaption])

  const onEditing = caption => {
    transControl.editCaption(caption)
  }

  const onSave = value => {

  }

  const handleMourseOver = bool => () => {
    transControl.isMourseOverTrans = bool
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
            captions.map( caption => (
              <CaptionLine
                key={caption.id}
                caption={caption}
                isCurrent={Boolean(currCaption) && currCaption.id === caption.id}
                isEditing={Boolean(currEditing) && currEditing.id === caption.id}
                onEditing={onEditing}
                onSave={onSave}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  ['captions', 'currCaption', 'currEditing'],
  ['setCurrEditing']
)