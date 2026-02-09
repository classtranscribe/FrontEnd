import { _filterTrivalItems, _parseRawEPubData, _getMediaLangOptions, _generateDefaultEpubName } from './helpers';

// Mock dependencies
jest.mock('utils', () => ({
  _buildID: jest.fn(() => 'mock-id'),
}));

jest.mock('utils/constants', () => ({
  ARRAY_INIT: [],
}));

jest.mock('../../CTPlayer', () => ({
  LanguageConstants: {
    decode: jest.fn((lang) => {
      const map = {
        'en-US': 'English',
        'es': 'Spanish',
        'fr': 'French',
      };
      return map[lang] || lang;
    }),
  },
}));

describe.skip('EPub Helpers', () => {
  describe('_filterTrivalItems', () => {
    it('filters out items with empty text', () => {
      const epubData = [
        { text: 'Valid text', id: '1' },
        { text: '', id: '2' },
        { text: '   ', id: '3' },
        { text: 'Another valid', id: '4' },
      ];

      const result = _filterTrivalItems(epubData);

      expect(result.length).toBe(2);
      expect(result[0].text).toBe('Valid text');
      expect(result[1].text).toBe('Another valid');
    });

    it('keeps items with whitespace-trimmed non-empty text', () => {
      const epubData = [
        { text: '  text with spaces  ', id: '1' },
      ];

      const result = _filterTrivalItems(epubData);

      expect(result.length).toBe(1);
    });

    it('handles empty array', () => {
      const result = _filterTrivalItems([]);
      expect(result).toEqual([]);
    });
  });

  describe('_parseRawEPubData', () => {
    it('filters trivial items and adds IDs', () => {
      const rawData = [
        { text: 'First sentence.', page: 1 },
        { text: '', page: 2 },
        { text: 'Second sentence.', page: 3 },
      ];

      const result = _parseRawEPubData(rawData);

      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0].text).toBe('First sentence.');
      expect(result[1].text).toBe('Second sentence.');
    });

    it('adds unique IDs to each item', () => {
      const { _buildID } = require('utils');
      const rawData = [
        { text: 'Text 1', page: 1 },
        { text: 'Text 2', page: 2 },
      ];

      _parseRawEPubData(rawData);

      expect(_buildID).toHaveBeenCalledTimes(2);
    });

    it('preserves original item properties', () => {
      const rawData = [
        { text: 'Test', page: 5, custom: 'value' },
      ];

      const result = _parseRawEPubData(rawData);

      expect(result[0].page).toBe(5);
      expect(result[0].custom).toBe('value');
    });
  });

  describe('_getMediaLangOptions', () => {
    it('converts language codes to options', () => {
      const languages = ['en-US', 'es', 'fr'];

      const result = _getMediaLangOptions(languages);

      expect(result.length).toBe(3);
      expect(result[0]).toEqual({ text: 'English', value: 'en-US' });
      expect(result[1]).toEqual({ text: 'Spanish', value: 'es' });
      expect(result[2]).toEqual({ text: 'French', value: 'fr' });
    });

    it('handles empty language array', () => {
      const result = _getMediaLangOptions([]);
      expect(result).toEqual([]);
    });

    it('calls LanguageConstants.decode for each language', () => {
      const { LanguageConstants } = require('../../CTPlayer');
      const languages = ['en-US', 'es'];

      _getMediaLangOptions(languages);

      expect(LanguageConstants.decode).toHaveBeenCalledWith('en-US');
      expect(LanguageConstants.decode).toHaveBeenCalledWith('es');
    });
  });

  describe('_generateDefaultEpubName', () => {
    it('returns default title when no existing epubs', () => {
      const result = _generateDefaultEpubName([], 'Lecture Notes');
      expect(result).toBe('Lecture Notes');
    });

    it('returns default title when ePubs is ARRAY_INIT', () => {
      const { ARRAY_INIT } = require('utils/constants');
      const result = _generateDefaultEpubName(ARRAY_INIT, 'Lecture Notes');
      expect(result).toBe('Lecture Notes');
    });

    it('appends -1 when default title exists', () => {
      const existingEpubs = [
        { title: 'Lecture Notes' },
      ];

      const result = _generateDefaultEpubName(existingEpubs, 'Lecture Notes');
      expect(result).toBe('Lecture Notes-1');
    });

    it('increments suffix when multiple similar titles exist', () => {
      const existingEpubs = [
        { title: 'Lecture Notes' },
        { title: 'Lecture Notes-1' },
        { title: 'Lecture Notes-2' },
      ];

      const result = _generateDefaultEpubName(existingEpubs, 'Lecture Notes');
      expect(result).toBe('Lecture Notes-3');
    });

    it('handles non-sequential suffixes correctly', () => {
      const existingEpubs = [
        { title: 'Lecture Notes' },
        { title: 'Lecture Notes-1' },
        { title: 'Lecture Notes-5' },
      ];

      const result = _generateDefaultEpubName(existingEpubs, 'Lecture Notes');
      expect(result).toBe('Lecture Notes-6');
    });

    it('ignores titles that do not match default title', () => {
      const existingEpubs = [
        { title: 'Different Title' },
        { title: 'Another Book' },
      ];

      const result = _generateDefaultEpubName(existingEpubs, 'Lecture Notes');
      expect(result).toBe('Lecture Notes');
    });

    it('handles titles that partially match', () => {
      const existingEpubs = [
        { title: 'Lecture' },
        { title: 'Lecture Notes Extra' },
      ];

      const result = _generateDefaultEpubName(existingEpubs, 'Lecture Notes');
      expect(result).toBe('Lecture Notes');
    });

    it('handles suffix parsing correctly', () => {
      const existingEpubs = [
        { title: 'Book-10' },
        { title: 'Book-2' },
      ];

      const result = _generateDefaultEpubName(existingEpubs, 'Book');
      expect(result).toBe('Book-11');
    });
  });
});
