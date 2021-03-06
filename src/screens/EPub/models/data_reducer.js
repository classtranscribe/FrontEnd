import _ from 'lodash';
import { EPubData, EPubChapterData, EPubSubChapterData, EPubImageData } from 'entities/EPubs';
import { getAllItemsInChapters } from 'entities/EPubs/utils'

function insertSubChapter(chapter, subChapterIndex, subChapterLike) {
    let newSubChapter = new EPubSubChapterData(subChapterLike).toObject();
    chapter.subChapters = [
        ...chapter.subChapters.slice(0, subChapterIndex),
        newSubChapter,
        ...chapter.subChapters.slice(subChapterIndex)
    ];

    return newSubChapter;
}
function removeSubChapter(chapter, subChapterIndex) {
    let subChapter = chapter.subChapters[subChapterIndex];
    chapter.subChapters = [
        ...chapter.subChapters.slice(0, subChapterIndex),
        ...chapter.subChapters.slice(subChapterIndex + 1)
    ];
    return subChapter;
}
function insertChapter(chapters, index, chapterLike) {
    let newChapter = new EPubChapterData(chapterLike);
    return [
        ...chapters.slice(0, index),
        newChapter.toObject(),
        ...chapters.slice(index)
    ];
}
function removeChapter(chapters, index) {
    // let chapter = chapters[index];
    return [
        ...chapters.slice(0, index),
        ...chapters.slice(index + 1)
    ];
}
function insertContentChapter(chapter, index, content) {
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

    // if no items in curr chapter
    // push its sub chapters to the prev chapter.subChapters
    if (currChp.items.length === 0) {
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
    // this.data.rebuildChapter(chapterIdx - 1, null, false);

    // remove appended chapter
    chapters = removeChapter(chapters, chapterIdx);

    // this.updateAll('Append to above sub-chapters', chapterIdx - 1);
    return chapters;
}
function removeContent(chapter, predictor) {
    if (typeof predictor === 'number') {
        if (predictor >= 0 && predictor < chapter.contents.length) {
            chapter.contents = [
                ...chapter.contents.slice(0, predictor),
                ...chapter.contents.slice(predictor + 1)
            ];
        }
    } else {
        let currIndex = _.findIndex(chapter.contents, (val) => val === predictor);
        removeContent(chapter, currIndex);
    }
}
function nextStateOfChapters(chapters) {
    const items = getAllItemsInChapters(chapters);
    return {chapters, items, images: _.map(items, item => item?.image) }
}
export default {
    subdivideChapter(state, { payload: { chapterIdx, itemIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx]
        // create a sub chp based on items after itemIdx in this chp
        insertSubChapter(chapter, 0, {
            items: _.slice(chapter.items, itemIdx)
        });

        // remove the items after itemIdx
        chapter.items = _.slice(chapter.items, 0, itemIdx);

        // this.data.rebuildChapter(chapterIdx);
        // this.updateAll('Subdivide the chapter');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } }
    },
    splitChapterFromChaptersItems(state, { payload: { chapterIdx, itemIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx]
        let subChapters = chapter.subChapters;
        let items = _.slice(chapter.items, itemIdx, chapter.items.length);

        // remove items and sub chapters from curr chapter
        chapter.subChapters = [];
        chapter.items = _.slice(chapter.items, 0, itemIdx);
        // this.data.rebuildChapter(chapterIdx);

        // insert the new chapter
        const newChapters = insertChapter(chapters, chapterIdx + 1, { subChapters, items });
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
        // this.updateAll('Split chapter', chapterIdx + 1);
    },
    undoSubdivideChapter(state, { payload: { chapterIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx]
        // push the items in the first sub chapter
        // to this chapter's items
        chapter.items = _.concat(chapter.items, chapter.subChapters[0].items);
        // remove this sub chapter
        removeSubChapter(chapter, 0);

        // this.data.rebuildChapter(chapterIdx);
        // this.updateAll('Undo subdivide the chapter');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } }
    },
    splitSubChapter(state, { payload: { chapterIdx, subChapterIdx, itemIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx];
        const subChapter = chapter.subChapters[subChapterIdx];

        // create a new sub chp based on the items after itemIdx
        insertSubChapter(chapter, subChapterIdx + 1, {
            items: _.slice(subChapter.items, itemIdx)
        });
        // remove relocated items from curr sub chp
        subChapter.items = _.slice(subChapter.items, 0, itemIdx);

        // this.data.rebuildSubChapter(chapterIdx, subChapterIdx);
        // this.data.rebuildChapter(chapterIdx, null, false);
        // this.updateAll('Subdivide the chapter');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } }
    },
    undoSplitSubChapter(state, { payload: { chapterIdx, subChapterIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx];
        let currSubChp = chapter.subChapters[subChapterIdx];
        let prevSubChp = chapter.subChapters[subChapterIdx - 1];

        // push curr sub chp's items to the prev sub chp
        prevSubChp.items = _.concat(prevSubChp.items, currSubChp.items);
        // then delete the curr sub chp
        removeSubChapter(chapter, subChapterIdx);

        // this.data.rebuildSubChapter(chapterIdx, subChapterIdx - 1);
        // this.data.rebuildChapter(chapterIdx, null, false);
        // this.updateAll('Undo subdivide the chapter');
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } }
    },
    splitChapterFromSubChapter(state, { payload: { chapterIdx, subChapterIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx];
        const subChapter = chapter.subChapters[subChapterIdx];

        // create a new chp w/ items after itemIdx of this subChapter.items
        // and sub chps of the rest of curr chp
        const newChapters = insertChapter(chapters, chapterIdx + 1, {
            ...subChapter,
            image: undefined,
            subChapters: _.slice(chapter.subChapters, subChapterIdx + 1)
        });

        // remove the subchps after subChapterIdx
        chapter.subChapters = _.slice(chapter.subChapters, 0, subChapterIdx);

        // this.data.rebuildChapter(chapterIdx, null, false);
        // this.updateAll('Split chapters', chapterIdx + 1);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
    },
    splitChapterFromSubChaptersItems(state, { payload: { chapterIdx, subChapterIdx, itemIdx } }) {
        const chapters = state.epub.chapters;
        const chapter = chapters[chapterIdx];
        const subChapter = chapter.subChapters[subChapterIdx];

        // create a new chp w/ items after itemIdx of this subChapter.items
        // and sub chps of the rest of curr chp
        const newChapters = insertChapter(chapters, chapterIdx + 1, {
            items: _.slice(subChapter.items, itemIdx),
            subChapters: _.slice(chapter.subChapters, subChapterIdx + 1)
        });

        // remove relocated items/subchps
        subChapter.items = _.slice(subChapter.items, 0, itemIdx);
        chapter.subChapters = _.slice(chapter.subChapters, 0, subChapterIdx + 1);

        // this.data.rebuildSubChapter(chapterIdx, subChapterIdx);
        // this.data.rebuildChapter(chapterIdx, null, false);
        // this.updateAll('Split chapters', chapterIdx + 1);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
    },
    undoSplitChapter(state, { payload: { chapterIdx } }) {
        const chapters = state.epub.chapters;
        const currChp = chapters[chapterIdx];
        const prevChp = chapters[chapterIdx - 1];

        // if the prev chapter has sub-chapters
        // append curr chapter and its sub-chapters to prev's sub-chapters
        let newChapters = null;
        if (prevChp.subChapters.length > 0) {
            newChapters = appendChapterAsSubChapter(chapters, chapterIdx)
        } else {
            // otherwise, append items & sub-chapters of this chapter to the prev
            prevChp.items = _.concat(prevChp.items, currChp.items);
            prevChp.subChapters = currChp.subChapters;
            // remove combined chapter
            newChapters = removeChapter(chapters, chapterIdx);
        }
        // this.data.rebuildChapter(chapterIdx - 1);
        // this.updateAll('Undo split chapters', chapterIdx - 1);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(newChapters) } };
    },
    appendChapterAsSubChapter(state, { payload: { chapterIdx } }) {
        const chapters = state.epub.chapters;
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(appendChapterAsSubChapter(chapters, chapterIdx)) } };
    },
    saveSubChapterTitle(state, { payload: { chapterIdx, subChapterIdx, value } }) {
        const chapters = state.epub.chapters;
        if (chapters?.[chapterIdx]?.subChapters[subChapterIdx]) {
            chapters[chapterIdx].subChapters[subChapterIdx].title = value;
        }
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
    },
    saveChapterTitle(state, { payload: { chapterIdx, value } }) {
        const chapters = state.epub.chapters;
        chapters[chapterIdx].title = value;
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
    },
    splitChaptersByScreenshots(state) {
        let splitChapters = _.map(
            state.items,
            (data, idx) =>
                new EPubChapterData({
                    items: [data],
                    title: `Untitled Chapter ${idx + 1}`,
                }).toObject(),
        );
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(splitChapters) } };
    },
    resetToDefaultChapters(state) {
        const defaultChapters = EPubData.__buildEPubDataFromArray(state.items);
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters(defaultChapters) }, currChIndex: 0 };
    },
    insertChapterContent(state, { payload: { type = 'text', contentIdx, subChapterIdx, value } }) {
        if (type === 'image') {
            value = new EPubImageData(value).toObject();
        }
        const chapters = state.epub.chapters;
        if (subChapterIdx === undefined) {
            insertContentChapter(chapters[state.currChIndex], contentIdx, value);
        } else {
            insertContentChapter(chapters?.[state.currChIndex]?.subChapters?.[subChapterIdx], contentIdx, value);
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
            chapter.contents[contentIdx] = value;
        } else if (chapters?.[state.currChIndex]?.subChapters?.[subChapterIdx]) {
            chapters[state.currChIndex].subChapters[subChapterIdx] = value
        }
        // this.updateAll('Update the chapter content');
        // this.__feed();
        return { ...state, epub: { ...state.epub, ...nextStateOfChapters([...chapters]) } };
    },
    removeChapterContent(state, { payload: { type = 'text', contentIdx, subChapterIdx } }) {
        const chapters = state.epub.chapters;
        if (subChapterIdx === undefined) {
            const chapter = chapters[state.currChIndex];
            removeContent(chapter, contentIdx);
        } else if (chapters?.[state.currChIndex]?.subChapters?.[subChapterIdx]) {
            removeContent(chapters?.[state.currChIndex]?.subChapters?.[subChapterIdx], contentIdx)
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