import _ from 'lodash';
import { EPubData, EPubChapterData, EPubSubChapterData, EPubImageData } from 'entities/EPubs';
import { getAllItemsInChapters } from 'entities/EPubs/utils'

// DEBUG ONLY: remove this once debugging is complete
/* eslint-disable no-console */

function insertSubChapter(chapter, subChapterIndex, subChapterLike) {
    let newSubChapter = new EPubSubChapterData(subChapterLike);
    newSubChapter = newSubChapter.__data__ ? newSubChapter.__data__ : newSubChapter.toObject();

    console.log(`Inserting subchapter at ${subChapterIndex}: `, subChapterLike);

    chapter.subChapters = [
        ...chapter.subChapters.slice(0, subChapterIndex),
        newSubChapter,
        ...chapter.subChapters.slice(subChapterIndex)
    ];

    return newSubChapter;
}
function removeSubChapter(chapter, subChapterIndex) {
    console.log(`Removing chapter at ${subChapterIndex}`);
    let subChapter = chapter.subChapters[subChapterIndex];
    chapter.subChapters = [
        ...chapter.subChapters.slice(0, subChapterIndex),
        ...chapter.subChapters.slice(subChapterIndex + 1)
    ];
    return subChapter;
}
function insertChapter(chapters, index, chapterLike, resetText = true) {
    let newChapter = new EPubChapterData(chapterLike, resetText);
    newChapter = newChapter.__data__ ? newChapter.__data__ : newChapter.toObject();

    console.log(`Inserting chapter at ${index}: `, chapterLike);

    return [
        ...chapters.slice(0, index),
        newChapter,
        ...chapters.slice(index)
    ];
}
function removeChapter(chapters, index) {
    console.log(`Removing chapter at ${index}`);
    // let chapter = chapters[index];
    return [
        ...chapters.slice(0, index),
        ...chapters.slice(index + 1)
    ];
}

function rebuildChapter(chapters, chapterIndex, chapterLike, resetText) {
    // if there is such a chapter in the epub data
    // update the subchapter item
    console.log(`Rebuilding chapter ${chapterIndex}: `, chapterLike);
    if (chapters[chapterIndex]) {
        let toBuild = chapterLike || chapters[chapterIndex];
        const rebuilt = new EPubChapterData(toBuild, resetText).toObject();
        console.log(`Rebuilt chapter ${chapterIndex}: `, rebuilt);
        chapters[chapterIndex] = rebuilt;
    }
}

function insertContentChapter(chapter, index, content) {
    console.log(`Inserting chapter contents ${index}: `, content);
    if (index >= chapter.contents.length) {
        chapter.contents.push(content);
    } else {
        chapter.contents = [
            ...chapter.contents.slice(0, index),
            content,
            ...chapter.contents.slice(index)
        ];
    }
}
function appendChapterAsSubChapter(chapters, chapterIdx) {
    let currChp = chapters[chapterIdx];
    let prevChp = chapters[chapterIdx - 1];

    console.log(`Appending chapter ${chapterIdx} as subchapter`);
    // if no items in curr chapter
    // push its sub chapters to the prev chapter.subChapters
    if (currChp?.items?.length === 0) {
        prevChp.subChapters = _.concat(prevChp.subChapters, currChp.subChapters);
    }
    // otherwise, convert itself as a sub chapter
    // and append to the prev chapter.subChapters along w/ its sub chapters
    else {
        prevChp.subChapters = _.concat(
            prevChp.subChapters,
            new EPubSubChapterData(currChp).toObject(),
            currChp.subChapters
        );
    }
    rebuildChapter(chapters, chapterIdx - 1, null, false);

    // remove appended chapter
    chapters = removeChapter(chapters, chapterIdx);

    // this.updateAll('Append to above sub-chapters', chapterIdx - 1);
    return chapters;
}
function removeContent(chapter, predictor) {
    if (typeof predictor === 'number') {
        console.log(`Removing chapter contents at ${predictor}`);
        if (predictor >= 0 && predictor < chapter.contents.length) {
            chapter.contents = [
                ...chapter.contents.slice(0, predictor),
                ...chapter.contents.slice(predictor + 1)
            ];
        }
    } else {
        console.log(`Removing chapter contents: `, predictor);
        let currIndex = _.findIndex(chapter.contents, (val) => val === predictor);
        removeContent(chapter, currIndex);
    }
}

