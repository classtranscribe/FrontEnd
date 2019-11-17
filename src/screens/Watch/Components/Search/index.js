import React from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import {  
  ARRAY_INIT,
  ARRAY_EMPTY,
  searchControl
} from '../../Utils'

function SearchWithRedux({
  search=null
}) {
  

  return Boolean(search) ? (
    <div className="watch-search">

    </div>
  ) : null
}

export const Search = connectWithRedux(
  SearchWithRedux,
  ['search'],
  []
)