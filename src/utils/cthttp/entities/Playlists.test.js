// Mock cthttp
import {
  getPlaylistById,
  getPlaylistsByOfferingId,
  searchForMedia,
  createPlaylist,
  reorderPlaylists,
  updatePlaylist,
  deletePlaylist,
} from './Playlists';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Playlists API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getPlaylistById calls GET Playlists/:id', async () => {
      await getPlaylistById('playlist123');
      expect(cthttp.get).toHaveBeenCalledWith('Playlists/playlist123');
    });

    it('getPlaylistsByOfferingId calls GET Playlists/ByOffering/:offeringId', async () => {
      await getPlaylistsByOfferingId('offering456');
      expect(cthttp.get).toHaveBeenCalledWith('Playlists/ByOffering/offering456');
    });

    it('searchForMedia calls GET Playlists/SearchForMedia/:offeringId/:query', async () => {
      await searchForMedia('offering456', 'lecture 1');
      expect(cthttp.get).toHaveBeenCalledWith('Playlists/SearchForMedia/offering456/lecture 1');
    });
  });

  describe('POST methods', () => {
    it('createPlaylist calls POST Playlists with data', async () => {
      const data = { name: 'Week 1 Lectures', offeringId: 'offering456' };
      await createPlaylist(data);
      expect(cthttp.post).toHaveBeenCalledWith('Playlists', data);
    });

    it('reorderPlaylists calls POST Playlists/Reorder/:offeringId with playlistIds', async () => {
      const playlistIds = ['playlist1', 'playlist2', 'playlist3'];
      await reorderPlaylists('offering456', playlistIds);
      expect(cthttp.post).toHaveBeenCalledWith('Playlists/Reorder/offering456', playlistIds);
    });
  });

  describe('PUT methods', () => {
    it('updatePlaylist calls PUT Playlists/:id with data', async () => {
      const data = { id: 'playlist123', name: 'Updated Playlist' };
      await updatePlaylist(data);
      expect(cthttp.put).toHaveBeenCalledWith('Playlists/playlist123', data);
    });
  });

  describe('DELETE methods', () => {
    it('deletePlaylist calls DELETE Playlists/:id', async () => {
      await deletePlaylist('playlist123');
      expect(cthttp.delete).toHaveBeenCalledWith('Playlists/playlist123');
    });
  });
});
