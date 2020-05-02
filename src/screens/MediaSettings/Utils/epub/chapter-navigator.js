import { util } from 'utils';
import { epubState } from './setstate';
import { SUB_CHAPTER_ID_PREFIX } from './constants'

const { elem } = util;

export const NAV_SHOW = ' show';
export const NAV_HIDE = ' hide';
export const NAV_CLOSE = null;

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

    if (epubState.isManagingChapters) {
        hideNavihator();
    }
}

export const navigateSubChapter = (subChapter, chapter) => () => {
    epubState.changeChapter(chapter);

    if (epubState.isManagingChapters) {
        elem.scrollToTop('msp-ee-el-con', { 
            scrollElemId: subChapter.id,
            scrollTop: window.innerHeight - 220
        });

        epubState.setNavId(subChapter.id);
        hideNavihator();
    } else {
        elem.scrollToTop('msp-ee-ep-con', { 
            scrollElemId: `${SUB_CHAPTER_ID_PREFIX}-${subChapter.id}`,
            scrollTop: -25
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
            elem.scrollIntoCenter('ee-cn-sub-ch-' + subChapter.id);
            return;
        }
    }

    // if no sub chapter is in view
    // epubState.setNavId(currChapter.id);
}

export function addScrollEventListenerToEpubPreview() {
    let previewElem = document.getElementById('msp-ee-ep-con');
    if (Boolean(previewElem)) {
        previewElem.addEventListener('scroll', onEpubPreviewScroll, true);
    }
}

export function removeScrollEventListenerToEpubPreview() {
    let previewElem = document.getElementById('msp-ee-ep-con');
    if (Boolean(previewElem)) {
        previewElem.removeEventListener('scroll', onEpubPreviewScroll);
    }
}

