import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { 
  api, 
  prompt, 
  html,
  CTEpubGenerator,
  ARRAY_INIT, 
} from 'utils'
import { ENGLISH } from 'screens/Watch/Utils' // language code
import { 
  NO_EPUB, 
  EDITOR_TYPE_SPLITTER,
  EDITOR_MARKDOWN,
} from './constants'
import { setup } from './setup'

class Epub {
  constructor() {
    this.redux = {}
    this.stateFunc = {}
    this.mediaId = ''

    this.epubData_ = []
    this.oldEpubData_ = []
    this.isEditingEpub_ = false

    this.textToSave_ = []
  }

  /**
   * Function used to register redux functions for epub settings
   * @param {Object} props 
   */
  init(props) {
    const { 
      setEpubData, setIsEditingEpub
    } = props

    this.redux = { 
      setEpubData, setIsEditingEpub
    }
  }

  register(functions={}) {
    this.stateFunc = { ...this.stateFunc, ...functions }
  }
  
  setState(funcName, stateName, value) {
    const setState = this.stateFunc[funcName]
    if (setState) {
      setState(value)
      this[stateName] = value
    }
  }

  /**
   * Function used to set or get epub data
   * @param {Object|Undefined} epubData the epub data to set
   * @returns {Object|Undefined} returns the current epub data if no params is passed in
   */
  epubData(epubData_) {
    if (epubData_ === undefined) return this.epubData_
    const { setEpubData } = this.redux
    if (setEpubData) {
      setEpubData(epubData_)
      this.epubData_ = epubData_
    }
  }

  /**
   * Function used to set or get `isEditingEpub`
   * @param {Boolean|Undefined} isEditingEpub true if reset the chapters
   * @returns {Boolean|Undefined} returns the current `isEditingEpub` if no params is passed in
   */
  isEditingEpub(isEditingEpub_) {
    if (isEditingEpub_ === undefined) return this.isEditingEpub_
    const { setIsEditingEpub } = this.redux
    if (setIsEditingEpub) {
      setIsEditingEpub(isEditingEpub_)
      this.isEditingEpub_ = isEditingEpub_
    }
  }

  /**
   * Functions used for editing chapter
   * ****************************************************************
   */
  parseText(text, editor='') {
    let splittedTexts = _.split(text, EDITOR_TYPE_SPLITTER)
    let content = splittedTexts[0]
    let editorType = splittedTexts[1]

    return { content, editorType }
  }

  markdown2HTML(text) {
    return html.markdown(text)
  } 

  startEditContent(txtEditor, description) {
    let text = description ? this.currChapter.audioDescription : this.currChapter.text
    let { content } = this.parseText(text, txtEditor)
    this.newText = content
  }
  
  newText = ''
  updateText(newText) {
    this.newText = newText
  }

  onSaveText(type) {
    let chapterId = this.currChapter.id
    let chapterIndex = _.findIndex(this.chapters, { id: chapterId })

    if (chapterIndex >= 0) {
      this.newText += EDITOR_TYPE_SPLITTER + type
      this.chapters[chapterIndex].text = this.newText
      this.currChapter.text = this.newText
      this.setChapters([ ...this.chapters ])
      this.setCurrChapter({ ...this.currChapter })
    }
    this.newText = ''
  }

  onSaveAD(type) {
    let chapterId = this.currChapter.id
    let chapterIndex = _.findIndex(this.chapters, { id: chapterId })

    if (chapterIndex >= 0) {
      this.newText += EDITOR_TYPE_SPLITTER + type
      this.chapters[chapterIndex].audioDescription = this.newText
      this.currChapter.audioDescription = this.newText
      this.setChapters([ ...this.chapters ])
      this.setCurrChapter({ ...this.currChapter })
    }
    this.newText = ''
  }

  

  /**
   * Functions used for managing the epub chapters
   * ****************************************************************
   */

  currChapter = {}
  setCurrChapter(currChapter) {
    this.setState('setCurrChapter', 'currChapter', currChapter)
  }

  chapters = []
  setChapters(chapters) {
    this.setState('setChapters', 'chapters', chapters)
  }

  language = ENGLISH
  setLanguage(language) {
    this.setState('setLanguage', 'language', language)
  }

  coverImgs = []
  setCoverImgs(coverImgs) {
    this.setState('setCoverImgs', 'coverImgs', coverImgs)
  }

  magnifiedImg = null
  setMagnifiedImg(magnifiedImg) {
    this.setState('setMagnifiedImg', 'magnifiedImg', magnifiedImg)
  }

  foldedIds = []
  setFoldedIds(foldedIds) {
    this.setState('setFoldedIds', 'foldedIds', foldedIds)
  }

