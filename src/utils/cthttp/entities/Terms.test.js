// Mock cthttp
import {
  getTermById,
  getTermsByUniId,
  createTerm,
  updateTerm,
  deleteTerm,
} from './Terms';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Terms API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getTermById calls GET Terms/:id', async () => {
      await getTermById('term123');
      expect(cthttp.get).toHaveBeenCalledWith('Terms/term123');
    });

    it('getTermsByUniId calls GET Terms/ByUniversity/:universityId', async () => {
      await getTermsByUniId('uni456');
      expect(cthttp.get).toHaveBeenCalledWith('Terms/ByUniversity/uni456');
    });
  });

  describe('POST methods', () => {
    it('createTerm calls POST Terms with data', async () => {
      const data = { name: 'Fall 2024', startDate: '2024-08-01' };
      await createTerm(data);
      expect(cthttp.post).toHaveBeenCalledWith('Terms', data);
    });
  });

  describe('PUT methods', () => {
    it('updateTerm calls PUT Terms/:id with data', async () => {
      const data = { id: 'term123', name: 'Fall 2024 Updated' };
      await updateTerm(data);
      expect(cthttp.put).toHaveBeenCalledWith('Terms/term123', data);
    });
  });

  describe('DELETE methods', () => {
    it('deleteTerm calls DELETE Terms/:id', async () => {
      await deleteTerm('term123');
      expect(cthttp.delete).toHaveBeenCalledWith('Terms/term123');
    });
  });
});
