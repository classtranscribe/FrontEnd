import { cthttp } from './request'

// ------------------------------------------------------------
// Medias
// ------------------------------------------------------------

// GET

export function getMediaById(mediaId) {
    return cthttp.get('Media/' + mediaId)
}

// POST

export function uploadVideo(playlistId, video1, video2, onUploadProgress) {
    const formData = new FormData()
    formData.append('video1', video1)
    formData.append('video2', video2)
    formData.append('playlistId', playlistId)
    // console.log('uploadData', {playlistId, video1, video2})
    return cthttp.post('Media', formData, { onUploadProgress, timeout: 5400000 })
}

// PUT

export function renameMedia(mediaId, name) {
    return cthttp.put('Media/PutMediaName', null, { params: { name, mediaId } })
}

export function updateMediaMetadata(mediaId, jsonMetadata) {
    return cthttp.put('Media/PutJsonMetaData/' + mediaId, jsonMetadata)
}

// DELETE

export function deleteMedia(mediaId) {
    return cthttp.delete('Media/' + mediaId)
}