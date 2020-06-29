import React from 'react';
import { CTFragment, CTFooter, CTLoadable, CTDNDList } from 'layout';
import { InfoAndListLayout } from 'components';
import { ARRAY_INIT, NOT_FOUND_404 } from 'utils';
import { plControl } from '../../controllers';

import PlaylistItem from './PlaylistItem';
import PlaylistsErrorWrapper from './PlaylistsErrorWrapper';
import NewPlaylistButton from './NewPlaylistButton';

function PlaylistsView({
  isInstMode,
  offering,
  playlists,
}) {
  const loading = playlists === ARRAY_INIT;
  const error = playlists === NOT_FOUND_404;

  const errorElement = <PlaylistsErrorWrapper accessType={offering.accessType} />;

  const getDNDItems = () => {
    let dndItems = [];
    if (!loading && !error) {
      dndItems = playlists.map(pl => ({
        id: `pl-${pl.id}=${pl.name}`,
        node: <PlaylistItem isInstMode={isInstMode} playlist={pl} offering={offering} />
      }));
    }

    let dndProps = {
      contextId: 'pl-ord',
      disabled: !isInstMode,
      onDragEnd: plControl.onDragEnd,
      items: dndItems,
      itemClassName: 'pl-item'
    };

    return <CTDNDList {...dndProps} />;
  };

  const playlistDNDElement = getDNDItems();
  

  return (
    <InfoAndListLayout.List fade loading={loading} id="cp-pls-view">
      <CTFragment sticky vCenter className="title" as="h3">
        <i className="material-icons">list</i>
        <span>Playlists</span>
        {
          isInstMode
          &&
          <NewPlaylistButton offeringId={offering.id} />
        }
      </CTFragment>

      <CTLoadable error={error} errorElement={errorElement}>
        {playlistDNDElement}
      </CTLoadable>

      <CTFooter />
    </InfoAndListLayout.List>
  )
}

export default PlaylistsView;
