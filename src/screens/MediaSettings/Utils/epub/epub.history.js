import _ from 'lodash';
import { prompt, util } from 'utils';
import { epubState } from './epub.state';

class EpubHistory {
  #history = [];
  #currentIndex = -1;

  constructor() {
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
  }

  static ACTION = 'action';
  static DATA = 'data';

  getHistory() {
    return this.#history;
  }

  setHistory(history) {
    this.#history = history;
  }

  clear() {
    this.setHistory([]);
    this.#currentIndex = -1;
  }

  get isEmpty() {
    return this.#history.length === 0;
  }

  get canUndo() {
    return this.#currentIndex >= 0;
  }

  get canRedo () {
    return this.#currentIndex + 1 < this.getHistory().length;
  }

  getItem(index) {
    let item = { ...(this.getHistory()[index] || {}) };
    if (item.type === EpubHistory.DATA) {
      item.data = JSON.parse(item.data);
    }

    return item;
    // JSON.parse(this.getHistory()[index] || '{}');
  }

  push(historyItem) {
    this.#currentIndex += 1;
    let history = this.getHistory();

    history = [
      ...history.slice(0, this.#currentIndex), 
      historyItem // JSON.stringify(historyItem)
    ];

    this.setHistory(history);
    this.logger();
  }

  pushAction(
    name = 'Untitled Action',
    action = {
      undo() {},
      redo() {},
    },
    targetId = null
  ) {
    action.name = name;
    action.type = EpubHistory.ACTION;
    action.targetId = targetId;
    this.push(action);
  }

  createData(prev, next) {
    return { prev, next };
  }

  pushData(
    name,
    data,
    targetId = null
  ) {
    let item = {};
    item.name = name;
    item.type = EpubHistory.DATA;
    item.targetId = targetId;
    item.data = JSON.stringify(data);
    this.push(item);
  }

  revertToChapters(chapters) {
    let currChapterId = epubState.currChapter.id;
    let currChapterIndex = _.findIndex(chapters, { id: currChapterId });
    if (currChapterIndex < 0) currChapterIndex = 0;

    epubState.updateEpubChapters(chapters, chapters[currChapterIndex]);
  }

  navigateToTarget(targetId) {
    if (targetId) {
      util.elem.scrollIntoCenter(targetId)
    }
  }

  undo() {
    if (!this.canUndo) {
      return;
    }

    let curr = this.getItem(this.#currentIndex);

    switch (curr.type) {
      case EpubHistory.ACTION:
        curr.undo();
        this.navigateToTarget(curr.targetId);
        break;

      case EpubHistory.DATA:
        this.revertToChapters(curr.data.prev);
        this.navigateToTarget(curr.targetId);
        break;
      default:
        break;
    }

    this.#currentIndex -= 1;
    this.logger();
    this.$feed('UNDO', curr.name);
  }

  redo() {
    if (!this.canRedo) {
      return;
    }

    let next = this.getItem(this.#currentIndex + 1);

    switch (next.type) {
      case EpubHistory.ACTION:
        next.redo();
        this.navigateToTarget(next.targetId);
        break;

      case EpubHistory.DATA:
        this.revertToChapters(next.data.next);
        this.navigateToTarget(next.targetId);
        break;
      default:
        break;
    }

    this.#currentIndex += 1;
    this.logger();
    this.$feed('REDO', next.name);
  }

  updateChaptersAndHistory(
    actionName, 
    prevChapters, 
    nextChapters, 
    currChapter,
    targetId,
  ) {
    this.pushData(
      actionName, 
      this.createData(prevChapters, nextChapters),
      targetId
    );
  
    epubState.updateEpubChapters(nextChapters, currChapter);
  }


  logger() {
    // console.info('history', this.#currentIndex, this.#history);
  }

  $feed(action, name) {
    prompt.addOne({
      text: `${action}: ${name}`,
      timeout: 2000,
      position: 'bottom left'
    });
  }
}

export const epubHistory = new EpubHistory();
