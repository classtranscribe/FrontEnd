import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { CTNavHeader } from 'components';
import { util } from 'utils';

function SearchHeader({ displaySideBar, handleShowSidebar, displaySearchHeader, history }) {
  const [searchValue, setSearchValue] = useState('');
  const handleOnKeyDown = (e) => {
    if (e.keyCode === 13) {
      setSearchValue('');
      history.push(util.links.search(), { value: searchValue });
    }
  };
  return (
    <CTNavHeader
      hasSidebar
      showSidebar={displaySideBar} 
      handleShowSidebar={handleShowSidebar}
    >
      {displaySearchHeader && !util.links.isEqual(util.links.search()) && (
        <div className="ui icon input header-search">
          <label className="accessbility_hide">Search for Courses</label>
          <input
            id="header_search_input"
            type="text"
            className="prompt"
            aria-label="Search for Courses"
            placeholder="Search for Courses"
            onChange={({ target: { value } }) => setSearchValue(value)}
            value={searchValue}
            onKeyDown={handleOnKeyDown}
          />
          <i aria-hidden="true" className="search icon" />
        </div>
      )}
    </CTNavHeader>
  );
}

export default withRouter(SearchHeader);
