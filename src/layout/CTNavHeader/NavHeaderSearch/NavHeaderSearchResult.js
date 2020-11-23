import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { links } from 'utils'
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import _ from 'lodash';
import { api, elem, CTSearch } from 'utils';
import { SearchCard } from './SearchCard'


export function NavHeaderSearchResult({ searchText = '' }) {

  const url = links.currentUrl();
  const offeringId = url.split('/').pop();
  const [searchResult, setSearchResult] = useState([]);

  async function searchCaption() {
    try {
      const res = await api.searchCaptionInOffering(offeringId, searchText);
      const test = []

      _.forEach(res.data, (val) => {

        console.log(res.data)
        if (test.some(e => e.mediaName === val.mediaName)) {
          for (let i = 0; i < test.length; i++) {
            if (test[i].mediaName === val.mediaName) {
              test[i].times += 1;
              break;
            }
          }
        } else {
          test.push(
            {
              mediaName: val.mediaName,
              playlistName: val.playlistName,
              mediaId: val.mediaId,
              times: 1
            }
          )
        }
        // if (!searchResult.includes(val.mediaName) && !test.includes(val.mediaName)) {
        //   test.push(val.mediaName)
        // }
      })

      setSearchResult(test);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    // setSearchResult([])
    searchCaption();
  }, [searchText])

  useEffect(() => {
    console.log(searchResult);
  }, [searchResult])

  return (
    searchResult.length ?
      <Paper id="ct-nh-search-result" elevation={1}>
        <List>
          {/* {searchText} */}
          {searchResult.map((item) =>
            <ListItem>
              {/* {item} */}
              {/* <ListItemText primary={item} /> */}
              <SearchCard searchData={item} />
            </ListItem>
          )}
        </List>
      </Paper>
      : <div />


  );
}
