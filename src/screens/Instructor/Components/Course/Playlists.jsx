import React, { useState } from 'react'
import { Button } from 'pico-ui'
import { Filter } from '../Filter'
import { ListItem } from '../ListItem'
import { ARRAY_EMPTY, NEW_PLAYLIST } from '../../Utils'

export default function Playlists({
  results,
  playlist,

  onFilter,
  onReverse,
  handlePlaylistClick,
}) {

  const [filtering, setFiltering] = useState(false)

  return (
    <>
      {/* Title & Filter */}
      <div className="ip-c-title">
        <div className="ip-sb-title ct-d-r-center-v">
          <i className="material-icons" aria-hidden="true">list_alt</i>
          <h3>PLAYLISTS</h3>
        </div>

        <ListItem dark
          icon="add"
          title=" NEW PLAYLIST"
          rightIcon="small"
          current={playlist === NEW_PLAYLIST}
          onClick={handlePlaylistClick(NEW_PLAYLIST)}
        />

        <div className="w-100 ip-c-actions">
          <Button uppercase
            icon="format_list_numbered"
            text="Order Playlists"
            color="transparent"
          />
          <Button uppercase
            icon={filtering ? "close" : "search"}
            text="Filter Playlists"
            color={filtering ? "" : "transparent"}
            onClick={() => setFiltering(!filtering)}
          />
        </div>

        {
          filtering
          &&
          <div className="w-100 ct-a-fade-in">
            <Filter //darker
              searchFor="Playlists"
              onFilter={onFilter}
              onReverse={onReverse}
            />
          </div>
        }
      </div>

      {/* Playlists */}
      <div className="ct-list-col ip-c-playlists">
      {
        results === ARRAY_EMPTY ?
        <div className="ct-d-r-center w-100">
          <div className="mt-5 text-muted">
            NO PLAYLIST
          </div>
        </div>
        :
        results.map( pl => (
          <div id={pl.id} key={pl.id} className="w-100">
            <ListItem
              icon={pl.sourceType}
              title={pl.name}
              description={(pl.createdAt || new Date().toISOString()).slice(0,10)}
              rightIcon="normal"
              current={Boolean(playlist.id === pl.id)}
              onClick={handlePlaylistClick(pl)}
            />
          </div>
        ))
      }
      </div>
    </>
  )
}