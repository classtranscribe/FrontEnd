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

export async function buildMDfromImage(image) {
  const img = await EPubParser.loadImageBuffer(uurl.getMediaUrl(image.src))
  const img_blob = new Blob([img]);
  const img_data_url = await EPubParser.blobToDataUrl(img_blob)
  if (_.trim(image.description)) {
    let despId = _buildID();
    return [
      '<div class="img-block">',
      `\t<img src="${img_data_url}" alt="${image.alt}" aria-describedby="${despId}" />`,
      `\t<div id="${despId}">${html.markdown(image.description)}</div>`,
      '</div>'
    ].join('\n');
  } 
    return [
      '<div class="img-block">',
      `\t<img src="${img_data_url}" alt="${image.alt}" />`,
      '</div>'
    ].join('\n');
}

export async function buildMDFromContent(content) {
  // if content is just text 
  if (typeof content === 'string') return content;
  if ("__data__" in content) {  // unwrap __data__ for correct image loading in subchapters 
    content = JSON.parse(JSON.stringify(content.__data__))
  }
  // if content is an image 
  return buildMDfromImage(content);
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
