import _ from 'lodash';
import { prompt } from 'utils';
import { EPubData, EPubChapterData, EPubSubChapterData, EPubImageData } from 'entities/EPubs';
import EPubHistoryManager from './EPubHistoryManager';
import { epubState } from './EPubStateManager';
import { saveCtrl } from './AutoSaveController';
import { extractAudioDescription } from './utils';

/**
 * The controller for handling the ePub data
 */
class EPubDataController {
  constructor() {
    this.data = null;  
    this.history = new EPubHistoryManager(this);

    this.saveEPub = this.saveEPub.bind(this);
    this.resetToDefaultChapters = this.resetToDefaultChapters.bind(this);
    this.splitChaptersByScreenshots = this.splitChaptersByScreenshots.bind(this);
    this.subdivideChaptersByScreenshots = this.subdivideChaptersByScreenshots.bind(this);
  }

  saveEPub(timeout) {
    const data = this.data.toObject();
    if (timeout === 0) {
      saveCtrl.notifyOnce();
    }
    saveCtrl.save(data, timeout);
    // console.log('AudioDescriptions', extractAudioDescription(this.data.chapters));
    return data;
  }

  initEPubData(ePubLike) {
    if (ePubLike instanceof EPubData) {
      this.data = ePubLike;
    } else {
      this.data = new EPubData(ePubLike);
    }

    return this.data.toObject();
  }

  saveEPubTitle = (title) => {
    this.data.title = title;
  }

  saveEPubFilename = (filename) => {
    this.data.filename = filename;
  }

  saveEPubCover = (cover) => {
    this.data.cover = new EPubImageData(cover);
  }

  saveEPubAuthor = (author) => {
    this.data.author = author;
  }

  setChapters(chapters) {
    this.data.chapters = _.map(chapters, chapter => new EPubChapterData(chapter, false));
    this.saveEPub();
  }

  setEPubInfo(newEPubData) {
    this.saveEPubAuthor(newEPubData.author);
    this.saveEPubCover(newEPubData.cover);
    this.saveEPubTitle(newEPubData.title);
    this.saveEPubFilename(newEPubData.filename);
    // console.log(this.data.toObject());
    this.saveEPub(0);
  }

  updateAll(actionName, currChIndex) {
    const data = this.saveEPub();
    this.history.pushAndUpdateAll(
      actionName,
      // the cloned new chapters
      data.chapters,
      (typeof currChIndex === 'number' ? currChIndex : epubState.currChIndex)
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
      prevChp.subChapters = _.concat(
        prevChp.subChapters, 
        new EPubSubChapterData(currChp), 
        currChp.subChapters
      );
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
      ...subChapter.toShallowObject(),
      image: undefined,
      subChapters: _.slice(chapter.subChapters, subChapterIdx + 1)
    });

    // remove the subchps after subChapterIdx
    chapter.subChapters = _.slice(chapter.subChapters, 0, subChapterIdx);

