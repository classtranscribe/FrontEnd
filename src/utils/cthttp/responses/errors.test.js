import { parseError, errorType, isError, isAuthError } from './errors';

describe('errors', () => {
  describe('parseError', () => {
    it('returns status from response when available', () => {
      const error = { response: { status: 404 } };
      expect(parseError(error)).toEqual({ status: 404 });
    });

    it('returns 500 when response is not present', () => {
      const error = {};
      expect(parseError(error)).toEqual({ status: 500 });
    });

    it('handles different status codes', () => {
      expect(parseError({ response: { status: 200 } })).toEqual({ status: 200 });
      expect(parseError({ response: { status: 401 } })).toEqual({ status: 401 });
      expect(parseError({ response: { status: 403 } })).toEqual({ status: 403 });
      expect(parseError({ response: { status: 500 } })).toEqual({ status: 500 });
    });
  });

  describe('errorType', () => {
    it('returns the status number from the error', () => {
      expect(errorType({ response: { status: 404 } })).toBe(404);
      expect(errorType({ response: { status: 401 } })).toBe(401);
      expect(errorType({})).toBe(500);
    });
  });

  describe('isError', () => {
    it('returns true for numbers', () => {
      expect(isError(404)).toBe(true);
      expect(isError(500)).toBe(true);
      expect(isError(0)).toBe(true);
      expect(isError(-1)).toBe(true);
    });

    it('returns false for non-number types', () => {
      expect(isError('404')).toBe(false);
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError([])).toBe(false);
      expect(isError(true)).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('returns true for 401 status', () => {
      const error = { response: { status: 401 } };
      expect(isAuthError(error)).toBe(true);
    });

    it('returns true for 403 status', () => {
      const error = { response: { status: 403 } };
      expect(isAuthError(error)).toBe(true);
    });

    it('returns false for other status codes', () => {
      expect(isAuthError({ response: { status: 404 } })).toBe(false);
      expect(isAuthError({ response: { status: 500 } })).toBe(false);
      expect(isAuthError({ response: { status: 200 } })).toBe(false);
    });

    it('returns false when no response is present', () => {
      expect(isAuthError({})).toBe(false);
    });
  });
});
