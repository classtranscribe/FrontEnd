import React, {useEffect} from 'react';
import { connect } from 'dva'
import {
  transControl,
  NORMAL_MODE,
  SEARCH_INIT,
  SEARCH_HIDE,
  TRANSCRIPT_VIEW,
  LINE_VIEW,
  ARRAY_EMPTY,
} from '../../Utils';
import './index.css';

import CaptionLine from './CaptionLine';
import TranscriptText from './TranscriptText';

import PlaceHolder from './PlaceHolder';

function TranscriptionsWithRedux(props) {
  const {
    transcript = [],
    currCaption,
    mode = NORMAL_MODE,
    transView = LINE_VIEW,
    currEditing = null,
    search = SEARCH_INIT,
    dispatch
  } = props;
  // console.log(transcript, props, "TSC")
  const handleMourseOver = (bool) => () => {
    dispatch({ type: 'watch/setMouseOnCaption', payload: bool });
  };

  const isCurrent = (id) => {
    return Boolean(currCaption) && currCaption.id === id;
    // || (Boolean(currDescription) && currDescription.id === id)
  };

  const displayTrans = search.status === SEARCH_HIDE || true;
  useEffect(() => {
    if (currCaption != null) {
      console.log("brooo please")
      var z = document.getElementById("caption-line-" + (currCaption- 5))
      if (z != null) {
        console.log("caption-line-" + currCaption)
        z.scrollIntoView()
      }
    }
  }, [currCaption])
  console.log(currCaption)

  return displayTrans ? (
    <div id="watch-trans-container" className="watch-trans-container" mode={mode}>
      <div
        className="trans-box"
        onMouseEnter={handleMourseOver(true)}
        onMouseLeave={handleMourseOver(false)}
      >
        {transcript.length === 0 ? (
          <PlaceHolder />
        ) : transcript === ARRAY_EMPTY ? (
          <div className="w-100 d-flex justify-content-center text-muted text-uppercase">
            No Transcriptions
          </div>
        ) : transView === LINE_VIEW ? (
          <div className="trans-list">
            {transcript.map(function(caption, index) {
              console.log(caption);
              return <CaptionLine
                key={index}
                caption={caption}
                currCaption={currCaption}
                isCurrent={isCurrent(caption.id)}
                dispatch={dispatch}
                isEditing={Boolean(currEditing) && currEditing.id === caption.id}
              />
            })}
          </div>
        ) : transView === TRANSCRIPT_VIEW ? (
          <div className="trans-article">
            {transcript.map((caption, index) => (
              <TranscriptText
                key={index}
                caption={caption}
                isCurrent={isCurrent(caption.id)}
                dispatch={dispatch}
              />
            ))}
          </div>
        ) : null}
        {/* @TODO Add prompt 'Only 50 lines after current caption are displayed' */}
      </div>
    </div>
  ) : null;
}

export const Transcriptions = connect(({ playerpref: { transView },
  watch: { transcript, currCaption, currEditing, bulkEditing, mode, search, }, loading }) => ({
    transView,
    transcript, currCaption, currEditing, bulkEditing, mode, search,
  }))(TranscriptionsWithRedux);
