import redirect from './redirect';

describe('redirect', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock window.location
    delete window.location;
    window.location = {
      href: 'http://localhost:3000/test',
      origin: 'http://localhost:3000',
    };
  });

  describe('saveRedirectURI', () => {
    it('stores URI to localStorage with default value', () => {
      redirect.saveRedirectURI();
      expect(localStorage.getItem('redirect_uri')).toBe('http://localhost:3000/test');
    });

    it('stores custom URI to localStorage', () => {
      redirect.saveRedirectURI('http://example.com/custom');
      expect(localStorage.getItem('redirect_uri')).toBe('http://example.com/custom');
    });
  });

  describe('getRedirectURI', () => {
    it('returns stored URI from localStorage', () => {
      localStorage.setItem('redirect_uri', 'http://example.com/stored');
      expect(redirect.getRedirectURI()).toBe('http://example.com/stored');
    });

    it('returns window.location.origin when no URI is stored', () => {
      expect(redirect.getRedirectURI()).toBe('http://localhost:3000');
    });
  });

  describe('clear', () => {
    it('removes the redirect URI from localStorage', () => {
      redirect.saveRedirectURI('http://example.com/test');
      expect(localStorage.getItem('redirect_uri')).toBe('http://example.com/test');

      redirect.clear();
      expect(localStorage.getItem('redirect_uri')).toBeNull();
    });
  });

  describe('REDIRECT_URI_KEY', () => {
    it('has correct key value', () => {
      expect(redirect.REDIRECT_URI_KEY).toBe('redirect_uri');
    });
  });
});
