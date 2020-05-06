import _ from 'lodash';
import downloadFile from 'js-file-download';

import { parse_chapters } from './util';
import epub_converter from './epub-converter';
import {
    html_converter,
    html_previewer,
} from './html-converter';


export class CTEpubGenerator {
    /**
     * Class used to create a ePub-file generator for ClassTranscribe
     * @param {Object} options - Options to initialize the ePub generator
     * @param {String} options.filename - the filename of the ePub -> filename.epub
     * @param {String} options.title - the title of the ePub file
     * @param {String} options.language - the language of the ePub file
     * @param {String} options.author - the author of the ePub file
     * @param {Object[]} options.chapters - the chapters of the ePub
     * @param {String} options.chapters[].id - the unique id of a chapter
     * @param {String} options.chapters[].title - the title of the chapter
     * @param {String} options.chapters[].image - the cover image of the chapter
     * @param {String} options.chapters[].text - the content of the chapter
     * @param {Object[]} options.chapters[].items - the included screenshots of this chapter
     */
    constructor(options={ 
        filename: '', 
        title: '',
        author: 'anonymous', 
        language: 'en-US',
        chapters: [], 
    }) {
        let { filename, chapters, title, author, language, cover } = options;
        if (!filename || !chapters || !title) {
            console.error('filename, title, and chapters are required.');
            return;
        }

        this.filename = filename;
        this.chapters = chapters;
        this.title = title;
        this.author = author;
        this.language = language;
        this.cover = cover;
    }

    /**
     * Save as a ePub file
     * @param {Object} config - the callback functions
     * @param {Function} config.onDownloaded - the function called when the file has been downloaded
     * @param {Function} config.onError - the function called when error occurs
     */
    async downloadEpub(config={
        onDownloaded: null,
        onError: null,
    }) {
        const { onDownloaded, onError } = config;
        const { title, author, language, filename, cover } = this;
        const chapters = parse_chapters(this.chapters);
        
        try {
            let epubBuffer = await epub_converter({
                title, 
                author, 
                language, 
                filename, 
                chapters, 
                cover
            });

            downloadFile(epubBuffer, filename + '.epub');
            
            if (onDownloaded) {
                onDownloaded();
            }
        
        } catch (error) {
            if (onError) {
                onError(error);
            } else {
                console.error(error);
            }
        }
    }

    /**
     * Save as a HTML file
     * @param {Object} config - the callback functions
     * @param {Function} config.onDownloaded - the function called when the file has been downloaded
     * @param {Function} config.onError - the function called when error occurs
     */
    async downloadHTML(config={
        onDownloaded: null,
        onError: null,
    }) {
        const { onDownloaded, onError } = config;
        const { title, author, language, filename, cover } = this;
        const chapters = parse_chapters(this.chapters);
        
        try {
            let htmlBuffer = await html_converter({
                title, 
                author, 
                language, 
                filename, 
                chapters, 
                cover
            });

            downloadFile(htmlBuffer, filename + '.zip');
            
            if (onDownloaded) {
                onDownloaded();
            }
        
        } catch (error) {
            if (onError) {
                onError(error);
            } else {
                console.error(error);
            }
        }
    }

    /**
     * Preview the ePub as HTML
     * @param {Object} config - the callback functions
     * @param {Boolean} config.print - true if request a print action to browser
     * @param {Function} config.onError - the function called when error occurs
     */
    async preview(config={
        print: true,
        onError: null,
    }) {
        const { print, onError } = config;
        const { title, author, language, filename, cover, chapters } = this;
        
        try {
            html_previewer({
                title, 
                author, 
                language, 
                filename, 
                chapters, 
                cover
            }, print);
        
        } catch (error) {
            if (onError) {
                onError(error);
            } else {
                console.error(error);
            }
        }
    }
}