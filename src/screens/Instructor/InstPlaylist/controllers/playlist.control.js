import { uurl, api, prompt, links } from 'utils';
import { setup } from './setup';

const YOUTUBE_PREFIX = 'https://www.youtube.com/playlist';

class PlaylistController {
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
  }

  async renamePlaylist(playlist, name) {
    try {
      playlist.name = name;
      await api.updatePlaylist(playlist);
      setup.setPlaylist(playlist);
      prompt.addOne({ text: 'Playlist renamed.', timeout: 3000 });
    } catch (error) {
      prompt.error('Failed to rename the playlist.', { timeout: 5000 });
    }
  }

  async deletePlaylist(playlistId, history) {
    try {
      await api.deletePlaylist(playlistId);
      prompt.addOne({ text: 'Playlist deleted.', timeout: 3000 });
      history.push(links.offeringDetail(setup.offering.id));
    } catch (error) {
      prompt.error('Failed to delete the playlist.', { timeout: 5000 });
    }
  }

  confirmDeletePlaylist(playlistId, history) {
    setup.confirm({
      text: 'Are you sure to delete this playlist? (This acrion cannot be undone)',
      onConfirm: () => this.deletePlaylist(playlistId, history)
    });
  }
}

export const plControl = new PlaylistController();