import { cthttp } from './request'

// ------------------------------------------------------------
// Watch Histories
// ------------------------------------------------------------

// GET

export function getMediaWatchHistories(mediaId) {
    return cthttp.get('WatchHistories/' + mediaId)
}

export function getUserWatchHistories() {
    return cthttp.get('WatchHistories/GetAllWatchHistoryForUser')
}

// POST

export function sendMediaWatchHistories(mediaId, timestamp, ratio) {
    return cthttp.post('WatchHistories/' + mediaId, { timestamp, ratio })
}