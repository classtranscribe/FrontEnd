import { cthttp } from '../request';

// ------------------------------------------------------------
// Roles
// ------------------------------------------------------------

// GET

export function getRolesByUniId(universityId) {
  return cthttp.get('Roles', { params: { universityId } });
}

// POST

/**
 * Create a role
 * @param {String} mailId email
 * @param {String} role `Instructor`, `Student`, `Admin`
 */
export function createRole(mailId, role) {
  return cthttp.post('Roles', null, { params: { mailId, role } });
}

export function createInstructor(mailId) {
  return cthttp.post('Roles', null, { params: { mailId, role: 'Instructor' } });
}

// DELETE

export function deleteRole(mailId) {
  return cthttp.delete('Roles', { params: { mailId } });
}
