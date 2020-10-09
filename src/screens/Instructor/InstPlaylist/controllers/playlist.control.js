import { uurl, links } from 'utils';
import { Playlist } from 'entities/Playlists';
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

  async renamePlaylist(name) {
    const playlist = await Playlist.rename(setup.playlist, name);
    if (playlist) {
      setup.setPlaylist(playlist.toObject());
    }
  }

  confirmDeletePlaylist(history) {
    setup.confirm({
      text: 'Are you sure you want to delete this playlist? This action cannot be undone!',
      onConfirm: async () => {
        const successed = await Playlist.delete(setup.playlistId);
        if (successed) {
          history.push(links.offeringDetail(setup.offering.id));
        }
      }
    });
  }
}

export const plControl = new PlaylistController();