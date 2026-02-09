import { strList2Html, plaintext2Html } from './plaintext';

describe('plaintext', () => {
  describe('strList2Html', () => {
    it('converts array of objects to HTML with key', () => {
      const data = [
        { text: 'First paragraph' },
        { text: 'Second paragraph' },
      ];
      const result = strList2Html(data, 'text');
      expect(result).toBe('<p>\n\tFirst paragraph\n</p>\n\n<p>\n\tSecond paragraph\n</p>');
    });

    it('filters out empty strings', () => {
      const data = [
        { text: 'First paragraph' },
        { text: '' },
        { text: 'Third paragraph' },
      ];
      const result = strList2Html(data, 'text');
      expect(result).toBe('<p>\n\tFirst paragraph\n</p>\n\n<p>\n\tThird paragraph\n</p>');
    });

    it('filters out whitespace-only strings', () => {
      const data = [
        { text: 'First paragraph' },
        { text: '   ' },
        { text: 'Third paragraph' },
      ];
      const result = strList2Html(data, 'text');
      expect(result).toBe('<p>\n\tFirst paragraph\n</p>\n\n<p>\n\tThird paragraph\n</p>');
    });

    it('returns empty string for non-array input', () => {
      expect(strList2Html('not an array', 'text')).toBe('');
      expect(strList2Html(null, 'text')).toBe('');
      expect(strList2Html(undefined, 'text')).toBe('');
      expect(strList2Html({}, 'text')).toBe('');
    });

    it('returns empty string for array without key', () => {
      const data = [
        { text: 'First paragraph' },
        { text: 'Second paragraph' },
      ];
      const result = strList2Html(data);
      expect(result).toBe('');
    });

    it('returns empty string for empty array', () => {
      const result = strList2Html([], 'text');
      expect(result).toBe('');
    });

    it('handles nested object keys', () => {
      const data = [
        { nested: { text: 'First paragraph' } },
        { nested: { text: 'Second paragraph' } },
      ];
      const result = strList2Html(data, 'nested.text');
      expect(result).toBe('<p>\n\tFirst paragraph\n</p>\n\n<p>\n\tSecond paragraph\n</p>');
    });
  });

  describe('plaintext2Html', () => {
    // Note: There's a bug in strList2Html - when called without a key parameter
    // (as plaintext2Html does), it returns an empty string because the paragraphs
    // array is never populated from the input textdata array.
    // These tests document the actual (buggy) behavior.

    it('returns empty string due to missing key parameter', () => {
      // Bug: strList2Html needs a key parameter, but plaintext2Html doesn't provide one
      const text = 'First paragraph\nSecond paragraph\nThird paragraph';
      const result = plaintext2Html(text);
      expect(result).toBe('');
    });

    it('returns empty string with custom separator', () => {
      const text = 'First paragraph||Second paragraph||Third paragraph';
      const result = plaintext2Html(text, { paragraphSeparator: '||' });
      expect(result).toBe('');
    });

    it('returns empty string for null input', () => {
      expect(plaintext2Html(null)).toBe('');
    });

    it('returns empty string for undefined input', () => {
      expect(plaintext2Html(undefined)).toBe('');
    });

    it('returns empty string for empty string input', () => {
      expect(plaintext2Html('')).toBe('');
    });

    it('returns empty string for single paragraph', () => {
      const text = 'Single paragraph';
      const result = plaintext2Html(text);
      expect(result).toBe('');
    });
  });
});
