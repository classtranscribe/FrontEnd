import _ from 'lodash'
import { util, api } from '../../../utils'
import { setup } from './setup.control'
import { promptControl } from './prompt.control'

const echo360Prefix = 'https://echo360.org/section/'
const boxPrefix = 'https://uofi.app.box.com/folder/'

// const initPlaylist = {
//   name: '',
//   offeringId: '',
//   sourceType: 2,
//   playlistIdentifier: ''
// }

export const plControl = {
  externalFunctions: {},
  // playlist_: initPlaylist,

  init: function(props) {
    const { setPlaylists, setPlaylist } = props
    this.externalFunctions = { setPlaylists, setPlaylist }
  },

  // playlistSet: function(key, value) {
  //   if (value === undefined) {
  //     return _.get(this.playlist_, key)
  //   }
  //   _.set(this.playlist_, key, value)
  // },

  // name: function(val) {
  //   this.playlistSet('name', val)
  // },
  // offeringId: function(val) {
  //   this.playlistSet('offeringId', val)
  // },
  // sourceType: function(val) {
  //   this.playlistSet('sourceType', val)
  // },
  // indentifier: function(val) {
  //   this.playlistSet('playlistIdentifier', val)
  // },

  createPlaylist: async function(playlist) {
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

  renamePlaylist: async function(playlist, newName) {
    // setup.loading()
    promptControl.saving()

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

  deletePlaylist: async function(playlist) {
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

  /**
   * Helpers
   */
  isValidIdURL: function(sourceType, url='') {
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