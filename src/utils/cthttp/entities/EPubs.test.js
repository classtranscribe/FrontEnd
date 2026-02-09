// Mock cthttp
import {
  getEpubData,
  requestEpubCreation,
  getEPubById,
  getEPubsBySource,
  createEPub,
  updateEPub,
  updateEPubSimple,
  deleteEPub,
} from './EPubs';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('EPubs API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('EPub raw data - GET methods', () => {
    it('getEpubData calls GET EPubs/GetEpubData with params', async () => {
      await getEpubData('media123', 'en-US');
      expect(cthttp.get).toHaveBeenCalledWith('EPubs/GetEpubData', {
        params: { mediaId: 'media123', language: 'en-US' }
      });
    });

    it('getEpubData uses default language en-US', async () => {
      await getEpubData('media123');
      expect(cthttp.get).toHaveBeenCalledWith('EPubs/GetEpubData', {
        params: { mediaId: 'media123', language: 'en-US' }
      });
    });

    it('requestEpubCreation calls GET EPubs/RequestEpubCreation with params', async () => {
      await requestEpubCreation('media123');
      expect(cthttp.get).toHaveBeenCalledWith('EPubs/RequestEpubCreation', {
        params: { mediaId: 'media123' }
      });
    });
  });

  describe('EPub entities - GET methods', () => {
    it('getEPubById calls GET EPubs/:id', async () => {
      await getEPubById('epub123');
      expect(cthttp.get).toHaveBeenCalledWith('EPubs/epub123');
    });

    it('getEPubsBySource calls GET EPubs/BySource/:sourceType/:sourceId', async () => {
      await getEPubsBySource('media', 'media123');
      expect(cthttp.get).toHaveBeenCalledWith('EPubs/BySource/media/media123');
    });
  });

  describe('EPub entities - POST methods', () => {
    it('createEPub calls POST EPubs with data', async () => {
      const ePubData = { title: 'Test EPub', sourceId: 'media123' };
      await createEPub(ePubData);
      expect(cthttp.post).toHaveBeenCalledWith('EPubs', ePubData);
    });
  });

  describe('EPub entities - PUT methods', () => {
    it('updateEPub calls PUT EPubs/:id with data', async () => {
      const ePubData = { id: 'epub123', title: 'Updated EPub' };
      await updateEPub(ePubData);
      expect(cthttp.put).toHaveBeenCalledWith('EPubs/epub123', ePubData);
    });

    it('updateEPubSimple calls PUT EPubs/:id with partial data', async () => {
      const partialData = { title: 'Partial Update' };
      await updateEPubSimple('epub123', partialData);
      expect(cthttp.put).toHaveBeenCalledWith('EPubs/epub123', partialData);
    });
  });

  describe('EPub entities - DELETE methods', () => {
    it('deleteEPub calls DELETE EPubs/:id', async () => {
      await deleteEPub('epub123');
      expect(cthttp.delete).toHaveBeenCalledWith('EPubs/epub123');
    });
  });
});
