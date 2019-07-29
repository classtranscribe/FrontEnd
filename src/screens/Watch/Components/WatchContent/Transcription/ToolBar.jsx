import React from 'react'
import { Select, Input } from 'semantic-ui-react'
import { IconButton } from '@material-ui/core'
import { SEARCH_IN_COURSE, SEARCH_IN_VIDEO } from '../constants'

const searchOptions = [
  {key: SEARCH_IN_COURSE, value: SEARCH_IN_COURSE, text: 'Search in Course'},
  {key: SEARCH_IN_VIDEO, value: SEARCH_IN_VIDEO, text: 'Search in Video'}
]

export default function ToolBar() {
  return (
    <div className="tool-bar">
      <div className="search">
        <Select 
          defaultValue={SEARCH_IN_VIDEO} 
          options={searchOptions} 
        />
        <Input icon="search" />
      </div>
      
      <div>
        <IconButton style={{color: 'white', outline: 'none'}}>
          <i class="material-icons">expand_less</i>
        </IconButton>
      </div>
    </div>
  )
}