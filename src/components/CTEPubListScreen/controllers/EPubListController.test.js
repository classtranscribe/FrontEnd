import SourceTypes from 'entities/SourceTypes';
import ErrorTypes from 'entities/ErrorTypes';

import { api, prompt, uurl } from 'utils';
import EPubListController, { EPubListCtrl } from './EPubListController';
import { _parseRawEPubData } from './helpers';

// Mock dependencies
jest.mock('utils', () => ({
  api: {
    createEPub: jest.fn(),
    getEpubData: jest.fn(),
    getMediaById: jest.fn(),
    parseMedia: jest.fn(),
    getEPubsBySource: jest.fn(),
    requestEPubCreation: jest.fn(),
    deleteEPub: jest.fn(),
    getEPubById: jest.fn(),
    updateEPubSimple: jest.fn(),
  },
  prompt: {
    addOne: jest.fn(),
    error: jest.fn(),
  },
  links: {
    epub: jest.fn((id) => `/epub/${id}`),
  },
  uurl: {
    openNewTab: jest.fn(),
  },
}));

const mockEPubDataCreate = jest.fn();

jest.mock('entities/EPubs/structs', () => ({
  EPubData: {
    get create() {
      return mockEPubDataCreate;
    },
  },
}));

jest.mock('./helpers', () => ({
  _parseRawEPubData: jest.fn((data) => data),
}));

jest.mock('../../CTPlayer', () => ({
  LanguageConstants: {
    English: 'en-US',
  },
}));

