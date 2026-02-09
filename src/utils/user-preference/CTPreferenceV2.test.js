import CTPreferenceV2 from './CTPreferenceV2';

describe('CTPreferenceV2', () => {
  let preference;

  beforeEach(() => {
    localStorage.clear();
    preference = new CTPreferenceV2();
  });

  describe('static constants', () => {
    it('defines LSTrue as "true"', () => {
      expect(CTPreferenceV2.LSTrue).toBe('true');
    });

    it('defines LSFalse as "false"', () => {
      expect(CTPreferenceV2.LSFalse).toBe('false');
    });
  });

  describe('isValidVal', () => {
    it('returns true for valid values', () => {
      expect(preference.isValidVal('test')).toBe(true);
      expect(preference.isValidVal(0)).toBe(true);
      expect(preference.isValidVal(false)).toBe(true);
      expect(preference.isValidVal('')).toBe(true);
    });

    it('returns false for undefined', () => {
      expect(preference.isValidVal(undefined)).toBe(false);
    });

    it('returns false for null', () => {
      expect(preference.isValidVal(null)).toBe(false);
    });
  });

  describe('getVal', () => {
    it('returns stored value from localStorage', () => {
      localStorage.setItem('testKey', 'testValue');
      expect(preference.getVal('testKey')).toBe('testValue');
    });

    it('returns altValue when key does not exist', () => {
      expect(preference.getVal('nonExistent', 'default')).toBe('default');
    });

    it('returns altValue when stored value is null', () => {
      expect(preference.getVal('testKey', 'fallback')).toBe('fallback');
    });

    it('returns stored value even if empty string', () => {
      localStorage.setItem('testKey', '');
      expect(preference.getVal('testKey', 'default')).toBe('');
    });
  });

  describe('getNumVal', () => {
    it('parses and returns numeric value', () => {
      localStorage.setItem('testKey', '42');
      expect(preference.getNumVal('testKey')).toBe(42);
    });

    it('parses float values', () => {
      localStorage.setItem('testKey', '3.14');
      expect(preference.getNumVal('testKey')).toBe(3.14);
    });

    it('returns altValue for non-existent key', () => {
      expect(preference.getNumVal('nonExistent', 100)).toBe(100);
    });

    it('returns null on parse error', () => {
      localStorage.setItem('testKey', 'not a number');
      expect(preference.getNumVal('testKey')).toBeNaN();
    });
  });

  describe('getJSONVal', () => {
    it('parses and returns JSON object', () => {
      localStorage.setItem('testKey', '{"foo":"bar"}');
      expect(preference.getJSONVal('testKey')).toEqual({ foo: 'bar' });
    });

    it('parses and returns JSON array', () => {
      localStorage.setItem('testKey', '[1,2,3]');
      expect(preference.getJSONVal('testKey')).toEqual([1, 2, 3]);
    });

    it('returns null for non-existent key when no altValue', () => {
      expect(preference.getJSONVal('nonExistent')).toBeNull();
    });

    it('returns null on parse error', () => {
      localStorage.setItem('testKey', 'invalid json');
      expect(preference.getJSONVal('testKey')).toBeNull();
    });
  });

  describe('isTrue', () => {
    it('returns true when value is "true"', () => {
      localStorage.setItem('testKey', 'true');
      expect(preference.isTrue('testKey')).toBe(true);
    });

    it('returns false when value is not "true"', () => {
      localStorage.setItem('testKey', 'false');
      expect(preference.isTrue('testKey')).toBe(false);
    });

    it('returns false when key does not exist', () => {
      expect(preference.isTrue('nonExistent')).toBe(false);
    });
  });

  describe('isFalse', () => {
    it('returns true when value is "false"', () => {
      localStorage.setItem('testKey', 'false');
      expect(preference.isFalse('testKey')).toBe(true);
    });

    it('returns false when value is not "false"', () => {
      localStorage.setItem('testKey', 'true');
      expect(preference.isFalse('testKey')).toBe(false);
    });

    it('returns false when key does not exist', () => {
      expect(preference.isFalse('nonExistent')).toBe(false);
    });
  });

  describe('setVal', () => {
    it('stores string value', () => {
      preference.setVal('testKey', 'testValue');
      expect(localStorage.getItem('testKey')).toBe('testValue');
    });

    it('converts number to string', () => {
      preference.setVal('testKey', 42);
      expect(localStorage.getItem('testKey')).toBe('42');
    });

    it('converts boolean to string', () => {
      preference.setVal('testKey', true);
      expect(localStorage.getItem('testKey')).toBe('true');
    });
  });

  describe('setJSONVal', () => {
    it('stringifies and stores JSON object', () => {
      preference.setJSONVal('testKey', { foo: 'bar' });
      expect(localStorage.getItem('testKey')).toBe('{"foo":"bar"}');
    });

    it('stringifies and stores JSON array', () => {
      preference.setJSONVal('testKey', [1, 2, 3]);
      expect(localStorage.getItem('testKey')).toBe('[1,2,3]');
    });
  });

  describe('setTrue', () => {
    it('sets value to "true"', () => {
      preference.setTrue('testKey');
      expect(localStorage.getItem('testKey')).toBe('true');
    });
  });

  describe('setFalse', () => {
    it('sets value to "false"', () => {
      preference.setFalse('testKey');
      expect(localStorage.getItem('testKey')).toBe('false');
    });
  });

  describe('setBool', () => {
    it('sets "true" when bool is truthy', () => {
      preference.setBool('testKey', true);
      expect(localStorage.getItem('testKey')).toBe('true');
    });

    it('sets "false" when bool is falsy', () => {
      preference.setBool('testKey', false);
      expect(localStorage.getItem('testKey')).toBe('false');
    });

    it('converts truthy values to "true"', () => {
      preference.setBool('testKey', 1);
      expect(localStorage.getItem('testKey')).toBe('true');
    });

    it('converts falsy values to "false"', () => {
      preference.setBool('testKey', 0);
      expect(localStorage.getItem('testKey')).toBe('false');
    });
  });
});
