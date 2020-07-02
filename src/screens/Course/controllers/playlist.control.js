import _ from 'lodash';
import { prompt, api } from 'utils';
import { setup } from './setup';

class PlaylistConrtol {
  constructor() {
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  reorder(list, startIndex, endIndex) {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }

    const playlists = this.reorder(
      setup.playlists, 
      result.source.index, 
      result.destination.index
    );

    this.updatePlaylists(playlists);
  }

  async updatePlaylists(playlists) {
    const oldPlaylists = [...setup.playlists];

    setup.setPlaylists(playlists);

    try {
      const playlistIds = _.map(playlists, ({ id }) => id);
      await api.reorderPlaylists(setup.offering.id, playlistIds);
      prompt.addOne({ text: 'Playlists reordered.', timeout: 3000 });
    } catch (error) {
      setup.setPlaylists(oldPlaylists);
      prompt.addOne({ text: 'Failed to reorder playlists.', timeout: 5000 });
    }
  }
}

export const plControl = new PlaylistConrtol();