import _ from 'lodash';
import { api, prompt } from 'utils';
import { setup } from './setup';

class MediaController {
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

    const medias = this.reorder(
      setup.medias, 
      result.source.index, 
      result.destination.index
    );

    this.onReorderMedias(medias)
  }

  async onReorderMedias(medias) {
    const oldMedias = [...setup.medias];
    setup.setMedias(medias);

    try {
      const mediaIds = _.map(medias, ({ id }) => id);
      await api.reorderMedias(setup.playlist.id, mediaIds);
      prompt.addOne({ text: 'Videos reordered.', timeout: 3000 });
    } catch (error) {
      setup.setMedias(oldMedias);
      prompt.addOne({ text: 'Failed to reorder videos.', timeout: 5000 });
    }
  }

  async renameMedia(id, name) {
    try {
      await api.renameMedia(id, name);
      let medias = setup.medias;
      let currIdx = _.findIndex(medias, { id });
      if (currIdx >= 0) {
        medias[currIdx].mediaName = name;
        setup.setMedias([...medias]);
      }
      prompt.addOne({ text: 'Video renamed.', timeout: 3000 });
    } catch (error) {
      prompt.addOne({ text: 'Failed to rename the video.', timeout: 5000 });
    }
  }
}

export const mediaControl = new MediaController();