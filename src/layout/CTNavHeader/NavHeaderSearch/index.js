import React, { useState, useEffect, useRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import './index.scss';
import { links } from 'utils';
import _ from 'lodash';
import SearchIcon from '@material-ui/icons/Search';
import { NavHeaderSearchResult } from './NavHeaderSearchResult';
import setup from '../../../screens/Watch/model/setup';

export function NavHeaderSearch() {
  const ref = useRef();
  const [searchText, setSearchText] = useState('');
  const searchId = searchText ? 'ct-nh-search-input-with-text' : 'ct-nh-search-input';
  const searchPlaceholder = 'Search in course';

  // mapping transId to {mediaId, mediaName, playlistId, playlistName}
  const [transObject, setTransObject] = useState({});

  const handleSearchChange = val => {
    setSearchText(val.target.value);
  }

  // handle open/close of search component
  const [open, setOpen] = useState(true);
  const handleClickOutside = e => {
    if (ref.current.contains(e.target)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // parse url
  const url = new URL(links.currentUrl());
  const currOfferingId = url.pathname.split('/').pop();
  // const currPlaylistId = url.hash.split('=').pop();

  async function updateTransObject() {
    try {
      const playlists = await setup.getPlaylists(currOfferingId);
      // map playlist id to playlist name here
      const playlistObject = {};
      _.forEach(playlists, pl => {
        playlistObject[pl.id] = pl.name;
      });

      const temp = {};
      _.forEach(playlists, async item => {
        const playlist = await setup.getPlaylist(item.id);

        // get mediaId, mediaName here for each transId
        if (playlist && playlist.medias) {
          _.forEach(playlist.medias, media => {
            media.transcriptions && media.transcriptions.forEach(trans => {
              if (trans.language === 'en-US' && !Object.keys(temp).includes(trans.id)) {
                // temp.push(trans.id)
                temp[trans.id] = {
                  mediaId: media.id,
                  mediaName: media.name,
                  playlistId: media.playlistId,
                  playlistName: playlistObject[media.playlistId]
                }
              }
            })
            setTransObject(temp);
          })
        }
      })
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    updateTransObject(searchText)
  }, [searchText]);

  return (
    <div className="ct-nh-search" ref={ref} onClick={() => { setOpen(true) }}>
      <IconButton id="ct-nh-search-button" size="small"><SearchIcon /></IconButton>
      {/* https://www.w3.org/WAI/tutorials/forms/labels/#associating-labels-explicitly */}
      <label htmlFor={searchId} className="sr-only">{searchPlaceholder}</label>
      <input
        id={searchId}
        label="Search"
        // variant="filled"
        value={searchText}
        onChange={handleSearchChange}
        placeholder={`${searchPlaceholder}...`}
        autoComplete="off"
      />
      <div id="ct-nh-search-result-wrap">
        {searchText && open && <NavHeaderSearchResult searchText={searchText} transObject={transObject} id="ct-nh-search-result-wrap" />}
      </div>
    </div>
  );
}

// export const NavHeaderSearch = connectWithRedux(
//   NavHeaderSearchWithRedux,
//   ['searchValue', 'result'],
// );