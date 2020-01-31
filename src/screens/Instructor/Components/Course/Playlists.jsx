import React from 'react'
import { Filter } from '../Filter'
import { ARRAY_EMPTY, NEW_PLAYLIST } from '../../Utils'
import { PlaylistIcon } from '../PlaylistIcon'

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

        <button 
          className="plain-btn ip-sb-off-item ip-c-pl-item" 
          data-current={playlist === NEW_PLAYLIST}
          onClick={handlePlaylistClick(NEW_PLAYLIST)}
        >
          <div tabIndex="-1" className="ip-sb-off-item-con ip-c-pl-item-con">
            <span className="ct-d-r-center-v ip-sb-off-text ip-c-pl-name ip-sb-off-num">
              {/* <Icon name="add" /> */}
              <i className="material-icons" aria-hidden="true">add</i> NEW PLAYLIST
            </span>
            <span className="ip-c-pl-r-icon" data-small>
              <i className="material-icons">chevron_right</i>
            </span>
          </div>
        </button>

        <Filter darker
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
            <button 
              className="plain-btn ip-sb-off-item ip-c-pl-item" 
              data-current={Boolean(playlist.id === pl.id)}
              onClick={handlePlaylistClick(pl)}
            >
              <div tabIndex="-1" className="ip-sb-off-item-con ip-c-pl-item-con">
                <span className="ip-sb-off-text ip-c-pl-name ip-sb-off-num">
                  <PlaylistIcon type={pl.sourceType} /> {pl.name}
                </span>
                <span className="ip-sb-off-text ip-c-pl-mnum">
                  {pl.medias.length} video(s)
                </span>
                <span className="ip-c-pl-r-icon">
                  <i className="material-icons" aria-hidden="true">chevron_right</i>
                </span>
              </div> 
            </button>
          </div>
        ))
      }
      </div>
    </>
  )
}