import { cthttp } from '../request';

// ------------------------------------------------------------
// EPubs: ePub raw data
// ------------------------------------------------------------


// GET 

export function getEpubData(mediaId, language = 'en-US') {
  return cthttp.get('EPubs/GetEpubData', { params: { mediaId, language } });
}

export function requestEpubCreation(mediaId) {
  return cthttp.get('EPubs/RequestEpubCreation', { params: { mediaId } });
}

// ------------------------------------------------------------
// EPubs: ePub entities
// ------------------------------------------------------------

// GET 

export function getEPubById(ePubId) {
  return cthttp.get(`EPubs/${ePubId}`);
}

export function getEPubsBySource(sourceType, sourceId) {
  return cthttp.get(`EPubs/BySource/${sourceType}/${sourceId}`);
}

// POST

export function createEPub(ePubData) {
  return cthttp.post('EPubs', ePubData);
}

// PUT

export function updateEPub(ePubData) {
  return cthttp.put(`EPubs/${ePubData.id}`, ePubData);
}

/** partially update the ePub data */
export function updateEPubSimple(ePubId, ePubData) {
  return cthttp.put(`EPubs/${ePubId}`, ePubData);
}

// DELETE

export function deleteEPub(ePubId) {
  return cthttp.delete(`EPubs/${ePubId}`);
}