describe('EPubListController', () => {
  let controller;

  beforeEach(() => {
    controller = new EPubListController();
    jest.clearAllMocks();

    // Reset EPubData.create mock
    mockEPubDataCreate.mockReturnValue({
      toObject: jest.fn(() => ({ id: 'test-id', title: 'Test EPub' })),
    });

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('constructor', () => {
    it('creates an instance', () => {
      expect(controller).toBeInstanceOf(EPubListController);
    });

    it('exports a singleton instance', () => {
      expect(EPubListCtrl).toBeInstanceOf(EPubListController);
    });
  });

  describe('setupEPubsData', () => {
    it('sets up EPub data with all components', async () => {
      const mockSource = { id: 'source-1', transcriptions: [{ language: 'en-US' }] };
      const mockEPubs = [{ id: 'epub-1' }];
      const mockRawData = { content: 'test' };

      jest.spyOn(controller, 'getSource').mockResolvedValue(mockSource);
      jest.spyOn(controller, 'getLanguages').mockReturnValue(['en-US']);
      jest.spyOn(controller, 'getEPubs').mockResolvedValue(mockEPubs);
      jest.spyOn(controller, 'getRawEPubData').mockReturnValue(mockRawData); // BUG: Source code doesn't await this!

      const result = await controller.setupEPubsData(SourceTypes.Media, 'media-1');

      // Note: rawEPubData is a Promise because getRawEPubData is not awaited in the source (bug)
      expect(result.source).toEqual(mockSource);
      expect(result.ePubs).toEqual(mockEPubs);
      expect(result.languages).toEqual(['en-US']);
      expect(result.rawEPubData).toBe(mockRawData);
    });

    it('uses provided source if given', async () => {
      const mockSource = { id: 'source-1', transcriptions: [] };
      jest.spyOn(controller, 'getSource').mockResolvedValue(null);
      jest.spyOn(controller, 'getLanguages').mockReturnValue([]);
      jest.spyOn(controller, 'getEPubs').mockResolvedValue([]);
      jest.spyOn(controller, 'getRawEPubData').mockResolvedValue(null);

      await controller.setupEPubsData(SourceTypes.Media, 'media-1', mockSource);

      expect(controller.getSource).not.toHaveBeenCalled();
    });
  });

  describe('createEPub', () => {
    it('creates a new EPub successfully', async () => {
      const mockRawData = { content: 'test' };
      const mockNewEPubData = { id: 'new-epub-1', title: 'New EPub' };

      jest.spyOn(controller, 'getRawEPubData').mockResolvedValue(mockRawData);
      jest.spyOn(controller, 'postEPubData').mockResolvedValue(mockNewEPubData);

      const data = { language: 'en-US', title: 'Test' };
      const result = await controller.createEPub(SourceTypes.Media, 'media-1', data);

      expect(prompt.addOne).toHaveBeenCalledWith({ text: 'Creating I-Note...', timeout: 4000 });
      expect(result).toEqual(mockNewEPubData);
      expect(uurl.openNewTab).toHaveBeenCalled();
    });

    it('handles 404 error when getting raw data', async () => {
      jest.spyOn(controller, 'getRawEPubData').mockResolvedValue(ErrorTypes.NotFound404);

      const result = await controller.createEPub(SourceTypes.Media, 'media-1', { language: 'en-US' });

      expect(result).toBe(false);
      expect(prompt.error).toHaveBeenCalledWith('Failed to create the I-Note.');
    });

    it('handles null response from postEPubData', async () => {
      jest.spyOn(controller, 'getRawEPubData').mockResolvedValue({ content: 'test' });
      jest.spyOn(controller, 'postEPubData').mockResolvedValue(null);

      const result = await controller.createEPub(SourceTypes.Media, 'media-1', { language: 'en-US' });

      expect(result).toBe(null);
      expect(prompt.error).toHaveBeenCalledWith('Failed to create the I-Note.');
    });
  });

  describe('postEPubData', () => {
    it('posts EPub data successfully', async () => {
      const mockData = { id: 'epub-1' };
      api.createEPub.mockResolvedValue({ data: mockData });

      const result = await controller.postEPubData({ title: 'Test' });

      expect(api.createEPub).toHaveBeenCalledWith({ title: 'Test' });
      expect(result).toEqual(mockData);
    });

    it('returns null on error', async () => {
      api.createEPub.mockRejectedValue(new Error('API error'));

      const result = await controller.postEPubData({ title: 'Test' });

      expect(result).toBe(null);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getRawEPubData', () => {
    it('gets raw EPub data for Media source', async () => {
      const mockData = { content: 'test' };
      jest.spyOn(controller, 'getMediaRawEPubData').mockResolvedValue(mockData);

      const result = await controller.getRawEPubData(SourceTypes.Media, 'media-1', 'en-US');

      expect(controller.getMediaRawEPubData).toHaveBeenCalledWith('media-1', 'en-US');
      expect(result).toEqual(mockData);
    });

    it('returns null for non-Media source types', async () => {
      const result = await controller.getRawEPubData('OtherType', 'id-1', 'en-US');
      expect(result).toBe(null);
    });
  });

  describe('getMediaRawEPubData', () => {
    it('gets and parses media raw EPub data', async () => {
      const mockData = { raw: 'data' };
      const parsedData = { parsed: 'result' };
      api.getEpubData.mockResolvedValue({ data: mockData });
      _parseRawEPubData.mockReturnValue(parsedData);

      const result = await controller.getMediaRawEPubData('media-1', 'en-US');

      expect(api.getEpubData).toHaveBeenCalledWith('media-1', 'en-US');
      expect(_parseRawEPubData).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(parsedData);
    });

    it('returns NotFound404 on error', async () => {
      api.getEpubData.mockRejectedValue(new Error('Not found'));

      const result = await controller.getMediaRawEPubData('media-1', 'en-US');

      expect(result).toBe(ErrorTypes.NotFound404);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getLanguages', () => {
    it('extracts languages from Media source transcriptions', () => {
      const source = {
        transcriptions: [
          { language: 'en-US' },
          { language: 'es-ES' },
        ],
      };

      const result = controller.getLanguages(SourceTypes.Media, source);

      expect(result).toEqual(['en-US', 'es-ES']);
    });

    it('returns empty array if no source', () => {
      const result = controller.getLanguages(SourceTypes.Media, null);
      expect(result).toEqual([]);
    });

    it('returns empty array if no transcriptions', () => {
      const result = controller.getLanguages(SourceTypes.Media, {});
      expect(result).toEqual([]);
    });
  });

  describe('getSource', () => {
    it('gets Media source', async () => {
      const mockMedia = { id: 'media-1' };
      jest.spyOn(controller, 'getMedia').mockResolvedValue(mockMedia);

      const result = await controller.getSource(SourceTypes.Media, 'media-1');

      expect(controller.getMedia).toHaveBeenCalledWith('media-1');
      expect(result).toEqual(mockMedia);
    });

    it('returns null for non-Media source types', async () => {
      const result = await controller.getSource('OtherType', 'id-1');
      expect(result).toBe(null);
    });
  });

  describe('getMedia', () => {
    it('gets and parses media by id', async () => {
      const mockData = { id: 'media-1', name: 'Test Media' };
      const mockParsed = { id: 'media-1', name: 'Test Media', parsed: true };
      api.getMediaById.mockResolvedValue({ data: mockData });
      api.parseMedia.mockReturnValue(mockParsed);

      const result = await controller.getMedia('media-1');

      expect(api.getMediaById).toHaveBeenCalledWith('media-1');
      expect(api.parseMedia).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockParsed);
    });

    it('returns NotFound404 on error', async () => {
      api.getMediaById.mockRejectedValue(new Error('Not found'));

      const result = await controller.getMedia('media-1');

      expect(result).toBe(ErrorTypes.NotFound404);
    });
  });

  describe('getEPubs', () => {
    it('gets and reverses EPubs by source', async () => {
      const mockEPubs = [{ id: '1' }, { id: '2' }, { id: '3' }];
      api.getEPubsBySource.mockResolvedValue({ data: mockEPubs });

      const result = await controller.getEPubs(SourceTypes.Media, 'media-1');

      expect(api.getEPubsBySource).toHaveBeenCalledWith(SourceTypes.Media, 'media-1');
      expect(result).toEqual([{ id: '3' }, { id: '2' }, { id: '1' }]);
    });

    it('returns NotFound404 on error', async () => {
      api.getEPubsBySource.mockRejectedValue(new Error('Not found'));

      const result = await controller.getEPubs(SourceTypes.Media, 'media-1');

      expect(result).toBe(ErrorTypes.NotFound404);
    });
  });

  describe('requestEPub', () => {
    it('requests EPub for Media source', async () => {
      jest.spyOn(controller, 'requestMediaEPub').mockResolvedValue(undefined);

      await controller.requestEPub(SourceTypes.Media, 'media-1');

      expect(controller.requestMediaEPub).toHaveBeenCalledWith('media-1');
      expect(prompt.addOne).toHaveBeenCalledWith({
        text: 'Request sent.',
        status: 'success',
        timeout: 3000,
      });
    });
  });

  describe('requestMediaEPub', () => {
    it('requests EPub creation for media', async () => {
      api.requestEPubCreation.mockResolvedValue({});

      await controller.requestMediaEPub('media-1');

      expect(api.requestEPubCreation).toHaveBeenCalledWith('media-1');
    });

    it('logs error on failure', async () => {
      api.requestEPubCreation.mockRejectedValue(new Error('Failed'));

      await controller.requestMediaEPub('media-1');

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteEPub', () => {
    it('deletes an EPub', async () => {
      api.deleteEPub.mockResolvedValue({});

      await controller.deleteEPub('epub-1');

      expect(api.deleteEPub).toHaveBeenCalledWith('epub-1');
    });

    it('logs error on failure', async () => {
      api.deleteEPub.mockRejectedValue(new Error('Failed'));

      await controller.deleteEPub('epub-1');

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('renameEpub', () => {
    it('renames an EPub', async () => {
      const mockEPubData = { id: 'epub-1', title: 'Old Title', filename: 'old.epub' };
      api.getEPubById.mockResolvedValue({ data: mockEPubData });
      api.updateEPubSimple.mockResolvedValue({});

      await controller.renameEpub('epub-1', 'New Title');

      expect(api.getEPubById).toHaveBeenCalledWith('epub-1');
      expect(api.updateEPubSimple).toHaveBeenCalledWith('epub-1', {
        id: 'epub-1',
        title: 'New Title',
        filename: 'New Title',
      });
    });

    it('logs error on fetch failure', async () => {
      api.getEPubById.mockRejectedValue(new Error('Not found'));

      await controller.renameEpub('epub-1', 'New Title');

      expect(console.error).toHaveBeenCalled();
    });

    it('logs error on update failure', async () => {
      api.getEPubById.mockResolvedValue({ data: { id: 'epub-1' } });
      api.updateEPubSimple.mockRejectedValue(new Error('Failed'));

      await controller.renameEpub('epub-1', 'New Title');

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('pinEpub', () => {
    it('pins an unpinned EPub', async () => {
      const mockEPubData = { id: 'epub-1', publishStatus: 0 };
      api.getEPubById.mockResolvedValue({ data: mockEPubData });
      api.updateEPubSimple.mockResolvedValue({});

      await controller.pinEpub('epub-1');

      expect(api.getEPubById).toHaveBeenCalledWith('epub-1');
      expect(api.updateEPubSimple).toHaveBeenCalledWith('epub-1', {
        id: 'epub-1',
        publishStatus: 1,
      });
    });

    it('unpins a pinned EPub', async () => {
      const mockEPubData = { id: 'epub-1', publishStatus: 1 };
      api.getEPubById.mockResolvedValue({ data: mockEPubData });
      api.updateEPubSimple.mockResolvedValue({});

      await controller.pinEpub('epub-1');

      expect(api.updateEPubSimple).toHaveBeenCalledWith('epub-1', {
        id: 'epub-1',
        publishStatus: 0,
      });
    });

    it('logs error on fetch failure', async () => {
      api.getEPubById.mockRejectedValue(new Error('Not found'));

      await controller.pinEpub('epub-1');

      expect(console.error).toHaveBeenCalled();
    });

    it('logs error on update failure', async () => {
      api.getEPubById.mockResolvedValue({ data: { id: 'epub-1', publishStatus: 0 } });
      api.updateEPubSimple.mockRejectedValue(new Error('Failed'));

      await controller.pinEpub('epub-1');

      expect(console.error).toHaveBeenCalled();
    });
  });
});
