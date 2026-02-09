// Mock cthttp
import {
  getUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from './Universities';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Universities API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getUniversities calls GET Universities', async () => {
      await getUniversities();
      expect(cthttp.get).toHaveBeenCalledWith('Universities');
    });

    it('getUniversityById calls GET Universities/:id', async () => {
      await getUniversityById('123');
      expect(cthttp.get).toHaveBeenCalledWith('Universities/123');
    });
  });

  describe('POST methods', () => {
    it('createUniversity calls POST Universities with data', async () => {
      const data = { name: 'Test University' };
      await createUniversity(data);
      expect(cthttp.post).toHaveBeenCalledWith('Universities', data);
    });
  });

  describe('PUT methods', () => {
    it('updateUniversity calls PUT Universities/:id with data', async () => {
      const data = { id: '123', name: 'Updated University' };
      await updateUniversity(data);
      expect(cthttp.put).toHaveBeenCalledWith('Universities/123', data);
    });
  });

  describe('DELETE methods', () => {
    it('deleteUniversity calls DELETE Universities/:id', async () => {
      await deleteUniversity('123');
      expect(cthttp.delete).toHaveBeenCalledWith('Universities/123');
    });
  });
});
