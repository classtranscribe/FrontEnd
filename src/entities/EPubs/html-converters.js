import _ from 'lodash';
import { html, uurl, _buildID } from 'utils';
import EPubParser from 'screens/EPub/controllers/file-builders/EPubParser';

export function buildMDFromItems(items) {
  if (!items || items.length === 0) return '';
  return [
    '\n#### Transcript',
    _.map(items, (item) => _.trim(item.text)).join(' ')
  ].join('\n');
}

export async function buildMDFromContent(content) {
  if (typeof content === 'string') return content;
  // unwrap __data__ for correct image loading in subchapters 
  if ("__data__" in content) {
    content = JSON.parse(JSON.stringify(content.__data__))
  }

  let img_data_url = null
  try {
    const img = await EPubParser.loadImageBuffer(uurl.getMediaUrl(content.src));
    const img_blob = new Blob([img]);
    img_data_url = await EPubParser.blobToDataUrl(img_blob);
  } catch (error) {
    // intentionally ignoring error in fetching image.
    // Most likely cause is CORS policy when running local dev server
  }

  if (img_data_url === null) {
    let despId = _buildID();
    return [
      '<div class="img-block">',
      `\t<img src="${""}" alt="${content.alt}" aria-describedby="${despId}" />`,
      `\t<div id="${despId}">${html.markdown(content.descriptions.join("\n"))}</div>`,
      '</div>'
    ].join('\n');
  }
  if (content.descriptions.length !== 0) {
    let despId = _buildID();
    return [
      '<div class="img-block">',
      `\t<img src="${img_data_url}" alt="${content.alt}" aria-describedby="${despId}" />`,
      `\t<div id="${despId}">${html.markdown(content.descriptions.join("\n"))}</div>`,
      '</div>'
    ].join('\n');
  }
  return [
    '<div class="img-block">',
    `\t<img src="${img_data_url}" alt="${content.alt}" />`,
    '</div>'
  ].join('\n');
}

export async function buildMDFromSubChapter({ id, title, contents }) {
  return [
    `<!-- Sub-Chapter -->\n<h3 data-sub-ch id="${id}">${title}</h3>\n\n`,
    (await Promise.all(_.map(contents, buildMDFromContent))).join('\n\n')
  ].join('\n\n');
}

export async function buildMDFromChapter({ id, contents, subChapters, title }) {
  return [
    `<!-- Chapter -->\n<h2 data-ch id="${id}">${title}</h2>`,
    (await Promise.all(_.map(contents, buildMDFromContent))).join('\n\n'),
    (await Promise.all(_.map(subChapters, buildMDFromSubChapter))).join('\n\n')
  ].join('\n\n\n');
}

export async function buildMDFromChapters(chapters) {
  return (await Promise.all(_.map(chapters, buildMDFromChapter))).join('\n\n');
}

export function buildHTMLFromMD(text) {
  return html.markdown(text);
}

export async function buildHTMLFromChapter(chapter) {
  return html.markdown(await buildMDFromChapter(chapter));
}

// Function to encode special XML characters in a string
export function encodeXmlEntities(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    /* eslint-disable */
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); // Remove control characters
  /* eslint-enable */
}