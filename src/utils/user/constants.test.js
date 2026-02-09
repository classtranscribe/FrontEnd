import {
  TOKEN_INFO_ROLES,
  TOKEN_INFO_EMAIL,
  TOKEN_INFO_GIVEN_NAME,
  TOKEN_INFO_FAMILY_NAME,
  ROLE_ADMIN,
  ROLE_INST,
  AUTH_AUTH0,
  AUTH_CILOGON,
  AUTH_TEST,
} from './constants';

describe('user constants', () => {
  describe('token info URL constants', () => {
    it('has correct TOKEN_INFO_ROLES value', () => {
      expect(TOKEN_INFO_ROLES).toBe('http://schemas.microsoft.com/ws/2008/06/identity/claims/role');
    });

    it('has correct TOKEN_INFO_EMAIL value', () => {
      expect(TOKEN_INFO_EMAIL).toBe('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress');
    });

    it('has correct TOKEN_INFO_GIVEN_NAME value', () => {
      expect(TOKEN_INFO_GIVEN_NAME).toBe('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname');
    });

    it('has correct TOKEN_INFO_FAMILY_NAME value', () => {
      expect(TOKEN_INFO_FAMILY_NAME).toBe('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname');
    });
  });

  describe('role constants', () => {
    it('has correct ROLE_ADMIN value', () => {
      expect(ROLE_ADMIN).toBe('Admin');
    });

    it('has correct ROLE_INST value', () => {
      expect(ROLE_INST).toBe('Instructor');
    });
  });

  describe('auth method constants', () => {
    it('has correct AUTH_AUTH0 value', () => {
      expect(AUTH_AUTH0).toBe('Auth0');
    });

    it('has correct AUTH_CILOGON value', () => {
      expect(AUTH_CILOGON).toBe('CILogon');
    });

    it('has correct AUTH_TEST value', () => {
      expect(AUTH_TEST).toBe('Test');
    });
  });
});
