import React from 'react';
import { connectWithRedux, SEARCH_INIT, SEARCH_HIDE } from '../../Utils';
import './index.css';

import InputBar from './InputBar';
import Results from './Results';

function SearchWithRedux({ search = SEARCH_INIT }) {
  return search.status !== SEARCH_HIDE ? (
    <div id="watch-search-container" className="watch-search">
      <InputBar search={search} />
      <Results search={search} />
    </div>
  ) : null;
}

export const Search = connectWithRedux(SearchWithRedux, ['search']);
