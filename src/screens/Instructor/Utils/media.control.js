import _ from 'lodash'
import { api } from 'utils'

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
  deleteMedia: async function(media) {

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
      
    }
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

  handleDeleteVideos: function() {

  },

}