  setupChapters(epubData) {
    let chapters = [{ items: epubData, title: 'Default Chapter', id: epub.genId('epub-ch') }]
    // let chapters_ = _.map(epubData, (data, idx) => ({items: [data], title: 'Untitled Chapter ' + idx, id: epub.genId('epub-ch')}))
    this.setChapters(chapters)
    if (chapters[0]) this.changeChapter(chapters[0])
  }

  ///////////////////////////////////////////////////////////////////////////
  // Generate a chapter based on list of screenshots and transcriptions
  ///////////////////////////////////////////////////////////////////////////
  genChaperFromItems(chapter) {
    const { id, title, image, items, audioDescription="", text } = chapter
    return {
      id: id,
      title: title || 'Untitled Chapter',
      image: image || (items[0] || {}).image,
      items: items,
      audioDescription: audioDescription,
      text: text || _.map(
        _.filter(items, ({ text }) => text !== ''), 
        item => `<p>${_.trim(item.text)}</p>`
      ).join('\n\n')
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // Handle change chapters
  ///////////////////////////////////////////////////////////////////////////
  changeChapter(chapter) {
    this.setCurrChapter(this.genChaperFromItems(chapter))
  }

  ///////////////////////////////////////////////////////////////////////////
  // Handle split chapters
  ///////////////////////////////////////////////////////////////////////////
  untitledNum = 0
  splitChapter(chapterIndex, itemIndex) {
    let chapters = this.chapters
    let items = chapters[chapterIndex].items
    chapters[chapterIndex].items = _.slice(items, 0, itemIndex + 1)
    let newChapter = {}
    newChapter.items = _.slice(items, itemIndex + 1, items.length)
    newChapter.id = epub.genId('epub-ch')
    newChapter.title = 'Untitled Chapter' + (this.untitledNum === 0 ? '' : ' ' + this.untitledNum)
    this.untitledNum += 1

    // Check if the cover of the curr chapter is in the splitted new chapter
    let cover = chapters[chapterIndex].image
    if (cover && _.findIndex(newChapter.items, { image: cover }) >= 0) {
      chapters[chapterIndex].image = undefined
    }

    this.setChapters([
      ..._.slice(chapters, 0, chapterIndex+1),
      newChapter,
      ..._.slice(chapters, chapterIndex+1, chapters.length),
    ])
    this.changeChapter(newChapter)
  }

  undoSplitChapter(chapterIndex) {
    let chapters = this.chapters
    let currItems = chapters[chapterIndex].items
    let prevItems = chapters[chapterIndex - 1].items
    chapters[chapterIndex - 1].items = [ ...prevItems, ...currItems ]
    this.setChapters([
      ..._.slice(chapters, 0, chapterIndex),
      ..._.slice(chapters, chapterIndex+1, chapters.length),
    ])
    this.changeChapter(chapters[chapterIndex - 1])
  }

  undoAllSplit() {
    let defaultChapter = { items: this.epubData(), title: 'Default Chapter', id: this.genId('epub-ch') }
    this.setChapters([ defaultChapter ])
    this.changeChapter(defaultChapter)
    prompt.addOne({
      text: 'Reset to the default chapters.',
      position: 'left bottom',
      timeout: 2000,
    })
  }
  
  splitByScreenshots() {
    let splitChapters = _.map(
      this.epubData(), 
      (data, idx) => ({items: [data], title: 'Untitled Chapter ' + idx, id: this.genId('epub-ch')})
    )
    this.setChapters(splitChapters)
    this.changeChapter(splitChapters[0])
    prompt.addOne({
      text: 'Split the chapters by screenshots.',
      position: 'left bottom',
      timeout: 2000,
    })
  }

  ///////////////////////////////////////////////////////////////////////////
  // handle edit title
  ///////////////////////////////////////////////////////////////////////////
  handleTitleChange(chapterIndex, value) {
    this.chapters[chapterIndex].title = value
    this.setChapters([ ...this.chapters ])
    this.changeChapter(this.chapters[chapterIndex])
  }

  ///////////////////////////////////////////////////////////////////////////
  // handle choosing cover image
  ///////////////////////////////////////////////////////////////////////////
  pickCoverImage() {
    this.setCoverImgs(_.map(this.currChapter.items, item => item.image))
  }

  closeCoverImagePicker() {
    this.setCoverImgs([])
  }

  saveCoverImage(image) {
    let chapterId = this.currChapter.id
    let chapterIndex = _.findIndex(this.chapters, { id: chapterId })
    if (chapterIndex >= 0) {
      this.chapters[chapterIndex].image = image
      this.currChapter.image = image
      this.setChapters([ ...this.chapters ])
      this.setCurrChapter({ ...this.currChapter })
    }
    this.closeCoverImagePicker()
  }

  ///////////////////////////////////////////////////////////////////////////
  // handle fold/unfold a chapter
  ///////////////////////////////////////////////////////////////////////////
  foldChapter(id) {
    this.setFoldedIds([ ...this.foldedIds, id ])
  }

  unfoldChapter(id) {
    _.remove(this.foldedIds, fid => fid === id)
    this.setFoldedIds([ ...this.foldedIds ])
  }

  ///////////////////////////////////////////////////////////////////////////
  // handle language change
  ///////////////////////////////////////////////////////////////////////////
  changeLanguage(lang) {
    this.setLanguage(lang)
    this.setChapters(ARRAY_INIT)
    this.changeEpubLanguage(lang)
  }

  ///////////////////////////////////////////////////////////////////////////
  // handle magnify images
  ///////////////////////////////////////////////////////////////////////////
  magnifyImage(image) {
    this.setMagnifiedImg(image)
  }
  endMagnifyImage() {
    this.setMagnifiedImg(null)
  }

  ///////////////////////////////////////////////////////////////////////////
  // handle save ePub
  ///////////////////////////////////////////////////////////////////////////
  saveChapters = () => {
    this.isEditingEpub(false)
    prompt.addOne({
      text: 'ePub chapters saved.',
      status: 'success',
      position: 'left bottom',
      timeout: 3000,
    })
  }

  cancelEditChapters = () => {
    this.setupChapters(this.epubData())
    this.isEditingEpub(false)
  }


  /**
   * Function used to begin reset epub chapters
   */
  resetEpub() {
    if (this.isEditingEpub()) return

    this.oldEpubData_ = [...this.epubData_]
    this.isEditingEpub(true)
    this.epubData([])
  }

  /**
   * Function used to cancel reset epub chapters
   */
  cancelResetEpub() {
    if (!this.isEditingEpub()) return

    this.epubData(this.oldEpubData_)
    this.isEditingEpub(false)
    this.oldEpubData_ = []
  }

  /**
   * Function used to save new epub chapters
   */
  saveResetEpub() {
    if (!this.isEditingEpub()) return

    this.isEditingEpub(false)
    this.oldEpubData_ = []
  }

  download() {
    let chapters = _.map(this.chapters, chapter => {
      chapter = this.genChaperFromItems(chapter)

      let parsedTxt = this.parseText(chapter.text)
      if (parsedTxt.editorType === EDITOR_MARKDOWN) {
        chapter.text = this.markdown2HTML(parsedTxt.content)
      }

      let parsedAD = this.parseText(chapter.audioDescription)
      if (parsedAD.editorType === EDITOR_MARKDOWN) {
        chapter.audioDescription = this.markdown2HTML(parsedAD.content)
      }

      return chapter
    })

    const epubDownloader = new CTEpubGenerator({ 
      chapters,
      filename: setup.media().mediaName + '.epub', 
      author: 'Test Instructor', 
      language: this.language,
      title: setup.media().mediaName
    })

    epubDownloader.download({
      onError: error => {
        if (error.message === 'Network Error') {
          error.message += ': Failed to download cover images.'
        } else {
          error.message += 'Failed to download the ePub file.'
        }

        prompt.addOne({ 
          text: error.message,
          status: 'error',
          position: 'bottom left'
        })
      }
    })
  }


  /**
   * Functions used to set up epub setting page
   * ****************************************************************
   */
  genId(prefx='auto-id') {
    return `${prefx}-${uuidv4()}`
  }

  parseChapter(epub, index) {
    return {
      ...epub,
      id: `epub-data-${index || Math.random()}`,
      title: epub.title || `Chapter ${index + 1}`,
    }
  }

  parseEpubData(epubData) {
    return _.map(epubData, this.parseChapter)
  }

  async requestEpub(mediaId) {
    try {
      await api.requestEpubCreation(mediaId)
    } catch (error) {
      console.error('Failed to request a epub for ' + mediaId)
    }
  }

  /**
   * Function used to get epub data given mediaId
   * @param {String} mediaId id of the media
   */
  async getEpubData(mediaId, language) {
    try {
      let { data=[] } = await api.getEpubData(mediaId, language)
      return this.parseEpubData(data)
    } catch (error) {
      console.error('Failed to get ePub data of media for ' + mediaId)
      setup.error(NO_EPUB)
    }

    return ARRAY_INIT
  }

  async changeEpubLanguage(language) {
    this.epubData(ARRAY_INIT)
    let epubData = await this.getEpubData(this.mediaId, language)
    this.epubData(epubData)
  }

  /**
   * Function used to set the epub setting page given mediaId
   * @param {String} mediaId id of the media
   */
  async setupEpub(mediaId) {
    this.mediaId = mediaId
    let epubData = await this.getEpubData(mediaId)
    this.epubData(epubData)
  }
}

export const epub = new Epub()