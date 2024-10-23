import { cthttp } from '../request';

// const qs = require('qs')

// ------------------------------------------------------------
// Captions
// ------------------------------------------------------------

// GET

export function getTranscriptionFile(transcriptionId,format) {
  // {vtt,srt,txt}
  return cthttp.get(`Captions/TranscriptionFile/${transcriptionId}/${format}`);
}


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
  console.log("Preparing to update caption line with data:", data);
  
  // Check if all required fields are present
  if (!data.id || !data.text || !data.begin || !data.end) {
    console.error("Missing required data fields:", data);
    throw new Error("Required data fields are missing.");
  }
  
  return cthttp.post('Captions', { 
    id: data.id, 
    text: data.text, 
    begin: data.begin, 
    end: data.end 
  }).then(response => {
    console.log("Caption line updated successfully:", response);
    return response;
  }).catch(error => {
    console.error("Error updating caption line:", error);
    throw error; // Re-throw to handle it upstream if necessary
  });
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
