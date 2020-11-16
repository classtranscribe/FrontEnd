import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { api, elem, CTSearch } from 'utils';
import './index.scss';
import { links } from 'utils'
import _ from 'lodash';

import { NavHeaderSearchResult } from './NavHeaderSearchResult';
import SearchIcon from '@material-ui/icons/Search';
export function NavHeaderSearch(props) {
  let {
    tabs = [],
    tabTitleElem,
  } = props;
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState();
  const [open, setOpen] = useState(false);
  const searchInput = [];
  const handleSearchChange = val => {
    setSearchText(val.target.value);
  }
  const url = links.currentUrl();
  const offeringId = url.split('/').pop();

  function searchCaption(text) {
    console.log(offeringId)
    let result;
    api.searchCaptionInOffering(offeringId, text)
      .then((res) => {
        _.forEach(res.data, (val) => {
          if (!searchInput.includes(val.mediaName)) {
            searchInput.push(val.mediaName)
          }
        })
      })
      .catch((err) => console.log(err))

    return result
  }
  useEffect(() => {
    if (searchText.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchText])
  useEffect(() => {
    console.log(searchInput);
  }, [searchInput])

  useEffect(() => {
    console.log(searchCaption(searchText));
  }, [searchText])

  return (
    <div className="ct-nh-search">
      <IconButton id="ct-nh-search-button" size="small"><SearchIcon /></IconButton>
      <input
        id="ct-nh-search-input"
        label="Search"
        variant="filled"
        value={searchText}
        onChange={handleSearchChange}
        placeholder={"Search"}
        autoComplete="off"
      />

      {open && <NavHeaderSearchResult results={searchInput} />}
    </div>
  );
}

