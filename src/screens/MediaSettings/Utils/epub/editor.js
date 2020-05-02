import _ from 'lodash';
import { EDITOR_TYPE_SPLITTER } from './constants';
import { epubState } from './setstate';
import { parseText } from './chapter-html-converter';

const { updateEpubChapters } = epubState;

export var newText = '';

export const getNewText = () => newText;

export function startEditContent(txtEditor, description) {
    let text = description 
             ? epubState.currChapter.audioDescription 
             : epubState.currChapter.text;

    let { content } = parseText(text, txtEditor);
    newText = content;
}

export function updateText(text) {
    newText = text;
}

export function onSaveText(type) {
    let { 
        chapters, 
        currChapter 
    } = epubState;

    let chapterIndex = _.findIndex(chapters, { id: currChapter.id });
    console.log('chapterIndex', chapterIndex, newText)

    if (chapterIndex >= 0) {
        newText += EDITOR_TYPE_SPLITTER + type;
        chapters[chapterIndex].text = newText;

        updateEpubChapters(chapters, chapters[chapterIndex]);
        console.log(chapters[chapterIndex])
    }

    newText = '';
}

export function onSaveAD(type) {
    let { 
        chapters, 
        currChapter 
    } = epubState.chapters;

    let chapterIndex = _.findIndex(chapters, { id: currChapter.id });

    if (chapterIndex >= 0) {
        newText += EDITOR_TYPE_SPLITTER + type;
        chapters[chapterIndex].audioDescription = newText;
        currChapter.audioDescription = newText;

        updateEpubChapters(chapters, currChapter);
    }

    newText = '';
}

