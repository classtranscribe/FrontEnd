import { cthttp } from './request'

// ------------------------------------------------------------
// Watch Histories
// ------------------------------------------------------------

// GET

export function getMediaWatchHistories(mediaId) {
    return cthttp.get('WatchHistories/' + mediaId)
}

// POST

export function sendMediaWatchHistories(mediaId, playlistId, timestamp) {
    return cthttp.post('WatchHistories/' + mediaId, { playlistId, timestamp })
}