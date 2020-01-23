import _ from 'lodash'
import { api } from 'utils'
import { setup } from './setup.control'
import { LOADING_D } from './constants'

export const mediaControl = {
  externalFunctions: {},
  isSelectingVideos: false,
  selectedVideos: {},
  selectedVideosLength: function(selectedVideos) {
    if ( !selectedVideos ) selectedVideos = this.selectedVideos
    return Object.keys(selectedVideos).length
  },

  /**
   * @param {Function} 
   * setIsSelectingVideos, setSelectedVideos
   */
  init: function(props) {
    const { setIsSelectingVideos, setSelectedVideos } = props
    this.externalFunctions = { setIsSelectingVideos, setSelectedVideos }
  },

  /**
   * Functions for editing videos
   * ************************************************************************
   */
  deleteMedia: async function(media, bulkDelete=false) {
    if (!bulkDelete) setup.loading(LOADING_D)
    try {
      await api.deleteMedia(media.id)
      let playlist = setup.playlist()
      _.remove(playlist.medias, me => me === media)
      if (!bulkDelete) setup.playlist({ ...playlist })
    } catch (error) {
      console.error('Failed to delete media')
    }
    if (!bulkDelete) setup.unloading()
  },

  renameMedia: async function(media, type, newName) {
    console.log(media)
    if (type === 2) {
      media.jsonMetadata.filename = newName
    } else {
      media.jsonMetadata.title = newName
    }
    
    try {
      await api.updateMediaMetadata(media.id, media.jsonMetadata)
    } catch (error) {
      console.error('Failed to rename media')
    }
  },

  /**
   * Functions for uploading videos
   * ************************************************************************
   */
  upload: async function(playlistId, { video1, video2 }, onUploadProgress) {
    try {
      const { data } = await api.uploadVideo(playlistId, video1, video2, onUploadProgress)
      let newMedia = {
        id: data.id,
        playlistId: data.playlistId,
        sourceType: data.sourceType,
        jsonMetadata: data.jsonMetadata,
        video: [],
        transcriptions: []
      }
      let playlist = setup.playlist()
      playlist.medias.push(newMedia)
    } catch (error) {
      console.error('Failed to upload media')
    }
    // setup.playlist({ ...playlist })
  },


  /**
   * Functions for selecting videos
   * ************************************************************************
   */

  openSelect: function() {
    const { setIsSelectingVideos } = this.externalFunctions
    this.isSelectingVideos = true
    setIsSelectingVideos(true)
  },

  closeSelect: function() {
    const { setIsSelectingVideos } = this.externalFunctions
    if (Boolean(setIsSelectingVideos)) {
      this.isSelectingVideos = false
      setIsSelectingVideos(false)
      this.setSelectedVideos({})
    }
  },

  handleOpenSelect: function(bool) {
    if ( !this.isSelectingVideos ) {
      this.openSelect()
    } else {
      this.closeSelect()
    }
  },

  setSelectedVideos: function(videos) {
    const { setSelectedVideos } = this.externalFunctions
    if (Boolean(setSelectedVideos)) {
      setSelectedVideos(videos)
      this.selectedVideos = videos
    }
  },

  handleSelect: function(me) {
    this.setSelectedVideos({ ...this.selectedVideos, [me.id]: me })
  },

  handleRemove: function(me) {
    if (Boolean(this.selectedVideos[me.id])) {
      delete this.selectedVideos[me.id]
      this.setSelectedVideos({ ...this.selectedVideos })
    }
  },

  isSelected: function({ id }) {
    return Boolean(this.selectedVideos[id])
  },

  isSelectedAll: function(results, selectedVideos) {
    return results.length === this.selectedVideosLength(selectedVideos)
  },

  selectAll: function(results) {
    if (this.isSelectedAll(results)) {
      this.setSelectedVideos({})
    } else {
      let selectedVideos = {}
      _.forEach(results, re => {
        selectedVideos[re.id] = re
      })
      this.setSelectedVideos({ ...selectedVideos })
    }
  },

  handleDeleteVideos: async function() {
    console.log('??????????', this.selectedVideos);
    setup.loading(LOADING_D)
    let selectedVideos = this.selectedVideos
    for (let mediaId in selectedVideos) {
      await this.deleteMedia(selectedVideos[mediaId], true)
    }
    let playlist = setup.playlist()
    setup.playlist({ ...playlist })
    setup.unloading()
  },

}