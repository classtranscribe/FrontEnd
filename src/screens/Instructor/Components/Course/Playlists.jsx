import React from 'react'
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

        <Filter //darker
          searchFor="Playlists"
          onFilter={onFilter}
          onReverse={onReverse}
        />
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