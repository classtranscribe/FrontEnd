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
  const formData = new FormData();
  formData.append('imageFile', imageFile);
  formData.append('sourceType', sourceType);
  formData.append('sourceId', sourceId);
  return cthttp.post('Images', formData);
}

// DELETE

export function deleteImage(imageId) {
  return cthttp.delete(`Images/${imageId}`);
}