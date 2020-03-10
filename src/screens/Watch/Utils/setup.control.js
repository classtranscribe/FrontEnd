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
      setMedia, setPlaylist, setPlaylists, 
      setWatchHistory, setStarredOfferings, 
      location, history, changeVideo,
    } = props

    this.externalFunctions = { 
      setMedia, setPlaylist, setPlaylists, 
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

  changeVideo: function(media, playlist, playlists) {
    const { history } = this.externalFunctions
    const { courseNumber } = util.parseSearchQuery()

    if (!playlists) playlists = this.playlists()
    if (!playlist) playlist = _.find(playlists, { id: media.playlistId })

    history.push(
      util.links.watch(courseNumber, media.id), 
      { media, playlist, playlists }
    )
  },

  findNeighbors: function(mediaId, playlists) {
    if (!mediaId) mediaId = this.media().id
    if (!playlists) playlists = this.playlists()

    let playlistResults = _.map( 
      playlists, 
      pl => _.map(
        (pl.medias.slice() || []).reverse(), 
        me => ({ ...me, playlistId: pl.id})
      ) 
    )
    playlistResults = _.flatten(playlistResults)
  
    let currIdx = _.findIndex(playlistResults, { id: mediaId })
    let nextIdx = currIdx + 1
    let prevIdx = currIdx - 1
    let next = playlistResults[nextIdx] || null
    let prev = playlistResults[prevIdx] || null
    return { next, prev }
  },



  /**
   * Funcitons for setup watch page
   * ************************************************************************
   */
  getMedia: async function() {
    const { id } = util.parseSearchQuery()

    // if the playlists exist
    if (this.playlists().length > 0) { 
      let media = _.find(
        _.flatten(
          _.map(this.playlists(), pl => pl.medias)
        ),
        { id }
      )
      if (media) return api.parseMedia(media)
    }

    try {
      let { data } = await api.getMediaById(id)
      return api.parseMedia(data)
    } catch (error) {
      return null
    }
  },

  getPlaylist: async function(playlistId) {
    // if the playlists exist
    if (this.playlists().length > 0) { 
      let playlist = _.find(this.playlists(), { id: playlistId })
      if (playlist) return playlist
    }

    let { state } = this.externalFunctions.location
    if (state && state.playlist) return state.playlist

    try {
      const { data } = await api.getPlaylistById(playlistId)
      return data
    } catch (error) {
      return null
    }
  },

  getPlaylists: async function(offeringId) {
    // if the playlists exist
    if (this.playlists().length > 0) return null 

    let { state } = this.externalFunctions.location
    if (state && state.playlists) return state.playlists

    try {
      const { data } = await api.getPlaylistsByOfferingId(offeringId)
      return data 
    } catch (error) {
      return null
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
  setupMedias: async function(props, context) {
    this.checkForReset()
    const { generalError } = context
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
      promptControl.error('playlists')
      api.contentLoaded()
      return
    }

    // Get playlists
    let { offeringId } = playlist
    let playlists = await this.getPlaylists(offeringId)

    // set user metadata
    // await this.getUserMetadata()

    // Set data
    this.media(media)
    this.playlist(playlist)
    if (playlists) this.playlists(playlists)

    // Initialize user action handler
    let mediaId = media.id
    userAction.init({ offeringId, mediaId })

    api.contentLoaded()
  }
}