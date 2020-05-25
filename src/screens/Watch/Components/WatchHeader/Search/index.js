import React from 'react';
import { connectWithRedux, searchControl, SEARCH_INIT } from '../../../Utils';
import './index.css';

function Search() {
  const handleOpenSearch = () => {
    searchControl.openSearch();
  };

  return (
    <button
      id="wp-h-search-btn"
      className="plain-btn watch-header-search-btn"
      aria-label="Search"
      aria-controls="watch-search-container"
      aria-haspopup="true"
      onClick={handleOpenSearch}
    >
      <span className="header-search-btn-content" tabIndex="-1">
        <i aria-hidden="true" className="material-icons">
          search
        </i>{' '}
        Search
      </span>
    </button>
  );
}

export default connectWithRedux(Search);
