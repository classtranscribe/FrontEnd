import _ from 'lodash'
import { api, util, user } from '../../../utils'
// import { } from './constants'

class SetupMSP {
  constructor() {
    this.redux = {}
    this.media_ = api.parseMedia()
    this.error_ = null
  }

  init(props) {
    const { 
      setMedia, setError,
      history, location 
    } = props

    this.redux = { 
      setMedia, setError,
      history, location 
    }
  }

  verifyUser() {
    if (!user.isAdmin()) {
      window.location = util.links.notfound404()
    }
  }

  error(error_) {
    if (error_ === undefined) return this.error_
    const { setError } = this.redux
    if (setError) {
      setError(error_)
      this.error_ = error_
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
    this.error(null)

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