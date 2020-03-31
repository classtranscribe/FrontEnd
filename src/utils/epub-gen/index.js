import _ from 'lodash'
import AdmZip from 'adm-zip'
import downloadFile from 'js-file-download'

import { 
  MIMETYPE, 
  META_INF_CONTAINER_XML, 
  OEBPS_STYLE_CSS,
} from './content-data'

import * as ehelper from './helpers'


export class CTEpubGenerator {
  constructor(options={ 
    filename: '', 
    chapters: [], 
    title: '',
    author: 'anonymous', 
    language: 'en-US',
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

  async download() {
    const { title, author, language, filename, chapters } = this
    if (!filename || !chapters || !title) {
      console.error('filename, title, and chapters are required.')
      return
    }
    console.log('this.chapters', this.chapters)
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
  }
}