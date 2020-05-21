import _ from 'lodash';
import AdmZip from 'adm-zip';
import { dedent } from 'dentist';

import { loadImagesBuffers } from './util';

import { KATEX_CSS } from './statics/katex.min.css.js';
import { OEBPS_STYLE_CSS } from './statics/epub/style.css.js';
import { META_INF_CONTAINER_XML } from './statics/epub/container.xml.js';
import { MIMETYPE } from './statics/epub/mimetype.js';
import { OEBPS_TOC_NCX } from './statics/epub/toc.ncx.js';
import { OEBPS_TOC_XHTML } from './statics/epub/toc.xhtml.js';
import { OEBPS_CONTENT_OPF } from './statics/epub/content.opf.js';
import { OEBPS_CONTENT_XHTML } from './statics/epub/content.xhtml.js';

async function loadAndAddImages(zip, chapters, cover) {
  const { coverBuffer, images } = await loadImagesBuffers({ chapters, cover });

  zip.addFile(`OEBPS/cover.jpeg`, coverBuffer);

  _.forEach(images, (img) => {
    zip.addFile(`OEBPS/images/${img.id}.jpeg`, img.buffer);
  });
}

function getTocNCX(title, author, chapters) {
  let navPoints = '';
  let playOrder = 0;

  const getPlayOrder = () => {
    playOrder += 1;
    return playOrder;
  };

  _.forEach(chapters, (ch, index) => {
    navPoints += `
        <navPoint id="${ch.id}" playOrder="${getPlayOrder()}" class="chapter">
            <navLabel>
                <text>${index + 1} - ${ch.title}</text>
            </navLabel>
            <content src="${ch.id}.xhtml"/>

            ${_.map(
              ch.subChapters,
              (subCh, subIndex) => `
            <navPoint id="${subCh.id}" playOrder="${getPlayOrder()}">
                <navLabel>
                    <text>${index + 1}.${subIndex + 1} - ${subCh.title}</text>
                </navLabel>
                <content src="${ch.id}.xhtml#${subCh.id}" />
            </navPoint>`,
            ).join('\n\t\t\t\t')}
        </navPoint>
        `;
  });

  return OEBPS_TOC_NCX(title, author, navPoints);
}

function getTocXHTML(title, language, chapters) {
  let navContents = '';
  _.forEach(chapters, (ch, index) => {
    navContents += `
        <dt class="table-of-content">
            <a href="${ch.id}.xhtml">${index + 1} - ${ch.title}</a>
        </dt>
        ${_.map(
          ch.subChapters,
          (subCh, subIndex) => `
            <dd>
                <a href="${ch.id}.xhtml#${subCh.id}">
                    ${index + 1}.${subIndex + 1} - ${subCh.title}
                </a>
            </dd>`,
        ).join('\n\t\t\t')}
        `;
  });

  return OEBPS_TOC_XHTML(title, language, navContents);
}

function getContentOPF(title, author, language, publisher, date, chapters) {
  // image items
  const images = _.flatten(_.map(chapters, (ch) => ch.images));
  const imageItems = _.map(
    images,
    (img) => `<item id="${img.id}" href="images/${img.id}.jpeg" media-type="image/jpeg" />`,
  ).join('\n\t\t');

  // content items
  const contentItems = _.map(
    chapters,
    (ch) => `<item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml" />`,
  ).join('\n\t\t');

  // content itemrefs
  const contentItemsRefs = _.map(chapters, (ch) => `<itemref idref="${ch.id}"/>`).join('\n\t\t');

  return OEBPS_CONTENT_OPF(
    title,
    author,
    language,
    publisher,
    date,
    imageItems,
    contentItems,
    contentItemsRefs,
  );
}

function getContentXHTML(chapter, language) {
  const { title, text } = chapter;

  const content = dedent(`
        <div class="epub-ch">
            ${text}
        </div>
    `);

  return OEBPS_CONTENT_XHTML(title, content, language);
}

async function epubConverter({ title, author, language, filename, chapters, cover }) {
  if (!filename || !chapters || !title) {
    throw Error('filename, title, and chapters are required.');
  }

  const zip = new AdmZip();

  // OEBPS/cover.jpeg
  // OEBPS/images/image-id.jpeg
  await loadAndAddImages(zip, chapters, cover);

  // mimetype
  zip.addFile('mimetype', Buffer.from(MIMETYPE));

  // META-INF/container.xml
  zip.addFile('META-INF/container.xml', Buffer.from(META_INF_CONTAINER_XML));

  // OEBPS
  // OEBPS/style.css
  zip.addFile('OEBPS/style.css', Buffer.from(OEBPS_STYLE_CSS));
  // OEBPS/katex.min.css
  zip.addFile('OEBPS/katex.min.css', Buffer.from(KATEX_CSS));

  // OEBPS/toc.ncx
  const toxNCX = getTocNCX(title, author, chapters);
  zip.addFile('OEBPS/toc.ncx', Buffer.from(toxNCX));

  // OEBPS/toc.xhtml
  const tocXHTML = getTocXHTML(title, language, chapters);
  zip.addFile('OEBPS/toc.xhtml', Buffer.from(tocXHTML));

  // OEBPS/content.opf
  const contentOPF = getContentOPF(
    title,
    author,
    language,
    'ClassTranscribe',
    new Date(),
    chapters,
  );
  zip.addFile('OEBPS/content.opf', Buffer.from(contentOPF));

  // OEBPS/chapter-id.xhtml
  _.forEach(chapters, (ch) => {
    const contentXHTML = getContentXHTML(ch, language);
    zip.addFile(`OEBPS/${ch.id}.xhtml`, Buffer.from(contentXHTML));
  });

  return zip.toBuffer();
}

export default epubConverter;
