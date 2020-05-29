import React from 'react';
import { Button } from 'pico-ui';
import { connectWithRedux, searchControl } from '../../controllers';
import './index.scss';

function SearchInputWithRedux(props) {
  let { searchValue = '' } = props;

  return (
    <div className="sp-input-con-outer">
      <div className="sp-input-con-inner">
        <input
          id="sp-input"
          placeholder="Search for courses ..."
          value={searchValue}
          onChange={searchControl.handleSearchInputChange}
          autoComplete={false}
        />

        <Button
          round 
          icon="search" 
          color="transparent"
        />
      </div>
    </div>
  );
}

export const SearchInput = connectWithRedux(
  SearchInputWithRedux,
  ['searchValue']
);

