import _ from 'lodash';
import AdmZip from 'adm-zip';

import { loadImagesBuffers } from './util';

import { KATEX_CSS } from './statics/katex.min.css.js';
import { STYLE_CSS } from './statics/html/styles.css.js';
import { LOCAL_INDEX_HTML } from './statics/html/index.local.html.js';
import { LIVE_INDEX_HTML } from './statics/html/index.live.html.js';

async function loadAndAddImages(zip, chapters, cover) {
  const { coverBuffer, images } = await loadImagesBuffers({ chapters, cover });

  zip.addFile(`images/cover.jpeg`, coverBuffer);

  _.forEach(images, (img) => {
    zip.addFile(`images/${img.id}.jpeg`, img.buffer);
  });
}

function getIndexHTML({ title, author, chapters, withStyles = false, print = false, cover }) {
  const navContents = _.map(
    chapters,
    (ch, chIndex) => `
                    <h3><a href="#${ch.id}">${chIndex + 1} - ${ch.title}</a></h3>
                    <ol>
                        ${_.map(
                          ch.subChapters,
                          (subch, subIndex) =>
                            `<li><a href="#${subch.id}">${chIndex + 1}.${subIndex + 1} - ${
                              subch.title
                            }</a></li>`,
                        ).join('\n\t\t\t\t\t\t')}
                    </ol>
    `,
  ).join('\n\t\t\t\t\t');

  const content = _.map(
    chapters,
    (ch) => `
            <div class="ee-preview-text-con">
                ${ch.text.split('\n').join('\n\t\t\t\t')}
            </div>
    `,
  ).join('\n\t\t\t');

  return withStyles
    ? LIVE_INDEX_HTML({ title, navContents, content, cover, author, print })
    : LOCAL_INDEX_HTML({ title, navContents, content, author });
}

export async function htmlConverter({ title, author, filename, chapters, cover /** language, */ }) {
  if (!filename || !chapters || !title) {
    throw Error('filename, title, and chapters are required.');
  }

  const zip = new AdmZip();

  // cover.jpeg
  // images/image-id.jpeg
  await loadAndAddImages(zip, chapters, cover);

  // styles
  // styles/style.css
  zip.addFile('styles/style.css', Buffer.from(STYLE_CSS));
  // styles/katex.min.css
  zip.addFile('styles/katex.min.css', Buffer.from(KATEX_CSS));

  // index.html
  const indexHTML = getIndexHTML({ title, author, chapters });
  zip.addFile(`${filename}.html`, Buffer.from(indexHTML));

  return zip.toBuffer();
}

export function htmlPreviewer(
  { title, author, /** language, filename, */ chapters, cover },
  print = true,
) {
  const html = getIndexHTML({
    title,
    author,
    chapters,
    withStyles: true,
    print,
    cover,
  });

  const htmlBlob = new Blob([html], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  window.open(htmlUrl, '_blank');
}
