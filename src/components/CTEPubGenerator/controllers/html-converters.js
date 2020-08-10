import _ from 'lodash';
import { html, uurl } from 'utils';

export function buildMDFromItems(items) {
  if (!items || items.length === 0) return '';
  return `\n#### Transcript\n\n${ 
         _.map(items, (item) => _.trim(item.text)).join('\n\n')}`;
}

export function buildMDFromContent(content) {
  if (typeof content === 'string') return content;
  return `![${content.alt}](${uurl.getMediaUrl(content.src)})`;
}

export function buildMDFromSubChapter({ id, title, contents }) {
  let mdString = `<!-- Sub-Chapter -->\n<h3 data-sub-ch id="${id}">${title}</h3>\n\n`;
  mdString += _.map(contents, buildMDFromContent).join('\n\n');

  return `${mdString }\n`;
}

export function buildMDFromChapter({ id, contents, subChapters, title }) {
  let mdString = [
    `<!-- Chapter -->\n<h2 data-ch id="${id}">${title}</h2>`,
    _.map(contents, buildMDFromContent).join('\n\n'),
    _.map(subChapters, buildMDFromSubChapter).join('\n\n')
  ].join('\n\n\n');

  return mdString;
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
