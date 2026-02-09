// Mock cthttp
import {
  getMediaWatchHistories,
  getUserWatchHistories,
  sendMediaWatchHistories,
  deleteWatchHistory,
} from './WatchHistories';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('WatchHistories API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getMediaWatchHistories calls GET WatchHistories/:mediaId', async () => {
      await getMediaWatchHistories('media123');
      expect(cthttp.get).toHaveBeenCalledWith('WatchHistories/media123');
    });

    it('getUserWatchHistories calls GET WatchHistories/GetAllWatchedMediaForUser', async () => {
      await getUserWatchHistories();
      expect(cthttp.get).toHaveBeenCalledWith('WatchHistories/GetAllWatchedMediaForUser');
    });
  });

  describe('POST methods', () => {
    it('sendMediaWatchHistories calls POST WatchHistories/:mediaId with data', async () => {
      await sendMediaWatchHistories('media123', 120, 0.5);
      expect(cthttp.post).toHaveBeenCalledWith('WatchHistories/media123', {
        timestamp: 120,
        ratio: 0.5,
      });
    });
  });

  describe('DELETE methods', () => {
    it('deleteWatchHistory calls DELETE WatchHistories with params', async () => {
      await deleteWatchHistory('history123');
      expect(cthttp.delete).toHaveBeenCalledWith('WatchHistories', {
        params: { id: 'history123' },
      });
    });
  });
});
