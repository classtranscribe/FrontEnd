import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import _ from 'lodash';
import { api } from 'utils';
import { CTFragment } from 'layout';
import { SearchCard } from './SearchCard';

export function NavHeaderSearchResult({ searchText = '', transObject = {} }) {
  const [searchResult, setSearchResult] = useState([]);
  // this is a temporary, other languages will be supported in the future
  const transId_suffix = '_en-us_primary';
  // prepare the transId list for mapping
  const transId = Object.keys(transObject);
  for (let i = 0; i < transId.length; i += 1) {
    if (!transId[i].endsWith(transId_suffix)) { transId[i] += transId_suffix; }
  };

  const [noResults, setNoResults] = useState(false);

  async function searchCaption() {
    setSearchResult([]);
    try {
      const { data } = await api.searchCaptions(transId, {
        text: searchText,
        page: 1,
        pageSize: 1000 // get all captions for now
      });
      const temp = [];
      // console.log('searchCaptions', searchText, data);
      if (data.total === -1) {
        setNoResults(true);
        return;
      }
      setNoResults(false);

      for (let i = 0; i < data.results.length; i += 1) {
        let currTransId = data.results[i].transcriptionId;
        let found = false;
        for (let j = 0; j < temp.length; j += 1) {
          if (temp[j].mediaName === transObject[currTransId].mediaName) {
            temp[j].captions.push(data.results[i]);
            found = true;
          }
        }
        if (!found) {
          temp.push({
            mediaName: transObject[currTransId].mediaName,
            mediaId: transObject[currTransId].mediaId,
            playlistName: transObject[currTransId].playlistName,
            captions: [data.results[i]]
          })
        }
      }
      // sort media based on how many times the keyword appears in it
      temp.sort((a, b) => {
        return b.captions.length - a.captions.length
      })
      setSearchResult(temp);
    } catch (err) {
      console.error(err);
      setSearchResult([]);
      setNoResults(true);
    }
  }

  useEffect(() => {
    searchCaption();
  }, [searchText]);

  return (
    noResults ?
      <div id="ct-nh-search-empty">No Result</div>
      :
      <List id="ct-nh-search-result">
        <CTFragment loading={searchResult.length === 0}>
          {/* {searchText} */}
          {searchResult.map((item) =>
            // padding need to be adjusted
            <ListItem>
              <SearchCard searchData={item} />
            </ListItem>
          )}
        </CTFragment>
      </List>
  );
}
