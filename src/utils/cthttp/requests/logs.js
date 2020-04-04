import { deviceType, osVersion, osName, fullBrowserVersion, browserName } from 'react-device-detect'
import { user } from '../../user'
import { cthttp } from './request'

// ------------------------------------------------------------
// Admin Logs
// ------------------------------------------------------------

export function adminGetLogs(from, to) {
    return cthttp.get('Admin/GetLogs', { params: { from, to } })
}


// ------------------------------------------------------------
// Logs
// ------------------------------------------------------------

// GET

export function getCourseLogs(eventType, offeringId, start, end) {
    return cthttp.get('Logs/CourseLogs', { params: { eventType, offeringId, start, end } })
}

export function getUserLogs() {
    return cthttp.get('Logs/UserLogs')
}

export function getUserLogsByEvent(eventType, start, end) {
    return cthttp.get('Logs/UserLogs/ByEvent', { params: { eventType, start, end } })
}

export function getOfferingSearchHistory(offeringId) {
    return cthttp.get('Logs/OfferingSearchHistory', { params: { offeringId } })
}

export function getUserSearchHistoryInOffering(offeringId) {
    return cthttp.get('Logs/UserSearchHistory', { params: { offeringId } })
}

// POST

export function sendUserAction(eventType, data={}) {
    const { json, mediaId, offeringId } = data
    return cthttp.post('Logs', {
        eventType, 
        mediaId, 
        offeringId,
        userId: user.userId(),
        json: {
            ...json, 
            device: { deviceType, osVersion, osName, fullBrowserVersion, browserName }
        }
    })
}