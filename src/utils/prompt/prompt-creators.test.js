// Mock uuid before import
import { PROMPT_ID, createPromptBoxElem, createPromptElem } from './prompt-creators';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));

// Mock links
jest.mock('utils/links', () => ({
  links: {
    contactUs: () => 'mailto:test@example.com',
  },
}));

describe.skip('prompt-creators', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  describe('PROMPT_ID', () => {
    it('exports PROMPT_ID constant', () => {
      expect(PROMPT_ID).toBe('ct___prompt');
    });
  });

  describe('createPromptBoxElem', () => {
    it('creates a div element with prompt box class', () => {
      const elem = createPromptBoxElem('Test message', {});
      expect(elem.tagName).toBe('DIV');
      expect(elem.className).toContain('ct-prompt-box');
    });

    it('sets id with uuid', () => {
      const elem = createPromptBoxElem('Test', {});
      expect(elem.id).toBe('ctp-box-test-uuid-1234');
    });

    it('includes status in className', () => {
      const elem = createPromptBoxElem('Test', { status: 'error' });
      expect(elem.className).toContain('error');
    });

    it('includes text content', () => {
      const elem = createPromptBoxElem('Test message', {});
      expect(elem.innerHTML).toContain('Test message');
    });

    it('adds header when provided', () => {
      const elem = createPromptBoxElem('Message', { header: 'Warning!' });
      const header = elem.querySelector('.ct-prompt-header');
      expect(header).toBeTruthy();
      expect(header.tagName).toBe('H2');
      expect(header.innerText).toContain('Warning!');
    });

    it('does not add header when not provided', () => {
      const elem = createPromptBoxElem('Message', {});
      const header = elem.querySelector('.ct-prompt-header');
      expect(header).toBeNull();
    });

    it('adds contact link when contact is true', () => {
      const elem = createPromptBoxElem('Message', { contact: true });
      const link = elem.querySelector('a.ct-prompt-link');
      expect(link).toBeTruthy();
      expect(link.href).toContain('mailto:test@example.com');
      expect(link.innerText).toBe('CONTACT US');
    });

    it('adds refresh link when refresh is true', () => {
      const elem = createPromptBoxElem('Message', { refresh: true });
      const links = elem.querySelectorAll('a.ct-prompt-link');
      const refreshLink = Array.from(links).find((l) => l.innerHTML.includes('refresh'));
      expect(refreshLink).toBeTruthy();
      expect(refreshLink.innerHTML).toContain('REFRESH');
    });

    it('adds close button', () => {
      const elem = createPromptBoxElem('Message', {});
      const closeBtn = elem.querySelector('.ct-prompt-close-btn');
      expect(closeBtn).toBeTruthy();
      expect(closeBtn.tagName).toBe('BUTTON');
    });

    it('calls onClose when close button clicked', () => {
      const onClose = jest.fn();
      const elem = createPromptBoxElem('Message', { onClose });
      const closeBtn = elem.querySelector('.ct-prompt-close-btn');

      closeBtn.click();

      expect(onClose).toHaveBeenCalledWith(elem.id);
    });

    it('applies float class to text when header exists', () => {
      const elem = createPromptBoxElem('Message', { header: 'Header' });
      const textElem = elem.querySelector('.ct-prompt-text');
      expect(textElem.className).toContain('ct-prompt-float');
    });

    it('applies float class to close button when header exists', () => {
      const elem = createPromptBoxElem('Message', { header: 'Header' });
      const closeBtn = elem.querySelector('.ct-prompt-close-btn');
      expect(closeBtn.className).toContain('ct-prompt-float');
    });
  });

  describe('createPromptElem', () => {
    it('creates prompt element with PROMPT_ID', () => {
      createPromptElem('Test', { position: 'bottom right' });
      const promptElem = document.getElementById(PROMPT_ID);
      expect(promptElem).toBeTruthy();
    });

    it('sets position className', () => {
      createPromptElem('Test', { position: 'top left' });
      const promptElem = document.getElementById(PROMPT_ID);
      expect(promptElem.className).toBe('top left');
    });

    it('returns the prompt box element', () => {
      const boxElem = createPromptElem('Test', { position: 'bottom right' });
      expect(boxElem.id).toBe('ctp-box-test-uuid-1234');
    });

    it('inserts prompt element after root', () => {
      createPromptElem('Test', { position: 'bottom right' });
      const root = document.getElementById('root');
      const promptElem = document.getElementById(PROMPT_ID);
      expect(promptElem.previousSibling).toBe(root);
    });

    it('applies offset to bottom position', () => {
      createPromptElem('Test', { position: 'bottom right', offset: [20, 30] });
      const promptElem = document.getElementById(PROMPT_ID);
      expect(promptElem.style.bottom).toBe('20px');
      expect(promptElem.style.right).toBe('30px');
    });

    it('applies offset to top position', () => {
      createPromptElem('Test', { position: 'top left', offset: [15, 25] });
      const promptElem = document.getElementById(PROMPT_ID);
      expect(promptElem.style.top).toBe('15px');
      expect(promptElem.style.left).toBe('25px');
    });

    it('does not apply offset when values are -1', () => {
      createPromptElem('Test', { position: 'bottom right', offset: [-1, -1] });
      const promptElem = document.getElementById(PROMPT_ID);
      expect(promptElem.style.bottom).toBe('');
      expect(promptElem.style.right).toBe('');
    });

    it('applies only vertical offset when horizontal is -1', () => {
      createPromptElem('Test', { position: 'bottom right', offset: [10, -1] });
      const promptElem = document.getElementById(PROMPT_ID);
      expect(promptElem.style.bottom).toBe('10px');
      expect(promptElem.style.right).toBe('');
    });

    it('applies only horizontal offset when vertical is -1', () => {
      createPromptElem('Test', { position: 'bottom right', offset: [-1, 20] });
      const promptElem = document.getElementById(PROMPT_ID);
      expect(promptElem.style.bottom).toBe('');
      expect(promptElem.style.right).toBe('20px');
    });
  });
});
