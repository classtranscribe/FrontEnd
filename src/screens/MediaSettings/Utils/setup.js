import _ from 'lodash'
import { api, util } from 'utils'
import { TAB_DEFAULT } from './constants'

class SetupMSP {
  constructor() {
    this.redux = {}

    this.tab_ = TAB_DEFAULT
    this.media_ = api.parseMedia()
  }

  init(props) {
    const { 
      setTab, setMedia, 
      history, location 
    } = props

    this.redux = { 
      setTab, setMedia, 
      history, location 
    }
  }

  tab(tab_) {
    if (tab_ === undefined) return this.tab_
    const { setTab, location } = this.redux
    if (setTab) {
      setTab(tab_)
      this.tab_ = tab_
      window.history.replaceState(
        {}, document.title, location.pathname + `#tab=${tab_}`
      )
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

  async setupMedia(mediaId, tab) {
    // console.log('mediaId', mediaId, tab)
    util.links.title('Media Settings')
    this.tab(tab || TAB_DEFAULT)

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