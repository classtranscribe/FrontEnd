// Mock navigator and window before importing the module
import {
  STUDENT,
  INSTRUCTOR,
  ADMIN,
  DEFAULT_ROLE,
  ARRAY_INIT,
  ARRAY_EMPTY,
  PAGE_INSTRUCTOR,
  PAGE_HOME,
  PAGE_MEDIA_SETTING,
  PAGE_WATCH,
  isMac,
  isApple,
  isDeveloping,
  FLASH_SET_YES,
  FLASH_DETECT_YES,
  FLASH_SET_NO,
  FLASH_DETECT_NO,
  FLASH_UNKNOWN,
  CROWDEDIT_ALLOW,
  CROWDEDIT_FREEZE_ALL,
} from './constants';

const mockNavigator = {
  platform: 'Linux',
};
const mockLocation = {
  hostname: 'localhost',
  origin: 'http://localhost:3000',
};

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
});

Object.defineProperty(global, 'window', {
  value: { location: mockLocation },
  writable: true,
});

describe('constants', () => {
  describe('user roles', () => {
    it('has correct role constant values', () => {
      expect(STUDENT).toBe('u-stu');
      expect(INSTRUCTOR).toBe('u-inst');
      expect(ADMIN).toBe('u-admin');
      expect(DEFAULT_ROLE).toBe(STUDENT);
    });
  });

  describe('array sentinels', () => {
    it('has correct array sentinel values', () => {
      expect(ARRAY_INIT).toEqual(['init']);
      expect(ARRAY_EMPTY).toEqual(['empty']);
    });
  });

  describe('page constants', () => {
    it('has correct page constant values', () => {
      expect(PAGE_INSTRUCTOR).toBe('instp');
      expect(PAGE_HOME).toBe('homep');
      expect(PAGE_MEDIA_SETTING).toBe('msp');
      expect(PAGE_WATCH).toBe('watch');
    });
  });

  describe('platform detection', () => {
    it('detects Mac platform correctly', () => {
      // Already mocked to Linux, so should be false
      expect(isMac).toBe(false);
      expect(isApple).toBe(false);
    });
  });

  describe('isDeveloping', () => {
    it('is true when hostname is localhost', () => {
      // Already mocked to localhost
      expect(isDeveloping).toBe(true);
    });
  });

  describe('flash constants', () => {
    it('has correct numeric values', () => {
      expect(FLASH_SET_YES).toBe(4);
      expect(FLASH_DETECT_YES).toBe(3);
      expect(FLASH_SET_NO).toBe(2);
      expect(FLASH_DETECT_NO).toBe(1);
      expect(FLASH_UNKNOWN).toBe(0);
    });
  });

  describe('crowdedit constants', () => {
    it('has correct numeric values', () => {
      expect(CROWDEDIT_ALLOW).toBe(0);
      expect(CROWDEDIT_FREEZE_ALL).toBe(1);
    });
  });
});

describe('platform detection with different platforms', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('detects Mac platform', () => {
    Object.defineProperty(global.navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });

    const constants = require('./constants');
    expect(constants.isMac).toBe(true);
    expect(constants.isApple).toBe(true);
  });

  it('detects iPhone platform', () => {
    Object.defineProperty(global.navigator, 'platform', {
      value: 'iPhone',
      configurable: true,
    });

    const constants = require('./constants');
    expect(constants.isApple).toBe(true);
  });
});

describe('isDeveloping with different hostnames', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('is false for production hostname', () => {
    Object.defineProperty(global.window, 'location', {
      value: { hostname: 'classtranscribe.illinois.edu' },
      configurable: true,
    });

    const constants = require('./constants');
    expect(constants.isDeveloping).toBe(false);
  });

  it('is true for IPv6 localhost', () => {
    Object.defineProperty(global.window, 'location', {
      value: { hostname: '[::1]' },
      configurable: true,
    });

    const constants = require('./constants');
    expect(constants.isDeveloping).toBe(true);
  });

  it('is true for 127.0.0.1', () => {
    Object.defineProperty(global.window, 'location', {
      value: { hostname: '127.0.0.1' },
      configurable: true,
    });

    const constants = require('./constants');
    expect(constants.isDeveloping).toBe(true);
  });
});
