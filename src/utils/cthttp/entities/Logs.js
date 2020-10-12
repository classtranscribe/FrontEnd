import { cthttp } from '../request';

const GET_LOG_TIMEOUT = 6000000;

// ------------------------------------------------------------
// Admin Logs
// ------------------------------------------------------------

export function adminGetLogs(from, to) {
  return cthttp.get('Admin/GetLogs', { params: { from, to }, timeout: GET_LOG_TIMEOUT });
}

// ------------------------------------------------------------
// Logs
// ------------------------------------------------------------

// GET

export function getCourseLogs(eventType, offeringId, start, end) {
  return cthttp.get('Logs/CourseLogs', {
    params: { eventType, offeringId, start, end },
    timeout: GET_LOG_TIMEOUT,
  });
}

export function getUserLogs() {
  return cthttp.get('Logs/UserLogs');
}

export function getUserLogsByEvent(eventType, start, end) {
  return cthttp.get('Logs/UserLogs/ByEvent', {
    params: { eventType, start, end },
    timeout: GET_LOG_TIMEOUT,
  });
}

export function getOfferingSearchHistory(offeringId) {
  return cthttp.get('Logs/OfferingSearchHistory', {
    params: { offeringId },
    timeout: GET_LOG_TIMEOUT,
  });
}

export function getUserSearchHistoryInOffering(offeringId) {
  return cthttp.get('Logs/UserSearchHistory', { params: { offeringId }, timeout: GET_LOG_TIMEOUT });
}

// POST

export function sendUserAction(data) {
  return cthttp.post('Logs', data);
}
