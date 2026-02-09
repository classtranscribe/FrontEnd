// Mock cthttp
import {
  getOfferingById,
  getOfferingsByStudent,
  createOffering,
  updateOffering,
  deleteOffering,
  getCourseOfferingsByInstructorId,
  createCourseOffering,
  deleteCourseOffering,
  getInstructorsByOfferingId,
  getStudentsByOfferingId,
  addInstructorsToOffering,
  addStudentsToOffering,
  deleteInstructorsFromOffering,
  deleteStudentsFromOffering,
} from './Offerings';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Offerings API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Offerings - GET methods', () => {
    it('getOfferingById calls GET Offerings/:id', async () => {
      await getOfferingById('offering123');
      expect(cthttp.get).toHaveBeenCalledWith('Offerings/offering123');
    });

    it('getOfferingsByStudent calls GET Offerings/ByStudent', async () => {
      await getOfferingsByStudent();
      expect(cthttp.get).toHaveBeenCalledWith('Offerings/ByStudent');
    });
  });

  describe('Offerings - POST methods', () => {
    it('createOffering calls POST Offerings with data', async () => {
      const data = { termId: 'term123', courseId: 'course456' };
      await createOffering(data);
      expect(cthttp.post).toHaveBeenCalledWith('Offerings', data);
    });
  });

  describe('Offerings - PUT methods', () => {
    it('updateOffering calls PUT Offerings/:id with data', async () => {
      const data = { id: 'offering123', sectionName: 'Section A' };
      await updateOffering(data);
      expect(cthttp.put).toHaveBeenCalledWith('Offerings/offering123', data);
    });
  });

  describe('Offerings - DELETE methods', () => {
    it('deleteOffering calls DELETE Offerings/:id', async () => {
      await deleteOffering('offering123');
      expect(cthttp.delete).toHaveBeenCalledWith('Offerings/offering123');
    });
  });

  describe('CourseOfferings - GET methods', () => {
    it('getCourseOfferingsByInstructorId calls GET CourseOfferings/ByInstructor/:instructorId', async () => {
      await getCourseOfferingsByInstructorId('inst789');
      expect(cthttp.get).toHaveBeenCalledWith('CourseOfferings/ByInstructor/inst789');
    });
  });

  describe('CourseOfferings - POST methods', () => {
    it('createCourseOffering calls POST CourseOfferings with data', async () => {
      const data = { courseId: 'course456', offeringId: 'offering123' };
      await createCourseOffering(data);
      expect(cthttp.post).toHaveBeenCalledWith('CourseOfferings', data);
    });
  });

  describe('CourseOfferings - DELETE methods', () => {
    it('deleteCourseOffering calls DELETE CourseOfferings/:courseId/:offeringId', async () => {
      await deleteCourseOffering('course456', 'offering123');
      expect(cthttp.delete).toHaveBeenCalledWith('CourseOfferings/course456/offering123');
    });
  });

  describe('UserOfferings - GET methods', () => {
    it('getInstructorsByOfferingId calls GET UserOfferings/GetUsersOfOffering/:offeringId/Instructor', async () => {
      await getInstructorsByOfferingId('offering123');
      expect(cthttp.get).toHaveBeenCalledWith('UserOfferings/GetUsersOfOffering/offering123/Instructor');
    });

    it('getStudentsByOfferingId calls GET UserOfferings/GetUsersOfOffering/:offeringId/Student', async () => {
      await getStudentsByOfferingId('offering123');
      expect(cthttp.get).toHaveBeenCalledWith('UserOfferings/GetUsersOfOffering/offering123/Student');
    });
  });

  describe('UserOfferings - POST methods', () => {
    it('addInstructorsToOffering calls POST UserOfferings/AddUsers/:offeringId/Instructor', async () => {
      const data = ['instructor1@example.com', 'instructor2@example.com'];
      await addInstructorsToOffering('offering123', data);
      expect(cthttp.post).toHaveBeenCalledWith('UserOfferings/AddUsers/offering123/Instructor', data);
    });

    it('addStudentsToOffering calls POST UserOfferings/AddUsers/:offeringId/Student', async () => {
      const data = ['student1@example.com', 'student2@example.com'];
      await addStudentsToOffering('offering123', data);
      expect(cthttp.post).toHaveBeenCalledWith('UserOfferings/AddUsers/offering123/Student', data);
    });
  });

  describe('UserOfferings - DELETE methods', () => {
    it('deleteInstructorsFromOffering calls DELETE with correct endpoint and data', async () => {
      const emails = ['instructor1@example.com'];
      await deleteInstructorsFromOffering('offering123', emails);
      expect(cthttp.delete).toHaveBeenCalledWith('UserOfferings/DeleteUserFromOffering/offering123/Instructor', {
        data: emails,
      });
    });

    it('deleteStudentsFromOffering calls DELETE with correct endpoint and data', async () => {
      const emails = ['student1@example.com'];
      await deleteStudentsFromOffering('offering123', emails);
      expect(cthttp.delete).toHaveBeenCalledWith('UserOfferings/DeleteUserFromOffering/offering123/Student', {
        data: emails,
      });
    });
  });
});
