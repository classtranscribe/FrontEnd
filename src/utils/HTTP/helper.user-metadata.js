import { api } from './index'
import _ from 'lodash'

export const userMetadataHelper = {
  storeUserMetadata: async function({
    setWatchHistory, 
    setWatchHistoryArray, 
    setStarredOfferings, 
    setStarredOfferingsArray
  }) {
    // Get all userMetadata
    try {
      var userMetadata = await api.getUserMetaData()
      var { watchHistory=JSON.stringify({}), starredOfferings=JSON.stringify({}) } = userMetadata.data.metadata || {}

      watchHistory = JSON.parse(watchHistory)
      starredOfferings = JSON.parse(starredOfferings)
      // Parse into array
      var watchHistoryArray = [], starredOfferingsArray = []
      if (setWatchHistoryArray) {
        watchHistoryArray = await this.getWatchHistoryArray(watchHistory)
      }
      if (setStarredOfferingsArray) starredOfferingsArray = this.getStarredOfferingsArray(starredOfferings)
      
      // console.log('starredOfferings', starredOfferings)
      // console.log('starredOfferingsArray', starredOfferingsArray)

      // console.log('watchHistory', watchHistory)
      // console.log('watchHistoryArray', watchHistoryArray)

      // Set vars if needed
      if (setWatchHistory) setWatchHistory(watchHistory || {})
      if (setStarredOfferings) setStarredOfferings(starredOfferings || {})
      if (setWatchHistoryArray) setWatchHistoryArray(watchHistoryArray)
      if (setStarredOfferingsArray) setStarredOfferingsArray(starredOfferingsArray)
    } catch (error) {
      console.error("Couldn't load user metadata.")
      if (setWatchHistory) setWatchHistory({})
      if (setStarredOfferings) setStarredOfferings({})
      if (setWatchHistoryArray) setWatchHistoryArray([])
      if (setStarredOfferingsArray) setStarredOfferingsArray([])
    }
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