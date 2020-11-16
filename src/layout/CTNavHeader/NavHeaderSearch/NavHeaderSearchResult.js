import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { links } from 'utils'
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import _ from 'lodash';

export function NavHeaderSearchResult({ results = [] }) {

  const url = links.currentUrl();
  const offeringId = url.split('/').pop();

  React.useEffect(() => {
    console.log(results);
  }, [results])
  function itemRenderer() {
    results.forEach(item => {

    })
  }
  return (

    <Paper id="ct-nh-search-result">
      <List>
        {results.map((item) =>
          <ListItem>
            {item}
            <ListItemText primary={item} />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}
