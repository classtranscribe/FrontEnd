import { CTUserGuide } from './user-guide';

// Mock mk-guide
const mockStart = jest.fn();

jest.mock('mk-guide', () => {
  return jest.fn().mockImplementation((props) => ({
    guides: [],
    start: mockStart,
    buttonColor: props.buttonColor,
    skipButtonColor: props.skipButtonColor,
  }));
});

// Mock CSS import
jest.mock('mk-guide/style.css', () => ({}), { virtual: true });

describe.skip('CTUserGuide', () => {
  let MkGuide;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStart.mockClear();
    MkGuide = require('mk-guide');
  });

  describe('constructor', () => {
    it('creates a CTUserGuide instance', () => {
      const userGuide = new CTUserGuide();
      expect(userGuide).toBeInstanceOf(CTUserGuide);
    });

    it('initializes MkGuide with default props', () => {
      const userGuide = new CTUserGuide();
      expect(MkGuide).toHaveBeenCalledWith({
        buttonColor: '#328383',
        skipButtonColor: 'rgb(63,63,63)',
      });
      expect(userGuide.mask).toBeDefined();
    });

    it('accepts custom mkProps', () => {
      const customProps = { buttonColor: '#ff0000' };
      // eslint-disable-next-line no-new
      new CTUserGuide([], undefined, customProps);
      expect(MkGuide).toHaveBeenCalledWith({
        buttonColor: '#ff0000',
        skipButtonColor: 'rgb(63,63,63)',
      });
    });

    it('sets guides when provided', () => {
      const guides = [{ title: 'Guide 1' }, { title: 'Guide 2' }];
      const userGuide = new CTUserGuide(guides);
      expect(userGuide.mask.guides).toEqual(guides);
    });

    it('accepts isOnboarded callback function', () => {
      const isOnboardedFn = jest.fn();
      const userGuide = new CTUserGuide([], isOnboardedFn);
      expect(userGuide.isOnboarded).toBe(isOnboardedFn);
    });
  });

  describe('isOnboarded', () => {
    it('returns false by default', async () => {
      const userGuide = new CTUserGuide();
      const result = await userGuide.isOnboarded();
      expect(result).toBe(false);
    });
  });

  describe('guides', () => {
    it('sets guides array when valid', () => {
      const userGuide = new CTUserGuide();
      const guides = [{ title: 'Guide 1' }];
      userGuide.guides(guides);
      expect(userGuide.mask.guides).toEqual(guides);
    });

    it('does not set guides when empty array provided', () => {
      const userGuide = new CTUserGuide();
      const initialGuides = [{ title: 'Initial' }];
      userGuide.mask.guides = initialGuides;
      userGuide.guides([]);
      expect(userGuide.mask.guides).toEqual(initialGuides);
    });

    it('does not set guides when non-array provided', () => {
      const userGuide = new CTUserGuide();
      const initialGuides = [{ title: 'Initial' }];
      userGuide.mask.guides = initialGuides;
      userGuide.guides(null);
      expect(userGuide.mask.guides).toEqual(initialGuides);
    });
  });

  describe('start', () => {
    it('starts guide when user is not onboarded', async () => {
      const userGuide = new CTUserGuide();
      userGuide.isOnboarded = jest.fn().mockResolvedValue(false);

      await userGuide.start();

      expect(userGuide.isOnboarded).toHaveBeenCalled();
      expect(mockStart).toHaveBeenCalled();
    });

    it('does not start guide when user is onboarded', async () => {
      const userGuide = new CTUserGuide();
      userGuide.isOnboarded = jest.fn().mockResolvedValue(true);

      await userGuide.start();

      expect(userGuide.isOnboarded).toHaveBeenCalled();
      expect(mockStart).not.toHaveBeenCalled();
    });
  });
});
