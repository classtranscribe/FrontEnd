import { uurl, api, prompt, links } from 'utils';

class PlaylistController {
  constructor() {
    this.isValidIdURL = this.isValidIdURL.bind(this);
    this.updatePlaylist = this.updatePlaylist.bind(this);
  }

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
  }

  async updatePlaylist(offeringId, newPlayList, history) {
    const { name, sourceType, url } = newPlayList;
    let playlistId = null;
    let playlistIdentifier = url;
    let playlistURL = url;

    // Check validity
    if (!offeringId || !name) return;
    if (!this.isValidIdURL(sourceType, url)) return;

    // extract url
    if (sourceType === 1) {
      // YouTube
      const { list } = uurl.useSearch(url);
      playlistIdentifier = list;
    } else if (sourceType === 3) {
      // Kaltura
      const items = url.split('/');
      playlistIdentifier = items[items.length - 1]; // the last one is the channel id
    } else if (sourceType === 4) {
      // Box
      playlistIdentifier = url.split('/folder/')[1]; // the 2nd one is the channel id
    }

    // set the `source` in the jsonMetadata to the source URL of this playlist
    const jsonMetadata = playlistURL ? { source: playlistURL } : null;

    let newPl = {
      offeringId,
      name,
      sourceType,
      playlistIdentifier,
      jsonMetadata,
    };

    try {
      const { data } = await api.createPlaylist(newPl);
      newPl = data;
      playlistId = data.id;
    } catch (e) {
      console.error(e);
      prompt.error('Failed to create the new playlist.');
      return;
    }

    prompt.addOne({
      text: 'Playlist Created.',
      status: 'success',
      timeout: 3000,
      position: 'top'
    });

    if (playlistId && history) {
      history.push(links.playlist(playlistId));
    }
  }
}

export const plControl = new PlaylistController();