import {
  _getPlayerSize,
  _isCurrentTimeBlock,
  _findCurrTimeBlock,
  _downloadScreenshotByBlob,
} from './helpers';

// Mock dependencies
jest.mock('utils/use-time', () => ({
  toSeconds: jest.fn((timeStr) => {
    if (typeof timeStr === 'number') return timeStr;
    // Simple mock: assumes format like "00:10" means 10 seconds
    const parts = timeStr.split(':');
    return parts.length === 2 ? parseInt(parts[1], 10) : parseInt(timeStr, 10);
  }),
  toTimeString: jest.fn((seconds) => `00:${seconds.toString().padStart(2, '0')}`),
}));

jest.mock('js-file-download', () => jest.fn());

jest.mock('utils', () => ({
  api: {},
  uurl: {},
  prompt: {},
  _copyTextToClipboard: jest.fn(),
}));

describe.skip('CTPlayer Helpers', () => {
  describe('_getPlayerSize', () => {
    it('returns 100% dimensions when fill is true', () => {
      const result = _getPlayerSize({ fill: true });
      expect(result).toEqual({ width: '100%', height: '100%' });
    });

    it('returns 100% dimensions when isFullscreen is true', () => {
      const result = _getPlayerSize({ isFullscreen: true });
      expect(result).toEqual({ width: '100%', height: '100%' });
    });

    it('returns calculated dimensions based on width', () => {
      const result = _getPlayerSize({ width: 800 });
      expect(result.minHeight).toBe('400px');
      expect(result.width).toBe('800px');
      expect(result.height).toBe('max-content');
    });

    it('uses default width of 560 when not provided', () => {
      const result = _getPlayerSize({});
      expect(result.width).toBe('560px');
      expect(result.minHeight).toBe('280px');
    });

    it('uses provided height when specified', () => {
      const result = _getPlayerSize({ width: 800, height: 600 });
      expect(result.height).toBe('600px');
    });

    it('prioritizes fill over width/height', () => {
      const result = _getPlayerSize({ width: 800, height: 600, fill: true });
      expect(result).toEqual({ width: '100%', height: '100%' });
    });
  });

  describe('_isCurrentTimeBlock', () => {
    it('returns true when now is within time block', () => {
      const block = { begin: 10, end: 20 };
      expect(_isCurrentTimeBlock(block, 15)).toBe(true);
    });

    it('returns true when now equals begin time', () => {
      const block = { begin: 10, end: 20 };
      expect(_isCurrentTimeBlock(block, 10)).toBe(true);
    });

    it('returns true when now equals end time', () => {
      const block = { begin: 10, end: 20 };
      expect(_isCurrentTimeBlock(block, 20)).toBe(true);
    });

    it('returns false when now is before begin time', () => {
      const block = { begin: 10, end: 20 };
      expect(_isCurrentTimeBlock(block, 5)).toBe(false);
    });

    it('returns false when now is after end time', () => {
      const block = { begin: 10, end: 20 };
      expect(_isCurrentTimeBlock(block, 25)).toBe(false);
    });

    it('returns false when block is null', () => {
      expect(_isCurrentTimeBlock(null, 15)).toBe(false);
    });

    it('returns false when block has no begin', () => {
      const block = { end: 20 };
      expect(_isCurrentTimeBlock(block, 15)).toBe(false);
    });

    it('returns false when block has no end', () => {
      const block = { begin: 10 };
      expect(_isCurrentTimeBlock(block, 15)).toBe(false);
    });

    it('handles string time values', () => {
      const timestr = require('utils/use-time');
      timestr.toSeconds.mockReturnValueOnce(10).mockReturnValueOnce(20);

      const block = { begin: '00:10', end: '00:20' };
      expect(_isCurrentTimeBlock(block, 15)).toBe(true);
    });

    it('handles mixed number and string time values', () => {
      const timestr = require('utils/use-time');
      timestr.toSeconds.mockReturnValueOnce(10);

      const block = { begin: '00:10', end: 20 };
      expect(_isCurrentTimeBlock(block, 15)).toBe(true);
    });
  });

  describe('_findCurrTimeBlock', () => {
    const blocks = [
      { begin: '00:00', end: '00:10', text: 'First' },
      { begin: '00:10', end: '00:20', text: 'Second' },
      { begin: '00:20', end: '00:30', text: 'Third' },
    ];

    beforeEach(() => {
      const timestr = require('utils/use-time');
      timestr.toSeconds.mockImplementation((timeStr) => {
        const match = timeStr.match(/00:(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
    });

    it('finds block when time is within range', () => {
      const result = _findCurrTimeBlock(blocks, 15);
      expect(result).toBeDefined();
      expect(result.text).toBe('Second');
    });

    it('finds first block', () => {
      const result = _findCurrTimeBlock(blocks, 5);
      expect(result).toBeDefined();
      expect(result.text).toBe('First');
    });

    it('finds last block', () => {
      const result = _findCurrTimeBlock(blocks, 25);
      expect(result).toBeDefined();
      expect(result.text).toBe('Third');
    });

    it('returns null when time is before all blocks', () => {
      const result = _findCurrTimeBlock(blocks, -5);
      expect(result).toBeNull();
    });

    it('returns null when time is after all blocks', () => {
      const result = _findCurrTimeBlock(blocks, 35);
      expect(result).toBeNull();
    });

    it('uses startIndex parameter', () => {
      const result = _findCurrTimeBlock(blocks, 25, 2);
      expect(result).toBeDefined();
      expect(result.text).toBe('Third');
    });

    it('uses endIndex parameter', () => {
      const result = _findCurrTimeBlock(blocks, 5, 0, 1);
      expect(result).toBeDefined();
      expect(result.text).toBe('First');
    });
  });

  describe('_downloadScreenshotByBlob', () => {
    it('calls downloadFile with correct filename format', () => {
      const downloadFile = require('js-file-download');
      const mockBlob = new Blob(['test']);

      _downloadScreenshotByBlob(mockBlob, 65, 'Lecture 1');

      expect(downloadFile).toHaveBeenCalled();
      expect(downloadFile).toHaveBeenCalledWith(
        mockBlob,
        expect.stringContaining('Lecture 1.jpg')
      );
    });

    it('includes timestamp in filename', () => {
      const downloadFile = require('js-file-download');
      const mockBlob = new Blob(['test']);

      _downloadScreenshotByBlob(mockBlob, 120, 'Video');

      expect(downloadFile).toHaveBeenCalledWith(
        mockBlob,
        expect.stringContaining('(00:120)')
      );
    });

    it('handles media name with special characters', () => {
      const downloadFile = require('js-file-download');
      const mockBlob = new Blob(['test']);

      _downloadScreenshotByBlob(mockBlob, 30, 'Lecture: Part 1');

      expect(downloadFile).toHaveBeenCalledWith(
        mockBlob,
        expect.stringContaining('Lecture: Part 1.jpg')
      );
    });
  });
});
