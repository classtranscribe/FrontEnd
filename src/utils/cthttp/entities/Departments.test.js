// Mock cthttp
import {
  getDepartments,
  getDepartById,
  getDepartsByUniId,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from './Departments';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Departments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getDepartments calls GET Departments', async () => {
      await getDepartments();
      expect(cthttp.get).toHaveBeenCalledWith('Departments');
    });

    it('getDepartById calls GET Departments/:id', async () => {
      await getDepartById('456');
      expect(cthttp.get).toHaveBeenCalledWith('Departments/456');
    });

    it('getDepartsByUniId calls GET Departments/ByUniversity/:universityId', async () => {
      await getDepartsByUniId('789');
      expect(cthttp.get).toHaveBeenCalledWith('Departments/ByUniversity/789');
    });
  });

  describe('POST methods', () => {
    it('createDepartment calls POST Departments with data', async () => {
      const data = { name: 'Computer Science' };
      await createDepartment(data);
      expect(cthttp.post).toHaveBeenCalledWith('Departments', data);
    });
  });

  describe('PUT methods', () => {
    it('updateDepartment calls PUT Departments/:id with data', async () => {
      const data = { id: '456', name: 'Updated Department' };
      await updateDepartment(data);
      expect(cthttp.put).toHaveBeenCalledWith('Departments/456', data);
    });
  });

  describe('DELETE methods', () => {
    it('deleteDepartment calls DELETE Departments/:id', async () => {
      await deleteDepartment('456');
      expect(cthttp.delete).toHaveBeenCalledWith('Departments/456');
    });
  });
});
