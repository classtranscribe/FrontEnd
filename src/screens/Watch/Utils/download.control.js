import { api } from 'utils';

const fileDownload = require('js-file-download');



export const downloadControl = {
  async webVTT(transcriptionId = '', format, filename = '', onSuccess, onError) {
    try {
      // let { data } = await api.getFile(path); // vtt
      let { data } = await api.getTranscriptionFile(transcriptionId,format);
      
      fileDownload(data, `${filename}.${format}`);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError();
    }
  },

  epub() {},
};
