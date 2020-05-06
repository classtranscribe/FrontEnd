import _ from 'lodash';
import { EDITOR_TYPE_SPLITTER, EDITOR_MARKDOWN } from './constants';
import { html } from 'utils';
import { getImageUrl } from './util'

export function parseText(text) {
    let splittedTexts = _.split(text, EDITOR_TYPE_SPLITTER);
    let content = splittedTexts[0];
    let editorType = splittedTexts[1];

    return { content, editorType };
}

export function markdown2HTML(text) {
    return html.markdown(text);
}

export function chapterItemsToMarkdown(items) {
    let subTitle = items.length > 0 
                 ? '\n#### Transcript\n'
                 : '';

    return  subTitle
            + _.map(items, item => _.trim(item.text)).join('\n\n')
            + '\n\n'
            + EDITOR_TYPE_SPLITTER 
            + EDITOR_MARKDOWN;
}

export function chapterToHTML({ 
    id,
    items, 
    content, 
    subChapters, 
    image, 
    title 
}) {
    if (!content) content = chapterItemsToMarkdown(items);
    content = parseText(content).content;

    let chapterHTML = `\n\n<h2 data-ch id="${id}">${title}</h2>\n\n`
                    + (image ? `![Screenshot](${getImageUrl(image)})\n\n` : '')
                    + parseText(content).content;

    let subChapterHTML = _.reduce(
        subChapters,
        (subHtml, subChapter, index) => subHtml 
            + `\n\n<!-- Sub-chapter ${index + 1} -->\n`
            + `<h3 data-sub-ch id="${subChapter.id}">${subChapter.title}</h3>\n\n`
            + (subChapter.image ? `![Screenshot](${getImageUrl(subChapter.image)})\n` : '')
            // + '#### Transcript\n'
            + parseText(subChapter.text).content + '\n'
        ,
        '\n'
    );

    return chapterHTML 
         + subChapterHTML 
         + '\n\n'
         + EDITOR_TYPE_SPLITTER 
         + EDITOR_MARKDOWN;
}

export function chapterToPreviewHTML(text) {
    let { content, editorType } = parseText(text);
    let phtml = editorType === EDITOR_MARKDOWN
              ? markdown2HTML(content) 
              : content;

    return {
        content,
        editorType,
        previewHTML: phtml
    };
}

export function chaptersToMarkdown(chapters) {
    return  _.map(chapters, chapter => parseText(chapter.text).content)
             .join('\n\n\n')
            + '\n\n'
            + EDITOR_TYPE_SPLITTER 
            + EDITOR_MARKDOWN;
}
