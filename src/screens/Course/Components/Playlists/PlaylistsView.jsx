import React from 'react';
import { ARRAY_INIT, NOT_FOUND_404 } from 'utils';
import { CTFragment, CTFooter } from 'layout';
import { Link } from 'react-router-dom';
import PlaylistsErrorWrapper from './PlaylistsErrorWrapper';

function PlaylistsView({
  accessType,
  playlists
}) {
  const loading = playlists === ARRAY_INIT;
  const error = playlists === NOT_FOUND_404;

  const errorElement = <PlaylistsErrorWrapper accessType={accessType} />

  return (
    <CTFragment fade loading={loading} id="cp-pls-view" data-scroll>
      <CTFragment sticky vCenter className="title" as="h3">
        <i className="material-icons">list</i>
        <span>Playlists</span>
      </CTFragment>

      <CTFragment list role="list" error={error} errorElement={errorElement}>
        {error ? null : playlists.map(pl => (
          <Link
            className="pl-item"
            key={pl.id}
            id={pl.id}
            role="listitem"
            to={`#plid=${ pl.id}`}
          >
            <CTFragment vCenter className="pl-name">
              <i className="material-icons">video_library</i>
              <span>{pl.name}</span>
            </CTFragment>
            <i className="material-icons pl-icon">chevron_right</i>
          </Link>
        ))}
      </CTFragment>
      
      <CTFooter />
    </CTFragment>
  )
}

export default PlaylistsView;
