import _ from 'lodash';
import { html, util, api } from 'utils';
import {
    chapterToHTML,
    chapterItemsToMarkdown,
} from './chapter-html-converter';

export function getImageUrl(image='') {
    if (image.startsWith('blob')) {
        return image;
    } else {
        return api.getMediaFullPath(image);
    }
}


function parseChapter(epub, index) {
    return {
        ...epub,
        id: util.genId(),
        title: epub.title || `Chapter ${index + 1}`,
    };
}

export function parseEpubData(epubData) {
    return _.map(epubData, parseChapter);
}

export function getAllItemsInChapter(chapter) {
    return _.flatten([
        chapter.items,
        ..._.map(
            (chapter.subChapters || []), 
            subChapter => subChapter.items
        )
    ]);
}

export function getAllImagesInChapter(chapter) {
    let items = getAllItemsInChapter(chapter);
    return _.map(items, item => item.image);
}

/**
 * @todo generate text for chapter based on items and subchapters
 */
export function genChaperFromItems(chapter, replaceText=true) {
    let { 
        id,
        title,
        // image,
        items,
        text = "",
        audioDescription = "",
        subChapters = [],
    } = chapter;

    let content = chapterItemsToMarkdown(items);
    chapter.content = content;
    text = (replaceText || !text) ? chapterToHTML(chapter) : text;

    return {
        id: id || util.genId(),
        title: title || 'Untitled Chapter',
        items: items,
        audioDescription: audioDescription,
        content,
        text,
        subChapters,
    };
}

export function genSubChaperFromItems(subChapter) {
    const { 
        id,
        title,
        // image,
        items,
        // text = "",
        // audioDescription = "",
    } = subChapter;

    return {
        id: id || util.genId(),
        title: title || 'Untitled Sub-Chapter',
        image: (items[0] || {}).image,
        items: items,
        // audioDescription: audioDescription,
        // text: text || html.strList(items, 'text'),
        text: chapterItemsToMarkdown(items)
    };
}

export function getCompactText(chapter) {
    return _.map(getAllItemsInChapter(chapter), item => item.text)
            .filter(txt => txt !== '')
            .join('. ')
            .slice(0, 200);
}