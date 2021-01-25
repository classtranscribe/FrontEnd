import React from 'react';
import { CTFragment, CTFooter, CTLoadable, CTDNDList, CTText } from 'layout';
import { InfoAndListLayout } from 'components';
import ErrorTypes from 'entities/ErrorTypes';
import { ARRAY_INIT } from 'utils/constants';
import PlaylistItem from './PlaylistItem';
import PlaylistsErrorWrapper from './PlaylistsErrorWrapper';
import NewPlaylistButton from './NewPlaylistButton';

function reorder(list, startIndex, endIndex) {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}
function PlaylistsView({
  isInstMode,
  offering,
  playlists,
  dispatch
}) {
  const loading = playlists === ARRAY_INIT;
  const error = ErrorTypes.isError(playlists);

  const errorElement = <PlaylistsErrorWrapper accessType={offering.accessType} />;

  const getDNDItems = () => {
    let dndItems = [];
    if (!loading && !error) {
      dndItems = playlists.map(pl => ({
        id: `pl-${pl.id}=${pl.name}`,
        node: <PlaylistItem isInstMode={isInstMode} playlist={pl} offering={offering} />
      }));
    }
    const onDragEnd = (result) => {
      if (!result.destination) {
        return;
      }
      if (result.destination.index === result.source.index) {
        return;
      }

      const playlists_ = reorder(
        playlists,
        result.source.index,
        result.destination.index
      );
      /// dispatch
      dispatch({ type: 'course/updatePlaylists', payload: playlists_ });
    }
    let dndProps = {
      contextId: 'pl-ord',
      disabled: !isInstMode,
      onDragEnd,
      items: dndItems,
      itemClassName: 'pl-item'
    };

    return <CTDNDList {...dndProps} />;
  };

  const playlistDNDElement = playlists.length > 0
    ? getDNDItems()
    : <CTText center muted padding={[30, 0]}>No Playlist</CTText>;


  return (
    <InfoAndListLayout.List fadeIn loading={loading} id="cp-pls-view">
      <CTFragment sticky alignItCenter className="title" as="h3">
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
