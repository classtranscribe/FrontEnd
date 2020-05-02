import { api, ARRAY_INIT } from 'utils';
import { ENGLISH } from 'screens/Watch/Utils';
import { NO_EPUB, DEFAULT_IS_MANAGING_CHAPTERS } from './constants';
import { parseEpubData } from './util';

class EpubState {
    constructor() {
        this.mediaId = '';
        this.redux = {};
        this.setStateFunc = {};

        this.init = this.init.bind(this);
        this.registerSetStateFunc = this.registerSetStateFunc.bind(this);
        this.setupEpub = this.setupEpub.bind(this);
        this.changeChapter = this.changeChapter.bind(this);
        this.updateEpubChapters = this.updateEpubChapters.bind(this);
    }

    /**
     * Function used to register redux functions for epub settings
     * @param {Object} props 
     */
    init(props) {
        const { 
            setEpubData, setIsManagingChapters,
            setLanguage, setChapters, setCurrChapter,
            setCoverImgs, setMagnifiedImg, setFoldedIds,
            setNavId, setShowNav,
            setTxtEditor, setError,
        } = props;
    
        this.redux = { 
            ...this.redux,
            setEpubData, setIsManagingChapters,
            setLanguage, setChapters, setCurrChapter,
            setCoverImgs, setMagnifiedImg, setFoldedIds,
            setNavId, setShowNav,
            setTxtEditor, setError,
        };
    }

    epubData = ARRAY_INIT
    setEpubData(epubData) {
        const { setEpubData } = this.redux;
        if (setEpubData) {
            setEpubData(epubData);
            this.epubData = epubData;
        }
    }

    isManagingChapters = DEFAULT_IS_MANAGING_CHAPTERS
    setIsManagingChapters(isManagingChapters) {
        const { setIsManagingChapters } = this.redux;
        if (setIsManagingChapters) {
            setIsManagingChapters(isManagingChapters);
            this.isManagingChapters = isManagingChapters;
        }
    }


    /**
     * Function used to register react setState functions
     * @param {Object} functions 
     */
    registerSetStateFunc(functions={}) {
        this.setStateFunc = { ...this.setStateFunc, ...functions };
    }

    setState(funcName, stateName, value) {
        const setState = this.redux[funcName];
        if (setState) {
            setState(value);
            this[stateName] = value;
        }
    }

    error = null
    setError(error) {
        this.setState('setError', 'error', error);
    }

    currChapter = {}
    setCurrChapter(currChapter) {
        this.setState('setCurrChapter', 'currChapter', currChapter);
    }

    changeChapter(chapter) {
        this.setCurrChapter(chapter);
    }

    chapters = ARRAY_INIT
    setChapters(chapters) {
        this.setState('setChapters', 'chapters', chapters);
    }

    updateEpubChapters(chapters, currChapter) {
        this.setChapters([ ...chapters ]);
        this.changeChapter({ ...currChapter });
    }

    switchToEditChapters() {

    }

    switchToSplitChapters() {
        
    }

    language = ENGLISH
    setLanguage(language) {
        this.setState('setLanguage', 'language', language);
    }

    coverImgs = []
    setCoverImgs(coverImgs) {
        this.setState('setCoverImgs', 'coverImgs', coverImgs);
    }

    magnifiedImg = null
    setMagnifiedImg(magnifiedImg) {
        this.setState('setMagnifiedImg', 'magnifiedImg', magnifiedImg);
    }

    foldedIds = []
    setFoldedIds(foldedIds) {
        this.setState('setFoldedIds', 'foldedIds', foldedIds);
    }

    navId = ''
    setNavId(navId) {
        this.setState('setNavId', 'navId', navId);
    }

    showNav = false
    setShowNav(showNav) {
        this.setState('setShowNav', 'showNav', showNav);
    }


    async changeEpubLanguage(language) {
        this.setEpubData(ARRAY_INIT);
        let epubData = await this.getEpubData(this.mediaId, language);
        this.setEpubData(epubData);
    }

    async requestEpub(mediaId) {
        try {
            await api.requestEpubCreation(mediaId)
        } catch (error) {
            console.error('Failed to request a epub for ' + mediaId)
        }
    }

    async getEpubData(mediaId, language) {
        this.setError('');
        try {
            let { data=[] } = await api.getEpubData(mediaId, language);
            return parseEpubData(data);
        } catch (error) {
            console.error('Failed to get ePub data of media for ' + mediaId);
            this.setError(NO_EPUB);
        }

        return ARRAY_INIT;
    }

    async setupEpub(mediaId) {
        this.mediaId = mediaId;
        let epubData = await this.getEpubData(mediaId);
        this.setEpubData(epubData);
    }
}

export const epubState = new EpubState();