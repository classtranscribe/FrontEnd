import { cthttp } from '../request';

// ------------------------------------------------------------
// Terms
// ------------------------------------------------------------

// GET

export function getTermById(termId) {
  return cthttp.get(`Terms/${termId}`);
}

export function getTermsByUniId(universityId) {
  return cthttp.get(`Terms/ByUniversity/${universityId}`);
}

// POST

export function createTerm(data) {
  return cthttp.post('Terms', data);
}

// PUT

export function updateTerm(data) {
  return cthttp.put(`Terms/${data.id}`, data);
}

// DELETE

export function deleteTerm(termId) {
  return cthttp.delete(`Terms/${termId}`);
}
