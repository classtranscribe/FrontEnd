// Mock cthttp
import {
  adminGetLogs,
  getCourseLogs,
  getUserLogs,
  getUserLogsByEvent,
  getOfferingSearchHistory,
  getUserSearchHistoryInOffering,
  getPlayListsByCourseId,
  getAllCourseLogs,
  sendUserAction,
} from './Logs';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Logs API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Admin Logs', () => {
    it('adminGetLogs calls GET Admin/GetLogs with params and timeout', async () => {
      await adminGetLogs('2024-01-01', '2024-12-31');
      expect(cthttp.get).toHaveBeenCalledWith('Admin/GetLogs', {
        params: { from: '2024-01-01', to: '2024-12-31' },
        timeout: 6000000,
      });
    });
  });

  describe('Course Logs - GET methods', () => {
    it('getCourseLogs calls GET Logs/CourseLogs with params and timeout', async () => {
      await getCourseLogs('view', 'offering123', '2024-01-01', '2024-12-31');
      expect(cthttp.get).toHaveBeenCalledWith('Logs/CourseLogs', {
        params: {
          eventType: 'view',
          offeringId: 'offering123',
          start: '2024-01-01',
          end: '2024-12-31',
        },
        timeout: 6000000,
      });
    });

    it('getAllCourseLogs calls GET Logs/AllCourseLogs with params and timeout', async () => {
      await getAllCourseLogs('view', 'offering123', '2024-01-01', '2024-12-31');
      expect(cthttp.get).toHaveBeenCalledWith('Logs/AllCourseLogs', {
        params: {
          eventType: 'view',
          offeringId: 'offering123',
          start: '2024-01-01',
          end: '2024-12-31',
        },
        timeout: 6000000,
      });
    });
  });

  describe('User Logs - GET methods', () => {
    it('getUserLogs calls GET Logs/UserLogs', async () => {
      await getUserLogs();
      expect(cthttp.get).toHaveBeenCalledWith('Logs/UserLogs');
    });

    it('getUserLogsByEvent calls GET Logs/UserLogs/ByEvent with params and timeout', async () => {
      await getUserLogsByEvent('search', '2024-01-01', '2024-12-31');
      expect(cthttp.get).toHaveBeenCalledWith('Logs/UserLogs/ByEvent', {
        params: {
          eventType: 'search',
          start: '2024-01-01',
          end: '2024-12-31',
        },
        timeout: 6000000,
      });
    });
  });

  describe('Search History - GET methods', () => {
    it('getOfferingSearchHistory calls GET Logs/OfferingSearchHistory with params and timeout', async () => {
      await getOfferingSearchHistory('offering123');
      expect(cthttp.get).toHaveBeenCalledWith('Logs/OfferingSearchHistory', {
        params: { offeringId: 'offering123' },
        timeout: 6000000,
      });
    });

    it('getUserSearchHistoryInOffering calls GET Logs/UserSearchHistory with params and timeout', async () => {
      await getUserSearchHistoryInOffering('offering123');
      expect(cthttp.get).toHaveBeenCalledWith('Logs/UserSearchHistory', {
        params: { offeringId: 'offering123' },
        timeout: 6000000,
      });
    });
  });

  describe('Playlists - GET methods', () => {
    it('getPlayListsByCourseId calls GET Playlists/ByOffering2/:offeringId', async () => {
      await getPlayListsByCourseId('offering123');
      expect(cthttp.get).toHaveBeenCalledWith('Playlists/ByOffering2/offering123', {
        params: { offeringId: 'offering123' },
      });
    });
  });

  describe('POST methods', () => {
    it('sendUserAction calls POST Logs with data', async () => {
      const data = { eventType: 'click', metadata: { button: 'play' } };
      await sendUserAction(data);
      expect(cthttp.post).toHaveBeenCalledWith('Logs', data);
    });
  });
});
