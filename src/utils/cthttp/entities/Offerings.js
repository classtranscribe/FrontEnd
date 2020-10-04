import { cthttp } from '../request';

// ------------------------------------------------------------
// Offerings
// ------------------------------------------------------------

// GET

export function getOfferingById(offeringId) {
  return cthttp.get(`Offerings/${offeringId}`);
}

export function getOfferingsByStudent() {
  return cthttp.get('Offerings/ByStudent');
}

// POST

export function createOffering(data) {
  return cthttp.post('Offerings', data);
}

// PUT

export function updateOffering(data) {
  return cthttp.put(`Offerings/${data.id}`, data);
}

// DELETE

export function deleteOffering(offeringId) {
  return cthttp.delete(`Offerings/${offeringId}`);
}

// ------------------------------------------------------------
// CourseOfferings
// ------------------------------------------------------------

// GET

export function getCourseOfferingsByInstructorId(instructorId) {
  return cthttp.get(`CourseOfferings/ByInstructor/${instructorId}`);
}

// POST

export function createCourseOffering(data) {
  return cthttp.post('CourseOfferings', data);
}

// DELETE

export function deleteCourseOffering(courseId, offeringId) {
  return cthttp.delete(`CourseOfferings/${courseId}/${offeringId}`);
}

// ------------------------------------------------------------
// UserOfferings
// ------------------------------------------------------------

// GET

export function getInstructorsByOfferingId(offeringId) {
  return cthttp.get(`UserOfferings/GetUsersOfOffering/${offeringId}/Instructor`);
}

export function getStudentsByOfferingId(offeringId) {
  return cthttp.get(`UserOfferings/GetUsersOfOffering/${offeringId}/Student`);
}

// POST

export function addInstructorsToOffering(offeringId, data) {
  return cthttp.post(`UserOfferings/AddUsers/${offeringId}/Instructor`, data);
}

export function addStudentsToOffering(offeringId, data) {
  return cthttp.post(`UserOfferings/AddUsers/${offeringId}/Student`, data);
}

// DELETE

export function deleteInstructorsFromOffering(offeringId, emails) {
  return cthttp.delete(`UserOfferings/DeleteUserFromOffering/${offeringId}/Instructor`, {
    data: emails,
  });
}

export function deleteStudentsFromOffering(offeringId, emails) {
  return cthttp.delete(`UserOfferings/DeleteUserFromOffering/${offeringId}/Student`, {
    data: emails,
  });
}
