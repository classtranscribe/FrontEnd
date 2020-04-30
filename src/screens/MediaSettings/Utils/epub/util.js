import _ from 'lodash';
import { html, util, api } from 'utils';
import { EDITOR_TYPE_SPLITTER } from '../constants';


function parseChapter(epub, index) {
    return {
        ...epub,
        id: util.genId('epub-data'),
        title: epub.title || `Chapter ${index + 1}`,
    };
}

export function parseEpubData(epubData) {
    return _.map(epubData, parseChapter);
}

function generateHtml({ items, subChapters }) {
    let chapterHTML = html.strList(items, 'text');
    let subChapterHTML = _.reduce(
        subChapters,
        (subHtml, subChapter) => subHtml 
                               + `\n\n<h3>${subChapter.title}</h3>\n\n`
                               + `<img src="${api.getMediaFullPath(subChapter.image)}" />\n\n`
                               + html.strList(subChapter.items, 'text')
        ,
        ''
    );

    return chapterHTML + subChapterHTML;
}

/**
 * @todo generate text for chapter based on items and subchapters
 */
export function genChaperFromItems(chapter, replaceText=true) {
    let { 
        id,
        title,
        image,
        items,
        text = "",
        audioDescription = "",
        subChapters = [],
    } = chapter;

    text = (replaceText || !text) ? generateHtml(chapter) : text;

    return {
        id: id || util.genId('epub-ch'),
        title: title || 'Untitled Chapter',
        image: image || (items[0] || {}).image,
        items: items,
        audioDescription: audioDescription,
        text,
        subChapters,
    };
}

export function genSubChaperFromItems(subChapter) {
    const { 
        id,
        title,
        image,
        items,
        text = "",
        audioDescription = "",
    } = subChapter;

    return {
        id: id || util.genId('epub-sub-ch'),
        title: title || 'Untitled Sub-Chapter',
        image: image || (items[0] || {}).image,
        items: items,
        audioDescription: audioDescription,
        text: text || html.strList(items, 'text'),
    };
}

export function parseText(text /* , editor='' */) {
    let splittedTexts = _.split(text, EDITOR_TYPE_SPLITTER);
    let content = splittedTexts[0];
    let editorType = splittedTexts[1];

    return { content, editorType };
}

export function markdown2HTML(text) {
    return html.markdown(text);
}

export const getCompactText = chapter => {
    return _.map(chapter.items, item => item.text)
            .filter(txt => txt !== '')
            .join('. ')
            .slice(0, 200);
}