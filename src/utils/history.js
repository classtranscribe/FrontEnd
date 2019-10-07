import { api } from './http'

export const history = {
  // Keys to localStorage
  tempStoredOfferingsKey: 'temp-stored-offerings',
  watchHistoryKey: 'watch-history-new',
  starredOfferingKey: 'starred-offerings-new',
  searchHistoryKey: 'search-history',

  storeOfferings: function(offerings) {
    localStorage.setItem(this.tempStoredOfferingsKey, JSON.stringify(offerings))
  },
  getStoredOfferings: function() {
    // this.removeStoredOfferings()
    const storedOfferings_str = localStorage.getItem(this.tempStoredOfferingsKey)
    return storedOfferings_str ? JSON.parse(storedOfferings_str) : null
  },
  removeStoredOfferings: function() {
    localStorage.removeItem(this.tempStoredOfferingsKey)
  },

  // Functions to set and send histories
  saveUserMetadata: function({ watchHistory, starredOfferings, searchHistory }) {
    if (watchHistory) localStorage.setItem(this.watchHistoryKey, watchHistory)
    if (starredOfferings) localStorage.setItem(this.starredOfferingKey, starredOfferings)
    if (searchHistory) localStorage.setItem(this.searchHistoryKey, searchHistory)
  },
  updateUserdata: function() {
    const watchHistory = localStorage.getItem(this.watchHistoryKey)
    const starredOfferings = localStorage.getItem(this.starredOfferingKey)
    const searchHistory = localStorage.getItem(this.searchHistoryKey)
    api.postUserMetaData({ watchHistory, starredOfferings, searchHistory })
  },

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
    if (watchHistoryArray.length > 30) {
      for (var i = 30; i < watchHistoryArray.length; i++) {
        delete watchHistory[watchHistoryArray[i].mediaId]
      } 
      localStorage.setItem(this.watchHistoryKey, JSON.stringify(watchHistory))
    }
    this.updateUserdata()
    return watchHistoryArray.slice(0, 30)
  },
  saveVideoTime: function({ mediaId='', timeStamp=0, ratio=0, offeringId='', update=false }) {
    var watchHistory = this.getWatchHistory()
    watchHistory[mediaId] = { ratio, offeringId, timeStamp, lastModifiedTime: new Date() }
    localStorage.setItem(this.watchHistoryKey, JSON.stringify(watchHistory))
    if (update) this.updateUserdata()
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
    this.updateUserdata()
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
    this.updateUserdata()
  },
  unstarOffering: function(offeringId='') {
    var starredOfferings = this.getStarredOfferings()
    if (starredOfferings[offeringId]) {
      delete starredOfferings[offeringId]
    }
    localStorage.setItem(this.starredOfferingKey, JSON.stringify(starredOfferings))
    this.updateUserdata()
  },
  isOfferingStarred: function(offeringId='') {
    var starredOfferings = this.getStarredOfferings()
    return Boolean(starredOfferings[offeringId])
  },

  /**
   * Search History
   */
  // getSearchHistory: function() {
  //   const searchHistory_str = localStorage.getItem(this.searchHistoryKey)
  //   if (!searchHistory_str) return {}
  //   return JSON.parse(searchHistory_str)
  // },
  // getSearchHistoryArray: function() {
  //   var searchHistory = this.getSearchHistory()
  //   var searchHistoryArray = []
  //   for(var mediaId in searchHistory) {
  //     const { ratio, offeringId, timeStamp, lastModifiedTime } = searchHistory[mediaId]
  //     watchHistoryArray.push({ mediaId, offeringId, timeStamp, ratio: Math.ceil(ratio * 100), lastModifiedTime })
  //   }
  //   watchHistoryArray = watchHistoryArray.sort((media1, media2) => media1.lastModifiedTime < media2.lastModifiedTime ? 1 : media1.lastModifiedTime > media2.lastModifiedTime ? -1 : 0)
  //   if (watchHistoryArray.length > 12) {
  //     for (var i = 12; i < watchHistoryArray.length; i++) {
  //       delete watchHistory[watchHistoryArray[i].mediaId]
  //     } 
  //     localStorage.setItem(this.watchHistoryKey, JSON.stringify(watchHistory))
  //   }
  //   return watchHistoryArray.slice(0, 12)
  // },
  // saveVideoTime: function(mediaId='', timeStamp=0, ratio=0, offeringId='', update=false) {
  //   var watchHistory = this.getWatchHistory()
  //   watchHistory[mediaId] = { ratio, offeringId, timeStamp, lastModifiedTime: new Date() }
  //   localStorage.setItem(this.watchHistoryKey, JSON.stringify(watchHistory))
  //   if (update) this.updateUserdata()
  // },
  // getStoredMediaInfo: function(mediaId='') {
  //   const watchHistory = this.getWatchHistory()
  //   const re = watchHistory[mediaId] || {ratio: 0}
  //   return { ...re, ratio: Math.ceil(re.ratio * 100) }
  // },
  // removeStoredMediaInfo: function(mediaId='') {
  //   const watchHistory = this.getWatchHistory()
  //   console.log(watchHistory[mediaId] )
  //   delete watchHistory[mediaId] 
  //   localStorage.setItem(this.watchHistoryKey, JSON.stringify(watchHistory))
  // },
  // restoreVideoTime: function(mediaId='') {
  //   const watchHistory = this.getWatchHistory()
  //   return watchHistory[mediaId] ? parseFloat( watchHistory[mediaId].timeStamp) : null
  // },
  // completeWatchHistoryArray: async function(setWatchHistory) {
  //   var watchHistory = this.getWatchHistoryArray()
  //   for (let i = 0; i < watchHistory.length; i++) {
  //     const { mediaId } = watchHistory[i]
  //     const { data } = await api.getMediaById(mediaId)
  //     watchHistory[i].mediaName = api.parseMedia(data).mediaName
  //   }
  //   setWatchHistory(watchHistory)
  // },
 }