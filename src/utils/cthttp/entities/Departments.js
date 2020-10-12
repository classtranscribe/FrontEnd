import { cthttp } from '../request';

// ------------------------------------------------------------
// Departments
// ------------------------------------------------------------

// GET

export function getDepartments() {
  return cthttp.get('Departments');
}

export function getDepartById(departId) {
  return cthttp.get(`Departments/${departId}`);
}

export function getDepartsByUniId(universityId) {
  return cthttp.get(`Departments/ByUniversity/${universityId}`);
}

// POST

export function createDepartment(data) {
  return cthttp.post('Departments', data);
}

// PUT

export function updateDepartment(data) {
  return cthttp.put(`Departments/${data.id}`, data);
}

// DELETE

export function deleteDepartment(departId) {
  return cthttp.delete(`Departments/${departId}`);
}
