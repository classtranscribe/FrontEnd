import { api } from './http'
import { isMobile } from 'react-device-detect'
import _ from 'lodash'

export const history = {
  // Keys to localStorage
  tempStoredOfferingsKey: 'temp-stored-offerings',
  watchHistoryKey: 'watch-history-new',
  starredOfferingKey: 'starred-offerings-new',
  searchHistoryKey: 'search-history',

  storeOfferings: function(offerings) {
    if (!isMobile) localStorage.setItem(this.tempStoredOfferingsKey, JSON.stringify(offerings))
  },
  getStoredOfferings: function() {
    // this.removeStoredOfferings()
    if (isMobile) return null
    const storedOfferings_str = localStorage.getItem(this.tempStoredOfferingsKey)
    return storedOfferings_str ? JSON.parse(storedOfferings_str) : null
  },
  removeStoredOfferings: function() {
    if (!isMobile) localStorage.removeItem(this.tempStoredOfferingsKey)
  },

  // Functions to set and send histories
  storeUserMetadata: async function({
    setWatchHistory, 
    setWatchHistoryArray, 
    setStarredOfferings, 
    setStarredOfferingsArray
  }) {
    // Get all userMetadata
    var userMetadata = await api.getUserMetaData()
    var { watchHistory, starredOfferings } = userMetadata.data.metadata
    watchHistory = JSON.parse(watchHistory)
    starredOfferings = JSON.parse(starredOfferings)
    // Parse into array
    var watchHistoryArray = [], starredOfferingsArray = []
    if (setWatchHistoryArray) watchHistoryArray = await this.getWatchHistoryArray(watchHistory) 
    if (setStarredOfferingsArray) starredOfferingsArray = this.getStarredOfferingsArray(starredOfferings)
    // Set vars if needed
    if (setWatchHistory) setWatchHistory(watchHistory)
    if (setStarredOfferings) setStarredOfferings(starredOfferings)
    if (setWatchHistoryArray) setWatchHistoryArray(watchHistoryArray)
    if (setStarredOfferingsArray) setStarredOfferingsArray(starredOfferingsArray)
  },

  /**
   * Watch history
   */
  getWatchHistoryArray: async function(watchHistory) {
    var watchHistoryArray = []
    for(var mediaId in watchHistory) {
      var { ratio, offeringId, timeStamp, lastModifiedTime } = watchHistory[mediaId]
      const { data } = await api.getMediaById(mediaId)
      ratio = ratio > 1 ? (ratio > 90 ? 100 : ratio) : Math.ceil(ratio * 100)
      watchHistoryArray.push({ 
        mediaId, offeringId, timeStamp, ratio, 
        lastModifiedTime,
        mediaName: api.parseMedia(data).mediaName
      })
    }
    return _.sortBy(watchHistoryArray, ['lastModifiedTime']).reverse()
  },

  /**
   * Offering Starred
   */
  getStarredOfferingsArray: function(starredOfferings) {
    var starredOfferingsArray = []
    for(var offeringId in starredOfferings) {
      starredOfferingsArray.push( offeringId )
    }
    return starredOfferingsArray
  },

 }