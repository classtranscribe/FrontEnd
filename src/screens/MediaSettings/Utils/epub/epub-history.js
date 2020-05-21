import _ from 'lodash';
import { epubState } from './epub-state';

class EpubHistory {
  constructor() {
    this.__history__ = [];
    this.currentIndex = -1;
  }

  logger() {
    // console.info('history', this.currentIndex, this.__history__);
  }

  ACTION = 'action';
  DATA = 'data';

  getHistory() {
    return this.__history__;
  }

  setHistory(history) {
    this.__history__ = history;
  }

  isEmpty() {
    return this.getHistory().length === 0;
  }

  canRedo() {
    return this.currentIndex + 1 < this.getHistory().length;
  }

  getItem(index) {
    return JSON.parse(this.getHistory()[index] || '{}');
  }

  push(historyItem) {
    this.currentIndex += 1;
    let history = this.getHistory();

    history = [...history.slice(0, this.currentIndex), JSON.stringify(historyItem)];

    this.setHistory(history);
    this.logger();
  }

  pushAction(
    action = {
      name: 'Untitled Action',
      undo() {},
      redo() {},
    },
  ) {
    action.type = this.ACTION;
    this.push(action);
  }

  pushData(
    data = {
      chapters: [],
    },
  ) {
    data.type = this.DATA;
    this.push(data);
  }

  undo() {
    if (this.isEmpty()) {
      return;
    }

    let curr = this.getItem(this.currentIndex);

    switch (curr.type) {
      case this.ACTION:
        curr.undo();
        break;

      case this.DATA:
        // let chapters = curr.chapters;
        // let currChapterId = epubState.currChapter.id;
        // let currChapterIndex = _.findIndex(chapters, { id: currChapterId });
        // if (currChapterIndex < 0) currChapterIndex = 0;

        // epubState.updateEpubChapters(chapters, chapters[currChapterIndex]);
        break;
      default:
        break;
    }

    this.currentIndex -= 1;
    this.logger();
  }

  redo() {
    if (!this.canRedo()) {
      return;
    }

    let next = this.getItem(this.currentIndex + 1);

    switch (next.type) {
      case this.ACTION:
        next.redo();
        break;

      case this.DATA:
        // let chapters = next.chapters;
        // let currChapterId = epubState.currChapter.id;
        // let currChapterIndex = _.findIndex(chapters, { id: currChapterId });
        // if (currChapterIndex < 0) currChapterIndex = 0;

        // epubState.updateEpubChapters(chapters, chapters[currChapterIndex]);
        break;
      default:
        break;
    }

    this.currentIndex += 1;
    this.logger();
  }
}

export const epubHistory = new EpubHistory();
