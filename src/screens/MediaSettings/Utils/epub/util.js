import _ from 'lodash';
import { util, api } from 'utils';
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
export function genChaperFromItems(chapter, replace=true) {
    let { 
        id,
        title = 'Untitled Chapter',
        image,
        items = [],
        // text = "",
        audioDescription = "",
        subChapters = [],
        content,
    } = chapter;

    if (replace) {
        content = chapterItemsToMarkdown(items);
        chapter.content = content;
    }

    return {
        id: id || util.genId(),
        title,
        image,
        items: items,
        audioDescription,
        content,
        text: chapterToHTML(chapter),
        subChapters,
    };
}

export function genSubChaperFromItems(subChapter, replace=true) {
    const { 
        id,
        title,
        image,
        items = [],
        text = "",
        // audioDescription = "",
    } = subChapter;

    return {
        id: id || util.genId(),
        title: title || 'Untitled Sub-Chapter',
        image: replace
            ? (items[0] || {}).image
            : image,
        items: items,
        // audioDescription: audioDescription,
        // text: text || html.strList(items, 'text'),
        text: replace 
            ? chapterItemsToMarkdown(items)
            : text
    };
}

export function getCompactText(chapter) {
    return _.map(getAllItemsInChapter(chapter), item => item.text)
            .filter(txt => txt !== '')
            .join('. ')
            .slice(0, 200);
}