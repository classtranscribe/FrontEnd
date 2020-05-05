import _ from 'lodash';
import { prompt, util, ARRAY_INIT } from 'utils';
import { epubState } from "./setstate";
import { 
    genChaperFromItems, 
    genSubChaperFromItems,
    getAllItemsInChapter
} from './util';
import { EPUB_STEP_EDIT } from './constants';

let { updateEpubChapters } = epubState;

// **********************************************************************
// Helpers
// **********************************************************************

var untitledNum = 0;
function genUntitledName() {
    let name = 'Untitled Chapter' + (untitledNum === 0 ? '' : ' ' + untitledNum);
    untitledNum += 1;
    return name;
}

// **********************************************************************
// handle save ePub
// **********************************************************************

export function proceedToStep2() {
    epubState.setStep(EPUB_STEP_EDIT);

    prompt.addOne({
        text: "Start editing your chapters' contents.",
        status: 'success',
        position: 'left bottom',
        timeout: 3000,
    }, true);
}

export function cancelEditChapters() {
    setupChapters(epubState.epubData);
    epubState.setIsManagingChapters(false);
}


// **********************************************************************
// Handle split chapters
// **********************************************************************

export function splitChapterFromChaptersItems(chapterIndex, itemIndex) {
    let chapters = epubState.chapters;
    let items = chapters[chapterIndex].items;
    chapters[chapterIndex].items = _.slice(items, 0, itemIndex);

    let newChapter = {};

    // add the sub chapters to the new chapter
    newChapter.subChapters = chapters[chapterIndex].subChapters;
    chapters[chapterIndex].subChapters = [];

    // setup new chapter
    newChapter.items = _.slice(items, itemIndex, items.length);
    newChapter.title = genUntitledName();
    newChapter = genChaperFromItems(newChapter);
    chapters[chapterIndex] = genChaperFromItems(chapters[chapterIndex]);

    updateEpubChapters(
        [
            ..._.slice(chapters, 0, chapterIndex + 1),
            newChapter,
            ..._.slice(chapters, chapterIndex + 1, chapters.length),
        ], 
        newChapter
    );
}

export function undoSplitChapter(chapterIndex) {
    let chapters = epubState.chapters;
    let currChapter = chapters[chapterIndex];
    let prevChapter = chapters[chapterIndex - 1];

    // if the prev chapter has sub-chapters
    // append curr chapter and its sub-chapters to prev's sub-chapters
    if (prevChapter.subChapters.length > 0) {
        if (currChapter.items.length === 0) {
            prevChapter.subChapters = [
                ...prevChapter.subChapters,
                ...currChapter.subChapters,
            ];
        } else {
            prevChapter.subChapters = [
                ...prevChapter.subChapters,
                genSubChaperFromItems(currChapter),
                ...currChapter.subChapters,
            ];
        }
    // otherwise, append items & sub-chapters of this chapter to the prev
    } else {
        prevChapter.items = [
            ...prevChapter.items, 
            ...currChapter.items
        ];

        prevChapter.subChapters = currChapter.subChapters;
    }

    chapters[chapterIndex - 1] = genChaperFromItems(prevChapter);

    updateEpubChapters(
        [
            ..._.slice(chapters, 0, chapterIndex),
            ..._.slice(chapters, chapterIndex + 1, chapters.length),
        ],
        chapters[chapterIndex - 1]
    );
}

export function resetToDefaultChapters() {
    let defaultChapter = genChaperFromItems({
        items: _.filter(epubState.epubData, data => _.trim(data.text)),
        title: 'Default Chapter',
        id: util.genId()
    });

    updateEpubChapters([defaultChapter], defaultChapter);

    prompt.addOne({
      text: 'Reset to the default chapters.',
      position: 'left bottom',
      timeout: 2000,
    });
}

export function splitChaptersByScreenshots() {
    let splitChapters = _.map(
        _.filter(epubState.epubData, data => _.trim(data.text)), 
        (data, idx) => genChaperFromItems({
            items: [data], 
            title: 'Untitled Chapter ' + (idx + 1), 
            id: util.genId()
        })
    );

    updateEpubChapters(splitChapters, splitChapters[0]);

    prompt.addOne({
        text: 'Split the chapters by screenshots.',
        position: 'left bottom',
        timeout: 2000,
    });
}


// **********************************************************************
// Handle split sub-chapters
// **********************************************************************

export function subdivideChapter(chapterIndex, itemIndex) {
    let { chapters } = epubState;

    let currChapter = chapters[chapterIndex];
    let items = currChapter.items;
    currChapter.items = _.slice(items, 0, itemIndex);

    let subChapter = genSubChaperFromItems({
        items: _.slice(items, itemIndex, items.length)
    });

    currChapter.subChapters = [subChapter, ...currChapter.subChapters];
    chapters[chapterIndex] = genChaperFromItems(currChapter);

    updateEpubChapters(
        [
            ..._.slice(chapters, 0, chapterIndex + 1),
            ..._.slice(chapters, chapterIndex + 1, chapters.length),
        ], 
        chapters[chapterIndex]
    );
}

export function undoSubdivideChapter(chapterIndex) {
    let { chapters } = epubState;
    let currChapter = chapters[chapterIndex];
    let subChapters = currChapter.subChapters;
    
    let subChapterItems = subChapters[0].items;
    currChapter.items = [...currChapter.items, ...subChapterItems];

    currChapter.subChapters = subChapters.slice(1, subChapters.length);
    chapters[chapterIndex] = genChaperFromItems(currChapter);

    updateEpubChapters(chapters, chapters[chapterIndex]);
}

