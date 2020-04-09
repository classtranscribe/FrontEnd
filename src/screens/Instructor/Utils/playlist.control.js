import _ from 'lodash'
import { util, api, prompt } from '../../../utils'
import { setup } from './setup.control'
import { promptControl } from './prompt.control'

const YOUTUBE_PREFIX = 'https://www.youtube.com/playlist'
const ECHO360_PREFIX = 'https://echo360.org/section/'
const BOX_PREFIX = 'https://uofi.app.box.com/folder/'

export const plControl = {
  externalFunctions: {},

  init(props) {
    const { setPlaylists, setPlaylist } = props
    this.externalFunctions = { setPlaylists, setPlaylist }
  },

  getPlaylistSourceURL({ sourceType, playlistIdentifier }) {
    let source = ''
    if (!playlistIdentifier) return source

    if (sourceType === 1) { // YouTube
      source = YOUTUBE_PREFIX + util.links.createSearch({ list: playlistIdentifier })
    } else if (sourceType === 3) { // Kaltura

    } else if (sourceType === 4) { // Box
      source = BOX_PREFIX + playlistIdentifier
    } else if (sourceType === 0) { // echo
      source = ECHO360_PREFIX + playlistIdentifier + '/public'
    }

    return source
  },

  async createPlaylist(playlist) {
    setup.loading()
    let { offeringId, name, sourceType, playlistIdentifier } = playlist

    // Check validity
    if (!offeringId || !name) return;
    if (!this.isValidIdURL(sourceType, playlistIdentifier)) return;

    // extract playlistIdentifier
    if (sourceType === 1) { // YouTube
      let { list } = util.links.useSearch(playlistIdentifier)
      playlistIdentifier = list
    } else if (sourceType === 3) { // Kaltura
      let items = playlistIdentifier.split('/')
      playlistIdentifier = items[items.length-1] // the last one is the channel id
    } else if (sourceType === 4) { // Box
      playlistIdentifier = playlistIdentifier.split('/folder/')[1] // the 2nd one is the channel id
    } 

    let newPl = { offeringId, name, sourceType, playlistIdentifier }
    // console.log('newPl', newPl)
    try {
      let { data } = await api.createPlaylist(newPl)
      newPl = data
    } catch (error) {
      setup.unloading()
      promptControl.failedToSave('playlist')
      return
    }

    newPl.medias = []
    newPl.isNew = true
    setup.playlists([ ...setup.playlists(), newPl ])
    setup.changePlaylist(newPl, true)

    setup.unloading()
    promptControl.saved('playlist', 'created')
  },

  async renamePlaylist(playlist, newName) {
    try {
      playlist.name = newName
      await api.updatePlaylist(playlist)
      setup.playlist(playlist, 0)
      promptControl.updated('Playlist name')
    } catch (error) {
      promptControl.failedToUpdate('playlist name')
      console.error(`failed to rename playlist ${playlist.id}`)
    }

    // setup.unloading()
  },

  async deletePlaylist(playlist) {
    try {
      await api.deletePlaylist(playlist.id)
      let playlists = setup.playlists()
      _.remove(playlists, pl => pl.id === playlist.id)
      setup.playlists([ ...playlists ])
      promptControl.deleted('Playlist')
    } catch (error) {
      promptControl.failedToDelete('playlist')
      console.error(`failed to delete playlist ${playlist.id}`)
    }
  },

  async reorderMedias(results) {
    try {
      let mediaIds = _.map(results, ({ id }) => id)
      await api.reorderMedias(setup.playlist().id, mediaIds)
      setup.playlist({ ...setup.playlist(), medias: results })
      prompt.addOne({ text: 'Videos reordered.', timeout: 3000 })
    } catch (error) {
      prompt.addOne({ text: 'Failed to reorder videos.', timeout: 5000 })
    }
  },

  /**
   * Helpers
   */
  isValidIdURL(sourceType, url='') {
    if (sourceType === 2) return true
    if (!url) return false

    if (sourceType === 0) { // Echo360
      let reg = /https:\/\/echo360.org\/section\/[\s\S]*\/public/
      return reg.test(url)

    } else if (sourceType === 1) { // YouTube
      let { list } = util.links.useSearch(url)
      return Boolean(list)

    } else if (sourceType === 3) { // Kaltura/MediaSpace
      let reg = /https:\/\/mediaspace.illinois.edu\/channel\/[\s\S]*\/[0-9]{1}/
      return reg.test(url)

    } else if (sourceType === 4) { // Box
      let reg = /https:\/\/[\s\S]*box.com[\s\S]*\/folder\/[0-9]{1}/
      return reg.test(url)
    } 

    return false
  }
}