import React, { useRef, useState, useEffect } from 'react'
import { Popup } from 'semantic-ui-react'
import { 
  searchControl, 
  SEARCH_TRANS_IN_VIDEO, SEARCH_IN_PLAYLISTS, SEARCH_INIT, ARRAY_INIT, SEARCH_RESULT
} from '../../../Utils'
import { util } from 'utils'
import './index.css'

function InputBar({
  search=SEARCH_INIT,
  openFilter=null
}) {

  const inputRef = useRef()
  // const [searchOption, setSearchOption] = useState(SEARCH_TRANS_IN_VIDEO)
  const inputPlaceholder = 'Search Transcriptions, Videos...'// searchOption === SEARCH_IN_PLAYLISTS ? 'Search Playlists' : 'Search Transcriptions'

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const clearInput = () => {
    inputRef.current.value = ''
    searchControl.resetResult()
    inputRef.current.focus()
  }

  const handleSearch = () => {
    // console.log('search value', inputRef.current.value)
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
          ref={inputRef}
          type="text"
          className="watch-search-input"
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

      {/* Search Options Trigger */}
      {/* <Popup inverted wide basic
        position="left center"
        openOnTriggerClick={false}
        openOnTriggerFocus
        closeOnTriggerBlur
        content="Search Options"
        trigger={
          <button 
            className="plain-btn search-input-bar-btn"
            onClick={openFilter}
            action="filter"
            aria-label="Search Options"
          >
            <span tabIndex="-1" className="search-input-bar-btn-content">
              <i className="fas fa-filter"></i>
            </span>
          </button>
        }
      /> */}
      {/* Close Button */}
      <button 
        className="plain-btn search-input-bar-btn"
        onClick={handleClose}
        action="close"
        aria-label="Close"
      >
        <span tabIndex="-1" className="search-input-bar-btn-content">
          {/* <i className="material-icons">close</i> */}Cancel
        </span>
      </button>
    </div>
  )
}

export default InputBar
