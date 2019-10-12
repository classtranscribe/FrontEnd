import { isMobile } from 'react-device-detect'

export const storage = {
  // keys
  tempStoredOfferingsKey: 'temp-stored-offerings',

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