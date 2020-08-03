import _ from 'lodash';
import { prompt, uurl, CTEpubGenerator } from 'utils';
import EPubData from './EPubData';
import { epubState } from './EPubState';
import { epubHistory } from './EPubHistory';
import { buildHTMLFromChapter } from './html-converters';
import {
  buildChapter as bch,
  buildSubChapter as bsch,
  filterTrivalItems,
  buildEPubDataFromArray,
  getAllItemsInChapter,
} from './utils';

class EPubDataController {
  constructor() {
    this.data = null;  

    this.resetToDefaultChapters = this.resetToDefaultChapters.bind(this);
    this.splitChaptersByScreenshots = this.splitChaptersByScreenshots.bind(this);
    this.subdivideChaptersByScreenshots = this.subdivideChaptersByScreenshots.bind(this);
  }

  setChapters(chapters) {
    this.data.chapters = _.cloneDeep(chapters);
  }

  initEPubData(ePubLike) {
    if (ePubLike instanceof EPubData) {
      this.data = ePubLike;
    } else {
      this.data = new EPubData(ePubLike);
    }

    // the ePub data doesn't contain the `title`
    if (!this.data.title) {
      this.data.title = 'Untitled ePub'
    }

    // the ePub data doesn't contain the `filename`
    if (!this.data.filename) {
      this.data.filename = 'Untitled ePub';
    }

    return this.data.toObject();
  }

  updateAll(actionName, currChIndex) {
    epubHistory.pushAndUpdateAll(
      actionName,
      // the cloned new chapters
      this.data.toObject().chapters,
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

  /// ////////////////////////////////////////////////////////////////////////
  // Quick Actions
  /// ////////////////////////////////////////////////////////////////////////

  resetToDefaultChapters() {
    let defaultChapters = buildEPubDataFromArray(epubState.rawEPubData);
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
      filterTrivalItems(epubState.rawEPubData),
      (data, idx) =>
        bch({
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
      let items = getAllItemsInChapter(chapter);

      chapter.subChapters = _.map(items, (item, subChapterIndex) =>
        bsch({
          items: [item],
          title: `Untitled Sub-Chapter ${subChapterIndex + 1}`,
        }),
      );

      chapter.items = [];
      return bch(chapter);
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
  // handle edit image
  /// /////////////////////////////////////////////////////////////////////////

  saveCurrChapterImage(image) {
    let chapter = this.data.getChapter(epubState.currChIndex);
    chapter.image = image;
    this.updateAll('Change the chapter image');
  }

  removeCurrChapterImage = () => {
    this.saveCurrChapterImage(/** undefined */);
  }

  saveSubChapterImage(subChapterIdx, image) {
    let subChapter = this.data.getSubChapter(epubState.currChIndex, subChapterIdx);
    subChapter.image = image;
    this.updateAll('Change the sub-chapter image');
  }
  
  removeSubChapterImage(subChapterIdx) {
    this.saveSubChapterImage(subChapterIdx);
  }

  /// /////////////////////////////////////////////////////////////////////////
  // handle edit text
  /// /////////////////////////////////////////////////////////////////////////
  saveCurrChapterText(text) {
    let chapter = this.data.getChapter(epubState.currChIndex);
    chapter.text = text;
    this.updateAll('Change the chapter text');
  }

  saveSubChapterText(subChapterIdx, text) {
    let subChapter = this.data.getSubChapter(epubState.currChIndex, subChapterIdx);
    subChapter.text = text;
    this.updateAll('Change the sub-chapter text');
  }

  /// /////////////////////////////////////////////////////////////////////////
  // handle download
  /// /////////////////////////////////////////////////////////////////////////
  createEPubDownloader() {
    const options = this.data.toObject();
    options.cover = uurl.getMediaUrl(options.cover);
    options.chapters = _.map(
      options.chapters, 
      chp => ({
        ...chp,
        text: buildHTMLFromChapter(chp),
        // image: uurl.getMediaUrl(chp.image)
      })
    );
    return new CTEpubGenerator(options);
  }

  handleDownloadError(error) {
    if (error.message === 'Network Error') {
      error.message += ': Failed to download cover images.';
    } else {
      error.message = `Failed: ${error.message}`;
    }
  
    prompt.addOne({
      text: error.message,
      status: 'error',
      position: 'bottom left',
    });
  }

  downloadEPub = () => {
    this.createEPubDownloader().downloadEpub({ onError: this.handleDownloadError });
  };

  downloadHTML = () => {
    this.createEPubDownloader().downloadHTML({ onError: this.handleDownloadError });
  };

  downloadPDF = (print = true) => {
    this.createEPubDownloader().preview({ print, onError: this.handleDownloadError });
  };
}

export const epubData = new EPubDataController();