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

  enterFullscreen(id) {
    try {
      var elem = document.getElementById(id) || {}
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.webkitEnterFullscreen) { /* Safari IOS Mobile */
        elem.webkitEnterFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      } 
    } catch (error) {
      console.error('Failed to enter fullscreen.')
    }
  }

  exitFullscreen() {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen.')
    }
  }
}

export const setup = new SetupMSP()