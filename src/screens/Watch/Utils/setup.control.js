import _ from 'lodash'
import { api, util, userAction } from '../../../utils'
import { transControl } from './trans.control'
import { videoControl } from './player.control'
import { menuControl } from './menu.control'
import { promptControl } from './prompt.control'

export const setup = {
  media_: api.parseMedia(),
  playlist_: {},
  playlists_: {},
  externalFunctions : {},
  init: function(props) {
    const { 
      setMedia, setPlaylist, setPlaylists, setOffering,
      setWatchHistory, setStarredOfferings, 
      location, history, changeVideo,
    } = props

    this.externalFunctions = { 
      setMedia, setPlaylist, setPlaylists, setOffering,
      setWatchHistory, setStarredOfferings, 
      location, history, changeVideo
    }
  },

  /**
   * Functions for setting data
   * ************************************************************************
   */

  media: function(media_) {
    if (media_ === undefined) return this.media_

    const { setMedia } = this.externalFunctions
    if (setMedia) {
      setMedia(media_)
      this.media_ = media_
    }
  },

  playlist: function(playlist_) {
    if (playlist_ === undefined) return this.playlist_

    const { setPlaylist } = this.externalFunctions
    if (setPlaylist) {
      setPlaylist(playlist_)
      this.playlist_ = playlist_
    }
  },

  playlists: function(playlists_) {
    if (playlists_ === undefined) return this.playlists_

    const { setPlaylists } = this.externalFunctions
    if (setPlaylists) {
      setPlaylists(playlists_)
      this.playlists_ = playlists_
    }
  },

  offering: function(offering_) {
    if (offering_ === undefined) return this.offering_

    const { setOffering } = this.externalFunctions
    if (setOffering) {
      setOffering(offering_)
      this.offering_ = offering_
    }
  },

  /**
   * Helper functions
   * ************************************************************************
   */
  clear: function(media) {
    const { changeVideo } = this.externalFunctions
    if (changeVideo) changeVideo({})
    userAction.changevideo(videoControl.currTime(), media.id)
    videoControl.clear()
    transControl.clear()
    menuControl.clear()
  },

  changeVideo: function(media, playlist) {
    const { history } = this.externalFunctions
    if (!playlist) playlist = this.playlist()
    history.push(util.links.watch(media.id))
  },

  findNeighbors: function(mediaId, playlist) {
    if (!mediaId) mediaId = this.media().id
    if (!playlist) playlist = this.playlist()
    let { medias } = playlist
    if (!medias) return {}
    // medias = (medias || []).slice().reverse()
    let currIdx = _.findIndex(medias, { id: mediaId })
    let nextIdx = currIdx + 1
    let prevIdx = currIdx - 1
    let next = medias[nextIdx] || null
    let prev = medias[prevIdx] || null
    return { next, prev }
  },



  /**
   * Funcitons for setup watch page
   * ************************************************************************
   */
  getMedia: async function() {
    const { id } = util.parseSearchQuery()

    try {
      let { data } = await api.getMediaById(id)
      return api.parseMedia(data)
    } catch (error) {
      return null
    }
  },

  getPlaylist: async function(playlistId) {

    // let { state } = this.externalFunctions.location
    // if (state && state.playlist) return state.playlist

    try {
      const { data } = await api.getPlaylistById(playlistId)
      // _.reverse(data.medias || [])
      return data
    } catch (error) {
      return null
    }
  },

  getPlaylists: async function(offeringId) {
    // // if the playlists exist
    // if (this.playlists().length > 0) return null 

    // let { state } = this.externalFunctions.location
    // if (state && state.playlists) return state.playlists

    try {
      const { data } = await api.getPlaylistsByOfferingId(offeringId)
      return data 
    } catch (error) {
      return []
    }
  },

  getOffering: async function(offeringId) {
    // let { state } = this.externalFunctions.location
    // if (state && state.offering) return state.offering
    
    try {
      const { data } = await api.getOfferingById(offeringId)
      return data
    } catch (error) {
      return {}
    }
  },

  getUserMetadata: async function() {
    const { setWatchHistory, setStarredOfferings } = this.externalFunctions
    // api.storeUserMetadata({
    //   setWatchHistory,
    //   setStarredOfferings
    // })
  },

  /**
   * Function used to check whether to reset existing data
   */
  checkForReset: function() {
    const { courseNumber } = util.parseSearchQuery()
    if (courseNumber !== this.courseNumber) {
      this.media_ = api.parseMedia()
      this.playlist_ = {}
      this.playlists_ = []
    }
    this.courseNumber = courseNumber
  },

  /** 
   * Function for getting media, playlist, and playlists
   */
  setupMedias: async function() {
    this.checkForReset()
    // Get media
    let media = await this.getMedia()
    if (!media) {
      promptControl.error()
      api.contentLoaded()
      return
    }

    // reset data 
    this.clear(media)

    // Set transcriptions
    let { transcriptions } = media
    transControl.transcriptions(transcriptions)

    // Get Playlist
    let { playlistId } = media
    let playlist = await this.getPlaylist(playlistId)

    if (!playlist) {
      promptControl.error('playlist')
      api.contentLoaded()
      return
    }

    // set user metadata
    // await this.getUserMetadata()

    // Set data
    this.media(media)
    this.playlist(playlist)

    let { offeringId } = playlist

    // Get offering
    let offering = await this.getOffering(offeringId)
    offering = api.parseSingleOffering(offering)
    this.offering(offering)

    api.contentLoaded()

    // Get playlists
    let playlists = await this.getPlaylists(offeringId)
    if (playlists) this.playlists(playlists)

    // Initialize user action handler
    let mediaId = media.id
    userAction.init({ offeringId, mediaId })
  }
}