// Mock cthttp
import {
  getMediaById,
  uploadVideo,
  reorderMedias,
  renameMedia,
  updateMediaOption,
  updateCrowdEditModeMedia,
  updateFlashWarningMedia,
  updateMediaMetadata,
  deleteMedia,
  uploadASLVideo,
  deleteASLVideo,
} from './Media';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Media API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET methods', () => {
    it('getMediaById calls GET Media/:id', async () => {
      await getMediaById('media123');
      expect(cthttp.get).toHaveBeenCalledWith('Media/media123');
    });
  });

  describe('POST methods', () => {
    it('uploadVideo calls POST Media/Media with FormData', async () => {
      const mockFile1 = new File(['video1'], 'video1.mp4', { type: 'video/mp4' });
      const mockFile2 = new File(['video2'], 'video2.mp4', { type: 'video/mp4' });
      const onUploadProgress = jest.fn();

      await uploadVideo('playlist123', mockFile1, mockFile2, onUploadProgress);

      expect(cthttp.post).toHaveBeenCalledWith(
        'Media/Media',
        expect.any(FormData),
        expect.objectContaining({ onUploadProgress, timeout: 6000000 })
      );
    });

    it('reorderMedias calls POST Media/Reorder/:playlistId', async () => {
      const mediaIds = ['media1', 'media2', 'media3'];
      await reorderMedias('playlist123', mediaIds);
      expect(cthttp.post).toHaveBeenCalledWith('Media/Reorder/playlist123', mediaIds);
    });

    it('uploadASLVideo calls POST Media/ASLVideo with FormData', async () => {
      const mockVideo = new File(['asl'], 'asl.mp4', { type: 'video/mp4' });
      const onUploadProgress = jest.fn();

      await uploadASLVideo('media123', mockVideo, onUploadProgress);

      expect(cthttp.post).toHaveBeenCalledWith(
        'Media/ASLVideo',
        expect.any(FormData),
        expect.objectContaining({ onUploadProgress, timeout: 6000000 })
      );
    });
  });

  describe('PUT methods', () => {
    it('renameMedia calls PUT Media/PutMediaName with params', async () => {
      await renameMedia('media123', 'New Name');
      expect(cthttp.put).toHaveBeenCalledWith('Media/PutMediaName', null, {
        params: { name: 'New Name', mediaId: 'media123' }
      });
    });

    it('updateMediaOption calls PUT Media/Option/:mediaId/:option/:type/:value', async () => {
      await updateMediaOption('media123', 'someOption', 'string', 'value');
      expect(cthttp.put).toHaveBeenCalledWith('Media/Option/media123/someOption/string/value');
    });

    it('updateCrowdEditModeMedia calls updateMediaOption with correct params', async () => {
      await updateCrowdEditModeMedia('media123', 1);
      expect(cthttp.put).toHaveBeenCalledWith('Media/Option/media123/crowdEditMode/int/1');
    });

    it('updateFlashWarningMedia calls updateMediaOption with correct params', async () => {
      await updateFlashWarningMedia('media123', 2);
      expect(cthttp.put).toHaveBeenCalledWith('Media/Option/media123/flashWarning/int/2');
    });

    it('updateMediaMetadata calls PUT Media/PutJsonMetaData/:mediaId', async () => {
      const metadata = { key: 'value' };
      await updateMediaMetadata('media123', metadata);
      expect(cthttp.put).toHaveBeenCalledWith('Media/PutJsonMetaData/media123', metadata);
    });
  });

  describe('DELETE methods', () => {
    it('deleteMedia calls DELETE Media/:id', async () => {
      await deleteMedia('media123');
      expect(cthttp.delete).toHaveBeenCalledWith('Media/media123');
    });

    it('deleteASLVideo calls DELETE Media/ASLVideo/:mediaId', async () => {
      await deleteASLVideo('media123');
      expect(cthttp.delete).toHaveBeenCalledWith('Media/ASLVideo/media123');
    });
  });
});
