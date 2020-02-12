import { api } from '../../../utils'
var fileDownload = require('js-file-download')

export const downloadControl = {
  webVTT: async function(path="", lang="", onSuccess, onError) {
    try {
      const { data } = await api.getFile(path)
      fileDownload(data, `transcription-${lang.toLowerCase()}.vtt`)
      if (onSuccess) onSuccess()
    } catch(error) {
      if (onError) onError()
    }
  },
  
  epub: function() {

  },
}