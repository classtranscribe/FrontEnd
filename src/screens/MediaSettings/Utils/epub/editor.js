import _ from 'lodash';
import { EDITOR_TYPE_SPLITTER } from '../constants';
import { epubState } from './setstate';
import { parseText } from './chapter-html-converter';

var newText = '';

export function startEditContent(txtEditor, description) {
    let text = description 
             ? epubState.currChapter.audioDescription 
             : epubState.currChapter.text;

    let { content } = parseText(text, txtEditor);
    newText = content;
}

export function updateText(newText) {
    newText = newText;
}

export function onSaveText(type) {
    let { 
        chapters, 
        currChapter 
    } = epubState.chapters;

    let chapterIndex = _.findIndex(chapters, { id: currChapter.id });

    if (chapterIndex >= 0) {
        newText += EDITOR_TYPE_SPLITTER + type;
        chapters[chapterIndex].text = newText;
        currChapter.text = newText;
        epubState.setChapters([ ...chapters ]);
        epubState.setCurrChapter({ ...currChapter });
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
        epubState.setChapters([ ...chapters ]);
        epubState.setCurrChapter({ ...currChapter });
    }

    newText = '';
}

