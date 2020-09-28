import { cthttp } from './request';

// ------------------------------------------------------------
// ePub
// GET
// ------------------------------------------------------------

export function getEpubData(mediaId, language = 'en-US') {
  return cthttp.get('EPubs/GetEpubData', { params: { mediaId, language } });
}

export function requestEpubCreation(mediaId) {
  return cthttp.get('EPubs/RequestEpubCreation', { params: { mediaId } });
}
