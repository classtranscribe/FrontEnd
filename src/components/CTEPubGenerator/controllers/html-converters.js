import _ from 'lodash';
import { html, uurl } from 'utils';
import { buildID } from './utils';

export function buildMDFromItems(items) {
  if (!items || items.length === 0) return '';
  return [
    '\n#### Transcript',
    _.map(items, (item) => _.trim(item.text)).join('\n\n')
  ].join('\n\n');
}

export function buildMDFromContent(content) {
  if (typeof content === 'string') return content;
  if (_.trim(content.description)) {
    let despId = buildID();
    return [
      '<div class="img-block">',
      `\t<img src="${uurl.getMediaUrl(content.src)}" alt="${content.alt}" aria-describedby="${despId}" />`,
      `\t<div id="${despId}">${html.markdown(content.description)}</div>`,
      '</div>'
    ].join('\n');
  } 
    return [
      '<div class="img-block">',
      `\t<img src="${uurl.getMediaUrl(content.src)}" alt="${content.alt}" />`,
      '</div>'
    ].join('\n');
}

export function buildMDFromSubChapter({ id, title, contents }) {
  return [
    `<!-- Sub-Chapter -->\n<h3 data-sub-ch id="${id}">${title}</h3>\n\n`,
    _.map(contents, buildMDFromContent).join('\n\n')
  ].join('\n\n');
}

export function buildMDFromChapter({ id, contents, subChapters, title }) {
  return [
    `<!-- Chapter -->\n<h2 data-ch id="${id}">${title}</h2>`,
    _.map(contents, buildMDFromContent).join('\n\n'),
    _.map(subChapters, buildMDFromSubChapter).join('\n\n')
  ].join('\n\n\n');
}

export function buildMDFromChapters(chapters) {
  return _.map(chapters, buildMDFromChapter).join('\n\n');
}

export function buildHTMLFromMD(text) {
  return html.markdown(text);
}

export function buildHTMLFromChapter(chapter) {
  return html.markdown(buildMDFromChapter(chapter));
}
