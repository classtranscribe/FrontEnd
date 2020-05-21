import { api } from 'utils';

const fileDownload = require('js-file-download');

export const downloadControl = {
  async webVTT(path = '', lang = '', onSuccess, onError) {
    try {
      const { data } = await api.getFile(path);
      fileDownload(data, `transcription-${lang.toLowerCase()}.vtt`);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError();
    }
  },

  epub() {},
};
