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

  async setupMedia(mediaId, tab) {
    console.log('mediaId', mediaId, tab)
    util.links.title('Media Settings')
    this.tab(tab || TAB_DEFAULT)
    api.contentLoaded()
  }
}

export const setup = new SetupMSP()