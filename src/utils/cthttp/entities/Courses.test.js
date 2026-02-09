// Mock cthttp
import {
  getCourseById,
  getCoursesByDepartId,
  getCoursesByInstId,
  createCourse,
  updateCourse,
  deleteCourse,
} from './Courses';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Courses API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getCourseById calls GET Courses/:id', async () => {
      await getCourseById('course123');
      expect(cthttp.get).toHaveBeenCalledWith('Courses/course123');
    });

    it('getCoursesByDepartId calls GET Courses/ByDepartment/:departId', async () => {
      await getCoursesByDepartId('dept456');
      expect(cthttp.get).toHaveBeenCalledWith('Courses/ByDepartment/dept456');
    });

    it('getCoursesByInstId calls GET Courses/ByInstructor/:instructorId', async () => {
      await getCoursesByInstId('inst789');
      expect(cthttp.get).toHaveBeenCalledWith('Courses/ByInstructor/inst789');
    });
  });

  describe('POST methods', () => {
    it('createCourse calls POST Courses with data', async () => {
      const data = { courseNumber: 'CS101', courseName: 'Intro to CS' };
      await createCourse(data);
      expect(cthttp.post).toHaveBeenCalledWith('Courses', data);
    });
  });

  describe('PUT methods', () => {
    it('updateCourse calls PUT Courses/:id with data', async () => {
      const data = { id: 'course123', courseName: 'Updated Course' };
      await updateCourse(data);
      expect(cthttp.put).toHaveBeenCalledWith('Courses/course123', data);
    });
  });

  describe('DELETE methods', () => {
    it('deleteCourse calls DELETE Courses/:id', async () => {
      await deleteCourse('course123');
      expect(cthttp.delete).toHaveBeenCalledWith('Courses/course123');
    });
  });
});
