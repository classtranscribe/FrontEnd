import { cthttp } from '../request';

// ------------------------------------------------------------
// Watch Histories
// ------------------------------------------------------------

// GET

export function getMediaWatchHistories(mediaId) {
  return cthttp.get(`WatchHistories/${mediaId}`);
}

export function getUserWatchHistories() {
  return cthttp.get('WatchHistories/GetAllWatchedMediaForUser');
}

// POST

export function sendMediaWatchHistories(mediaId, timestamp, ratio) {
  return cthttp.post(`WatchHistories/${mediaId}`, { timestamp, ratio });
}

// DELETE

export function deleteWatchHistory(watchHistoryId) {
  return cthttp.delete('WatchHistories', { params: { id: watchHistoryId }});
}
