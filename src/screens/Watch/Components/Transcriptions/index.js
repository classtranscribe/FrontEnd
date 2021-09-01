import React, {useEffect} from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'dva';
import {
  // transControl,
  NORMAL_MODE,
  SEARCH_INIT,
  SEARCH_HIDE,
  TRANSCRIPT_VIEW,
  LINE_VIEW,
  ARRAY_EMPTY,
} from '../../Utils';

// modification for BOT live stream
import './index_liveplayer.scss';
// import './index.scss';

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
    dispatch,
    updating,
    currCaptionIndex,
    currentTime,
    liveMode,
    fontSize
  } = props;
  // console.log(transcript, props, "TSC")
  const handleMourseOver = (bool) => () => {
    dispatch({ type: 'watch/setMouseOnCaption', payload: bool });
  };
  // check text and time merge into one for key as well
  const isCurrent = (id) => {
    if (liveMode) {
      return Boolean(currCaption) && (String(currCaption.text) + String(currCaption.startTime)) === id;
    }
      return Boolean(currCaption) && currCaption.id === id;


    // || (Boolean(currDescription) && currDescription.id === id)
  };

  const displayTrans = search.status === SEARCH_HIDE || true;
  useEffect(() => {
    if (currCaption != null && liveMode) {
      if (true) {
        let z = document.getElementById(`caption-line-${currCaption.startTime}`)
        // console.log(z)
        if (z != null) {
          z.scrollIntoView({block: "center"})
        }
      }
    }
  }, [currCaption, currCaptionIndex, currentTime])

  let device = 'web';
  if (isMobile) {
    if (window.innerHeight > window.innerWidth) device = 'mobile';
  }

  return displayTrans ? (
    <div id={`watch-trans-container-${device}`} className={`watch-trans-container-${device}`} mode={mode}>
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
          <div className="trans-list" style={{zIndex: 10}}>
            {transcript.map((caption, index) => {
              return <CaptionLine
                key={liveMode ? String(caption.text) + String(caption.startTime): caption.id}
                caption={caption}
                fontSize={fontSize}
                currCaption={currCaption}
                isCurrent={liveMode ? isCurrent(caption.text + String(caption.startTime)) : isCurrent(caption.id)}
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
                isCurrent={isCurrent(index)}
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
  watch: { transcript, currCaption, currEditing, bulkEditing, mode, search, updating, currCaptionIndex, currentTime, liveMode, fontSize}, loading }) => ({
    transView,
    transcript, currCaption, currEditing, bulkEditing, mode, search,updating, currCaptionIndex, currentTime, liveMode, fontSize
  }))(TranscriptionsWithRedux);
