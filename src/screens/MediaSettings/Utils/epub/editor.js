import _ from 'lodash';
import { mspPreference as pref  } from 'utils/user-preference/media-settings';
import { util } from 'utils';
import { setup } from '../setup';
import { 
    EDITOR_TYPE_SPLITTER, 
    EDITOR_THEME_XCODE, 
    EDITOR_THEME_MONOKAI 
} from './constants';
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


// **********************************************************************
// Handle fullscreen change
// **********************************************************************

export function enterFullscreen() {
    if (!epubState.editorFullscreen) {
        setup.enterFullscreen('msp-ee-editor');
    }
}

export function exitFullscreen() {
    if (epubState.editorFullscreen) {
        setup.exitFullscreen();
    }
}

export function handleFullscreenChange() {
    if (epubState.editorFullscreen) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

function onFullscreenChange() {
    epubState.setEditorFullscreen(!epubState.editorFullscreen);
    util.elem.scrollIntoCenter('msp-ee-editor');
}

export function addEditorFullscreenChangeEventListener() {
    document.addEventListener('fullscreenchange', onFullscreenChange, true);
}

export function removeEditorFullscreenChangeEventListener() {
    document.removeEventListener('fullscreenchange', onFullscreenChange, true);
}

// **********************************************************************
// Handle theme change
// **********************************************************************

export function changeTheme() {
    let dark = epubState.editorTheme === EDITOR_THEME_MONOKAI;
    let theme = dark ? EDITOR_THEME_XCODE : EDITOR_THEME_MONOKAI;
    pref.defaultEditorTheme(theme);
    epubState.setEditorTheme(theme);
}