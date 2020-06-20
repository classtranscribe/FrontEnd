import React from 'react';
import { CTFragment, CTFooter, CTLoadable, CTDNDList } from 'layout';
import { ARRAY_INIT, NOT_FOUND_404 } from 'utils';
import { plControl } from '../../controllers';

import PlaylistItem from './PlaylistItem';
import PlaylistsErrorWrapper from './PlaylistsErrorWrapper';

function PlaylistsView({
  isInstMode,
  accessType,
  playlists
}) {
  const loading = playlists === ARRAY_INIT;
  const error = playlists === NOT_FOUND_404;

  const errorElement = <PlaylistsErrorWrapper accessType={accessType} />;

  const getDNDItems = () => {
    let dndItems = [];
    if (!loading && !error) {
      dndItems = playlists.map(pl => ({
        id: `pl-${pl.id}=${pl.name}`,
        node: <PlaylistItem isInstMode={isInstMode} playlist={pl} />
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
    <CTFragment fade loading={loading} id="cp-pls-view" data-scroll>
      <CTFragment sticky vCenter className="title" as="h3">
        <i className="material-icons">list</i>
        <span>Playlists</span>
      </CTFragment>

      <CTLoadable error={error} errorElement={errorElement}>
        {playlistDNDElement}
      </CTLoadable>

      <CTFooter />
    </CTFragment>
  )
}

export default PlaylistsView;
