// Simple tests for general-requests
// Note: These functions are thin wrappers around cthttp.request() which returns an axios instance.
// Full integration testing would require mocking axios, which is complex.
// These tests verify the functions exist and are exported correctly.

describe('general-requests', () => {
  it('exports getFile function', () => {
    const { getFile } = require('./general-requests');
    expect(typeof getFile).toBe('function');
  });

  it('exports getBuffer function', () => {
    const { getBuffer } = require('./general-requests');
    expect(typeof getBuffer).toBe('function');
  });

  // TODO: Add integration tests with proper axios mocking
  // The challenge is that cthttp.request() returns an axios instance,
  // which requires mocking axios.create and its returned instance methods
});
