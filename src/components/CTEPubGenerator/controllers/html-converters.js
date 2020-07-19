import _ from 'lodash';
import { html, uurl } from 'utils';

export function buildHTMLFromMD(text) {
  return html.markdown(text);
}

export function buildMarkdownFromItems(items) {
  const subTitle = items.length > 0 ? '\n#### Transcript\n\n' : '';

  return subTitle + _.map(items, (item) => _.trim(item.text)).join('\n\n');
}

export function buildMDFromChapter({ id, items, text, subChapters, image, title }) {
  /*eslint-disable */
  const content = text || buildMarkdownFromItems(items);

  const chapterHTML = `\n\n<h2 data-ch id="${id}">${title}</h2>\n\n`
                    + (image ? `![Screenshot](${uurl.getMediaUrl(image)})\n\n` : '')
                    + content + '\n\n';

  const subChapterHTML = _.reduce(
    subChapters,
    (subHtml, subChapter, index) =>
      `${subHtml}\n\n<!-- Sub-chapter ${index + 1} -->\n` 
      + `<h3 data-sub-ch id="${subChapter.id}">${subChapter.title}</h3>\n\n`
      + (subChapter.image ? `![Screenshot](${uurl.getMediaUrl(subChapter.image)})\n` : '')
      + subChapter.text
    ,
    '\n',
  );
  /*eslint eqeqeq:0*/

  return chapterHTML + subChapterHTML;
}

export function buildMDFromChapters(chapters) {
  return _.map(chapters, buildMDFromChapter).join('\n\n');
}
