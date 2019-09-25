import { api } from './http'

export const history = {
  watchHistoryKey: 'watch-history-new',
  starredOfferingKey: 'starred-offerings-new',
  /**
   * Watch history
   */
  getWatchHistory: function() {
    const watchHistory_str = localStorage.getItem(this.watchHistoryKey)
    if (!watchHistory_str) return {}
    return JSON.parse(watchHistory_str)
  },
  getWatchHistoryArray: function() {
    var watchHistory = this.getWatchHistory()
    var watchHistoryArray = []
    for(var mediaId in watchHistory) {
      const { ratio, offeringId, timeStamp, lastModifiedTime } = watchHistory[mediaId]
      watchHistoryArray.push({ mediaId, offeringId, timeStamp, ratio: Math.ceil(ratio * 100), lastModifiedTime })
    }
    watchHistoryArray = watchHistoryArray.sort((media1, media2) => media1.lastModifiedTime < media2.lastModifiedTime ? 1 : media1.lastModifiedTime > media2.lastModifiedTime ? -1 : 0)
    if (watchHistoryArray.length > 12) {
      for (var i = 12; i < watchHistoryArray.length; i++) {
        delete watchHistory[watchHistoryArray[i].mediaId]
      } 
      localStorage.setItem(this.watchHistoryKey, JSON.stringify(watchHistory))
    }
    return watchHistoryArray.slice(0, 12)
  },
  saveVideoTime: function(mediaId='', timeStamp=0, ratio=0, offeringId='') {
    var watchHistory = this.getWatchHistory()
    watchHistory[mediaId] = { ratio, offeringId, timeStamp, lastModifiedTime: new Date() }
    localStorage.setItem(this.watchHistoryKey, JSON.stringify(watchHistory))
  },
  getStoredMediaInfo: function(mediaId='') {
    const watchHistory = this.getWatchHistory()
    const re = watchHistory[mediaId] || {ratio: 0}
    return { ...re, ratio: Math.ceil(re.ratio * 100) }
  },
  removeStoredMediaInfo: function(mediaId='') {
    const watchHistory = this.getWatchHistory()
    console.log(watchHistory[mediaId] )
    delete watchHistory[mediaId] 
    localStorage.setItem(this.watchHistoryKey, JSON.stringify(watchHistory))
  },
  restoreVideoTime: function(mediaId='') {
    const watchHistory = this.getWatchHistory()
    return watchHistory[mediaId] ? parseFloat( watchHistory[mediaId].timeStamp) : null
  },
  completeWatchHistoryArray: async function(setWatchHistory) {
    var watchHistory = this.getWatchHistoryArray()
    for (let i = 0; i < watchHistory.length; i++) {
      const { mediaId } = watchHistory[i]
      const { data } = await api.getMediaById(mediaId)
      watchHistory[i].mediaName = api.parseMedia(data).mediaName
    }
    setWatchHistory(watchHistory)
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
      starredOfferingsArray.push( offeringId )
    }
    return starredOfferingsArray
  },
  starOffering: function(offeringId) {
    var starredOfferings = this.getStarredOfferings()
    starredOfferings[offeringId] = 'starred'
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
  },
 }