import React, { useState } from 'react'
import ResultList from './ResultList'
import { 
  // searchControl, 
  videoControl,
  timeStrToSec,
  SEARCH_INIT, SEARCH_RESULT, SEARCH_TRANS_IN_VIDEO, SEARCH_TRANS_IN_COURSE, SEARCH_IN_PLAYLISTS, ARRAY_INIT, ARRAY_EMPTY, preferControl,
} from '../../../Utils'
import './index.css'

function Results({
  search=SEARCH_INIT
}) {

  const { 
    inVideoTransResults=[], 
    inCourseTransResults=[], 
    playlistResults=[], 
    value='', status 
  } = search

  const [option, setOption] = useState(preferControl.defaultSearchOption())

  const handleChangeOption = opt => () => {
    setOption(opt)
    preferControl.defaultSearchOption(opt)
  }

  const resultNum = results => {
    if (results === ARRAY_INIT || results === ARRAY_EMPTY) return 0
    return results.length
  }

  return (
    <div className="watch-search-result-container">
      {
        status !== SEARCH_RESULT ?
        null
        :
        //results === ARRAY_EMPTY ?
        //<div className="search-result-empty">
          //{value && <div className="search-result-term">Found 0 result for '{value}'</div>}
        //</div>
        //:
        <>
          <div className="search-result-options">
            Found
            <button 
              className="plain-btn search-options-btn"
              current={Boolean(option === SEARCH_TRANS_IN_VIDEO).toString()}
              onClick={handleChangeOption(SEARCH_TRANS_IN_VIDEO)}
            >
              <span tabIndex="-1">
                {resultNum(inVideoTransResults)} caption(s) in this video
              </span>
            </button>
            <button 
              className="plain-btn search-options-btn"
              current={Boolean(option === SEARCH_IN_PLAYLISTS).toString()}
              onClick={handleChangeOption(SEARCH_IN_PLAYLISTS)}
            >
              <span tabIndex="-1">
                {resultNum(playlistResults)} video(s) in this course
              </span>
            </button>
            <button 
              className="plain-btn search-options-btn"
              current={Boolean(option === SEARCH_TRANS_IN_COURSE).toString()}
              onClick={handleChangeOption(SEARCH_TRANS_IN_COURSE)}
            >
              <span tabIndex="-1">
                {resultNum(inCourseTransResults)} caption(s) in this course
              </span>
            </button>
            for '{value}'
          </div>

          <ResultList 
            search={search}
            option={option}
          />
        </>
      }
    </div>
  )
}

export default Results