function rebuildSubChapter(chapters, chapterIndex, subChapterIndex, subChapterLike, resetText) {
    let currChapter = chapters[chapterIndex];
    console.log(`Rebuilding subchapter ${chapterIndex}-${subChapterIndex}: `, subChapterLike);
    if (currChapter) {
      let subChapters = currChapter.subChapters;
      // if there is such a subchapter in the epub data
      // update the subchapter item
      if (subChapters[subChapterIndex]) {
        let toBuild = subChapterLike || subChapters[subChapterIndex];
        const rebuilt = new EPubSubChapterData(toBuild, resetText).toObject();
        console.log(`Rebuilt subchapter ${chapterIndex}-${subChapterIndex}: `, rebuilt);
        subChapters[subChapterIndex] = rebuilt;
      }
    }
  }

function nextStateOfChapters(chapters) {
    console.log(`Building next state of chapters...`);
    const items = getAllItemsInChapters(chapters);
    return { chapters, items, images: _.map(items, item => item?.image) }
}
export default {
    subdivideChapter(state, { payload: { chapterIdx, itemIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx]
        console.log(`Subdividing chapter at ${chapterIdx}: `, itemIdx);
        // create a sub chp based on items after itemIdx in this chp
        insertSubChapter(chapter, 0, {
            items: _.slice(chapter.items, itemIdx)
        });

        // remove the items after itemIdx
        chapter.items = _.slice(chapter.items, 0, itemIdx);
        rebuildChapter(chapters, chapterIdx);
        // this.updateAll('Subdivide the chapter');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } }
    },
    splitChapterFromChaptersItems(state, { payload: { chapterIdx, itemIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx]
        let subChapters = chapter.subChapters;
        let items = _.slice(chapter.items, itemIdx, chapter.items.length);
        console.log(`Splitting chapter from chapter items at ${chapterIdx}: `, itemIdx);

        // remove items and sub chapters from curr chapter
        chapter.subChapters = [];
        chapter.items = _.slice(chapter.items, 0, itemIdx);
        rebuildChapter(chapters, chapterIdx);

        // insert the new chapter
        const newChapters = insertChapter(chapters, chapterIdx + 1, { subChapters, items });
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
        // this.updateAll('Split chapter', chapterIdx + 1);
    },
    undoSubdivideChapter(state, { payload: { chapterIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx]
        console.log(`Undoing subdivide chapter at ${chapterIdx}`);
        // push the items in the first sub chapter
        // to this chapter's items
        chapter.items = _.concat(chapter.items, chapter.subChapters[0].items);
        // remove this sub chapter
        removeSubChapter(chapter, 0);

        rebuildChapter(chapters, chapterIdx);
        // this.updateAll('Undo subdivide the chapter');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } }
    },
    splitSubChapter(state, { payload: { chapterIdx, subChapterIdx, itemIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx];
        const subChapter = chapter.subChapters[subChapterIdx];
        console.log(`Splitting subchapter at ${chapterIdx}-${subChapterIdx}: `, itemIdx);

        // create a new sub chp based on the items after itemIdx
        insertSubChapter(chapter, subChapterIdx + 1, {
            items: _.slice(subChapter.items, itemIdx)
        });
        // remove relocated items from curr sub chp
        subChapter.items = _.slice(subChapter.items, 0, itemIdx);

        rebuildSubChapter(chapters, chapterIdx, subChapterIdx);
        rebuildChapter(chapters, chapterIdx, null, false);
        // this.updateAll('Subdivide the chapter');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } }
    },
    undoSplitSubChapter(state, { payload: { chapterIdx, subChapterIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx];
        let currSubChp = chapter.subChapters[subChapterIdx];
        let prevSubChp = chapter.subChapters[subChapterIdx - 1];

        console.log(`Undoing split subchapter at ${chapterIdx}-${subChapterIdx}`);
        // push curr sub chp's items to the prev sub chp
        prevSubChp.items = _.concat(prevSubChp.items, currSubChp.items);
        // then delete the curr sub chp
        removeSubChapter(chapter, subChapterIdx);

        rebuildSubChapter(chapters, chapterIdx, subChapterIdx - 1);
        rebuildChapter(chapters, chapterIdx, null, false);
        // this.updateAll('Undo subdivide the chapter');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } }
    },
    splitChapterFromSubChapter(state, { payload: { chapterIdx, subChapterIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx];
        const subChapter = chapter.subChapters[subChapterIdx];

        console.log(`Splitting chapter from subchapter at ${chapterIdx}-${subChapterIdx}`);
        // create a new chp w/ items after itemIdx of this subChapter.items
        // and sub chps of the rest of curr chp
        const newChapters = insertChapter(chapters, chapterIdx + 1, {
            ...subChapter,
            image: undefined,
            subChapters: _.slice(chapter.subChapters, subChapterIdx + 1)
        });

        // remove the subchps after subChapterIdx
        chapter.subChapters = _.slice(chapter.subChapters, 0, subChapterIdx);

        rebuildChapter(chapters, chapterIdx, null, false);
        // this.updateAll('Split chapters', chapterIdx + 1);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
    },
    splitChapterFromSubChaptersItems(state, { payload: { chapterIdx, subChapterIdx, itemIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx];
        const subChapter = chapter.subChapters[subChapterIdx];

        // create a new chp w/ items after itemIdx of this subChapter.items
        // and sub chps of the rest of curr chp

        console.log(`Splitting chapter from subchapter items at ${chapterIdx}-${subChapterIdx}`);
        const newChapters = insertChapter(chapters, chapterIdx + 1, {
            items: _.slice(subChapter.items, itemIdx),
            subChapters: _.slice(chapter.subChapters, subChapterIdx + 1)
        });
        // remove relocated items/subchps
        subChapter.items = _.slice(subChapter.items, 0, itemIdx);
        chapter.subChapters = _.slice(chapter.subChapters, 0, subChapterIdx + 1);

        rebuildSubChapter(chapters, chapterIdx, subChapterIdx);
        rebuildChapter(chapters, chapterIdx, null, false);
        // this.updateAll('Split chapters', chapterIdx + 1);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
    },
    undoSplitChapter(state, { payload: { chapterIdx } }) {
        const chapters = state.epub.chapters;
        const currChp = chapters[chapterIdx];
        const prevChp = chapters[chapterIdx - 1];
        console.log(`Undoing split-chapter at ${chapterIdx}`);
        // if the prev chapter has sub-chapters
        // append curr chapter and its sub-chapters to prev's sub-chapters
        let newChapters = null;
        if (prevChp?.subChapters?.length > 0) {
            newChapters = appendChapterAsSubChapter(chapters, chapterIdx)
        } else {
            // otherwise, append items & sub-chapters of this chapter to the prev
            prevChp.items = _.concat(prevChp?.items, currChp?.items);
            prevChp.subChapters = currChp?.subChapters;
            // remove combined chapter
            newChapters = removeChapter(chapters, chapterIdx);
        } 
        rebuildChapter(chapters, chapterIdx - 1);
        // this.updateAll('Undo split chapters', chapterIdx - 1);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
    },
    sliceChapter(state, { payload: { chapterIdx, itemIdx}}) {
        console.log(`Splitting Chapter ${chapterIdx} at ItemIdx ${itemIdx}`);
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx]
        // remove contents from current chapter and add to new chapter
        let contents = _.slice(chapter.contents, itemIdx, chapter.contents.length);
        chapter.contents = _.slice(chapter.contents, 0, itemIdx);
        // insert the new chapter
        const newChapters = insertChapter(chapters, chapterIdx + 1, { contents }, false);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
    },
    mergeChapter(state, { payload: { chapterIdx } }) {
        console.log(`Merging Contents of Chapters ${chapterIdx - 1} and ${chapterIdx}`);
        const chapters = state.epub.chapters;
        const currChp = chapters[chapterIdx];
        const prevChp = chapters[chapterIdx - 1];
        
        // TODO account for sub chapters
        prevChp.contents = _.concat(prevChp?.contents, currChp?.contents);
        let newChapters = removeChapter(chapters, chapterIdx);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
    },
    appendChapterAsSubChapter(state, { payload: { chapterIdx } }) {
        console.log(`Appending chapter ${chapterIdx} as subchapter`);
        const chapters = state.epub.chapters;
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(appendChapterAsSubChapter(chapters, chapterIdx)) } };
    },
    saveSubChapterTitle(state, { payload: { chapterIdx, subChapterIdx, value } }) {
        console.log(`Saving chapter ${chapterIdx} subchapter ${subChapterIdx} title`, value);
        const chapters = state.epub.chapters;
        if (chapters?.[chapterIdx]?.subChapters[subChapterIdx]) {
            chapters[chapterIdx].subChapters[subChapterIdx].title = value;
        }
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
    },
    saveChapterTitle(state, { payload: { chapterIdx, value } }) {
        console.log(`Saving chapter ${chapterIdx} title`, value);
        const chapters = state.epub.chapters;
        chapters[chapterIdx].title = value;
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
    },
    splitChaptersByScreenshots(state, {payload: {wc}}) {
        console.log(`Splitting chapters by screenshots`);
        const new_items = [];
        // min word count that each chapter should have
        const default_word_count = 25;
        let min_word_count = wc;
        if (wc === "") { // if there was no input, set wc min wc to default  
            min_word_count = default_word_count;
        }
        // find total word count in i-note and make sure user input is not larger than total wc 
        const total_word_count = state.items.reduce((wordCount, a) => wordCount + a.text.split(' ').length, 0);
        if (min_word_count > total_word_count) {
            min_word_count = default_word_count;
        }
        // loop through chapters and enforce minimum wc  
        (state.items).forEach(function(elem) {
            let words = (elem.text).split(' ').length;
            if (words < min_word_count && new_items.length!==0 ) { 
                const oldelem = new_items.pop();
                // append shorter text to previous chapter
                oldelem.text += " ";
                oldelem.text += elem.text;
                new_items.push(oldelem);
            } else {
                new_items.push(elem);
            }
           });
        // makes sure the first element also has a min of min_word_count words
        const first_elem = new_items.shift();
        let words = (first_elem.text).split(' ').length;
        if(words < min_word_count) {
            if(new_items.length !== 0) {
                let elem_next_text = "";
                // append first chapter's text to next chapter
                elem_next_text += " ";
                elem_next_text += new_items.shift().text;
                first_elem.text += elem_next_text;
                new_items.unshift(first_elem);
            } 
        }
        let splitChapters = _.map(
            new_items,
            (data, idx) =>
                new EPubChapterData({
                    items: [data],
                    title: data.title,
                }).toObject(),
        );
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(splitChapters) } };
    },
    resetToDefaultChapters(state) {
        console.log(`Resetting to default chapters`);
        const defaultChapters = EPubData.__buildEPubDataFromArray(state.items);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(defaultChapters) }, currChIndex: 0 };
    },
     insertChapterContent(state, { payload: { type = 'text', contentIdx, subChapterIdx, value } }) {
        if (type === 'image') {
            value = new EPubImageData(value).toObject();
        }
        const chapters = state.epub.chapters;
        if (subChapterIdx === undefined) {
            console.log(`Inserting chapter ${state.currChIndex} content: `, value);
            insertContentChapter(chapters[state.currChIndex], contentIdx, value);
        } else {
            console.log(`Inserting chapter ${state.currChIndex} subchapter ${subChapterIdx} content: `, value);
            insertContentChapter(chapters?.[state.currChIndex]?.subChapters?.[subChapterIdx], contentIdx, value);
        }
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
        // this.updateAll('Insert chapter content');
    },
    insertChapterContentAtChapterIdx(state, { payload: { type = 'text', contentIdx, chapterIdx, subChapterIdx, value } }) {
        if (type === 'image') {
            value = new EPubImageData(value).toObject();
        }
        const chapters = state.epub.chapters;
        if (subChapterIdx === undefined) {
            console.log(`Inserting chapter ${state.currChIndex} content: `, value);
            insertContentChapter(chapters[chapterIdx], contentIdx, value);
        } else {
            console.log(`Inserting chapter ${state.currChIndex} subchapter ${subChapterIdx} content: `, value);
            insertContentChapter(chapters?.[chapterIdx]?.subChapters?.[subChapterIdx], contentIdx, value);
        }
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
        // this.updateAll('Insert chapter content');
    },
    setChapterContent(state, { payload: { type = 'text', contentIdx, subChapterIdx, value } }) {
        if (type === 'image') {
            value = new EPubImageData(value).toObject();
        }
        const chapters = state.epub.chapters;
        if (subChapterIdx === undefined) {
            const chapter = chapters[state.currChIndex];
            if (type === 'condition') {
                chapter.condition = value;
                console.log(`Setting chapter ${state.currChIndex} condition: `, value);
            } else{
                chapter.contents[contentIdx] = value;
                console.log(`Setting chapter ${state.currChIndex} content: `, value);
            }
        } else if (chapters?.[state.currChIndex]?.subChapters?.[subChapterIdx]) {
            chapters[state.currChIndex].subChapters[subChapterIdx] = value
            console.log(`Setting chapter ${state.currChIndex} subchapter ${subChapterIdx} content: `, value);
        }
        // this.updateAll('Update the chapter content');
        // this.__feed();
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
    },

    setChapterContentAtChapterIdx(state, { payload: { type = 'text', contentIdx, chapterIdx, subChapterIdx, value } }) {
        if (type === 'image') {
            value = new EPubImageData(value).toObject();
        }
        const chapters = state.epub.chapters;
        if (subChapterIdx === undefined) {
            const chapter = chapters[chapterIdx];
            if (type === 'condition') {
                chapter.condition = value;
                console.log(`Setting chapter ${state.currChIndex} condition: `, value);
            } else{
                chapter.contents[contentIdx] = value;
                console.log(`Setting chapter ${state.currChIndex} content: `, value);
            }
        } else if (chapters?.[chapterIdx]?.subChapters?.[subChapterIdx]) {
            chapters[chapterIdx].subChapters[subChapterIdx] = value
            console.log(`Setting chapter ${state.currChIndex} subchapter ${subChapterIdx} content: `, value);
        }
        // this.updateAll('Update the chapter content');
        // this.__feed();
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
    },
    removeChapterContent(state, { payload: { type = 'text', contentIdx, subChapterIdx } }) {
        const chapters = state.epub.chapters;
        if (subChapterIdx === undefined) {
            const chapter = chapters[state.currChIndex];
            console.log(`Removing chapter ${state.currChIndex} content`);
            removeContent(chapter, contentIdx);
        } else if (chapters?.[state.currChIndex]?.subChapters?.[subChapterIdx]) {
            console.log(`Removing chapter ${state.currChIndex} subchapter ${subChapterIdx} content`);
            removeContent(chapters?.[state.currChIndex]?.subChapters?.[subChapterIdx], contentIdx)
        }
        // this.updateAll('Remove the chapter content');
        // this.__feed('Removed.');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
    },
    removeChapterContentAtChapterIdx(state, { payload: { type = 'text', contentIdx, chapterIdx, subChapterIdx } }) {
        const chapters = state.epub.chapters;
        if (subChapterIdx === undefined) {
            const chapter = chapters[chapterIdx];
            console.log(`Removing chapter ${chapterIdx} content`);
            removeContent(chapter, contentIdx);
        } else if (chapters?.[chapterIdx]?.subChapters?.[subChapterIdx]) {
            console.log(`Removing chapter ${chapterIdx} subchapter ${subChapterIdx} content`);
            removeContent(chapters?.[chapterIdx]?.subChapters?.[subChapterIdx], contentIdx)
        }
        // this.updateAll('Remove the chapter content');
        // this.__feed('Removed.');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
    },
}
/*
__feed(mesg = 'Saved.') {
    prompt.addOne({ text: mesg, timeout: 2000, position: 'left bottom' });
  }
  */
