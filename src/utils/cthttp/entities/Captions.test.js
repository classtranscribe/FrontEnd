// Mock cthttp
import {
  getTranscriptionFile,
  getCaptionsByTranscriptionId,
  getCaptionLine,
  searchCaptionInOffering,
  updateCaptionLine,
  searchCaptions,
  captionUpVote,
  captionCancelUpVote,
  captionDownVote,
  captionCancelDownVote,
} from './Captions';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

// Mock console methods to suppress logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};

describe('Captions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getTranscriptionFile calls GET Captions/TranscriptionFile/:transcriptionId/:format', async () => {
      await getTranscriptionFile('trans123', 'vtt');
      expect(cthttp.get).toHaveBeenCalledWith('Captions/TranscriptionFile/trans123/vtt');
    });

    it('getCaptionsByTranscriptionId calls GET Captions/ByTranscription/:transcriptionId', async () => {
      await getCaptionsByTranscriptionId('trans123');
      expect(cthttp.get).toHaveBeenCalledWith('Captions/ByTranscription/trans123');
    });

    it('getCaptionLine calls GET Captions with params', async () => {
      await getCaptionLine('trans123', 5);
      expect(cthttp.get).toHaveBeenCalledWith('Captions', {
        params: { transcriptionId: 'trans123', index: 5 }
      });
    });

    it('searchCaptionInOffering calls GET Captions/SearchInOffering with params', async () => {
      await searchCaptionInOffering('offering123', 'search query', 'en-US');
      expect(cthttp.get).toHaveBeenCalledWith('Captions/SearchInOffering', {
        params: { offeringId: 'offering123', query: 'search query', filterLanguage: 'en-US' }
      });
    });

    it('searchCaptionInOffering uses default language en-US', async () => {
      await searchCaptionInOffering('offering123', 'search query');
      expect(cthttp.get).toHaveBeenCalledWith('Captions/SearchInOffering', {
        params: { offeringId: 'offering123', query: 'search query', filterLanguage: 'en-US' }
      });
    });
  });

  describe('POST methods', () => {
    it('updateCaptionLine calls POST Captions with data', async () => {
      const data = {
        id: 'caption123',
        text: 'Updated caption text',
        begin: '00:00:10',
        end: '00:00:15'
      };

      // Mock returns a resolved promise for the .then() chain
      cthttp.post.mockResolvedValue({ data: {} });

      await updateCaptionLine(data);

      expect(cthttp.post).toHaveBeenCalledWith('Captions', {
        id: 'caption123',
        text: 'Updated caption text',
        begin: '00:00:10',
        end: '00:00:15'
      });
    });

    it('updateCaptionLine throws error when required fields are missing', () => {
      const invalidData = { id: 'caption123', text: 'Some text' };

      // This throws synchronously, not async
      expect(() => updateCaptionLine(invalidData)).toThrow('Required data fields are missing.');
    });

    it('searchCaptions calls POST CaptionsSearch with transList and params', async () => {
      const transList = ['trans1', 'trans2'];
      const searchData = { text: 'query', page: 1, pageSize: 10 };

      await searchCaptions(transList, searchData);

      expect(cthttp.post).toHaveBeenCalledWith('CaptionsSearch', transList, {
        params: { query: 'query', page: 1, pageSize: 10 }
      });
    });
  });

  describe('Vote methods', () => {
    it('captionUpVote calls POST Captions/UpVote with id param', async () => {
      await captionUpVote('caption123');
      expect(cthttp.post).toHaveBeenCalledWith('Captions/UpVote', null, {
        params: { id: 'caption123' }
      });
    });

    it('captionCancelUpVote calls POST Captions/CancelUpVote with id param', async () => {
      await captionCancelUpVote('caption123');
      expect(cthttp.post).toHaveBeenCalledWith('Captions/CancelUpVote', null, {
        params: { id: 'caption123' }
      });
    });

    it('captionDownVote calls POST Captions/DownVote with id param', async () => {
      await captionDownVote('caption123');
      expect(cthttp.post).toHaveBeenCalledWith('Captions/DownVote', null, {
        params: { id: 'caption123' }
      });
    });

    it('captionCancelDownVote calls POST Captions/CancelDownVote with id param', async () => {
      await captionCancelDownVote('caption123');
      expect(cthttp.post).toHaveBeenCalledWith('Captions/CancelDownVote', null, {
        params: { id: 'caption123' }
      });
    });
  });
});
