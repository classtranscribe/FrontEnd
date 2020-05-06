import _ from 'lodash';
import { prompt, CTEpubGenerator } from 'utils';
import { EDITOR_MARKDOWN } from './constants';
import { setup } from '../setup';
import { getImageUrl } from './util';
import { markdown2HTML, parseText } from './chapter-html-converter';
import { epubState } from './setstate';


function formatEpubChapter(chapter) {
    let parsedTxt = parseText(chapter.text);
    if (parsedTxt.editorType === EDITOR_MARKDOWN) {
        chapter.text = markdown2HTML(parsedTxt.content);
    }

    return chapter;
}

function getEpubGeneratorOptions({
    filename,
    author,
    title,
    cover,
    chapters,
}) {
    let { mediaName } = setup.media();

    return { 
        chapters,
        cover: getImageUrl(cover),
        filename: (filename || mediaName), 
        author: author || 'Anonymous', 
        language: epubState.language,
        title: title || mediaName
    };
}

function handleError(error) {
    if (error.message === 'Network Error') {
        error.message += ': Failed to download cover images.';
    } else {
        error.message = 'Failed: ' + error.message;
    }

    prompt.addOne({ 
        text: error.message,
        status: 'error',
        position: 'bottom left'
    });
}

function getEpubGen({
    filename, 
    author,
    title,
    cover,
}) {
    let chapters = _.map(epubState.chapters, formatEpubChapter);
  
    let options = getEpubGeneratorOptions({ 
        filename, 
        author,
        title,
        cover,
        chapters,
    });

    const epubgen = new CTEpubGenerator(options);

    return epubgen;
}


export function downloadAsEpub({
    filename, 
    author,
    title,
    cover,
}) {
    getEpubGen({
        filename, 
        author,
        title,
        cover,
    })
    .downloadEpub({
        onError: handleError
    });
}

export function downloadAsHTML({
    filename, 
    author,
    title,
    cover,
}) {
    getEpubGen({
        filename, 
        author,
        title,
        cover,
    })
    .downloadHTML({
        onError: handleError
    });
}

export function downloadAsPDF({
    filename, 
    author,
    title,
    cover,
}, print=true) {
    getEpubGen({
        filename, 
        author,
        title,
        cover,
    })
    .preview({
        print,
        onError: handleError
    });
}