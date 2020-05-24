import { util } from 'utils';
import { epubState } from './epub.state';
import { 
  NAV_CLOSE, 
  NAV_HIDE, 
  NAV_SHOW, 
  SUB_CHAPTER_ID_PREFIX 
} from './constants';

const { elem } = util;

function onEpubPreviewScroll() {
  // return;
  const { currChapter } = epubState;
  const scrollTop = this.scrollTop;

  // if on the top
  if (scrollTop === 0) {
    epubState.setNavId(currChapter.id);
    return;
  }

  const subChapters = currChapter.subChapters;
  for (let i = 0; i < subChapters.length; i += 1) {
    const subChapter = subChapters[i];

    const subChapterElem = document.getElementById(`${SUB_CHAPTER_ID_PREFIX}-${subChapter.id}`);

    if (subChapterElem && elem.isScrolledIntoView(subChapterElem, 300)) {
      epubState.setNavId(subChapter.id);
      return;
    }
  }
}

class EpubChapterNavigatorController {
  constructor() {
    this.showNavigator = this.showNavigator.bind(this);
    this.hideNavihator = this.hideNavihator.bind(this);
    this.hideNavihator = this.hideNavihator.bind(this);

    this.addScrollEventListenerToEpubPreview = 
      this.addScrollEventListenerToEpubPreview.bind(this);

    this.removeScrollEventListenerToEpubPreview = 
      this.removeScrollEventListenerToEpubPreview.bind(this);
  }

  showNavigator() {
    epubState.setShowNav(NAV_SHOW);
  };

  hideNavihator() {
    epubState.setShowNav(NAV_HIDE);
    setTimeout(() => {
      epubState.setShowNav(NAV_CLOSE);
    }, 100);
  };

  navigateChapter = (chapter) => () => {
    elem.scrollIntoView(chapter.id);
    epubState.changeChapter(chapter);
    epubState.setNavId(chapter.id);

    if (epubState.isStep1) {
      this.hideNavihator();
    } else {
      elem.scrollToTop('ee-ech-ch');
    }
  };

  navigateSubChapter = (subChapter, chapter) => () => {
    if (!epubState.currChapter || epubState.currChapter.id !== chapter.id) {
      epubState.changeChapter(chapter);
    }

    if (epubState.isStep1) {
      // elem.scrollToTop('msp-ee-sch-list', {
      //     scrollElemId: subChapter.id,
      //     scrollTop: window.innerHeight - 220
      // });
      elem.scrollIntoCenter(`sch-subch-${subChapter.id}`);

      epubState.setNavId(subChapter.id);
      this.hideNavihator();
    } else {
      elem.scrollToTop('ee-ech-ch', {
        scrollElemId: `${SUB_CHAPTER_ID_PREFIX}-${subChapter.id}`,
        scrollTop: -100,
      });
    }
  };

  scrollToNavItem = (chapterId) => {
    elem.scrollIntoCenter(`ee-cn-ch-${chapterId}`);
  };

  onShowNavChange = (currChapterId) => {
    if (epubState.showNav === NAV_SHOW) {
      elem.scrollIntoCenter(`ee-cn-ch-${currChapterId}`);
    }
  };

  addScrollEventListenerToEpubPreview() {
    const previewElem = document.getElementById('ee-ech-ch');
    if (previewElem) {
      previewElem.addEventListener('scroll', onEpubPreviewScroll, true);
    }
  }

  removeScrollEventListenerToEpubPreview() {
    const previewElem = document.getElementById('ee-ech-ch');
    if (previewElem) {
      previewElem.removeEventListener('scroll', onEpubPreviewScroll);
    }
  }
}

export const chapterNavigator = new EpubChapterNavigatorController();