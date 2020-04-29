import _ from 'lodash';
import { api, util, ARRAY_INIT } from 'utils';
import { ENGLISH } from 'screens/Watch/Utils';
import { NO_EPUB } from '../constants';
import { setup } from '../setup';
import { genChaperFromItems } from './util';

function parseChapter(epub, index) {
    return {
        ...epub,
        id: util.genId('epub-data'),
        title: epub.title || `Chapter ${index + 1}`,
    };
}

function parseEpubData(epubData) {
    return _.map(epubData, parseChapter);
}

class EpubState {
    constructor() {
        this.mediaId = '';
        this.redux = {};
        this.setStateFunc = {};

        this.init = this.init.bind(this);
        this.registerSetStateFunc = this.registerSetStateFunc.bind(this);
        this.setupEpub = this.setupEpub.bind(this);
        this.changeChapter = this.changeChapter.bind(this);
    }

    /**
     * Function used to register redux functions for epub settings
     * @param {Object} props 
     */
    init(props) {
        const { 
            setEpubData, setIsEditingEpub
        } = props;
    
        this.redux = { 
            setEpubData, setIsEditingEpub
        };
    }

    epubData = []
    setEpubData(epubData) {
        const { setEpubData } = this.redux;
        if (setEpubData) {
            setEpubData(epubData);
            this.epubData = epubData;
        }
    }

    isEditingEpub = false
    setIsEditingEpub(isEditingEpub) {
        const { setIsEditingEpub } = this.redux;
        if (setIsEditingEpub) {
            setIsEditingEpub(isEditingEpub);
            this.isEditingEpub = isEditingEpub;
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
        const setState = this.setStateFunc[funcName];
        if (setState) {
            setState(value);
            this[stateName] = value;
        }
    }

    currChapter = {}
    setCurrChapter(currChapter) {
        this.setState('setCurrChapter', 'currChapter', currChapter);
    }

    changeChapter(chapter) {
        this.setCurrChapter(genChaperFromItems(chapter));
    }

    chapters = []
    setChapters(chapters) {
        this.setState('setChapters', 'chapters', chapters);
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
        setup.error('');
        try {
            let { data=[] } = await api.getEpubData(mediaId, language);
            return parseEpubData(data);
        } catch (error) {
            console.error('Failed to get ePub data of media for ' + mediaId);
            setup.error(NO_EPUB);
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