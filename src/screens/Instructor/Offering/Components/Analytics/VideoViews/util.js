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
                lastHr: 0,
                last3days: 0,
                lastWeek: 0,
                lastMonth: 0,
                count: 0,
            })
        })
    })

    return mediaList
}

export function parseCourseLogs(data, playlist, sortBy='count') {
    const mediaList = playlistsToMediaList(playlist)

    data.forEach( elem => {
        elem.medias.forEach( media => {
            const { mediaId, count, lastHr, last3days, lastWeek, lastMonth } = media
            const mediaIdx = _.findIndex(mediaList, {id: mediaId})
            mediaList[mediaIdx].count += count
            mediaList[mediaIdx].lastHr += lastHr
            mediaList[mediaIdx].last3days += last3days
            mediaList[mediaIdx].lastWeek += lastWeek
            mediaList[mediaIdx].lastMonth += lastMonth
        })
    })

    return _.sortBy(mediaList, [sortBy]).slice().reverse()
}

export function parseCourseLogsForMediaViewChart(data, playlist) {
    const parsedData = []
    const mediaList = parseCourseLogs(data, playlist).slice(0, 20)
    mediaList.forEach( media => {
        const { mediaName, count } = media
        parsedData.push({
            y: mediaName,
            x: Math.ceil(count/4)
        })
    })
    return parsedData
}