import _ from 'lodash';
import { prompt, util, ARRAY_INIT } from 'utils';
import { epubState } from "./setstate";


export function setupChapters(epubData) {
    let chapters = [{
        items: epubData,
        title: 'Default Chapter',
        id: util.genId('epub-ch')
    }];

    epubState.setChapters(chapters);

    if (chapters[0]) {
        epubState.changeChapter(chapters[0]);
    }
}

export function startManagingEpubChapters() {
    epubState.setIsEditingEpub(true);
}

export function handleMouseOverChapterList(chapter) {
    epubState.changeChapter(chapter);
}

// **********************************************************************
// handle save ePub
// **********************************************************************

export function saveChapters() {
    epubState.setIsEditingEpub(false);

    prompt.addOne({
      text: 'ePub chapters saved.',
      status: 'success',
      position: 'left bottom',
      timeout: 3000,
    });
}

export function cancelEditChapters() {
    setupChapters(epubState.epubData);
    epubState.setIsEditingEpub(false);
}


// **********************************************************************
// Handle split chapters
// **********************************************************************

var untitledNum = 0;

export function splitChapter(chapterIndex, itemIndex) {
    let chapters = epubState.chapters;
    let items = chapters[chapterIndex].items;
    chapters[chapterIndex].items = _.slice(items, 0, itemIndex + 1);
    let newChapter = {};
    newChapter.items = _.slice(items, itemIndex + 1, items.length);
    newChapter.id = util.genId('epub-ch');
    newChapter.title = 'Untitled Chapter' + (untitledNum === 0 ? '' : ' ' + untitledNum);
    untitledNum += 1;

    // Check if the cover of the curr chapter is in the splitted new chapter
    let cover = chapters[chapterIndex].image;
    if (cover && _.findIndex(newChapter.items, { image: cover }) >= 0) {
        chapters[chapterIndex].image = undefined;
    }

    epubState.setChapters([
        ..._.slice(chapters, 0, chapterIndex+1),
        newChapter,
        ..._.slice(chapters, chapterIndex+1, chapters.length),
    ]);

    epubState.changeChapter(newChapter);
}

export function undoSplitChapter(chapterIndex) {
    let chapters = epubState.chapters;
    let currItems = chapters[chapterIndex].items;
    let prevItems = chapters[chapterIndex - 1].items;
    chapters[chapterIndex - 1].items = [ ...prevItems, ...currItems ];

    epubState.setChapters([
        ..._.slice(chapters, 0, chapterIndex),
        ..._.slice(chapters, chapterIndex+1, chapters.length),
    ]);

    epubState.changeChapter(chapters[chapterIndex - 1]);
}

export function resetToDefaultChapters() {
    let defaultChapter = {
        items: epubState.epubData,
        title: 'Default Chapter',
        id: util.genId('epub-ch')
    };

    epubState.setChapters([ defaultChapter ]);
    epubState.changeChapter(defaultChapter);

    prompt.addOne({
      text: 'Reset to the default chapters.',
      position: 'left bottom',
      timeout: 2000,
    });
}

export function splitChaptersByScreenshots() {
    let splitChapters = _.map(
        epubState.epubData, 
        (data, idx) => ({
            items: [data], 
            title: 'Untitled Chapter ' + idx, 
            id: util.genId('epub-ch')
        })
    );

    epubState.setChapters(splitChapters);
    epubState.changeChapter(splitChapters[0]);

    prompt.addOne({
        text: 'Split the chapters by screenshots.',
        position: 'left bottom',
        timeout: 2000,
    });
}

// **********************************************************************
// handle edit title
// **********************************************************************

export function handleTitleChange(chapterIndex, value) {
    let chapters = epubState.chapters;
    chapters[chapterIndex].title = value;

    epubState.setChapters([ ...chapters ]);
    epubState.changeChapter(chapters[chapterIndex]);
}

// **********************************************************************
// handle cover image picker
// **********************************************************************

export function openCoverImagePicker() {
    epubState.setCoverImgs(
        _.map(
            epubState.currChapter.items, 
            item => item.image
        )
    );
}

export function closeCoverImagePicker() {
    epubState.setCoverImgs([]);
}

export function saveCoverImage(image) {
    let currChapter = epubState.currChapter;
    let chapters = epubState.chapters;

    let chapterIndex = _.findIndex(chapters, { id: currChapter.id });
    if (chapterIndex >= 0) {
        chapters[chapterIndex].image = image;
        currChapter.image = image;
        epubState.setChapters([ ...chapters ]);
        epubState.setCurrChapter({ ...currChapter });
    }

    closeCoverImagePicker();
}

// **********************************************************************
// handle fold/unfold chapters
// **********************************************************************

export function foldChapter(id) {
    epubState.setFoldedIds([ ...epubState.foldedIds, id ]);
}

export function unfoldChapter(id) {
    let foldedIds = epubState.foldedIds;
    _.remove(foldedIds, fid => fid === id);

    epubState.setFoldedIds([ ...foldedIds ]);
}

// **********************************************************************
// handle language change
// **********************************************************************

export function changeLanguage(lang) {
    epubState.setLanguage(lang);
    epubState.setChapters(ARRAY_INIT);
    epubState.changeEpubLanguage(lang);
}

// **********************************************************************
// handle magnify images
// **********************************************************************

export function magnifyImage(image) {
    epubState.setMagnifiedImg(image);
}

export function endMagnifyImage() {
    epubState.setMagnifiedImg(null);
}