    this.data.rebuildChapter(chapterIdx, null, false);
    this.updateAll('Split chapters', chapterIdx + 1);
  }

  /// ////////////////////////////////////////////////////////////////////////
  // Quick Actions
  /// ////////////////////////////////////////////////////////////////////////

  resetToDefaultChapters() {
    let defaultChapters = EPubData.__buildEPubDataFromArray(this.data.items);
    this.data.chapters = defaultChapters;
    this.updateAll('Reset to the default chapters', 0);
    prompt.addOne({
      text: 'Reset to the default chapters.',
      position: 'left bottom',
      timeout: 2000,
    });
  }

  splitChaptersByScreenshots() {
    let splitChapters = _.map(
      this.data.items,
      (data, idx) =>
        new EPubChapterData({
          items: [data],
          title: `Untitled Chapter ${idx + 1}`,
        }),
    );
    this.data.chapters = splitChapters;
    this.updateAll('Split chapters by screenshots', 0);
    prompt.addOne({
      text: 'Split chapters by screenshots.',
      position: 'left bottom',
      timeout: 2000,
    });
  }

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
    this.updateAll('Subdivided all the chapters by screenshots', 0);
    prompt.addOne({
      text: 'Subdivided all the chapters by screenshots.',
      position: 'left bottom',
      timeout: 2000,
    });
  }

  /// /////////////////////////////////////////////////////////////////////////
  // handle edit title
  /// /////////////////////////////////////////////////////////////////////////

  saveChapterTitle(chapterIdx, value) {
    let chapter = this.data.getChapter(chapterIdx);
    chapter.title = value;
    this.updateAll('Edit the chapter title', chapterIdx);
  }

  saveSubChapterTitle(chapterIdx, subChapterIdx, value) {
    let subChapter = this.data.getSubChapter(chapterIdx, subChapterIdx);
    subChapter.title = value;
    this.updateAll('Edit the sub-chapter title', chapterIdx);
  }

  /// /////////////////////////////////////////////////////////////////////////
  // handle edit chapter contents
  /// /////////////////////////////////////////////////////////////////////////

  setChapterContent(contentIdx, value) {
    let chapter = this.data.getChapter(epubState.currChIndex);
    chapter.setContent(contentIdx, value);
    this.updateAll('Update the chapter content');
    this.__feed();
  }

  setChapterImageContent(contentIdx, value) {
    this.setChapterContent(contentIdx, new EPubImageData(value));
  }

  insertChapterContent(contentIdx, value) {
    let chapter = this.data.getChapter(epubState.currChIndex);
    chapter.insert(contentIdx, value);
    this.updateAll('Insert chapter content');
    this.__feed();
  }

  insertChapterImageContent(contentIdx, value) {
    this.insertChapterContent(contentIdx, new EPubImageData(value));
  }

  // pushChapterContent(contentIdx, value) {
  //   let chapter = this.data.getChapter(epubState.currChIndex);
  //   chapter.push(contentIdx, value);
  //   this.updateAll('Push chapter content');
  // }

  // pushChapterImageContent(contentIdx, value) {
  //   this.pushChapterContent(contentIdx, new EPubImageData(value));
  // }

  removeChapterContent(contentIdx) {
    let chapter = this.data.getChapter(epubState.currChIndex);
    chapter.remove(contentIdx);
    this.updateAll('Remove the chapter content');
    this.__feed('Removed.');
  }

  /// /////////////////////////////////////////////////////////////////////////
  // handle edit sub-chapter contents
  /// /////////////////////////////////////////////////////////////////////////

  setSubChapterContent(subChapterIdx, contentIdx, value) {
    let subChapter = this.data.getSubChapter(epubState.currChIndex, subChapterIdx);
    subChapter.setContent(contentIdx, value);
    this.updateAll('Update the sub-chapter content');
    this.__feed();
  }

  setSubChapterImageContent(subChapterIdx, contentIdx, value) {
    this.setSubChapterContent(
      subChapterIdx, 
      contentIdx, 
      new EPubImageData(value)
    );
  }

  insertSubChapterContent(subChapterIdx, contentIdx, value) {
    let subChapter = this.data.getSubChapter(epubState.currChIndex, subChapterIdx);
    subChapter.insert(contentIdx, value);
    this.updateAll('Insert sub-chapter content');
    this.__feed();
  }

  insertSubChapterImageContent(subChapterIdx, contentIdx, value) {
    this.insertChapterContent(subChapterIdx, contentIdx, new EPubImageData(value));
  }

  removeSubChapterContent(subChapterIdx, contentIdx) {
    let subChapter = this.data.getSubChapter(epubState.currChIndex, subChapterIdx);
    subChapter.remove(contentIdx);
    this.updateAll('Remove the sub-chapter content');
    this.__feed('Removed.');
  }

  __feed(mesg = 'Saved.') {
    prompt.addOne({ text: mesg, timeout: 2000, position: 'left bottom' });
  }
}

export const epubData = new EPubDataController();