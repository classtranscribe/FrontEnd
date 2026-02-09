import CTError, { InvalidDataError } from './use-error';

describe('CTError', () => {
  it('creates an error object with name and message', () => {
    const error = new CTError('TestError', 'This is a test error');
    expect(error.name).toBe('TestError');
    expect(error.message).toBe('This is a test error');
  });

  it('has Error.prototype as its prototype', () => {
    const error = new CTError('TestError', 'This is a test error');
    expect(error instanceof Error).toBe(true);
  });

  it('can be created with different names and messages', () => {
    const error1 = new CTError('ValidationError', 'Validation failed');
    const error2 = new CTError('NetworkError', 'Network request failed');

    expect(error1.name).toBe('ValidationError');
    expect(error1.message).toBe('Validation failed');
    expect(error2.name).toBe('NetworkError');
    expect(error2.message).toBe('Network request failed');
  });
});

describe('InvalidDataError', () => {
  it('is an instance of CTError', () => {
    expect(InvalidDataError instanceof Error).toBe(true);
  });

  it('has the correct name', () => {
    expect(InvalidDataError.name).toBe('InvalidDataError');
  });

  it('has the correct message', () => {
    expect(InvalidDataError.message).toBe('The data is not valid.');
  });
});