/*
 subdivideChaptersByScreenshots() {
   let newChapters = _.map(this.data.chapters, (chapter) => {
     let items = chapter.allItemsWithIn;
     chapter.subChapters = _.map(items, (item, subChapterIndex) =>
       new EPubSubChapterData({
         items: [item],
         title: `Untitled Sub-Chapter ${subChapterIndex + 1}`,
       }),
     );
     chapter.items = [];
     return new EPubChapterData(chapter);
   });
   this.data.chapters = newChapters;
   // this.updateAll('Subdivided all the chapters by screenshots', 0);
   prompt.addOne({
     text: 'Subdivided all the chapters by screenshots.',
     position: 'left bottom',
     timeout: 2000,
   });
 }
 */
/*
updateAll(actionName, currChIndex) {
   const data = this.saveEPub();
   this.history.pushAndUpdateAll(
     actionName,
     // the cloned new chapters
     data.chapters,
     (typeof currChIndex === 'number' ? currChIndex : epubState.currChIndex)
   );
 }
 import EPubHistoryManager from './EPubHistoryManager';
setChapters(chapters) {
 // this.history = new EPubHistoryManager(this);
 this.data.chapters = _.map(chapters, chapter => new EPubChapterData(chapter, false));
 this.saveEPub();
}
 */