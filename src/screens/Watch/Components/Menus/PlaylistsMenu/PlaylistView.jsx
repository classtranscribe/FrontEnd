import React, { useEffect } from 'react';
import { elem } from 'utils/use-elem';
import { connectWithRedux } from '../../../Utils';
import setup from '../../../model/setup'

function PlaylistView({ playlists, playlist, currPlaylist, setCurrPlaylist }) {
  useEffect(() => {
    elem.scrollIntoCenter(currPlaylist.id, {
      focus: true,
      alternate: () => elem.scrollIntoView('watch-videos-list'),
    });
  }, [currPlaylist]);

  const handlePlaylistClick = (id) => async () => {
    setCurrPlaylist({});
    let data = await setup.getPlaylist(id);
    setCurrPlaylist(data);
  };

  return (
    <div className="watch-playlists-list">
      <div className="watch-list-title">
        Playlists
      </div>
      <div role="list" className="w-100 d-flex flex-column">
        {playlists.map((playlistItem) => (
          <button
            id={playlistItem.id}
            key={playlistItem.id}
            className="watch-playlist-item plain-btn"
            role="listitem"
            onClick={handlePlaylistClick(playlistItem.id)}
            current={Boolean(playlist.id === playlistItem.id).toString()}
            active={Boolean(currPlaylist.id === playlistItem.id).toString()}
          >
            <i className="material-icons library-icon">video_library</i>
            <div className="playlist-name">
              {playlistItem.name}
              {playlist.id === playlistItem.id && (
                <>
                  <br />
                  <span>Current Playlist</span>
                </>
              )}
            </div>
            <i className="material-icons right-arrow">chevron_right</i>
          </button>
        ))}
      </div>
    </div>
  );
}

export default connectWithRedux(PlaylistView, ['playlists', 'playlist']);
