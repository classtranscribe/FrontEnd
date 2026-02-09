import { CTPreference } from './CTPreference';

describe('CTPreference', () => {
  let preference;

  beforeEach(() => {
    localStorage.clear();
    preference = new CTPreference();
  });

  describe('constructor', () => {
    it('initializes TRUE and FALSE constants', () => {
      expect(preference.TRUE).toBe('true');
      expect(preference.FALSE).toBe('false');
    });

    it('has init method', () => {
      expect(typeof preference.init).toBe('function');
    });
  });

  describe('localStorage', () => {
    it('sets item to "true" when bool is true', () => {
      preference.localStorage('testKey', true);

      expect(localStorage.getItem('testKey')).toBe('true');
      expect(preference.testKey).toBe(true);
    });

    it('removes item when bool is false and setfalse is false', () => {
      localStorage.setItem('testKey', 'true');
      preference.localStorage('testKey', false);

      expect(localStorage.getItem('testKey')).toBeNull();
      expect(preference.testKey).toBe(false);
    });

    it('sets item to "false" when bool is false and setfalse is true', () => {
      preference.localStorage('testKey', false, true);

      expect(localStorage.getItem('testKey')).toBe('false');
      expect(preference.testKey).toBe(false);
    });

    it('returns stored value when called without bool', () => {
      preference.testKey = 'stored value';
      const result = preference.localStorage('testKey');

      expect(result).toBe('stored value');
    });

    it('converts truthy values to boolean true', () => {
      preference.localStorage('testKey', 1);
      expect(preference.testKey).toBe(true);
      expect(localStorage.getItem('testKey')).toBe('true');
    });

    it('converts falsy values to boolean false', () => {
      preference.localStorage('testKey', 0, true);
      expect(preference.testKey).toBe(false);
      expect(localStorage.getItem('testKey')).toBe('false');
    });
  });

  describe('isTrue', () => {
    it('returns true when localStorage value is "true"', () => {
      localStorage.setItem('testKey', 'true');
      expect(preference.isTrue('testKey')).toBe(true);
    });

    it('returns false when localStorage value is not "true"', () => {
      localStorage.setItem('testKey', 'false');
      expect(preference.isTrue('testKey')).toBe(false);
    });

    it('returns false when localStorage value does not exist', () => {
      expect(preference.isTrue('nonExistentKey')).toBe(false);
    });

    it('returns false when localStorage value is any other string', () => {
      localStorage.setItem('testKey', 'yes');
      expect(preference.isTrue('testKey')).toBe(false);
    });
  });

  describe('isFalse', () => {
    it('returns true when localStorage value is "false"', () => {
      localStorage.setItem('testKey', 'false');
      expect(preference.isFalse('testKey')).toBe(true);
    });

    it('returns false when localStorage value is not "false"', () => {
      localStorage.setItem('testKey', 'true');
      expect(preference.isFalse('testKey')).toBe(false);
    });

    it('returns false when localStorage value does not exist', () => {
      expect(preference.isFalse('nonExistentKey')).toBe(false);
    });

    it('returns false when localStorage value is any other string', () => {
      localStorage.setItem('testKey', 'no');
      expect(preference.isFalse('testKey')).toBe(false);
    });
  });
});
