import _ from 'lodash';
import Constants from './EPubConstants';
import EPubData from './EPubData';
import { epubState } from './EPubState';
import { epubHistory } from './EPubHistory';
import { buildSubChapter as bsch } from './utils';

export default class EPubController {
  constructor() {
    this.data = null;  
  }

  initEPubData(ePubLike, title) {
    this.data = new EPubData(ePubLike);

    // the ePub data doesn't contain the `title`
    if (!this.data.title) {
      this.data.title = title;
    }

    // the ePub data doesn't contain the `filename`
    if (!this.data.filename) {
      this.data.filename = title;
    }

    return this.data.chapters;
  }

  updateAll(actionName, currChIndex) {
    epubHistory.pushAndUpdateAll(
      actionName,
      // the cloned new chapters
      this.data.toObject().chapters,
      (currChIndex || epubState.currChIndex)
    );
  }

  splitChapterFromChaptersItems(chapterIdx, itemIdx) {
    let chapter = this.data.getChapter(chapterIdx);
    let subChapters = chapter.subChapters;
    let items = _.slice(chapter.items, itemIdx, chapter.items.length);
    
    // remove items and sub chapters from curr chapter
    chapter.subChapters = [];
    chapter.items = _.slice(chapter.items, 0, itemIdx);
    this.data.rebuildChapter(chapterIdx);

    // insert the new chapter
    this.data.insertChapter(chapterIdx + 1, { subChapters, items });

    this.updateAll('Split chapter', chapterIdx + 1);
  }

  appendChapterAsSubChapter(chapterIdx) {
    let currChp = this.data.getChapter(chapterIdx);
    let prevChp = this.data.getChapter(chapterIdx - 1);

    // if no items in curr chapter
    // push its sub chapters to the prev chapter.subChapters
    if (currChp.items.length === 0) {
      prevChp.subChapters = _.concat(prevChp.subChapters, currChp.subChapters);
    }
    // otherwise, convert itself as a sub chapter 
    // and append to the prev chapter.subChapters along w/ its sub chapters
    else {
      prevChp.subChapters = 
        _.concat(prevChp.subChapters, bsch(currChp), currChp.subChapters);
    }

    this.data.rebuildChapter(chapterIdx - 1, null, false);

    // remove appended chapter
    this.data.removeChapter(chapterIdx);
    
    this.updateAll('Append to above sub-chapters', chapterIdx - 1);
  }

  undoSplitChapter(chapterIdx) {
    let currChp = this.data.getChapter(chapterIdx);
    let prevChp = this.data.getChapter(chapterIdx - 1);

    // if the prev chapter has sub-chapters
    // append curr chapter and its sub-chapters to prev's sub-chapters
    if (prevChp.subChapters.length > 0) {
      this.appendChapterAsSubChapter(chapterIdx);
      return;
    }

    // otherwise, append items & sub-chapters of this chapter to the prev
    prevChp.items = _.concat(prevChp.items, currChp.items);
    prevChp.subChapters = currChp.subChapters;
    // remove combined chapter
    this.data.removeChapter(chapterIdx);

    this.data.rebuildChapter(chapterIdx - 1);
    this.updateAll('Undo split chapters', chapterIdx - 1);
  }

  subdivideChapter(chapterIdx, itemIdx) {
    let chapter = this.data.getChapter(chapterIdx);

    // create a sub chp based on items after itemIdx in this chp
    this.data.insertSubChapter(chapterIdx, 0, {
      items: _.slice(chapter.items, itemIdx)
    });

    // remove the items after itemIdx
    chapter.items = _.slice(chapter.items, 0, itemIdx);

    this.data.rebuildChapter(chapterIdx);
    this.updateAll('Subdivide the chapter');
  }

  undoSubdivideChapter(chapterIdx) {
    let chapter = this.data.getChapter(chapterIdx);
    // push the items in the first sub chapter
    // to this chapter's items
    chapter.items = _.concat(chapter.items, chapter.subChapters[0].items);
    // remove this sub chapter
    this.data.removeSubChapter(chapterIdx, 0);

    this.data.rebuildChapter(chapterIdx);
    this.updateAll('Undo subdivide the chapter');
  }

  splitSubChapter(chapterIdx, subChapterIdx, itemIdx) {
    let chapter = this.data.getChapter(chapterIdx);
    let subChapter = chapter.subChapters[subChapterIdx];

    // create a new sub chp based on the items after itemIdx
    this.data.insertSubChapter(chapterIdx, subChapterIdx + 1, {
      items: _.slice(subChapter.items, itemIdx)
    });
    // remove relocated items from curr sub chp
    subChapter.items = _.slice(subChapter.items, 0, itemIdx);

    this.data.rebuildSubChapter(chapterIdx, subChapterIdx);
    this.data.rebuildChapter(chapterIdx, null, false);
    this.updateAll('Subdivide the chapter');
  }

  undoSplitSubChapter(chapterIdx, subChapterIdx) {
    let chapter = this.data.getChapter(chapterIdx);
    let currSubChp = chapter.subChapters[subChapterIdx];
    let prevSubChp = chapter.subChapters[subChapterIdx - 1];

    // push curr sub chp's items to the prev sub chp
    prevSubChp.items = _.concat(prevSubChp.items, currSubChp.items);
    // then delete the curr sub chp
    this.data.removeSubChapter(chapterIdx, subChapterIdx);

    this.data.rebuildSubChapter(chapterIdx, subChapterIdx - 1);
    this.data.rebuildChapter(chapterIdx, null, false);
    this.updateAll('Undo subdivide the chapter');
  }

  splitChapterFromSubChaptersItems(chapterIdx, subChapterIdx, itemIdx) {
    let chapter = this.data.getChapter(chapterIdx);
    let subChapter = chapter.subChapters[subChapterIdx];

    // create a new chp w/ items after itemIdx of this subChapter.items
    // and sub chps of the rest of curr chp
    this.data.insertChapter(chapterIdx + 1, {
      items: _.slice(subChapter.items, itemIdx),
      subChapters: _.slice(chapter.subChapters, subChapterIdx + 1)
    });

    // remove relocated items/subchps
    subChapter.items = _.slice(subChapter.items, 0, itemIdx);
    chapter.subChapters = _.slice(chapter.subChapters, 0, subChapterIdx + 1);

    this.data.rebuildSubChapter(chapterIdx, subChapterIdx);
    this.data.rebuildChapter(chapterIdx, null, false);
    this.updateAll('Split chapters', chapterIdx + 1);
  }

  splitChapterFromSubChapter(chapterIdx, subChapterIdx) {
    let chapter = this.data.getChapter(chapterIdx);
    let subChapter = chapter.subChapters[subChapterIdx];

    // create a new chp w/ items after itemIdx of this subChapter.items
    // and sub chps of the rest of curr chp
    this.data.insertChapter(chapterIdx + 1, {
      ...subChapter,
      image: undefined,
      subChapters: _.slice(chapter.subChapters, subChapterIdx + 1)
    });

    // remove the subchps after subChapterIdx
    chapter.subChapters = _.slice(chapter.subChapters, 0, subChapterIdx);

    this.data.rebuildChapter(chapterIdx, null, false);
    this.updateAll('Split chapters', chapterIdx + 1);
  }
}