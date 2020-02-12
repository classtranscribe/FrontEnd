import _ from 'lodash'
import { api } from '../../../utils'

class SetupMSP {
  constructor() {}

  init(props) {

  }

  async setupMedia(mediaId, tab) {
    console.log('mediaId', mediaId, tab)
    api.contentLoaded()
  }
}

export const setup = new SetupMSP()