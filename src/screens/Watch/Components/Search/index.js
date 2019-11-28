import React from 'react'
import { connectWithRedux } from '_redux/watch'
import InputBar from './InputBar'
import ResultList from './ResultList'
import {  
  SEARCH_INIT,
  SEARCH_HIDE,
  searchControl,
} from '../../Utils'
import './index.css'


function SearchWithRedux({
  search=SEARCH_INIT
}) {
  

  return search.status !== SEARCH_HIDE ? (
    <div id="watch-search-container" className="watch-search">
      <InputBar search={search} />
      <ResultList search={search} />
    </div>
  ) : null
}

export const Search = connectWithRedux(
  SearchWithRedux,
  ['search'],
  []
)