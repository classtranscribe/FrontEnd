import { uemail } from './use-email';

describe('EmailHandler', () => {
  describe('isValid', () => {
    it('returns true for valid email addresses', () => {
      expect(uemail.isValid('user@example.com')).toBe(true);
      expect(uemail.isValid('user+tag@domain.co.uk')).toBe(true);
      expect(uemail.isValid('test.user@subdomain.example.com')).toBe(true);
      expect(uemail.isValid('user123@test.org')).toBe(true);
    });

    it('returns false for invalid email addresses', () => {
      expect(uemail.isValid('notanemail')).toBe(false);
      expect(uemail.isValid('@domain.com')).toBe(false);
      expect(uemail.isValid('user@')).toBe(false);
      expect(uemail.isValid('')).toBe(false);
      expect(uemail.isValid('user @example.com')).toBe(false);
      expect(uemail.isValid('user@domain')).toBe(false);
    });

    it('returns false for null or undefined', () => {
      expect(uemail.isValid(null)).toBe(false);
      expect(uemail.isValid(undefined)).toBe(false);
    });
  });

  describe('extract', () => {
    it('extracts valid emails from comma-separated text', () => {
      const text = 'user1@example.com,user2@test.org,user3@domain.co.uk';
      const result = uemail.extract(text);
      expect(result).toEqual(['user1@example.com', 'user2@test.org', 'user3@domain.co.uk']);
    });

    it('extracts valid emails from semicolon-separated text', () => {
      const text = 'user1@example.com;user2@test.org;user3@domain.co.uk';
      const result = uemail.extract(text);
      expect(result).toEqual(['user1@example.com', 'user2@test.org', 'user3@domain.co.uk']);
    });

    it('extracts valid emails from newline-separated text', () => {
      const text = 'user1@example.com\nuser2@test.org\nuser3@domain.co.uk';
      const result = uemail.extract(text);
      expect(result).toEqual(['user1@example.com', 'user2@test.org', 'user3@domain.co.uk']);
    });

    it('extracts valid emails with mixed delimiters', () => {
      const text = 'user1@example.com, user2@test.org; user3@domain.co.uk\tuser4@email.com';
      const result = uemail.extract(text);
      expect(result).toEqual(['user1@example.com', 'user2@test.org', 'user3@domain.co.uk', 'user4@email.com']);
    });

    it('extracts emails wrapped in angle brackets', () => {
      const text = '<user1@example.com>,<user2@test.org>';
      const result = uemail.extract(text);
      expect(result).toEqual(['user1@example.com', 'user2@test.org']);
    });

    it('filters out invalid emails', () => {
      const text = 'user1@example.com,notanemail,user2@test.org,@invalid';
      const result = uemail.extract(text);
      expect(result).toEqual(['user1@example.com', 'user2@test.org']);
    });

    it('returns empty array for non-string input', () => {
      expect(uemail.extract(null)).toEqual([]);
      expect(uemail.extract(undefined)).toEqual([]);
      expect(uemail.extract(123)).toEqual([]);
      expect(uemail.extract({})).toEqual([]);
    });

    it('returns empty array for text with no valid emails', () => {
      const text = 'This is just some text with no emails';
      const result = uemail.extract(text);
      expect(result).toEqual([]);
    });

    it('handles empty string', () => {
      expect(uemail.extract('')).toEqual([]);
    });
  });
});
