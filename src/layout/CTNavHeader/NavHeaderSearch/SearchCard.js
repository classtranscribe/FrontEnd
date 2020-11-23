import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { links, timestr } from 'utils'
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import _ from 'lodash';
import { api, elem, CTSearch } from 'utils';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

export function SearchCard({ searchData = {} }) {
  const handleClick = () => {
    // timestr.toSeconds(searchData.caption.begin)
    window.location = links.watch(searchData.mediaId, { begin: 0 });
  }
  return (
    <Card id="ct-nh-search-card" >
      <CardContent>
        <br />Appeared {searchData.times} times in
        <CardActions>
          <Button size="small" id="ct-nh-video-btn" onClick={handleClick}>{searchData.mediaName}</Button>
        </CardActions>
        {searchData.playlistName}

      </CardContent>
    </Card>
  );
}
