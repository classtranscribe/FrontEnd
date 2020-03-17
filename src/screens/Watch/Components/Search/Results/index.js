import React, { useState,useEffect } from 'react'
import ResultList from './ResultList'
import Placeholder from '../Placeholder'
import { 
  searchControl, 
  preferControl,
  SEARCH_INIT, 
  SEARCH_RESULT, 
  SEARCH_BEGIN, 
} from '../../../Utils'
import { util } from '../../../../../utils'
import './index.css'

function Results({
  search=SEARCH_INIT
}) {

  const { value='', status=SEARCH_BEGIN } = search

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

  const resultOptions = searchControl.getResultOptions(search, option)

  useEffect(() => {
    setPage(1)
  }, [search])

  return (
    <div className="watch-search-result-container">
      {
        status !== SEARCH_RESULT ?
        null
        :
        <>
        {/* Result Option Tabs */}
          <div className="search-result-options">
            Found
            {resultOptions.map( opt => (
              <button 
                className="plain-btn watch-search-btn search-options-btn"
                current={opt.current.toString()}
                onClick={handleChangeOption(opt.opt)}
                aria-label={opt.content}
                key={`result-option-${opt.opt}`}
              >
                <span tabIndex="-1">
                  { opt.init ? <Placeholder small /> : `${opt.content}` }
                </span>
              </button>
            ))}
            for '{value}'
          </div>

          {/* List of results */}
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