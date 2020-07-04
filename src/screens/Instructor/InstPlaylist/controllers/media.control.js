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

  onDragEnd(result, callback) {
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

    this.onReorderMedias(medias, callback);
  }

  async onReorderMedias(medias, callback) {
    const oldMedias = [...setup.medias];
    setup.setMedias(medias);
    if (typeof callback === 'function') callback(medias);

    try {
      const mediaIds = _.map(medias, ({ id }) => id);
      await api.reorderMedias(setup.playlist.id, mediaIds);
      prompt.addOne({ text: 'Videos reordered.', timeout: 3000 });
    } catch (error) {
      setup.setMedias(oldMedias);
      if (typeof callback === 'function') callback(oldMedias);
      prompt.error('Failed to reorder videos.', { timeout: 5000 });
    }
  }

  async renameMedia(mediaId, name) {
    try {
      await api.renameMedia(mediaId, name);
      let medias = setup.medias;
      let currIdx = _.findIndex(medias, { id: mediaId });
      if (currIdx >= 0) {
        medias[currIdx].mediaName = name;
        setup.setMedias([...medias]);
        prompt.addOne({ text: 'Video renamed.', timeout: 3000 });
      } else {
        throw Error('No such video');
      }
    } catch (error) {
      prompt.error('Failed to rename the video.', { timeout: 5000 });
    }
  }

  async deleteMedia(mediaId) {
    try {
      await api.deleteMedia(mediaId);
      setup.setMedias(_.filter(setup.medias, me => me.id !== mediaId));
      prompt.addOne({ text: 'Video deleted.', timeout: 3000 }); 
    } catch (error) {
      prompt.error('Failed to delete the video.', { timeout: 5000 });
    }
  }

  confirmDeleteMedia(mediaId) {
    setup.confirm({
      text: 'Are you sure to delete this video? (This acrion cannot be undone)',
      onConfirm: () => this.deleteMedia(mediaId)
    });
  }

  async deleteMedias(mediaIds) {
    try {
      await Promise
        .all(mediaIds.map((mediaId) => new Promise((resolve) => {
          api.deleteMedia(mediaId).then(() => resolve());
        })));
      setup.setMedias(_.filter(setup.medias, me => !_.includes(mediaIds, me.id)));
      prompt.addOne({ text: 'Videos deleted.', timeout: 3000 }); 
    } catch (error) {
      prompt.error('Failed to delete the selected video.', { timeout: 5000 });
    }
  }

  confirmDeleteMedias(mediaIds) {
    setup.confirm({
      text: `Are you sure to delete the selected ${mediaIds.length} `
            + `video${mediaIds.length > 1 ? 's' : ''}? `
            + '(This acrion cannot be undone)',
      onConfirm: () => this.deleteMedias(mediaIds)
    });
  }

  async handleUpload(
    playlistId, 
    uploadedMedias, 
    setUploadingIndex, 
    setProgress, 
    onUploadProgress
  ) {
    for (let i = 0; i < uploadedMedias.length; i += 1) {
      setUploadingIndex(i);
      setProgress(0);
      await this.upload(playlistId, uploadedMedias[i], onUploadProgress);
    }

    prompt.addOne({ text: `Uploaded ${uploadedMedias.length} videos.`, timeout: 4000 });
  }

  async upload(playlistId, { video1, video2 }, onUploadProgress) {
    try {
      await api.uploadVideo(playlistId, video1, video2, onUploadProgress);
    } catch (error) {
      console.error(error);
      prompt.error(`Failed to upload video ${video1.name}.`)
    }
  }
}

export const mediaControl = new MediaController();