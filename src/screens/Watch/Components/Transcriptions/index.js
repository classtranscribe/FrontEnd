import React, {useEffect, useState} from 'react';
import { connect } from 'dva'
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
import { List, AutoSizer } from "react-virtualized";

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
  let [scrollHere, setScrollHere] = useState(0);

  const displayTrans = search.status === SEARCH_HIDE || true;
  let [prevNull, setPrevNull] = useState(false);
  /**
   * There are two cases
   * 1. No seeking has been done. We can center the current caption using good ol html
   * 
   * 2. Seeking has been done, or someone has done something weird. We can be 100% if trying to get the current
   * caption is null and the previous one was also null
   */
  useEffect(() => {
    if (currCaption != null && liveMode) {
      if (true) {


        //try and get the current caption
        let z = document.getElementById(`caption-line-${currCaption.startTime}`)

        //if it isnt null just set the previous to false
        if (z !== null) {
          console.log("well now im here")
          setPrevNull(false);
        }

        //determine if we need to use any list scrolling behavior
        let toVerify = false;
        if (z === null && prevNull === true) {
          toVerify = true;
        }

        //if curr caption (soon to be previous) is null set previous to true.
        if (z === null) {
          setPrevNull(true);
        }

        // use list interface to scroll to the correct place
          if (toVerify == true) {
          for (let i = 0; i < transcript.length; i += 1) {
            if (transcript[i].text === currCaption.text ) {

              //5 is just arbitrary. It plops us to the centerish
              i + 5 < transcript.length ? setScrollHere(i + 5) : setScrollHere(transcript.length - 1);
              break;

            }

          }
        }
        // use good ol html for final scrolling and centering
        if (z === null) {
          z = document.getElementById(`caption-line-${currCaption.startTime}`)
        }

        if (z != null) {
          z.scrollIntoView({block: "center", behavior: "smooth"})
          setScrollHere(undefined)

        }

        
      }
    }
  }, [currCaption, currCaptionIndex, currentTime])


  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    return (
    <div key = {key} style = {style}>
    <CaptionLine
      key={liveMode ? String(transcript[index].text) + String(transcript[index].startTime): transcript[index].id}
      caption={transcript[index]}
      currCaption={currCaption}
      fontSize = {fontSize}
      isCurrent={liveMode ? isCurrent(transcript[index].text + String(transcript[index].startTime)) : isCurrent(transcript[index].id)}
      dispatch={dispatch}
      isEditing={Boolean(currEditing) && currEditing.id === transcript[index].id}
    />
    </div>
    
    );
  }
  

  return displayTrans ? (
    <div id="watch-trans-container" className="watch-trans-container" mode={mode}>
      {/* <div
        className="trans-box"
        onMouseEnter={handleMourseOver(true)}
        onMouseLeave={handleMourseOver(false)}
      > */}
        {transcript.length === 0 ? (
          <PlaceHolder />
        ) : transcript === ARRAY_EMPTY ? (
          <div className="w-100 d-flex justify-content-center text-muted text-uppercase">
            No Transcriptions
          </div>
        ) : transView === LINE_VIEW ? (
            <AutoSizer>
            {({height, width}) => (

            <List

              width={width}
              height={height}
              scrollToIndex = {scrollHere}

              // containerStyle={{
              //   width: "100%",
              //   maxWidth: "100%"
              // }}
              style={{
                paddingTop: '20px',
                paddingBottom: '300px',
              }}
            
  
      

              rowHeight={50}

              rowCount = {transcript? transcript.length : 0}
              rowRenderer = {rowRenderer}
            
            
            />

            )}
   
            </AutoSizer>


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
      {/* </div> */}
    </div>
  ) : null;
}
// transcript.map((caption, index) => {
//   return <CaptionLine
//     key={liveMode ? String(caption.text) + String(caption.startTime): caption.id}
//     caption={caption}
//     currCaption={currCaption}
//     isCurrent={liveMode ? isCurrent(caption.text + String(caption.startTime)) : isCurrent(caption.id)}
//     dispatch={dispatch}
//     isEditing={Boolean(currEditing) && currEditing.id === caption.id}
//   />
// })
export const Transcriptions = connect(({ playerpref: { transView },
  watch: { transcript, currCaption, currEditing, bulkEditing, mode, search, updating, currCaptionIndex, currentTime, liveMode, fontSize}, loading }) => ({
    transView,
    transcript, currCaption, currEditing, bulkEditing, mode, search,updating, currCaptionIndex, currentTime, liveMode, fontSize
  }))(TranscriptionsWithRedux);
