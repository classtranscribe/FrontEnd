import { api, prompt, InvalidDataError } from 'utils';
import Entity from '../Entity';
import PlaylistTypes from './PlaylistTypes';

class Playlist extends Entity {
  // __data = {
  //   offeringId: '',
  //   name: '',
  //   sourceType: 2,
  //   playlistIdentifier: '',
  //   jsonMetadata: {
  //     isChannel: 0,
  //     source: ''
  //   }
  // }

  get offeringId() {
    return this.__data.offeringId;
  }

  get name() {
    return this.__data.name;
  }

  get sourceType() {
    return this.__data.sourceType;
  }

  get source() {
    const { jsonMetadata } = this.__data;
    if (jsonMetadata && jsonMetadata.source) {
      return jsonMetadata.source;
    }

    return null;
  }

  get playlistIdentifier() {
    return this.__data.playlistIdentifier;
  }


  /**
   * Create a new playlist
   * @param {String} offeringId - the offering id
   * @param {Object} newPlayList - a new playlist object includes: {name, sourceType, url}
   * @returns {Playlist} - a Playlist instance
   */
  static async create(offeringId, newPlaylist) {
    const { name, sourceType, url, options } = newPlaylist;
    if (!name || !PlaylistTypes.isValidUrl(sourceType, url)) {
      throw InvalidDataError;
    }

    const playlistIdentifier = PlaylistTypes.getIdentifier(sourceType, url);
    const channelTypes = [PlaylistTypes.KalturaID, PlaylistTypes.YouTubeID];
    const jsonMetadata = {};
    if (url) jsonMetadata.source = url;
    if (channelTypes.includes(sourceType) && url.includes('channel')) {
      jsonMetadata.isChannel = '1';
    }

    let newPl = {
      offeringId,
      name,
      sourceType,
      playlistIdentifier,
      jsonMetadata,
      options
    };

    try {
      const { data } = await api.createPlaylist(newPl);
      newPl = data;
    } catch (error) {
      console.error(error);
      prompt.error('Failed to create the new playlist.');
      return null;
    }
    
    prompt.addOne({
      text: 'Playlist Created.',
      status: 'success',
      timeout: 3000,
      position: 'top'
    });

    return new Playlist(newPl);
  }

  /**
   * Rename the playlist and modify UI options
   * @param {String} newName - New name for the playlist
   * @param {String} newOptions - New options for the playlist
   * @returns {Playlist} true if successed
   */
  static async update(playlist, newName, newOptions) {
    if (!playlist.id || ! (newName || newOptions)) return;
    try {
      if(newName !== undefined) {
        playlist.name = newName;
      }
      if(newOptions !== undefined) {
        playlist.options = newOptions;
      }
      const data = { id:playlist.id,offeringId:playlist.offeringId,
        name:playlist.name, publishStatus:playlist.publishStatus,
        options:playlist.options};
      await api.updatePlaylist(data);
      prompt.addOne({ text: 'Playlist updated.', timeout: 3000 });
    } catch (error) {
      prompt.error('Could not update the playlist.', { timeout: 5000 });
      return;
    }

    return new Playlist(playlist);
  }

  /**
   * Delete the playlist
   * @returns {Boolean} true if successed
   */
  static async delete(playlistId) {
    if (!playlistId) return;
    try {
      await api.deletePlaylist(playlistId);
      prompt.addOne({ text: 'Playlist deleted.', timeout: 3000 });
    } catch (error) {
      prompt.error('Could not delete the playlist.', { timeout: 5000 });
      return false;
    }

    return true;
  }
}

export default Playlist;