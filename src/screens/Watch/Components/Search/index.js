import React from 'react'
import { connectWithRedux } from '../../../../_redux/watch'
import InputBar from './InputBar'
import Results from './Results'
import {  
  SEARCH_INIT,
  SEARCH_HIDE,
} from '../../Utils'
import './index.css'


function SearchWithRedux({
  search=SEARCH_INIT
}) {

  return search.status !== SEARCH_HIDE ? (
    <div id="watch-search-container" className="watch-search">
      <InputBar search={search} />
      <Results search={search} />
    </div>
  ) : null
}

export const Search = connectWithRedux(
  SearchWithRedux,
  ['search'],
  []
)