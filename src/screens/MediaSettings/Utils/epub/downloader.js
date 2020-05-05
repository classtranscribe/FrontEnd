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
        filename: (filename || mediaName) + '.epub', 
        author: author || 'Anonymous', 
        language: epubState.language,
        title: title || mediaName
    };
}

function handleError(error) {
    if (error.message === 'Network Error') {
        error.message += ': Failed to download cover images.';
    } else {
        error.message += 'Failed to download the ePub file.';
    }

    prompt.addOne({ 
        text: error.message,
        status: 'error',
        position: 'bottom left'
    });
}


export function downloadAsEpub({
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

    const epubDownloader = new CTEpubGenerator(options);
  
    epubDownloader.download({
        onError: handleError
    });
}