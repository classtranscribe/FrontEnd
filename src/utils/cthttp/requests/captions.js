import { cthttp } from './request';

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

export function searchCaptionInOffering(offeringId, query) {
  return cthttp.get('Captions/SearchInOffering', { params: { offeringId, query } });
}

// POST

export function updateCaptionLine(data) {
  return cthttp.post('Captions', { id: data.id, text: data.text });
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
