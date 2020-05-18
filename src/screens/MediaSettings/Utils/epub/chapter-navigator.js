import { util } from 'utils';
import { epubState } from './epub-state';
import { 
    NAV_CLOSE,
    NAV_HIDE,
    NAV_SHOW,
    SUB_CHAPTER_ID_PREFIX
} from './constants';

const { elem } = util;

export const showNavigator = () => {
    epubState.setShowNav(NAV_SHOW);
}

export const hideNavihator = () => {
    epubState.setShowNav(NAV_HIDE);
    setTimeout(() => {
        epubState.setShowNav(NAV_CLOSE);
    }, 100);
}

export const navigateChapter = chapter => () => {
    elem.scrollIntoView(chapter.id);
    epubState.changeChapter(chapter);
    epubState.setNavId(chapter.id);

    if (epubState.isStep1) {
        hideNavihator();
    } else {
        elem.scrollToTop('ee-ech-ch');
    }
}

export const navigateSubChapter = (subChapter, chapter) => () => {
    if (!epubState.currChapter || epubState.currChapter.id !== chapter.id) {
        epubState.changeChapter(chapter);
    }

    if (epubState.isStep1) {
        // elem.scrollToTop('msp-ee-sch-list', { 
        //     scrollElemId: subChapter.id,
        //     scrollTop: window.innerHeight - 220
        // });
        elem.scrollIntoCenter('sch-subch-' + subChapter.id)

        epubState.setNavId(subChapter.id);
        hideNavihator();
    } else {
        elem.scrollToTop('ee-ech-ch', { 
            scrollElemId: `${SUB_CHAPTER_ID_PREFIX}-${subChapter.id}`,
            scrollTop: -100
        });
    }
}

export const scrollToNavItem = chapterId => {
    elem.scrollIntoCenter('ee-cn-ch-' + chapterId);
}

export const onShowNavChange = currChapterId => {
    if (epubState.showNav === NAV_SHOW) {
        elem.scrollIntoCenter('ee-cn-ch-' + currChapterId);
    }
}

function onEpubPreviewScroll() {
    // return;
    let { currChapter } = epubState;
    let scrollTop = this.scrollTop;

    // if on the top
    if (scrollTop === 0) {
        epubState.setNavId(currChapter.id);
        return;
    }

    let subChapters = currChapter.subChapters;
    for (let i = 0; i < subChapters.length; i++) {
        let subChapter = subChapters[i];
        
        let subChapterElem = document.getElementById(
            `${SUB_CHAPTER_ID_PREFIX}-${subChapter.id}`
        );

        if (subChapterElem && elem.isScrolledIntoView(subChapterElem, 300)) {
            epubState.setNavId(subChapter.id);
            return;
        }
    }

    // if no sub chapter is in view
    // epubState.setNavId(currChapter.id);
}

export function addScrollEventListenerToEpubPreview() {
    let previewElem = document.getElementById('ee-ech-ch');
    if (Boolean(previewElem)) {
        previewElem.addEventListener('scroll', onEpubPreviewScroll, true);
    }
}

export function removeScrollEventListenerToEpubPreview() {
    let previewElem = document.getElementById('ee-ech-ch');
    if (Boolean(previewElem)) {
        previewElem.removeEventListener('scroll', onEpubPreviewScroll);
    }
}

