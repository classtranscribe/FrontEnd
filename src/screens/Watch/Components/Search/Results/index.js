import React, { useState } from 'react'
import ResultList from './ResultList'
import Placeholder from '../Placeholder'
import { 
  // searchControl, 
  SEARCH_INIT, SEARCH_RESULT, SEARCH_TRANS_IN_VIDEO, SEARCH_TRANS_IN_COURSE, SEARCH_IN_PLAYLISTS, ARRAY_INIT, ARRAY_EMPTY, 
  preferControl,
} from '../../../Utils'
import { util } from 'utils'
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
  const [page, setPage] = useState(1) // 20 results per page

  const handleChangeOption = opt => () => {
    setOption(opt)
    preferControl.defaultSearchOption(opt)
    setPage(1)
  }

  const nextPage = () => {
    setPage(page + 1)
    util.scrollToTop('.watch-search-result-container')
  }

  const prevPage = () => {
    setPage(page - 1)
    util.scrollToTop('.watch-search-result-container')
  }

  const resultNum = results => {
    if (results === ARRAY_INIT || results === ARRAY_EMPTY) return 0
    return results.length
  }

  const inVideoTransResultsNum = resultNum(inVideoTransResults)
  const inCourseTransResultsNum = resultNum(inCourseTransResults)
  const playlistResultsNum = resultNum(playlistResults)

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
              className="plain-btn watch-search-btn search-options-btn"
              current={Boolean(option === SEARCH_TRANS_IN_VIDEO).toString()}
              onClick={handleChangeOption(SEARCH_TRANS_IN_VIDEO)}
              aria-label={`${inVideoTransResultsNum} caption(s) in this video`}
            >
              <span tabIndex="-1">
                {inVideoTransResultsNum >= 100 ? '99+' : inVideoTransResultsNum} caption(s) in this video
              </span>
            </button>,
            <button 
              className="plain-btn watch-search-btn search-options-btn"
              current={Boolean(option === SEARCH_IN_PLAYLISTS).toString()}
              onClick={handleChangeOption(SEARCH_IN_PLAYLISTS)}
              aria-label={`${playlistResultsNum} video(s) in this course`}
            >
              <span tabIndex="-1">
                {playlistResultsNum >= 100 ? '99+' : playlistResultsNum} video(s) in this course
              </span>
            </button>,
            <button 
              className="plain-btn watch-search-btn search-options-btn"
              current={Boolean(option === SEARCH_TRANS_IN_COURSE).toString()}
              onClick={handleChangeOption(SEARCH_TRANS_IN_COURSE)}
              aria-label={`${inCourseTransResultsNum} caption(s) in this course`}
            >
              <span tabIndex="-1">
                {
                  inCourseTransResults === ARRAY_INIT ?
                  <Placeholder small />
                  :
                  `${inCourseTransResultsNum >= 100 ? '99+' : inCourseTransResultsNum} caption(s) in this course`
                }
              </span>
            </button>
            for '{value}'
          </div>

          <ResultList 
            search={search}
            option={option}
            page={page}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </>
      }
    </div>
  )
}

export default Results