export function splitSubChapter(chapterIndex, subChapterIndex, itemIndex) {
    let { chapters } = epubState;
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];
    let items = currSubChapter.items;

    currSubChapter.items = _.slice(items, 0, itemIndex);

    let newSubChapter = {};
    newSubChapter.items = _.slice(items, itemIndex, items.length);
    newSubChapter = genSubChaperFromItems(newSubChapter);

    let subChapters = currChapter.subChapters;
    currChapter.subChapters = [
        ..._.slice(subChapters, 0, subChapterIndex + 1),
        newSubChapter,
        ..._.slice(subChapters, subChapterIndex + 1, subChapters.length),
    ];

    chapters[chapterIndex] = genChaperFromItems(currChapter);

    updateEpubChapters(chapters, chapters[chapterIndex]);
}

export function undoSplitSubChapter(chapterIndex, subChapterIndex) {
    let { chapters } = epubState;
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];
    let prevSubChapter = currChapter.subChapters[subChapterIndex - 1];

    prevSubChapter.items = [
        ...prevSubChapter.items,
        ...currSubChapter.items
    ];

    currChapter.subChapters[subChapterIndex - 1] = genSubChaperFromItems(prevSubChapter);

    let subChapters = currChapter.subChapters;
    currChapter.subChapters = [
        ..._.slice(subChapters, 0, subChapterIndex),
        ..._.slice(subChapters, subChapterIndex + 1, subChapters.length),
    ];

    chapters[chapterIndex] = genChaperFromItems(currChapter);

    updateEpubChapters(chapters, chapters[chapterIndex]);
}

export function splitChapterFromSubChaptersItems(chapterIndex, subChapterIndex, itemIndex) {
    let { chapters } = epubState;
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];
    let items = currSubChapter.items;

    currSubChapter.items = _.slice(items, 0, itemIndex);

    let newChapter = genChaperFromItems({
        items: _.slice(items, itemIndex, items.length),
        title: genUntitledName()
    });
    
    chapters[chapterIndex] = genChaperFromItems(currChapter);

    updateEpubChapters(
        [
            ..._.slice(chapters, 0, chapterIndex + 1),
            newChapter,
            ..._.slice(chapters, chapterIndex + 1, chapters.length),
        ], 
        newChapter
    );
}

export function splitChapterFromSubChapter(chapterIndex, subChapterIndex) {
    let { chapters } = epubState;
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];

    let subChapters = currChapter.subChapters;
    currChapter.subChapters = _.slice(subChapters, 0, subChapterIndex);
    
    let newChapter = genChaperFromItems({
        ...currSubChapter,
        image: undefined,
        subChapters: _.slice(subChapters, subChapterIndex + 1, subChapters.length)
    });
    chapters[chapterIndex] = genChaperFromItems(currChapter);

    updateEpubChapters(
        [
            ..._.slice(chapters, 0, chapterIndex + 1),
            newChapter,
            ..._.slice(chapters, chapterIndex + 1, chapters.length),
        ], 
        newChapter
    );
}

export function subdivideChaptersByScreenshots() {
    let { chapters } = epubState;
    if (chapters === ARRAY_INIT) return;
    
    _.forEach(chapters, (chapter, chapterIndex) => {
        let items = getAllItemsInChapter(chapter);

        chapter.subChapters = _.map(
            items,
            (item, subChapterIndex) => genSubChaperFromItems({ 
                items: [item],
                title: 'Untitled Sub-Chapter ' + (subChapterIndex + 1)
            })
        );

        chapter.items = [];
        chapters[chapterIndex] = genChaperFromItems(chapter)
    });

    updateEpubChapters(chapters, chapters[0]);

    prompt.addOne({
        text: 'Subdivided all the chapters by screenshots.',
        position: 'left bottom',
        timeout: 2000,
    });
}


// **********************************************************************
// handle edit title
// **********************************************************************

export function handleChapterTitleChange(chapterIndex, value) {
    let chapters = epubState.chapters;
    chapters[chapterIndex].title = value;

    updateEpubChapters(chapters, genChaperFromItems(chapters[chapterIndex]));
}

export function handleSubChapterTitleChange(chapterIndex, subChapterIndex, value) {
    let chapters = epubState.chapters;
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];
    currSubChapter.title = value;

    currChapter.subChapters[subChapterIndex] = genSubChaperFromItems(currSubChapter);
    chapters[chapterIndex] = genChaperFromItems(currChapter);

    updateEpubChapters(chapters, chapters[chapterIndex]);
}

// **********************************************************************
// handle cover image picker
// **********************************************************************

export function openCoverImagePicker() {
    let items = getAllItemsInChapter(epubState.currChapter);
    epubState.setCoverImgs(_.map(items, item => item.image));
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

        updateEpubChapters(chapters, currChapter);
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


// **********************************************************************
// Setup
// **********************************************************************


export function setupChapters(epubData) {
    if (epubData === ARRAY_INIT) return;

    let chapters = [genChaperFromItems(
        {
            items: _.filter(epubData, data => _.trim(data.text)),
            title: 'Default Chapter'
        }
    )];

    epubState.setChapters(chapters);

    if (chapters[0]) {
        epubState.changeChapter(chapters[0]);
    }

    // subdivideChaptersByScreenshots();
}

export function startManagingEpubChapters() {
    epubState.setIsManagingChapters(true);
}

export function handleMouseOverChapterList(chapter) {
    epubState.changeChapter(chapter);
}