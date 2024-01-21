import { unescape } from 'lodash';
import { api } from 'utils';

const fileDownload = require('js-file-download');

const vttToText = (data) => {
  data=data.replace(/WEBVTT.*/g, '');
  const allEntries = data.split(/\n\n+/);

  const filteredLines = []
  const newParaEveryChars = 300;
  let captionCount = 0;
  allEntries.forEach((entry) => {
    if(entry.trim().length ===0 ) {return};
    // split(..,2) does not behavior like this in javascript
    const nextIndex = entry.indexOf('\n')
    const first = entry.slice(0,nextIndex-1);
    const remain = unescape(entry.slice(nextIndex+1));
    if(!remain || !first.includes(' --> ')) {return};
    // a more sophisticated version might use the timing.
    let sep = ' ';
    if ((captionCount >= newParaEveryChars && remain.trim().endsWith('.'))
    || (captionCount >= newParaEveryChars * 2) && remain.includes(".")) {
      sep = '\n';
      captionCount = 0;
    } else {
      captionCount += remain.length;
    }
    let text = `${remain.replaceAll(/([\r\n]|\s)+/g,' ')}${sep}`
    filteredLines.push(text);
  });
  return filteredLines.join('').trim();
}

export const downloadControl = {
  async webVTT(path = '', format, filename = '', onSuccess, onError) {
    try {
      let { data } = await api.getFile(path); // vtt
      if(format === 'txt') {
        // convert vtt to plain text
       data = vttToText(data);
      }
      fileDownload(data, `${filename}.${format}`);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError();
    }
  },

  epub() {},
};
