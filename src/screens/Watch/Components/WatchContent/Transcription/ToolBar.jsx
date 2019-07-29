import React, { useState, useEffect } from 'react'
import { Select, Input } from 'semantic-ui-react'
import { IconButton } from '@material-ui/core'
import { SEARCH_IN_COURSE, SEARCH_IN_VIDEO } from '../constants'
import { capSearch } from './captionSearch'

const searchOptions = [
  {key: SEARCH_IN_COURSE, value: SEARCH_IN_COURSE, text: 'Search in Course'},
  {key: SEARCH_IN_VIDEO, value: SEARCH_IN_VIDEO, text: 'Search in Video'}
]

export default function ToolBar({ handleExpand, expand, captions, setResults }) {
  const [loadingResults, setLoadingResults] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const handleOnChange = ({ target: {value} }) => {
    if (loadingResults) return;
    setSearchInput(() => value)
  }

  useEffect(() => {
    if (!searchInput) {
      setResults(() => [])
    }
  }, [searchInput])

  const handleOnKeyDown = ({ keyCode }) => {
    if (keyCode === 13) {
      setLoadingResults(true)
      setResults(() => capSearch.getResult(captions, searchInput))
      // capSearch.highlight(searchInput)
      handleExpand(true)
      setLoadingResults(false)
    }
  }

  return (
    <div className="tool-bar">
      <div className="search">
        <Select 
          defaultValue={SEARCH_IN_VIDEO} 
          options={searchOptions} 
        />
        <Input 
          icon="search" id="caption-search" 
          title={'Search for captions (\u2318/Ctrl + \u21E7 + space)'}
          value={searchInput}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          loading={loadingResults}
        />
      </div>

      <div>
        <IconButton 
          style={{color: 'white', outline: 'none'}} 
          onClick={handleExpand}
          title={'Expand the transcription area (\u2318/Ctrl + U)'}
          aria-action="Expand the transcription area"
        >
          {
            expand ? 
            <i class="material-icons">expand_more</i>
            :
            <i class="material-icons">expand_less</i> 
          }
        </IconButton>
      </div>
    </div>
  )
}