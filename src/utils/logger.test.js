import { logErrorToPrompt, logErrorToConsole, logError } from './logger';
import { prompt as prp } from './prompt';

jest.mock('./prompt', () => ({
  prompt: {
    addOne: jest.fn(),
  },
}));

describe('logger', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('logErrorToPrompt', () => {
    it('calls prp.addOne with text and options', () => {
      const text = 'Error message';
      const options = { position: 'top left', timeout: 5000 };

      logErrorToPrompt(text, options);

      expect(prp.addOne).toHaveBeenCalledWith({
        text: 'Error message',
        position: 'top left',
        timeout: 5000,
      });
    });

    it('handles undefined options properties', () => {
      logErrorToPrompt('Test error', {});

      expect(prp.addOne).toHaveBeenCalledWith({
        text: 'Test error',
        position: undefined,
        timeout: undefined,
      });
    });
  });

  describe('logErrorToConsole', () => {
    it('logs string error to console', () => {
      logErrorToConsole('Test error message');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error message');
    });

    it('logs Error object message to console', () => {
      const error = new Error('Something went wrong');
      logErrorToConsole(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Something went wrong');
    });

    it('handles object with message property', () => {
      const errorObj = { message: 'Custom error' };
      logErrorToConsole(errorObj);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Custom error');
    });
  });

  describe('logError', () => {
    it('logs to both console and prompt by default', () => {
      const error = new Error('Test error');
      logError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error');
      expect(prp.addOne).toHaveBeenCalledWith({
        text: 'Test error',
        position: 'bottom right',
        timeout: -1,
      });
    });

    it('converts string to Error object', () => {
      logError('String error');

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(prp.addOne).toHaveBeenCalledWith({
        text: 'String error',
        position: 'bottom right',
        timeout: -1,
      });
    });

    it('uses custom promptText when provided', () => {
      const error = new Error('Original error');
      logError(error, { promptText: 'Custom prompt message' });

      expect(prp.addOne).toHaveBeenCalledWith({
        text: 'Custom prompt message',
        position: 'bottom right',
        timeout: -1,
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Custom prompt message');
    });

    it('respects toConsole option', () => {
      logError('Test', { toConsole: false });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(prp.addOne).toHaveBeenCalled();
    });

    it('respects prompt option', () => {
      logError('Test', { prompt: false });

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(prp.addOne).not.toHaveBeenCalled();
    });

    it('uses custom promptPosition', () => {
      logError('Test', { promptPosition: 'top left' });

      expect(prp.addOne).toHaveBeenCalledWith({
        text: 'Test',
        position: 'top left',
        timeout: -1,
      });
    });

    it('uses custom promptTimeout', () => {
      logError('Test', { promptTimeout: 3000 });

      expect(prp.addOne).toHaveBeenCalledWith({
        text: 'Test',
        position: 'bottom right',
        timeout: 3000,
      });
    });

    it('can disable both console and prompt logging', () => {
      logError('Test', { toConsole: false, prompt: false });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(prp.addOne).not.toHaveBeenCalled();
    });
  });
});
