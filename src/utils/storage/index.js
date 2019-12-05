import { isBrowser } from 'react-device-detect'
import { api } from '../HTTP'

const onboardSuffix = '-onboard-1'

export const storage = {
  // keys
  watchHistoryKey: 'watch-history-new',
  starredOfferingKey: 'starred-offerings-new',
  searchHistoryKey: 'search-history',

  // onboard
  homeOnboardKey: 'home' + onboardSuffix,
  watchOnboardKey: 'watch' + onboardSuffix,

  tempStoredOfferingsKey: 'temp-stored-offerings',

  /**
   * Fix old version of watch history and starred offerngs
   */
  fixUserMetadata: function() {
    const watchHistory = localStorage.getItem(this.watchHistoryKey)
    const starredOffering = localStorage.getItem(this.starredOfferingKey)
    if (Boolean(watchHistory) || Boolean(starredOffering)) {
      localStorage.removeItem(this.watchHistoryKey)
      localStorage.removeItem(this.starredOfferingKey)
      api.postUserMetaData({ starredOffering: JSON.stringify({}), watchHistory: JSON.stringify({}) })
    }
  },

  /**
   * Store offerings temporarily (!ONLY FOR BROWSERS)
   */
  storeOfferings: function(offerings) {
    // if (isBrowser) localStorage.setItem(this.tempStoredOfferingsKey, JSON.stringify(offerings))
  },
  getStoredOfferings: function() {
    // this.removeStoredOfferings()
    // if (!isBrowser) return null
    // const storedOfferings_str = localStorage.getItem(this.tempStoredOfferingsKey)
    // return storedOfferings_str ? JSON.parse(storedOfferings_str) : null
  },
  removeStoredOfferings: function() {
    // if (isBrowser) localStorage.removeItem(this.tempStoredOfferingsKey)
  },

  /**
   * Onboard functions
   * ** The onboard data was stored in localStorage when signed in
   */
  // `home`, `watch`
  initOnboardLocally: async function() {
    try {
      const { data } = await api.getUserMetaData()
      const { onboard={} } = data
      for (let key in onboard) {
        localStorage.setItem(key + onboardSuffix, 'true')
      }
    } catch (error) {
      this.setOnboard('home')
      this.setOnboard('watch')
    }
  },
  isOnboard: function(key) {
    return Boolean(localStorage.getItem(key + onboardSuffix))
  },
  setOnboard: async function(key) {
    localStorage.setItem(key + onboardSuffix, 'true')
    const { data } = await api.getUserMetaData()
    const { metadata={}, onboard={} } = data
    onboard[key] = true
    api.postUserMetaData(metadata, onboard)
  },

}