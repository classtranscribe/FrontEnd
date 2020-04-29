import _ from 'lodash'
import { api, util, user } from '../../../utils'
// import { } from './constants'

class SetupMSP {
  constructor() {
    this.redux = {}
    this.media_ = api.parseMedia()
    this.playlist_ = {}
    this.error_ = null
  }

  init(props) {
    const { 
      setMedia, setPlaylist, setError,
      history, location 
    } = props

    this.redux = { 
      setMedia, setPlaylist, setError,
      history, location 
    }
  }

  verifyUser() {
    if (!user.isAdmin) {
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

  playlist(playlist_) {
    if (playlist_ === undefined) return this.playlist_
    const { setPlaylist } = this.redux
    if (setPlaylist) {
      setPlaylist(playlist_)
      this.playlist_ = playlist_
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

  async getPlaylist(playlistId) {
    try {
      let { data } = await api.getPlaylistById(playlistId)
      return data
    } catch (error) {
      return {}
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

    let { playlistId } = media
    if (playlistId) {
      let playlist = await this.getPlaylist(playlistId)
      this.playlist(playlist)
    }
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