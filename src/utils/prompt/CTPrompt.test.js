import { CTPrompt } from './CTPrompt';

// Mock CSS import
jest.mock('components/stylesheets/ct-prompt.css', () => ({}), { virtual: true });

// Mock prompt-creators - use factory functions to defer document access
jest.mock('./prompt-creators', () => ({
  PROMPT_ID: 'ct___prompt',
  createPromptBoxElem: jest.fn(),
  createPromptElem: jest.fn(),
}));

describe.skip('CTPrompt', () => {
  let prompt;
  let PROMPT_ID;
  let createPromptBoxElem;
  let createPromptElem;

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '';

    // Get mocked functions and set up implementations
    const promptCreators = require('./prompt-creators');
    PROMPT_ID = promptCreators.PROMPT_ID;
    createPromptBoxElem = promptCreators.createPromptBoxElem;
    createPromptElem = promptCreators.createPromptElem;

    // Setup mock implementations with document (now available)
    createPromptBoxElem.mockImplementation((text) => {
      const elem = document.createElement('div');
      elem.id = `ctp-box-${Date.now()}`;
      elem.textContent = text;
      return elem;
    });

    createPromptElem.mockImplementation((text) => {
      const elem = document.createElement('div');
      elem.id = `ctp-box-${Date.now()}`;
      elem.textContent = text;
      return elem;
    });

    jest.clearAllMocks();
    prompt = new CTPrompt();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe.skip('constructor', () => {
    it('initializes with empty promptIds array', () => {
      expect(prompt.promptIds).toEqual([]);
    });

    it('binds methods to instance', () => {
      expect(prompt.close).toBeDefined();
      expect(prompt.closeAll).toBeDefined();
      expect(prompt.addOne).toBeDefined();
      expect(prompt.addMany).toBeDefined();
    });
  });

  describe.skip('addOne', () => {
    it('accepts string as prompt', () => {
      prompt.addOne('Test message');
      expect(prompt.promptIds.length).toBe(1);
    });

    it('accepts prompt object', () => {
      prompt.addOne({ text: 'Test', status: 'error' });
      expect(prompt.promptIds.length).toBe(1);
    });

    it('creates prompt element when no existing prompt', () => {
      prompt.addOne('Test');
      expect(createPromptElem).toHaveBeenCalled();
    });

    it('creates prompt box when existing prompt element exists', () => {
      // Create existing prompt element
      const existingPrompt = document.createElement('div');
      existingPrompt.id = PROMPT_ID;
      document.body.appendChild(existingPrompt);

      prompt.addOne('Test');
      expect(createPromptBoxElem).toHaveBeenCalled();
    });

    it('closes existing prompts when replace is true', () => {
      prompt.addOne('First');

      prompt.addOne('Second', true);

      // closeAll is called, so promptIds should be cleared then new one added
      expect(prompt.promptIds.length).toBeGreaterThan(0);
    });

    it('sets timeout for auto-close when timeout > 0', () => {
      const existingPrompt = document.createElement('div');
      existingPrompt.id = PROMPT_ID;
      document.body.appendChild(existingPrompt);

      prompt.addOne({ text: 'Test', timeout: 3000 });

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
    });

    it('does not set timeout when timeout is -1', () => {
      const existingPrompt = document.createElement('div');
      existingPrompt.id = PROMPT_ID;
      document.body.appendChild(existingPrompt);

      jest.clearAllTimers();
      prompt.addOne({ text: 'Test', timeout: -1 });

      expect(setTimeout).not.toHaveBeenCalled();
    });

    it('uses default timeout of 5000ms', () => {
      const existingPrompt = document.createElement('div');
      existingPrompt.id = PROMPT_ID;
      document.body.appendChild(existingPrompt);

      prompt.addOne({ text: 'Test' });

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
    });
  });

  describe.skip('close', () => {
    it('removes prompt box by id', () => {
      const boxElem = document.createElement('div');
      boxElem.id = 'ctp-box-123';
      document.body.appendChild(boxElem);
      prompt.promptIds.push('ctp-box-123');

      prompt.close('ctp-box-123');

      expect(boxElem.classList.contains('ctp-close')).toBe(true);
      expect(prompt.promptIds).not.toContain('ctp-box-123');
    });

    it('calls closeAll when boxId is undefined', () => {
      const closeAllSpy = jest.spyOn(prompt, 'closeAll');
      prompt.close();
      expect(closeAllSpy).toHaveBeenCalled();
    });

    it('removes prompt element after all boxes closed', () => {
      const promptElem = document.createElement('div');
      promptElem.id = PROMPT_ID;
      document.body.appendChild(promptElem);

      const boxElem = document.createElement('div');
      boxElem.id = 'ctp-box-123';
      promptElem.appendChild(boxElem);
      prompt.promptIds.push('ctp-box-123');

      prompt.close('ctp-box-123');

      // Advance timers to trigger prompt element removal
      jest.advanceTimersByTime(100);

      // Prompt element should be removed since no more boxes
      expect(document.getElementById(PROMPT_ID)).toBeNull();
    });

    it('does nothing if boxId does not exist', () => {
      expect(() => prompt.close('non-existent')).not.toThrow();
    });
  });

  describe.skip('closeAll', () => {
    it('closes all tracked prompts', () => {
      const box1 = document.createElement('div');
      box1.id = 'ctp-box-1';
      document.body.appendChild(box1);

      const box2 = document.createElement('div');
      box2.id = 'ctp-box-2';
      document.body.appendChild(box2);

      prompt.promptIds = ['ctp-box-1', 'ctp-box-2'];

      prompt.closeAll();

      expect(prompt.promptIds.length).toBe(0);
    });
  });

  describe.skip('addMany', () => {
    it('adds multiple prompts', () => {
      const existingPrompt = document.createElement('div');
      existingPrompt.id = PROMPT_ID;
      document.body.appendChild(existingPrompt);

      prompt.addMany([
        { text: 'First' },
        { text: 'Second' },
        { text: 'Third' }
      ]);

      expect(prompt.promptIds.length).toBe(3);
    });

    it('calls closeAll when replace is true', () => {
      const closeAllSpy = jest.spyOn(prompt, 'closeAll');
      prompt.addMany([{ text: 'Test' }], true);
      expect(closeAllSpy).toHaveBeenCalled();
    });

    it('handles empty array', () => {
      prompt.addMany([]);
      expect(prompt.promptIds.length).toBe(0);
    });
  });

  describe.skip('push', () => {
    it('delegates to addOne for single prompt', () => {
      const addOneSpy = jest.spyOn(prompt, 'addOne');
      prompt.push({ text: 'Test' });
      expect(addOneSpy).toHaveBeenCalledWith({ text: 'Test' }, undefined);
    });

    it('delegates to addMany for array of prompts', () => {
      const addManySpy = jest.spyOn(prompt, 'addMany');
      const prompts = [{ text: 'First' }, { text: 'Second' }];
      prompt.push(prompts);
      expect(addManySpy).toHaveBeenCalledWith(prompts, undefined);
    });

    it('passes replace parameter', () => {
      const addOneSpy = jest.spyOn(prompt, 'addOne');
      prompt.push({ text: 'Test' }, true);
      expect(addOneSpy).toHaveBeenCalledWith({ text: 'Test' }, true);
    });
  });

  describe.skip('error', () => {
    it('adds error prompt with error status', () => {
      const existingPrompt = document.createElement('div');
      existingPrompt.id = PROMPT_ID;
      document.body.appendChild(existingPrompt);

      prompt.error('Error message');

      expect(createPromptBoxElem).toHaveBeenCalledWith('Error message', expect.objectContaining({
        status: 'error',
      }));
    });

    it('accepts string message', () => {
      const addOneSpy = jest.spyOn(prompt, 'addOne');
      prompt.error('Simple error');
      expect(addOneSpy).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Simple error',
        status: 'error',
      }), false);
    });

    it('accepts prompt object', () => {
      const addOneSpy = jest.spyOn(prompt, 'addOne');
      prompt.error({ text: 'Complex error', header: 'Error!' });
      expect(addOneSpy).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Complex error',
        header: 'Error!',
        status: 'error',
      }), false);
    });

    it('accepts custom timeout', () => {
      const addOneSpy = jest.spyOn(prompt, 'addOne');
      prompt.error('Timed error', 2000);
      expect(addOneSpy).toHaveBeenCalledWith(expect.objectContaining({
        timeout: 2000,
      }), false);
    });

    it('handles array of error messages', () => {
      const existingPrompt = document.createElement('div');
      existingPrompt.id = PROMPT_ID;
      document.body.appendChild(existingPrompt);

      prompt.error(['Error 1', 'Error 2']);

      expect(prompt.promptIds.length).toBe(2);
    });
  });
});
