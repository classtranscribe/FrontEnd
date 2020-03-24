import _ from 'lodash'
import { api, util } from '../../../utils'
// import { } from './constants'

class SetupMSP {
  constructor() {
    this.redux = {}
    this.media_ = api.parseMedia()
  }

  init(props) {
    const { 
      setMedia, 
      history, location 
    } = props

    this.redux = { 
      setMedia, 
      history, location 
    }
  }

  media(media_) {
    if (media_ === undefined) return this.media_
    const { setMedia } = this.redux
    if (setMedia) {
      setMedia(media_)
      this.media_ = media_
    }
  }

  async getMedia(mediaId) {
    try {
      let { data } = await api.getMediaById(mediaId)
      return api.parseMedia(data)
    } catch (error) {
      return api.parseMedia()
    }
  }

  async setupMedia(mediaId) {
    // console.log('mediaId', mediaId)
    util.links.title('Media Settings')

    let media = await this.getMedia(mediaId)
    if (!media.id) {
      // @TODO prompt
      return
    }

    this.media(media)
    api.contentLoaded()
  }
}

export const setup = new SetupMSP()