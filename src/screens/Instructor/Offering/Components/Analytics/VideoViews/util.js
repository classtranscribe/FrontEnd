import { api, handleData } from 'utils'
import _ from 'lodash'

function playlistsToMediaList(playlists) {
    var mediaList = []
    playlists.forEach( playlist => {
        playlist.medias.forEach(media => {
            const { id, mediaName } = api.parseMedia(media)
            mediaList.push({ 
                mediaName, 
                id, 
                playlistName: playlist.name,
                count: 0,
            })
        })
    })

    return mediaList
}

export function parseCourseLogs(data, playlist) {
    const mediaList = playlistsToMediaList(playlist)

    data.forEach( elem => {
        elem.medias.forEach( media => {
            const { mediaId, count } = media
            const mediaIdx = _.findIndex(mediaList, {id: mediaId})
            mediaList[mediaIdx].count += count
        })
    })

    return _.sortBy(mediaList, ['count']).slice().reverse()
}

export function parseCourseLogsForMediaView(data, playlist) {
    const parsedData = []
    const mediaList = parseCourseLogs(data, playlist).slice(0, 20)
    mediaList.forEach( media => {
        const { mediaName, count } = media
        parsedData.push({
            y: mediaName,
            x: count
        })
    })
    return parsedData
}