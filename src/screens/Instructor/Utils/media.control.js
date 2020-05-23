import _ from 'lodash';
import { api } from 'utils';
import { setup } from './setup.control';
import { LOADING_D } from './constants';
import { promptControl } from './prompt.control';

export const mediaControl = {
  externalFunctions: {},
  isSelectingVideos: false,
  selectedVideos: {},

  selectedVideosLength(selectedVideos) {
    if (!selectedVideos) selectedVideos = this.selectedVideos;
    return Object.keys(selectedVideos).length;
  },

  /**
   * @param {Function}
   * setIsSelectingVideos, setSelectedVideos
   */
  init(props) {
    const { setIsSelectingVideos, setSelectedVideos } = props;
    this.externalFunctions = { setIsSelectingVideos, setSelectedVideos };
  },

  /**
   * Functions for editing videos
   * ************************************************************************
   */
  async deleteMedia(media, bulkDelete = false) {
    try {
      await api.deleteMedia(media.id);
      const playlist = setup.playlist();
      _.remove(playlist.medias, (me) => me === media);

      if (!bulkDelete) setup.playlist({ ...playlist });
      if (!bulkDelete) promptControl.deleted('Video');

      setup.playlist({ ...playlist });
      return true;
    } catch (error) {
      if (!bulkDelete) promptControl.failedToDelete('video');
      console.error('Failed to delete media');
    }

    return false;
  },

  async renameMedia(media, newName) {
    try {
      await api.renameMedia(media.id, newName);
      // update the local media object
      media.name = newName;
      promptControl.updated('Media name');
    } catch (error) {
      promptControl.failedToUpdate('media name');
      console.error('Failed to rename media');
    }
  },

  /**
   * Functions for uploading videos
   * ************************************************************************
   */

  async handleUpload(playlistId, uploadedMedias, setUploadingIndex, setProgress, onUploadProgress) {
    for (let i = 0; i < uploadedMedias.length; i += 1) {
      setUploadingIndex(i);
      setProgress(0);
      await mediaControl.upload(playlistId, uploadedMedias[i], onUploadProgress);
    }
  },
  async upload(playlistId, { video1, video2 }, onUploadProgress) {
    try {
      const { data } = await api.uploadVideo(playlistId, video1, video2, onUploadProgress);
      // console.error(video1)
      const newMedia = {
        name: video1.name,
        id: data.id,
        playlistId: data.playlistId,
        sourceType: data.sourceType,
        jsonMetadata: data.jsonMetadata,
        video: [],
        transcriptions: [],
      };
      const playlist = setup.playlist();
      playlist.medias.push(newMedia);
    } catch (error) {
      console.error('Failed to upload media');
      promptControl.error(`upload video ${video1.name}`);
    }
    // setup.playlist({ ...playlist })
  },

  /**
   * Functions for selecting videos
   * ************************************************************************
   */

  openSelect() {
    const { setIsSelectingVideos } = this.externalFunctions;
    this.isSelectingVideos = true;
    setIsSelectingVideos(true);
  },

  closeSelect() {
    const { setIsSelectingVideos } = this.externalFunctions;
    if (setIsSelectingVideos) {
      this.isSelectingVideos = false;
      setIsSelectingVideos(false);
      this.setSelectedVideos({});
    }
  },

  handleOpenSelect() {
    if (!this.isSelectingVideos) {
      this.openSelect();
    } else {
      this.closeSelect();
    }
  },

  setSelectedVideos(videos) {
    const { setSelectedVideos } = this.externalFunctions;
    if (setSelectedVideos) {
      setSelectedVideos(videos);
      this.selectedVideos = videos;
    }
  },

  handleSelect(me) {
    this.setSelectedVideos({
      ...this.selectedVideos,
      [me.id]: me,
    });
  },

  handleRemove(me) {
    if (this.selectedVideos[me.id]) {
      delete this.selectedVideos[me.id];
      this.setSelectedVideos({ ...this.selectedVideos });
    }
  },

  isSelected({ id }) {
    return Boolean(this.selectedVideos[id]);
  },

  isSelectedAll(results, selectedVideos) {
    return results.length === this.selectedVideosLength(selectedVideos);
  },

  selectAll(results) {
    if (this.isSelectedAll(results)) {
      this.setSelectedVideos({});
    } else if (this.selectedVideosLength(this.selectedVideos) > 0) {
      this.setSelectedVideos({});
    } else {
      const selectedVideos = {};
      _.forEach(results, (re) => {
        selectedVideos[re.id] = re;
      });
      this.setSelectedVideos({ ...selectedVideos });
    }
  },

  async handleDeleteVideos() {
    setup.loading(LOADING_D);
    const selectedVideos = this.selectedVideos;
    let mediaIds = Object.keys(selectedVideos);
    for (let i = 0; i < mediaIds.length; i += 1) {
      await this.deleteMedia(selectedVideos[mediaIds[i]], true);
    }
    const playlist = setup.playlist();
    setup.playlist({ ...playlist });
    setup.unloading();

    promptControl.deleted('Videos');
  },
};
