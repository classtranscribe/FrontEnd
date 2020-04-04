import _ from 'lodash'
import { getUserMetaData } from './requests/account'
import { getMediaById } from './requests/medias'
import { parseMedia } from './responses/parsers'

/**
 * Watch history
 */
async function getWatchHistoryArray(watchHistory) {
    var watchHistoryArray = []
    for(var mediaId in watchHistory) {
        var { ratio, offeringId, timeStamp, lastModifiedTime } = watchHistory[mediaId]
        const { data } = await getMediaById(mediaId)
        ratio = ratio > 1 ? (ratio > 90 ? 100 : ratio) : Math.ceil(ratio * 100)
        watchHistoryArray.push({ 
            mediaId, offeringId, timeStamp, ratio, 
            lastModifiedTime,
            mediaName: parseMedia(data).mediaName
        })
    }
    return _.sortBy(watchHistoryArray, ['lastModifiedTime']).reverse()
}

/**
 * Offering Starred
 */
function getStarredOfferingsArray(starredOfferings) {
    var starredOfferingsArray = []
    for(var offeringId in starredOfferings) {
        starredOfferingsArray.push( offeringId )
    }
    return starredOfferingsArray
}

export async function storeUserMetadata({
    setOnboarded,
    setWatchHistory, 
    setWatchHistoryArray, 
    setStarredOfferings, 
    setStarredOfferingsArray
}) {
    // Get all userMetadata
    try {
        var userMetadata = await getUserMetaData()
        var { watchHistory=JSON.stringify({}), starredOfferings=JSON.stringify({}) } = userMetadata.data.metadata || {}

        watchHistory = JSON.parse(watchHistory)
        starredOfferings = JSON.parse(starredOfferings)
        // Parse into array
        var watchHistoryArray = [], starredOfferingsArray = []
        if (setWatchHistoryArray) {
            watchHistoryArray = await getWatchHistoryArray(watchHistory)
        }
        if (setStarredOfferingsArray) starredOfferingsArray = getStarredOfferingsArray(starredOfferings)
        
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
}