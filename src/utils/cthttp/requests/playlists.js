import { cthttp } from './request'

// ------------------------------------------------------------
// Playlists
// ------------------------------------------------------------

// GET

export function getPlaylistById(playlistId) {
    return cthttp.get('Playlists/' + playlistId)
}

export function getPlaylistsByOfferingId(offeringId) {
    return cthttp.get('Playlists/ByOffering/' + offeringId)
}

export function searchForMedia(offeringId, query) {
    return cthttp.getf(`Playlists/SearchForMedia/${offeringId}/${query}`)
}

// POST

export function createPlaylist(data) {
    return cthttp.post('Playlists', data)
}

// PUT

export function updatePlaylist(data) {
    return cthttp.put('Playlists/' + data.id, data)
}

// DELETE

export function deletePlaylist(playlistId) {
    return cthttp.delete('Playlists/' + playlistId)
}

