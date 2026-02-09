// Mock cthttp
import {
  getImageById,
  getImagesBySource,
  createImage,
  deleteImage,
} from './Images';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Images API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getImageById calls GET Images/:id', async () => {
      await getImageById('image123');
      expect(cthttp.get).toHaveBeenCalledWith('Images/image123');
    });

    it('getImagesBySource calls GET Images/BySource/:sourceType/:sourceId', async () => {
      await getImagesBySource('media', 'media123');
      expect(cthttp.get).toHaveBeenCalledWith('Images/BySource/media/media123');
    });
  });

  describe('POST methods', () => {
    it('createImage calls POST Images with FormData', async () => {
      const mockFile = new File(['image'], 'image.jpg', { type: 'image/jpeg' });

      await createImage(mockFile, 'media', 'media123');

      expect(cthttp.post).toHaveBeenCalledWith('Images', expect.any(FormData));
    });
  });

  describe('DELETE methods', () => {
    it('deleteImage calls DELETE Images/:id', async () => {
      await deleteImage('image123');
      expect(cthttp.delete).toHaveBeenCalledWith('Images/image123');
    });
  });
});
