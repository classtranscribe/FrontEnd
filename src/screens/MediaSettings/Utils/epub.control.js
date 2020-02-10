import _ from 'lodash'
import { api, util } from 'utils'

class Epub {
  constructor() {
    this.redux = {}

    this.epubData_ = []
    this.oldEpubData_ = []
    this.isSettingEpub_ = false
  }

  init(props) {
    const { 
      setEpubData, setIsSettingEpub
    } = props

    this.redux = { 
      setEpubData, setIsSettingEpub
    }
  }

  isSettingEpub(isSettingEpub_) {
    if (isSettingEpub_ === undefined) return this.isSettingEpub_
    const { setIsSettingEpub } = this.redux
    if (setIsSettingEpub) {
      setIsSettingEpub(isSettingEpub_)
      this.isSettingEpub_ = isSettingEpub_
    }
  }

  resetEpub() {
    if (this.isSettingEpub()) return

    this.oldEpubData_ = [...this.epubData_]
    console.log('this.epubData_', this.oldEpubData_)
    this.isSettingEpub(true)
    this.epubData([])
  }

  cancelResetEpub() {
    if (!this.isSettingEpub()) return

    console.log('this.epubData_', this.oldEpubData_)
    this.epubData(this.oldEpubData_)
    this.isSettingEpub(false)
    this.oldEpubData_ = []
  }

  saveResetEpub() {
    if (!this.isSettingEpub()) return

    this.isSettingEpub(false)
    this.oldEpubData_ = []
  }

  epubData(epubData_) {
    if (epubData_ === undefined) return this.epubData_
    const { setEpubData } = this.redux
    if (setEpubData) {
      setEpubData(epubData_)
      this.epubData_ = epubData_
    }
  }

  async getEpubData(mediaId) {
    try {
      let { data=[] } = await api.getEpubData(mediaId)
      return data.map( (chapter, index) => ({ 
        ...chapter,
        title: chapter.title || `Chapter ${index + 1}`,
      }) )
    } catch (error) {
      console.error('Failed to get ePub data of media ' + mediaId)
      // await api.requestEpubCreation(mediaId)
    }

    return []
  }

  async setupEpub(mediaId) {
    let epubData = await this.getEpubData(mediaId)
    this.epubData(epubData)
  }
}

export const epub = new Epub()