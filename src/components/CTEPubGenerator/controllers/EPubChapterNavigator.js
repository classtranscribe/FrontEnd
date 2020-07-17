import _ from 'lodash';
import { elem } from 'utils';
import Constants from './EPubConstants';
import { epubState } from './EPubState';

class EPubChapterNavigator {
  constructor(controller) {
    this.removeScrollListenerForChapterList = 
      this.removeScrollListenerForChapterList.bind(this);
  }

  updateCurrChIndex(e) {
    // console.log(e.target.scrollTop)
    if (e.target.scrollTop < 500 && epubState.currChIndex !== 0) {
      epubState.setCurrChIndex(0);
      return;
    }

    _.forEach(epubState.chapters, (chapter, index) => {
      const chId = Constants.chID(chapter.id);
      if (elem.isScrolledIntoView(chId, 300)) {
        if (epubState.currChIndex !== index) {
          epubState.setCurrChIndex(index);
        }
        let foundNavId = false;

        _.forEach(chapter.subChapters, (subChapter) => {
          const schId = Constants.schID(subChapter.id);
          if (elem.isScrolledIntoView(schId, 300)) {
            foundNavId = true;
            epubState.setNavId(subChapter.id);
            return false;
          }
        });
        
        if (!foundNavId) {
          epubState.setNavId(chapter.id);
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