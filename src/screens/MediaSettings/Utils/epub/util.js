import _ from 'lodash';
import { html, util } from 'utils';
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

export function genChaperFromItems(chapter) {
    const { 
        id,
        title,
        image,
        items,
        text = "",
        audioDescription = "",
        subChapters = [],
    } = chapter;

    return {
        id: id || util.genId('epub-ch'),
        title: title || 'Untitled Chapter',
        image: image || (items[0] || {}).image,
        items: items,
        audioDescription: audioDescription,
        text: text || html.strList(items, 'text'),
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
    let editorType = splittedTexts[1]

    return { content, editorType }
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