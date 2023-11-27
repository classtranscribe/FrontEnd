import { api } from 'utils';

const fileDownload = require('js-file-download');

export const downloadControl = {
  async webVTT(path = '', filename = '', onSuccess, onError) {
    try {
      const { data } = await api.getFile(path);
      fileDownload(data, `${filename}.vtt`);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError();
    }
  },

  epub() {},
};
