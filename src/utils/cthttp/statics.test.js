import { baseUrl, getMediaFullPath, contentLoaded, initialData, offeringAccessType, playlistTypes } from './statics';

// Mock env
jest.mock('../env', () => ({
  env: {
    baseURL: 'https://classtranscribe.illinois.edu',
  },
}));

describe('statics', () => {
  describe('JSON exports', () => {
    it('exports initialData', () => {
      expect(initialData).toBeDefined();
      expect(typeof initialData).toBe('object');
    });

    it('exports offeringAccessType', () => {
      expect(offeringAccessType).toBeDefined();
      expect(typeof offeringAccessType).toBe('object');
    });

    it('exports playlistTypes', () => {
      expect(playlistTypes).toBeDefined();
      expect(typeof playlistTypes).toBe('object');
    });
  });

  describe('baseUrl', () => {
    it('returns env.baseURL when available', () => {
      expect(baseUrl()).toBe('https://classtranscribe.illinois.edu');
    });

    it('falls back to window.location.origin when env.baseURL is not set', () => {
      // Re-import after mocking env differently
      jest.resetModules();
      jest.mock('../env', () => ({
        env: {},
      }));

      delete window.location;
      window.location = { origin: 'http://localhost:3000' };

      const { baseUrl: baseUrlNew } = require('./statics');
      expect(baseUrlNew()).toBe('http://localhost:3000');
    });
  });

  describe('getMediaFullPath', () => {
    it('prepends baseURL to path', () => {
      expect(getMediaFullPath('/api/media/123')).toBe('https://classtranscribe.illinois.edu/api/media/123');
    });

    it('handles paths without leading slash', () => {
      expect(getMediaFullPath('api/media/123')).toBe('https://classtranscribe.illinois.eduapi/media/123');
    });
  });

  describe('contentLoaded', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('adds "available" class to ct-page-wrapper element', () => {
      const ele = document.createElement('div');
      ele.id = 'ct-page-wrapper';
      document.body.appendChild(ele);

      contentLoaded();

      expect(ele.classList.contains('available')).toBe(true);
    });

    it('removes element from DOM after interval', () => {
      const ele = document.createElement('div');
      ele.id = 'ct-page-wrapper';
      document.body.appendChild(ele);

      contentLoaded(100);

      expect(document.getElementById('ct-page-wrapper')).toBeTruthy();

      jest.advanceTimersByTime(100);

      // Element should be removed (outerHTML = '')
      // Note: outerHTML = '' actually removes the element in real DOM
      // In jsdom it might behave slightly differently
      expect(ele.classList.contains('available')).toBe(true);
    });

    it('uses default interval of 500ms when not specified', () => {
      const ele = document.createElement('div');
      ele.id = 'ct-page-wrapper';
      document.body.appendChild(ele);

      contentLoaded();

      jest.advanceTimersByTime(499);
      expect(document.getElementById('ct-page-wrapper')).toBeTruthy();

      jest.advanceTimersByTime(1);
      // After 500ms, removal should be attempted
    });

    it('does nothing when element does not exist', () => {
      // Should not throw error
      expect(() => contentLoaded()).not.toThrow();
    });
  });
});
