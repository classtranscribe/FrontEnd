import _ from 'lodash'
import { api, util } from '../../../utils'
import { TEXT_SEP, textSepRegex } from './constants'

class Epub {
  constructor() {
    this.redux = {}

    this.epubData_ = []
    this.oldEpubData_ = []
    this.isSettingEpub_ = false

    this.textsToSave_ = []
  }

  /**
   * Function used to register redux functions for epub settings
   * @param {Object} props 
   */
  init(props) {
    const { 
      setEpubData, setIsSettingEpub
    } = props

    this.redux = { 
      setEpubData, setIsSettingEpub
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
   * Function used to set or get `isSettingEpub`
   * @param {Boolean|Undefined} isSettingEpub true if reset the chapters
   * @returns {Boolean|Undefined} returns the current `isSettingEpub` if no params is passed in
   */
  isSettingEpub(isSettingEpub_) {
    if (isSettingEpub_ === undefined) return this.isSettingEpub_
    const { setIsSettingEpub } = this.redux
    if (setIsSettingEpub) {
      setIsSettingEpub(isSettingEpub_)
      this.isSettingEpub_ = isSettingEpub_
    }
  }

  /**
   * Functions used for edit chapters
   * ****************************************************************
   */

  texts(texts_) {
    if (texts_ === undefined) return this.textsToSave_
    this.textsToSave_ = texts_
  }
  textsCopy() {
    return this.textsToSave_.map(txt => ({ ...txt }))
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
      epubdata[index].text = this.texts().map(t => t.text).join(TEXT_SEP)
      this.epubData([ ...epubdata ])
    }
  }

  cancelTextEdit() {
    this.epubData([ ...this.epubData() ])
  }

  /**
   * Functions used for handling chapter combining
   * ****************************************************************
   */
  combine(priChapter, secChapter) {
    priChapter.text += TEXT_SEP + secChapter.text
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
    if (this.isSettingEpub()) return

    this.oldEpubData_ = [...this.epubData_]
    // console.log('this.epubData_', this.oldEpubData_)
    this.isSettingEpub(true)
    this.epubData([])
  }

  /**
   * Function used to cancel reset epub chapters
   */
  cancelResetEpub() {
    if (!this.isSettingEpub()) return

    // console.log('this.epubData_', this.oldEpubData_)
    this.epubData(this.oldEpubData_)
    this.isSettingEpub(false)
    this.oldEpubData_ = []
  }

  /**
   * Function used to save new epub chapters
   */
  saveResetEpub() {
    if (!this.isSettingEpub()) return

    this.isSettingEpub(false)
    this.oldEpubData_ = []
  }


  /**
   * Functions used to set up epub setting page
   * ****************************************************************
   */
  genId(prefx='auto-id') {
    return `${prefx}-${Math.random()}`
  }

  formatText(text='') {
    return _.replace(text, textSepRegex, ' ')
  }

  splitText(text='') {
    return text.split(TEXT_SEP).map((t, i) => ({ text: t, id: 'msp-e-v-text-'+i }))
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
  async getEpubData(mediaId) {
    try {
      let { data=[] } = await api.getEpubData(mediaId)
      return this.parseEpubData(data)
    } catch (error) {
      console.error('Failed to get ePub data of media ' + mediaId)
      // await api.requestEpubCreation(mediaId)
    }

    return []
  }

  /**
   * Function used to set the epub setting page given mediaId
   * @param {String} mediaId id of the media
   */
  async setupEpub(mediaId) {
    let epubData = await this.getEpubData(mediaId)
    this.epubData(epubData)
  }
}

export const epub = new Epub()