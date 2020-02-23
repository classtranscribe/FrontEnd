import React, { useRef, useEffect } from 'react'
import { 
  searchControl, 
  SEARCH_INIT, SEARCH_RESULT
} from '../../../Utils'
import { util } from '../../../../../utils'
import './index.css'

function InputBar({
  search=SEARCH_INIT,
}) {

  const inputRef = useRef()
  const inputPlaceholder = 'Search Transcriptions, Videos...'

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const clearInput = () => {
    inputRef.current.value = ''
    searchControl.resetResult()
    inputRef.current.focus()
  }

  const handleSearch = () => {
    inputRef.current.focus()
    util.scrollToTop('.watch-search-result-container')
    searchControl.getResults(inputRef.current.value)
  }

  const handleOnKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleClose = () => {
    searchControl.closeSearch()
  }

  const defaultInput = search.value || ''


  return (
    <div className="watch-search-input-bar">
      <div className="search-input-container">
        {/* Search Button */}
        <button 
          className="plain-btn search-input-bar-btn"
          aria-label="Search"
          action="search"
          onClick={handleSearch}
        >
          <span tabIndex="-1" className="search-input-bar-btn-content">
            <i className="material-icons">search</i>
          </span>
        </button>
        {/* Search Input */}
        <input
          type="text"
          id="watch-search-input"
          className="watch-search-input"
          autoComplete="off"
          ref={inputRef}
          defaultValue={defaultInput}
          placeholder={inputPlaceholder}
          onKeyDown={handleOnKeyDown}
          aria-label={inputPlaceholder}
        />
        {/* Clear Input Button */}
        {
          search.status === SEARCH_RESULT
          &&
          <button 
            className="plain-btn search-input-bar-btn"
            onClick={clearInput}
            action="clear"
            aria-label="Clear"
          >
            <span tabIndex="-1" className="search-input-bar-btn-content">
              <i className="material-icons">close</i>
            </span>
          </button>
        }
      </div>

      {/* Close Button */}
      <button 
        className="plain-btn search-input-bar-btn"
        onClick={handleClose}
        action="close"
        aria-label="Close"
      >
        <span tabIndex="-1" className="search-input-bar-btn-content">
          Cancel
        </span>
      </button>
    </div>
  )
}

export default InputBar
