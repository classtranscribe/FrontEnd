import _ from 'lodash';
import { elem } from 'utils';
import Constants from './EPubConstants';
import { epubState } from './EPubState';

class EPubChapterNavigator {
  constructor() {
    this.prevScrollTop = 0;
    this.removeScrollListenerForChapterList = 
      this.removeScrollListenerForChapterList.bind(this);
  }

  showNavigator = () => {
    epubState.setShowNav(true);
  };

  closeNavigator = () => {
    epubState.setShowNav(false);
  };

  navigateChapter = (chId) => {
    elem.scrollIntoView(Constants.chID(chId));
  };

  navigateSubChapter = (schId) => {
    elem.scrollIntoCenter(Constants.schID(schId));
    // elem.scrollToTop(Constants.EPubChapterListID, {
    //   scrollElemId: Constants.schID(schId),
    //   scrollTop: 600,
    // });
  };

  /**
   * 
   * @param {Event} e 
   */
  updateCurrChIndex(e) {
    // console.log(e.target.scrollTop)
    if (e.target.scrollTop < 500 && epubState.currChIndex !== 0) {
      epubState.setCurrChIndex(0);
      return;
    }

    _.forEach(epubState.chapters, (chapter, index) => {
      const chId = Constants.chID(chapter.id);
      if (elem.isScrolledIntoView(chId, 350)) {
        if (epubState.currChIndex !== index) {
          this.prevScrollTop = e.target.scrollTop;
          epubState.setCurrChIndex(index);
        }
        let foundNavId = false;

        _.forEach(chapter.subChapters, (subChapter) => {
          const schId = Constants.schID(subChapter.id);
          if (elem.isScrolledIntoView(schId, 350)) {
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

  onScroll = _.debounce((e) => {
    switch (epubState.step) {
      case Constants.EPubStepSplitChapters:
        this.updateCurrChIndex(e);
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