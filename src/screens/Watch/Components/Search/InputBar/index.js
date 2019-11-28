import React, { useRef, useState, useEffect } from 'react'
import { Popup } from 'semantic-ui-react'
import { 
  searchControl, 
  SEARCH_TRANS_IN_VIDEO, SEARCH_VIDEOS, SEARCH_INIT
} from '../../../Utils'
import { util } from 'utils'
import './index.css'

function InputBar({
  search=SEARCH_INIT,
  openFilter=null
}) {

  const inputRef = useRef()
  const [searchOption, setSearchOption] = useState(SEARCH_TRANS_IN_VIDEO)
  const inputPlaceholder = searchOption === SEARCH_VIDEOS ? 'Search Playlists' : 'Search Transcriptions'

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleSearch = () => {
    // console.log('search value', inputRef.current.value)
    inputRef.current.focus()
    util.scrollToTop('.watch-search-result-container')
    searchControl.getInVideoTransSearchResult(inputRef.current.value)
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
        <input
          ref={inputRef}
          type="text"
          className="watch-search-input"
          defaultValue={defaultInput}
          placeholder={inputPlaceholder}
          onKeyDown={handleOnKeyDown}
        />
      </div>
      <Popup inverted wide basic
        position="left center"
        openOnTriggerClick={false}
        openOnTriggerFocus
        closeOnTriggerBlur
        content="Search Options"
        trigger={
          <button 
            className="plain-btn search-input-bar-btn"
            aria-label="Search Options"
            onClick={openFilter}
            action="filter"
          >
            <span tabIndex="-1" className="search-input-bar-btn-content">
              <i class="fas fa-filter"></i>
            </span>
          </button>
        }
      />
      {/* <Popup inverted wide basic
        position="left center"
        openOnTriggerClick={false}
        openOnTriggerFocus
        closeOnTriggerBlur
        content="Close"
        trigger={ */}
          <button 
            className="plain-btn search-input-bar-btn"
            aria-label="Close"
            onClick={handleClose}
            action="close"
          >
            <span tabIndex="-1" className="search-input-bar-btn-content">
              <i className="material-icons">close</i>
            </span>
          </button>
        {/* }
      /> */}
    </div>
  )
}

export default InputBar
