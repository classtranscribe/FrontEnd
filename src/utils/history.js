export const history = {
  watchHistoryKey: 'watch-history',
  starredOfferingKey: 'starred-offerings',
  /**
   * Watch history
   */
  getWatchHistory: function() {
    const watchHistory_str = localStorage.getItem(this.watchHistoryKey)
    if (!watchHistory_str) return {}
    return JSON.parse(watchHistory_str)
  },
  getStarredOfferingsArray: function() {
    var watchHistory = this.getWatchHistory()
    var watchHistoryArray = []
    for(var mediaId in watchHistory) {
      const { ratio, timestamp } = watchHistory[mediaId]
      watchHistoryArray.push({ mediaId, ratio, timestamp  })
    }
    return watchHistoryArray
  },
  saveVideoTime: function(mediaId='', timestamp=0, ratio=0) {
    var watchHistory = this.getWatchHistory()
    watchHistory[mediaId] = { timestamp, ratio }
    localStorage.setItem(this.watchHistoryKey, JSON.stringify(watchHistory))
  },
  restoreVideoTime: function(mediaId='') {
    const watchHistory = this.getWatchHistory()
    return parseFloat(watchHistory[mediaId] ? watchHistory[mediaId].timestamp : null)
  },

  /**
   * Offering Starred
   * @TODO add an array of starred courses
   */
  getStarredOfferings: function() {
    const starredOfferings_str = localStorage.getItem(this.starredOfferingKey)
    if (!starredOfferings_str) return {}
    return JSON.parse(starredOfferings_str)
  },
  getStarredOfferingsArray: function() {
    var starredOfferings = this.getStarredOfferings()
    var starredOfferingsArray = []
    for(var offeringId in starredOfferings) {
      starredOfferingsArray.push(starredOfferings[offeringId])
    }
    return starredOfferingsArray
  },
  starOffering: function(fullCourse) {
    const { id } = fullCourse
    var starredOfferings = this.getStarredOfferings()
    starredOfferings[id] = fullCourse
    localStorage.setItem(this.starredOfferingKey, JSON.stringify(starredOfferings))
  },
  unstarOffering: function(offeringId='') {
    var starredOfferings = this.getStarredOfferings()
    if (starredOfferings[offeringId]) {
      delete starredOfferings[offeringId]
    }
    localStorage.setItem(this.starredOfferingKey, JSON.stringify(starredOfferings))
  },
  isOfferingStarred: function(offeringId='') {
    var starredOfferings = this.getStarredOfferings()
    return Boolean(starredOfferings[offeringId])
  }
}