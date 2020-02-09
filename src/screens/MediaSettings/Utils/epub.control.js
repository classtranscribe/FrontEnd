import _ from 'lodash'
import { api, util } from 'utils'

class Epub {
  constructor() {
    this.redux = {}

    this.epubData_ = []
  }

  init(props) {
    const { 
      setEpubData
    } = props

    this.redux = { 
      setEpubData
    }
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
      let { data } = await api.getEpubData(mediaId)
      return data
    } catch (error) {
      console.error('Failed to get ePub data of media ' + mediaId)
    }

    return []
  }

  async setupEpub(mediaId) {
    let epubData = await this.getEpubData(mediaId)
    this.epubData(epubData)
  }
}

export const epub = new Epub()