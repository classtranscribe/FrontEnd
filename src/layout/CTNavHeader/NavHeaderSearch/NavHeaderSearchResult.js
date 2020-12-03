import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import _ from 'lodash';
import { api } from 'utils';
import { SearchCard } from './SearchCard'
export function NavHeaderSearchResult({ searchText = '', transObject = {} }) {

  const [searchResult, setSearchResult] = useState([]);
  const transId_suffix = '_en-us_primary';
  // prepare the transId list for mapping
  const transId = Object.keys(transObject);
  for (let i = 0; i < transId.length; i += 1) {
    if (!transId[i].endsWith(transId_suffix)) { transId[i] += transId_suffix; }
  }

  async function searchCaption() {
    try {
      const { data } = await api.searchCaptions(transId, {
        text: searchText,
        page: 1,
        pageSize: 1000 // get all captions for now
      });
      const temp = []
      console.log('searchCaptions', data);
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
      // console.error(err)
      setSearchResult([]);
    }
  }

  useEffect(() => {
    searchCaption();
  }, [searchText])

  return (
    searchResult.length ?
      <List id="ct-nh-search-result">
        {/* {searchText} */}
        {searchResult.map((item) =>
          // padding need to be adjusted
          <ListItem>
            <SearchCard searchData={item} />
          </ListItem>
        )}
      </List>
      : <div id="ct-nh-search-empty">No Result</div>
  );
}
