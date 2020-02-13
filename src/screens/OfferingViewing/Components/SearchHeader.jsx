import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { ClassTranscribeHeader } from '../../../components'
import { util } from '../../../utils'

function SearchHeader({ displaySideBar, showSiderBar, displaySearchHeader, history }) {
  const [searchValue, setSearchValue] = useState('')
  const handleOnKeyDown = e => {
    if (e.keyCode === 13) {
      setSearchValue('')
      history.push(util.links.search(), { value: searchValue })
    }
  }
  return (
    <ClassTranscribeHeader display={displaySideBar} showSiderBar={showSiderBar}>
      {
        (displaySearchHeader && window.location.pathname !== util.links.search())
        &&
        <div className="ui icon input header-search" >
          <label className="accessbility_hide" >Search for Courses</label>
          <input 
            id="header_search_input"
            type="text" className="prompt"
            aria-label="Search for Courses"
            placeholder="Search for Courses"
            onChange={({target: {value}}) => setSearchValue(value)}
            value={searchValue}
            onKeyDown={handleOnKeyDown}
          />
          <i aria-hidden="true" className="search icon"></i>
        </div>
      }
    </ClassTranscribeHeader>
  )
}

export default withRouter(SearchHeader)