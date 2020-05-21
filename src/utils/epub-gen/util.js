import _ from 'lodash';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export function parseChapters(chapters, replaceSrc = true) {
  return _.map(chapters, (chapter) => {
    let html = chapter.text;
    // Remove invalid syntax for xhtml
    html = _.replace(html, /&nbsp;/g, '&#160;');
    html = _.replace(html, /<br>/g, '<br/>');

    const doc = new DOMParser().parseFromString(html, 'text/html');

    // get all images from html
    const imgEls = doc.getElementsByTagName('img');
    const images = _.map(imgEls, (imgEl) => {
      const src = imgEl.src;
      const imgID = `img-${uuidv4()}`;
      if (replaceSrc) {
        imgEl.src = `images/${imgID}.jpeg`;
      }

      return { src, id: imgID };
    });

    // Serialize xhtml
    let xhtml = new XMLSerializer().serializeToString(doc);

    // only keep codes inside the <body>..</body>
    xhtml = xhtml.replace('<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>', '');
    xhtml = xhtml.replace('</body></html>', '');

    return {
      id: chapter.id,
      title: chapter.title,
      text: xhtml,
      images,
      subChapters: chapter.subChapters,
    };
  });
}

export async function loadImagesBuffers({ cover, chapters }) {
  const coverResp = await axios.get(cover, { responseType: 'arraybuffer' });
  const coverBuffer = Buffer.from(coverResp.data);

  const images = [];
  for (let i = 0; i < chapters.length; i += 1) {
    const ch = chapters[i];
    if (ch.images) {
      /* eslint-disable no-await-in-loop */
      for (let j = 0; j < ch.images.length; j += 1) {
        const img = ch.images[j];

        const { data } = await axios.get(img.src, { responseType: 'arraybuffer' });
        images.push({
          ...img,
          buffer: Buffer.from(data),
        });
      }
      /* eslint-enable no-await-in-loop */
    }
  }

  return {
    coverBuffer,
    images,
  };
}
