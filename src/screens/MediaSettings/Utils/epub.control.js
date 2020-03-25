import _ from 'lodash'
import { api, util, ARRAY_INIT } from '../../../utils'
import { } from './constants'

class Epub {
  constructor() {
    this.redux = {}
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
   * Functions used for edit chapters
   * ****************************************************************
   */

  text(text_) {
    if (text_ === undefined) return this.textToSave_
    this.textToSave_ = text_
  }
  /**
   * Function used to save new text of a chapter
   * @param {Integer} index 
   * @param {Array.Integer} texts 
   */
  saveTextEdit(id, title='') {
    let epubdata = this.epubData()
    let index = _.findIndex(epubdata, { id })
    if (index >= 0) {
      epubdata[index].title = title
      epubdata[index].text = this.textToSave_
      this.epubData([ ...epubdata ])
    }
  }

  cancelTextEdit() {
    this.textToSave_ = ''
    this.epubData([ ...this.epubData() ])
  }

  /**
   * Functions used for handling chapter combining
   * ****************************************************************
   */
  combine(priChapter, secChapter) {
    // priChapter.text += TEXT_SEP + secChapter.text
    // _.findIndex(this.epubData(), priChapter)
    // @TODO
    // add currChapter as a redux state
  }

  /**
   * Functions used for re-setting the epub chapters
   * ****************************************************************
   */

  /**
   * Function used to begin reset epub chapters
   */
  resetEpub() {
    if (this.isEditingEpub()) return

    this.oldEpubData_ = [...this.epubData_]
    // console.log('this.epubData_', this.oldEpubData_)
    this.isEditingEpub(true)
    this.epubData([])
  }

  /**
   * Function used to cancel reset epub chapters
   */
  cancelResetEpub() {
    if (!this.isEditingEpub()) return

    // console.log('this.epubData_', this.oldEpubData_)
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


  /**
   * Functions used to set up epub setting page
   * ****************************************************************
   */
  genId(prefx='auto-id') {
    return `${prefx}-${Math.random()}`
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

  /**
   * Function used to get epub data given mediaId
   * @param {String} mediaId id of the media
   */
  async getEpubData(mediaId, language) {
    try {
      let { data=[] } = await api.getEpubData(mediaId, language)
      return this.parseEpubData(data)
    } catch (error) {
      console.error('Failed to get ePub data of media ' + mediaId)
      // await api.requestEpubCreation(mediaId)
    }

    return []
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
    this.isEditingEpub(true)
  }
}

export const epub = new Epub()