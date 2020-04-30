import _ from 'lodash';
import { prompt, util, ARRAY_INIT } from 'utils';
import { epubState } from "./setstate";
import { 
    genChaperFromItems, 
    genSubChaperFromItems 
} from './util';


export function setupChapters(epubData) {
    let chapters = [genChaperFromItems(
        {
            items: epubData,
            title: 'Default Chapter'
        }
    )];

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
// Helpers
// **********************************************************************

var untitledNum = 0;
function genUntitledName() {
    let name = 'Untitled Chapter' + (untitledNum === 0 ? '' : ' ' + untitledNum);
    untitledNum += 1;
    return name;
}

function updateEpubChapters(chapters, currChapter) {
    epubState.setChapters([ ...chapters ]);
    epubState.changeChapter({ ...currChapter });
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
        items: epubState.epubData,
        title: 'Default Chapter',
        id: util.genId('epub-ch')
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
        epubState.epubData, 
        (data, idx) => genChaperFromItems({
            items: [data], 
            title: 'Untitled Chapter ' + (idx + 1), 
            id: util.genId('epub-ch')
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

    let subChapter = {};
    subChapter.items = _.slice(items, itemIndex, items.length);
    subChapter = genSubChaperFromItems(subChapter);

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

    currChapter.text = '';
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

    updateEpubChapters(chapters, currChapter);
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

    let subChapters = currChapter.subChapters;
    currChapter.subChapters = [
        ..._.slice(subChapters, 0, subChapterIndex),
        ..._.slice(subChapters, subChapterIndex + 1, subChapters.length),
    ]

    currChapter.text = '';
    currChapter = genChaperFromItems(currChapter);

    updateEpubChapters(chapters, currChapter);
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
        subChapters: _.slice(subChapters, subChapterIndex + 1, subChapters.length)
    });

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
    _.forEach(chapters, (chapter, chapterIndex) => {
        chapter.subChapters = [
            ..._.map(
                chapter.items,
                (item, subChapterIndex) => genSubChaperFromItems({ 
                    items: [item],
                    title: 'Untitled Sub-Chapter ' + (subChapterIndex + 1)
                })
            ),
            ...chapter.subChapters
        ];
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