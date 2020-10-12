import { cthttp } from '../request';

// ------------------------------------------------------------
// Courses
// ------------------------------------------------------------

// GET

export function getCourseById(courseId) {
  return cthttp.get(`Courses/${courseId}`);
}

export function getCoursesByDepartId(departId) {
  return cthttp.get(`Courses/ByDepartment/${departId}`);
}

export function getCoursesByInstId(instructorId) {
  return cthttp.get(`Courses/ByInstructor/${instructorId}`);
}

// POST

export function createCourse(data) {
  return cthttp.post('Courses', data);
}

// PUT

export function updateCourse(data) {
  return cthttp.put(`Courses/${data.id}`, data);
}

// DELETE

export function deleteCourse(courseId) {
  return cthttp.delete(`Courses/${courseId}`);
}
