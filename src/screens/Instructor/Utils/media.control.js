import _ from 'lodash'

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

  /**
   * Selected videos
   */

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