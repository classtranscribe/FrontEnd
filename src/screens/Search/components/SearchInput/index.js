import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';
import { connectWithRedux, searchControl } from '../../controllers';
import './index.scss';

function SearchInputWithRedux(props) {
  let { searchValue = '' } = props;

  return (
    <CTFragment padding={[0, 30]}>
      <CTFragment hCenter padding={[0, 0, 0, 20]} className="sp-input-con">
        <input
          id="sp-input"
          placeholder="Search for courses ..."
          value={searchValue}
          onChange={searchControl.handleSearchInputChange}
          autoComplete="off"
          autoFocus
        />

        <Button
          round 
          icon="search" 
          color="transparent"
        />
      </CTFragment>
    </CTFragment>
  );
}

export const SearchInput = connectWithRedux(
  SearchInputWithRedux,
  ['searchValue']
);

