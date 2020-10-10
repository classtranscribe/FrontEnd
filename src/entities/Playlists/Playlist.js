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
    const { name, sourceType, url } = newPlaylist;
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
      jsonMetadata
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
   * Rename the playlist
   * @param {String} newName - New name for the playlist
   * @returns {Playlist} true if successed
   */
  static async rename(playlist, newName) {
    if (!playlist.id || !newName) return;
    try {
      playlist.name = newName;
      await api.updatePlaylist(playlist);
      prompt.addOne({ text: 'Playlist renamed.', timeout: 3000 });
    } catch (error) {
      prompt.error('Failed to rename the playlist.', { timeout: 5000 });
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
      prompt.error('Failed to delete the playlist.', { timeout: 5000 });
      return false;
    }

    return true;
  }
}

export default Playlist;