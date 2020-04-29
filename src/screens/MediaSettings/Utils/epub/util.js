import _ from 'lodash';
import { html } from 'utils';
import { EDITOR_TYPE_SPLITTER } from '../constants';


export function genChaperFromItems(chapter) {
    const { 
        id,
        title,
        image,
        items,
        text="",
        audioDescription="",
    } = chapter;

    return {
        id: id,
        title: title || 'Untitled Chapter',
        image: image || (items[0] || {}).image,
        items: items,
        audioDescription: audioDescription,
        text: text || html.strList(items, 'text')
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