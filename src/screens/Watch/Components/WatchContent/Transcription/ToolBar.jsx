import React, { useState } from 'react'
import { Select, Input, Button } from 'semantic-ui-react'
import { SEARCH_IN_COURSE, SEARCH_IN_VIDEO } from '../constants'
import { capSearch, handleExpand } from '../watchUtils'

const searchOptions = [
  {key: SEARCH_IN_VIDEO, value: SEARCH_IN_VIDEO, text: 'Search in Video'},
  {key: SEARCH_IN_COURSE, value: SEARCH_IN_COURSE, text: 'Search in Course'}
]

export default function ToolBar({ captions, setResults, canReset }) {
  const [loadingResults, setLoadingResults] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const handleOnChange = ({ target: {value} }) => {
    if (loadingResults) return;
    setSearchInput(() => value)
  }

  const handleOnKeyDown = ({ keyCode }) => {
    if (keyCode === 13) {
      setResults(() => capSearch.getResult(captions, searchInput))
      capSearch.toTop()
      handleExpand(true)
    }
  }

  const onReset = () => {
    setSearchInput(() => '')
    handleExpand(false)
    setResults(() => [])
  }


  return (
    <div className="tool-bar">
      <div className="search">
        <Select 
          defaultValue={SEARCH_IN_VIDEO} 
          options={searchOptions} 
        />
        <div className="ui icon input">
          <input 
            type="text" 
            id="caption-search" 
            placeholder="Search Captions"
            value={searchInput}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            title={'Search for captions (\u2318/Ctrl + \u21E7 + space)'}
            autoComplete="off"
          />
          <i aria-hidden="true" className="search icon"></i>
        </div>
        {
          canReset
          &&
          <Button className="edit-button" onClick={onReset}>
            Reset
          </Button>
        }
      </div>

      <div>
        <Button 
          className="expand-button"
          style={{color: 'white', outline: 'none'}} 
          onClick={handleExpand}
          tabIndex={0}
          title={'Expand the transcription area (\u2318/Ctrl + U)'}
          aria-label="Expand the transcription area"
        >
          <i className="material-icons" id="expand-trigger">expand_less</i>
        </Button>
      </div>
    </div>
  )
}