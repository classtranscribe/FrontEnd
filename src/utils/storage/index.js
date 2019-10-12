import { isMobile } from 'react-device-detect'
import { api } from '../HTTP'

export const storage = {
  // keys
  watchHistoryKey: 'watch-history-new',
  starredOfferingKey: 'starred-offerings-new',
  searchHistoryKey: 'search-history',

  fixUserMetadata: function() {
    const watchHistory = localStorage.getItem(this.watchHistoryKey)
    const starredOffering = localStorage.getItem(this.starredOfferingKey)
    if (Boolean(watchHistory)) {
      localStorage.removeItem(this.watchHistoryKey)
    }
    if (Boolean(starredOffering)) {
      api.postUserMetaData({ starredOffering, watchHistory: '' })
      localStorage.removeItem(this.starredOfferingKey)
    }
  },


  ttempStoredOfferingsKey: 'temp-stored-offerings',

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
}