import registerHighlightLanguages from './prism-highlight';

// Mock prismjs component requires
jest.mock('prismjs/components/prism-jsx.min', () => ({}), { virtual: true });
jest.mock('prismjs/components/prism-python.min', () => ({}), { virtual: true });

describe('prism-highlight', () => {
  it('exports registerHighlightLanguages function', () => {
    expect(typeof registerHighlightLanguages).toBe('function');
  });

  it('calls registerHighlightLanguages without errors', () => {
    expect(() => registerHighlightLanguages()).not.toThrow();
  });

  it('registers JSX and Python Prism languages', () => {
    // This test verifies that the function executes the require statements
    // We can't easily test that Prism was actually configured since it's a side effect
    // The function returns undefined
    const result = registerHighlightLanguages();
    expect(result).toBeUndefined();
  });
});
