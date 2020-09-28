import { cthttp } from '../request';

// ------------------------------------------------------------
// Departments
// ------------------------------------------------------------

// GET

export function getImageById(imageId) {
  return cthttp.get(`Images/${imageId}`);
}

export function getImagesBySource(sourceType, sourceId) {
  return cthttp.get(`Images/BySource/${sourceType}/${sourceId}`);
}

// POST

export function createImage(imageFile, sourceType, sourceId) {
  return cthttp.post('Images', { imageFile, sourceType, sourceId });
}

// DELETE

export function deleteImage(imageId) {
  return cthttp.delete(`Images/${imageId}`);
}