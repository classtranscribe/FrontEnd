// Mock cthttp
import {
  getRolesByUniId,
  createRole,
  createInstructor,
  deleteRole,
} from './Roles';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Roles API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getRolesByUniId calls GET Roles with params', async () => {
      await getRolesByUniId('uni123');
      expect(cthttp.get).toHaveBeenCalledWith('Roles', { params: { universityId: 'uni123' } });
    });
  });

  describe('POST methods', () => {
    it('createRole calls POST Roles with mailId and role params', async () => {
      await createRole('user@example.com', 'Instructor');
      expect(cthttp.post).toHaveBeenCalledWith('Roles', null, {
        params: { mailId: 'user@example.com', role: 'Instructor' }
      });
    });

    it('createInstructor calls POST Roles with Instructor role', async () => {
      await createInstructor('instructor@example.com');
      expect(cthttp.post).toHaveBeenCalledWith('Roles', null, {
        params: { mailId: 'instructor@example.com', role: 'Instructor' }
      });
    });
  });

  describe('DELETE methods', () => {
    it('deleteRole calls DELETE Roles with mailId param', async () => {
      await deleteRole('user@example.com');
      expect(cthttp.delete).toHaveBeenCalledWith('Roles', { params: { mailId: 'user@example.com' } });
    });
  });
});
