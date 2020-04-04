import { cthttp } from './request'

// ------------------------------------------------------------
// Roles
// ------------------------------------------------------------

// GET

export function getRolesByUniId(universityId) {
    return cthttp.get('Roles', { params: { universityId } })
}

// POST

export function createRole(mailId) {
    return cthttp.post('Roles', null, { params: { mailId } })
}

// DELETE

export function deleteRole(mailId) {
    return cthttp.delete('Roles', { params: { mailId } })
}