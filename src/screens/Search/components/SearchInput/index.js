import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';
import './index.scss';

function SearchInput(props) {
  const { search, dispatch } = props;
  const {searchValue = ''} = search;
  const handleSearchInputChange = (e) => {
    dispatch({type: 'search/searchValue', payload: e.target.value})
  }
  return (
    <CTFragment padding={[0, 30]}>
      <CTFragment justConCenter padding={[0, 0, 0, 20]} className="sp-input-con">
        <input
          id="sp-input"
          placeholder="Search for courses ..."
          value={searchValue}
          onChange={handleSearchInputChange}
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

export default SearchInput;

