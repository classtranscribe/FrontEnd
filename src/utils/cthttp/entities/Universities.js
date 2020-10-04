import { cthttp } from '../request';

// ------------------------------------------------------------
// Universities
// ------------------------------------------------------------

// GET

export function getUniversities() {
  return cthttp.get('Universities');
}

export function getUniversityById(universityId) {
  return cthttp.get(`Universities/${universityId}`);
}

// POST

export function createUniversity(data) {
  return cthttp.post('Universities', data);
}

// PUT

export function updateUniversity(data) {
  return cthttp.put(`Universities/${data.id}`, data);
}

// DELETE

export function deleteUniversity(universityId) {
  return cthttp.delete(`Universities/${universityId}`);
}
