import { cthttp } from '../request';

const qs = require('qs')

// ------------------------------------------------------------
// Captions
// ------------------------------------------------------------

// GET

export function getCaptionsByTranscriptionId(transcriptionId) {
  return cthttp.get(`Captions/ByTranscription/${transcriptionId}`);
}

export function getCaptionLine(transcriptionId, index) {
  return cthttp.get('Captions', { params: { transcriptionId, index } });
}

export function searchCaptionInOffering(offeringId, query, filterLanguage = 'en-US') {
  return cthttp.get('Captions/SearchInOffering', { params: { offeringId, query, filterLanguage } });
}

// POST

export function updateCaptionLine(data) {
  return cthttp.post('Captions', { id: data.id, text: data.text });
}

export function searchCaptions(transList, data) {
  return cthttp.post('CaptionsSearch',
    transList
    , { params: { query: data.text, page: data.page, pageSize: data.pageSize } });
}

// ------------------------------------------------------------
// Vote
// ------------------------------------------------------------

export function captionUpVote(id) {
  // captionId
  return cthttp.post('Captions/UpVote', null, { params: { id } });
}

export function captionCancelUpVote(id) {
  // captionId
  return cthttp.post('Captions/CancelUpVote', null, { params: { id } });
}

export function captionDownVote(id) {
  // captionId
  return cthttp.post('Captions/DownVote', null, { params: { id } });
}

export function captionCancelDownVote(id) {
  // captionId
  return cthttp.post('Captions/CancelDownVote', null, { params: { id } });
}
