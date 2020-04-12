import _ from 'lodash'
import AdmZip from 'adm-zip'
import downloadFile from 'js-file-download'

import { OEBPS_STYLE_CSS        } from './statics/style.css.js'
import { OEBPS_KATEX_CSS        } from './statics/katex.min.css.js'
import { META_INF_CONTAINER_XML } from './statics/container.xml.js'
import { MIMETYPE               } from './statics/mimetype.js'


import * as ehelper from './helpers'

export class CTEpubGenerator {
  /**
   * Class used to create a ePub-file generator for ClassTranscribe
   * @param {Object} options Options to initialize the ePub generator
   * @param {String} options.filename the filename of the ePub -> filename.epub
   * @param {String} options.title the title of the ePub file
   * @param {String} options.language the language of the ePub file
   * @param {String} options.author the author of the ePub file
   * @param {Object[]} options.chapters the chapters of the ePub
   * @param {String} options.chapters[].id the unique id of a chapter
   * @param {String} options.chapters[].title the title of the chapter
   * @param {String} options.chapters[].image the cover image of the chapter
   * @param {String} options.chapters[].text the content of the chapter
   * @param {Object[]} options.chapters[].items the included screenshots of this chapter
   */
  constructor(options={ 
    filename: '', 
    title: '',
    author: 'anonymous', 
    language: 'en-US',
    chapters: [], 
  }) {
    let { filename, chapters, title, author, language } = options
    if (!filename || !chapters || !title) {
      console.error('filename, title, and chapters are required.')
      return
    }
    this.filename = filename
    this.chapters = ehelper.parse_chapters(chapters)
    this.title = title
    this.author = author
    this.language = language
  }

  /**
   * Function called to start downloading the ePub file
   * @param {Object} config the callback functions
   * @param {Function} config.onDownloaded the function called when the file has been downloaded
   * @param {Function} config.onError the function called when error occurs
   */
  async download(config={
    onDownloaded: null,
    onError: null,
  }) {
    const { onDownloaded, onError } = config
    const { title, author, language, filename, chapters } = this
    
    try {
      if (!filename || !chapters || !title) {
        throw Error('filename, title, and chapters are required.')
      }

      // console.log('this.chapters', this.chapters)
      const zip = new AdmZip()
      // OEBPS/cover.jpeg
      // OEBPS/images/image-id.jpeg
      await ehelper.load_and_add_images(zip, chapters)
      // mimetype
      zip.addFile('mimetype', new Buffer(MIMETYPE))
      // META-INF/container.xml
      zip.addFile('META-INF/container.xml', new Buffer(META_INF_CONTAINER_XML))
      // OEBPS
      // OEBPS/style.css
      zip.addFile('OEBPS/style.css', new Buffer(OEBPS_STYLE_CSS))
      zip.addFile('OEBPS/katex.min.css', new Buffer(OEBPS_KATEX_CSS))
      // OEBPS/toc.ncx
      let tox_ncx = ehelper.get_toc_ncx(title, author, chapters)
      zip.addFile('OEBPS/toc.ncx', new Buffer(tox_ncx))
      // OEBPS/toc.xhtml
      let toc_xhtml = ehelper.get_toc_xhtml(title, language, chapters)
      zip.addFile('OEBPS/toc.xhtml', new Buffer(toc_xhtml))
      // OEBPS/content.opf
      let content_opf = ehelper.get_content_opf(title, author, language, 'ClassTranscribe', new Date(), chapters)
      zip.addFile('OEBPS/content.opf', new Buffer(content_opf))
  
      // OEBPS/chapter-id.xhtml
      _.forEach(chapters, ch => {
        let content_xhtml = ehelper.get_content_xhtml(ch, language)
        zip.addFile(`OEBPS/${ch.id}.xhtml`, new Buffer(content_xhtml))
      })
  
      // console.log('tox_ncx', toc_xhtml)
      // console.log(zip.toBuffer().toString('utf8'))
      downloadFile(zip.toBuffer(), filename)
      if (onDownloaded) onDownloaded()
      
    } catch (error) {
      if (onError) {
        onError(error)
      } else {
        console.error(error)
      }
    }
  }
}