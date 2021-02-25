import _ from 'lodash';
import { prompt } from 'utils';

/**
 * The controller for histories of a ePub generating process
 */
class EPubHistoryManager {
  constructor(dataController) {
    this.__history__ = [];
    this.__index__ = -1;
    this.__dataCtrl = dataController;

    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
  }

  getHistory() {
    return this.__history__;
  }

  setHistory(history) {
    this.__history__ = history;
  }

  clear() {
    this.setHistory([]);
    this.__index__ = -1;
  }

  stepBack() {
    this.__index__ -= 1;
  }

  stepForward() {
    this.__index__ += 1;
  }

  get length() {
    return this.__history__.length;
  }

  get isEmpty() {
    return this.length === 0;
  }

  get canUndo() {
    return this.__index__ >= 0;
  }

  get canRedo () {
    return !this.isEmpty && (this.__index__ + 1 < this.length);
  }

  logger() {
    // console.info('history', this.__index__, this.__history__);
  }
  /*
  updateContentChanges: 
    this.setChapters(chapters);
    this.setCurrChIndex(currChIndex);
    */
  revertToChapters(chapters) {
    // epubState.updateContentChanges(chapters, epubState.currChIndex); NOT IMPLEMENTED
    this.__dataCtrl.setChapters(chapters);
  }

  getItem(index) {
    return JSON.parse(this.getHistory()[index] || '{}');
  }

  push(name, prev, next) {
    this.stepForward();
    this.__history__ = [
      ...this.__history__.slice(0, this.__index__),
      JSON.stringify({ name, prev, next })
    ];
  }

  pushAndUpdateAll(
    actionName,
    nextChapters,
    currChIndex
  ) {
    // this.push(actionName, epubState.chapters, nextChapters); NOT IMPLEMENTED
    // epubState.updateContentChanges(nextChapters, currChIndex); NOT IMPLEMENTED
  }

  undo() {
    if (!this.canUndo) {
      return;
    }

    let curr = this.getItem(this.__index__);
    this.revertToChapters(curr.prev);
    this.stepBack();
    this.feed('UNDO', curr.name);
    this.logger();
  }

  redo() {
    if (!this.canRedo) {
      return;
    }

    let next = this.getItem(this.__index__ + 1);
    this.revertToChapters(next.next);
    this.stepForward();
    this.feed('REDO', next.name);
    this.logger();
  }

  feed(action, name) {
    prompt.addOne({
      text: `${action}: ${name}`,
      timeout: 2000,
      position: 'bottom left'
    });
  }
}

export default EPubHistoryManager;