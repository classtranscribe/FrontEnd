import _ from 'lodash';
import { elem } from 'utils';
import Constants from './EPubConstants';
import { epubState } from './EPubState';

/**
 * The controller for scrolling events and indicates the current active item of the ePub
 */
class EPubChapterNavigator {
  constructor() {
    this.prevScrollTop = 0;
    this.removeScrollListenerForChapterList = 
      this.removeScrollListenerForChapterList.bind(this);
  }

  get schOffsetTopTol() {
    return (window.innerHeight / 2) + 50;
  }

  get chOffsetTopTol() {
    return (window.innerHeight / 2) - 80;
  }

  showNavigator = () => {
    epubState.setShowNav(true);
  };

  closeNavigator = () => {
    if (epubState.showNav) {
      epubState.setShowNav(false);
    }
  };

  navigateChapter = (chId) => {
    if (epubState.step === Constants.EPubStepSplitChapters) {
      elem.scrollIntoView(Constants.chID(chId));
    } else if (epubState.step === Constants.EPubStepEditChapters) {
      let chIdx = _.findIndex(epubState.chapters, { id: chId });
      if (chIdx >= 0) {
        epubState.setCurrChIndex(chIdx);
        epubState.setNavId(Constants.chNavItemID(chId));
      }
    } else {
      elem.scrollIntoView(chId);
      epubState.setNavId(Constants.chNavItemID(chId));
    }
  };

  navigateSubChapter = (schId) => {
    if (epubState.step === Constants.EPubStepDownload) {
      elem.scrollIntoView(schId);
      epubState.setNavId(Constants.schNavItemID(schId));
    } else {
      elem.scrollIntoCenter(Constants.schTitleID(schId));
    }
  };

  /**
   * @param {Event} e
   */
  updateNavIdForSplitChaper(e) {
    // console.log(e.target.scrollTop)
    if (e.target.scrollTop < 500 && epubState.currChIndex !== 0) {
      epubState.setCurrChIndex(0);
      return;
    }

    _.forEach(epubState.chapters, (chapter, index) => {
      const chId = Constants.chID(chapter.id);
      if (elem.isScrolledIntoView(chId, this.chOffsetTopTol)) {
        if (epubState.currChIndex !== index) {
          this.prevScrollTop = e.target.scrollTop;
          epubState.setCurrChIndex(index);
        }
        let foundNavId = false;

        _.forEach(chapter.subChapters, (subChapter) => {
          const schId = Constants.schID(subChapter.id);
          if (elem.isScrolledIntoView(schId, this.schOffsetTopTol)) {
            foundNavId = true;
            epubState.setNavId(Constants.schNavItemID(subChapter.id));
            return false;
          }
        });
        
        if (!foundNavId) {
          epubState.setNavId(Constants.chNavItemID(chapter.id));
        }

        return false
      }
    });
  }

  /**
   * @param {Event} e
   */
  updateNavIdForEditChaper(e) {
    const currChapter = epubState.chapters[epubState.currChIndex];

    if (e.target.scrollTop === 0) {
      epubState.setNavId(Constants.chNavItemID(currChapter.id));
      return;
    }

    _.forEach(currChapter.subChapters, (schp) => {
      let schId = Constants.schID(schp.id);
      if (elem.isScrolledIntoView(schId, this.schOffsetTopTol)) {
        epubState.setNavId(Constants.schNavItemID(schp.id));
        return false;
      }
    });
  }

  /**
   * @param {Event} e
   */
  updateNavIdForDownloadEPub(e) {
    // console.log(e.target.scrollTop)
    // _.forEach(epubState.chapters, (chapter) => {
    //   const chId = chapter.id;
    //   if (elem.isScrolledIntoView(chId, 0)) {
    //     let foundNavId = false;

    //     _.forEach(chapter.subChapters, (subChapter) => {
    //       const schId = subChapter.id;
    //       if (elem.isScrolledIntoView(schId, 0)) {
    //         foundNavId = true;
    //         epubState.setNavId(Constants.schNavItemID(subChapter.id));
    //         return false;
    //       }
    //     });
        
    //     if (!foundNavId) {
    //       epubState.setNavId(Constants.chNavItemID(chapter.id));
    //     }

    //     return false
    //   }
    // });
  }

  onScroll = _.debounce((e) => {
    switch (epubState.step) {
      case Constants.EPubStepSplitChapters:
        this.updateNavIdForSplitChaper(e);
        break;
      case Constants.EPubStepEditChapters:
        this.updateNavIdForEditChaper(e);
        break;
      case Constants.EPubStepDownload:
        this.updateNavIdForDownloadEPub(e);
        break;
      default:
        break;
    }
  }, 100);

  addScrollListenerForChapterList() {
    const chListEl = document.getElementById(Constants.EPubChapterListID);
    if (chListEl) {
      chListEl.removeEventListener('scroll', this.onScroll, true);
      chListEl.addEventListener('scroll', this.onScroll, true);
    }
  }

  removeScrollListenerForChapterList() {
    const chListEl = document.getElementById(Constants.EPubChapterListID);
    if (chListEl) {
      chListEl.removeEventListener('scroll', this.onScroll, true);
    }
  }
}

export default EPubChapterNavigator;