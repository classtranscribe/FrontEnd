import _ from 'lodash';
import { elem } from 'utils';
import ID from './constants/EPubIDs';
import Constants from './constants/EPubConstants';
import { epubState } from './EPubStateManager';

/**
 * The controller for scrolling events and indicates the current active item of the ePub
 */
class EPubNavigator {
  constructor() {
    this.__disabled = false;

    this.removeScrollListenerForChapterList = 
      this.removeScrollListenerForChapterList.bind(this);
  }

  disable() {
    this.__disabled = true;
  }

  enable() {
    this.__disabled = false;
  }

  get offsetTop() {
    return 80;
  }

  get chListEl() {
    return elem.getElement(ID.EPubChapterListID);
  }

  getChTop = (id) => {
    const chId = epubState.view === Constants.EpbReadOnly ? id : ID.chID(id);
    const chEl = elem.getElement(chId);
    return chEl.offsetTop;
  }

  getSubChTop = (id, offset = 75) => {
    const schId = epubState.view === Constants.EpbReadOnly ? id : ID.schID(id);
    const schEl = elem.getElement(schId);
    if (!schEl) {
      return 10000;
    }
    const schUlEl = schEl.parentElement;
    const chEl = schUlEl.parentElement;

    if (epubState.view === Constants.EpbEditStructure) {
      return schEl.offsetTop + schUlEl.offsetTop + chEl.offsetTop - offset;
    } else {
      return schEl.offsetTop - offset;
    } 
  }

  scrollToCh = (id) => {
    const chListEl = this.chListEl;
    chListEl.scrollTop = this.getChTop(id);
  }

  scrollToSubCh = (id) => {
    const chListEl = this.chListEl;
    chListEl.scrollTop = this.getSubChTop(id);
  }

  navigateChapter = (chId) => {
    if (epubState.view === Constants.EpbEditChapter) {
      let chIdx = _.findIndex(epubState.chapters, { id: chId });
      if (chIdx >= 0) {
        epubState.setCurrChIndex(chIdx);
        epubState.setNavId(ID.chNavItemID(chId));
      }
    } else {
      this.scrollToCh(chId);
    }
  };

  navigateSubChapter = (schId) => {
    this.scrollToSubCh(schId);
  };


  updateNavIdForEpbEditStructure(e) {
    const chElScrollTop = e.target.scrollTop;
    // console.log('chElScrollTop', chElScrollTop);
    // handle abnormal cases when scroll to top
    if (chElScrollTop < 10 && epubState.chapters.length > 0) {
      epubState.setNavId(ID.chNavItemID(epubState.chapters[0].id));
      epubState.setCurrChIndex(0);
    }

    // initialize default values
    let navId = epubState.navId;
    let currChIndex = epubState.currChIndex;
    let minDis = 1000;

    // iterate all possible chapters and sub-chapters 
    // to find the current one in view
    _.forEach(epubState.chapters, (ch, chIdx) => {
      const chTop = this.getChTop(ch.id);
      const chDis = chElScrollTop - chTop + 90;
      if (chDis < 0) return false; // stop iterate when exceed the scrollTop
      if (chDis > 0 && chDis < minDis) {
        minDis = chDis;
        navId = ID.chNavItemID(ch.id);
        currChIndex = chIdx;
      }

      _.forEach(ch.subChapters, (sch) => {
        const schTop = this.getSubChTop(sch.id);
        const schDis = chElScrollTop - schTop + 50;
        if (schDis < 0) return false; // stop iterate when exceed the scrollTop
        if (schDis > 0 && schDis < minDis) {
          minDis = schDis;
          navId = ID.schNavItemID(sch.id);
          currChIndex = chIdx;
        }
      });
    });

    epubState.setNavId(navId);
    epubState.setCurrChIndex(currChIndex);
  }

  updateNavIdForEditChaper(e) {
    const chElScrollTop = e.target.scrollTop;
    const chIdx = epubState.currChIndex;
    const chapter = epubState.chapters[chIdx];
    if (chElScrollTop < 40) {
      epubState.setNavId(ID.chNavItemID(chapter.id));
    }

    // initialize default values
    let navId = epubState.navId;
    let minDis = 1000;

    _.forEach(chapter.subChapters, (sch) => {
      const schTop = this.getSubChTop(sch.id);
      const schDis = chElScrollTop - schTop + 50;
      if (schDis < 0) return false; // stop iterate when exceed the scrollTop
      if (schDis > 0 && schDis < minDis) {
        minDis = schDis;
        navId = ID.schNavItemID(sch.id);
      }
    });

    epubState.setNavId(navId);
  }

  onScroll = _.debounce((e) => {
    if (this.__disabled) return;
    // console.log(e.target.scrollTop);
    switch (epubState.view) {
      case Constants.EpbEditStructure:
        this.updateNavIdForEpbEditStructure(e);
        break;
      case Constants.EpbEditChapter:
        this.updateNavIdForEditChaper(e);
        break;
      case Constants.EpbReadOnly:
        this.updateNavIdForEpbEditStructure(e);
        //this.updateNavIdForDownloadEPub(e);
        break;
      default:
        break;
    }
  }, 80);

  addScrollListenerForChapterList() {
    const chListEl = this.chListEl;
    if (chListEl) {
      chListEl.removeEventListener('scroll', this.onScroll, true);
      chListEl.addEventListener('scroll', this.onScroll, true);
    }
  }

  removeScrollListenerForChapterList() {
    const chListEl = this.chListEl;
    if (chListEl) {
      chListEl.removeEventListener('scroll', this.onScroll, true);
    }
  }
}

export default EPubNavigator;