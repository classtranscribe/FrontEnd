import _ from 'lodash';
import { uurl, api, prompt } from 'utils';
import { setup } from './setup.control';
import { promptControl } from './prompt.control';

const YOUTUBE_PREFIX = 'https://www.youtube.com/playlist';
// const BOX_PREFIX = 'https://uofi.app.box.com/folder/'
// const ECHO360_PREFIX = 'https://echo360.org/section/'

export const plControl = {
  externalFunctions: {},

  init(props) {
    const { setPlaylists, setPlaylist } = props;
    this.externalFunctions = { setPlaylists, setPlaylist };
  },

  getPlaylistSourceURL({ sourceType, playlistIdentifier, jsonMetadata }) {
    let source = '';
    if (!playlistIdentifier) return source;
    if (jsonMetadata && jsonMetadata.source) {
      return jsonMetadata.source;
    }

    if (sourceType === 1) {
      // YouTube
      source = YOUTUBE_PREFIX + uurl.createSearch({ list: playlistIdentifier });
    } else if (sourceType === 3) {
      // Kaltura
      source = `(Kaltura Playlist ID) ${playlistIdentifier}`;
    } else if (sourceType === 4) {
      // Box
      source = `(Box Folder ID) ${playlistIdentifier}`;
    } else if (sourceType === 0) {
      // echo
      source = playlistIdentifier; // ECHO360_PREFIX + playlistIdentifier + '/public'
    }

    return source;
  },

  async createPlaylist(playlist) {
    setup.loading();
    let { offeringId, name, sourceType, playlistIdentifier } = playlist;
    const playlistURL = playlistIdentifier;

    // Check validity
    if (!offeringId || !name) return;
    if (!this.isValidIdURL(sourceType, playlistIdentifier)) return;

    // extract playlistIdentifier
    if (sourceType === 1) {
      // YouTube
      const { list } = uurl.useSearch(playlistIdentifier);
      playlistIdentifier = list;
    } else if (sourceType === 3) {
      // Kaltura
      const items = playlistIdentifier.split('/');
      playlistIdentifier = items[items.length - 1]; // the last one is the channel id
    } else if (sourceType === 4) {
      // Box
      playlistIdentifier = playlistIdentifier.split('/folder/')[1]; // the 2nd one is the channel id
    }

    // set the `source` in the jsonMetadata to the source URL of this playlist
    const jsonMetadata = playlistURL ? { source: playlistURL } : null;

    let newPl = {
      offeringId,
      name,
      sourceType,
      playlistIdentifier,
      jsonMetadata,
      index: setup.playlists().length,
    };
    // console.error('newPl', newPl)

    // create the playlist
    try {
      const { data } = await api.createPlaylist(newPl);
      // get the new playlist data from the response
      newPl = data;
      // console.error('newPl', newPl)
    } catch (error) {
      setup.unloading();
      promptControl.failedToSave('playlist');
      return;
    }

    // set up the new playlist
    newPl.medias = [];
    newPl.isNew = true;

    // replace the `plid` in the window.location.search
    // to locate the playlist, after the playslists changed
    uurl.replaceSearch({ plid: newPl.id });
    // update the playlists
    setup.playlists([...setup.playlists(), newPl]);

    setup.unloading();
    promptControl.saved('playlist', 'created');
  },

  async renamePlaylist(playlist, newName) {
    try {
      // update the playlist
      playlist.name = newName;
      await api.updatePlaylist(playlist);
      setup.playlist(playlist, 0);

      // if succeed, sync the changed name to the playlists panel
      const playlists = setup.playlists();
      const currPlIndex = _.findIndex(playlists, { id: playlist.id });
      if (currPlIndex >= 0) {
        playlists[currPlIndex].name = newName;
        setup.playlists([...playlists]);
      }

      // send prompt to user
      promptControl.updated('Playlist name');
    } catch (error) {
      promptControl.failedToUpdate('playlist name');
      console.error(`failed to rename playlist ${playlist.id}`);
    }
  },

  async deletePlaylist(playlist) {
    try {
      await api.deletePlaylist(playlist.id);
      const playlists = setup.playlists();
      _.remove(playlists, (pl) => pl.id === playlist.id);
      setup.playlists([...playlists]);
      if (playlists[0]) setup.changePlaylist(playlists[0]);
      promptControl.deleted('Playlist');
    } catch (error) {
      promptControl.failedToDelete('playlist');
      console.error(`failed to delete playlist ${playlist.id}`);
    }
  },

  async reorderMedias(results) {
    try {
      const mediaIds = _.map(results, ({ id }) => id);
      await api.reorderMedias(setup.playlist().id, mediaIds);
      setup.playlist({ ...setup.playlist(), medias: results });

      prompt.addOne({ text: 'Videos reordered.', timeout: 3000 });
    } catch (error) {
      prompt.addOne({ text: 'Failed to reorder videos.', timeout: 5000 });
    }
  },

  /**
   * Helpers
   */
  isValidIdURL(sourceType, url = '') {
    if (sourceType === 2) return true;
    if (!url) return false;

    if (sourceType === 0) {
      // Echo360
      const reg = /https:\/\/echo360.org\/section\/[\s\S]*\/public/;
      return reg.test(url);
    }
    if (sourceType === 1) {
      // YouTube
      const { list } = uurl.useSearch(url);
      return Boolean(list);
    }
    if (sourceType === 3) {
      // Kaltura/MediaSpace
      const reg = /https:\/\/mediaspace.illinois.edu\/channel\/[\s\S]*\/[0-9]{1}/;
      return reg.test(url);
    }
    if (sourceType === 4) {
      // Box
      const reg = /https:\/\/[\s\S]*box.com[\s\S]*\/folder\/[0-9]{1}/;
      return reg.test(url);
    }

    return false;
  },
};
