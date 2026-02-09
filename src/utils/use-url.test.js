import { uurl } from './use-url';

// Mock env
jest.mock('./env', () => ({
    env: {
        baseURL: 'https://classtranscribe.illinois.edu'
    }
}));

describe('UrlHandler', () => {
    describe('isValidUrl', () => {
        it('returns true for valid http URLs', () => {
            expect(uurl.isValidUrl('http://example.com')).toBe(true);
            expect(uurl.isValidUrl('http://www.example.com')).toBe(true);
        });

        it('returns true for valid https URLs', () => {
            expect(uurl.isValidUrl('https://example.com')).toBe(true);
            expect(uurl.isValidUrl('https://www.example.com/path')).toBe(true);
        });

        it('returns true for URLs with paths and query strings', () => {
            expect(uurl.isValidUrl('https://example.com/path/to/page')).toBe(true);
            expect(uurl.isValidUrl('https://example.com?query=value')).toBe(true);
            expect(uurl.isValidUrl('https://example.com/path?query=value#hash')).toBe(true);
        });

        it('returns false for invalid URLs', () => {
            expect(uurl.isValidUrl('not a url')).toBe(false);
            expect(uurl.isValidUrl('example.com')).toBe(false);
            expect(uurl.isValidUrl('/relative/path')).toBe(false);
        });
    });

    describe('getMediaUrl', () => {
        it('returns blob URLs as-is', () => {
            const blobUrl = 'blob:https://example.com/12345';
            expect(uurl.getMediaUrl(blobUrl)).toBe(blobUrl);
        });

        it('returns http URLs as-is', () => {
            const httpUrl = 'https://example.com/image.jpg';
            expect(uurl.getMediaUrl(httpUrl)).toBe(httpUrl);
        });

        it('prepends baseURL to relative paths', () => {
            expect(uurl.getMediaUrl('/api/image/123')).toBe(
                'https://classtranscribe.illinois.edu/api/image/123'
            );
        });

        it('handles empty string', () => {
            expect(uurl.getMediaUrl('')).toBe('https://classtranscribe.illinois.edu');
        });

        it('handles undefined', () => {
            expect(uurl.getMediaUrl()).toBe('https://classtranscribe.illinois.edu');
        });
    });

    describe('purePath', () => {
        it('removes query string from URL', () => {
            expect(uurl.purePath('/path?query=value')).toBe('/path');
        });

        it('removes hash from URL', () => {
            expect(uurl.purePath('/path#section')).toBe('/path');
        });

        it('removes both query and hash', () => {
            expect(uurl.purePath('/path?query=value#section')).toBe('/path');
        });

        it('returns path as-is when no query or hash', () => {
            expect(uurl.purePath('/path/to/page')).toBe('/path/to/page');
        });
    });

    describe('useParams', () => {
        it('parses query string into object', () => {
            expect(uurl.useParams('?name=john&age=30')).toEqual({
                name: 'john',
                age: '30'
            });
        });

        it('handles URL-encoded values', () => {
            expect(uurl.useParams('?text=hello%20world')).toEqual({
                text: 'hello world'
            });
        });

        it('handles empty values', () => {
            expect(uurl.useParams('?empty=')).toEqual({
                empty: ''
            });
        });

        it('returns empty object for empty query', () => {
            expect(uurl.useParams('')).toEqual({});
            expect(uurl.useParams(null)).toEqual({});
            expect(uurl.useParams(undefined)).toEqual({});
        });

        it('handles hash parameters', () => {
            expect(uurl.useParams('#view=edit&id=123')).toEqual({
                view: 'edit',
                id: '123'
            });
        });
    });

    describe('createQuery', () => {
        it('creates query string from object', () => {
            const result = uurl.createQuery({ name: 'john', age: '30' }, '?');
            expect(result).toBe('?name=john&age=30');
        });

        it('skips falsy values', () => {
            const result = uurl.createQuery({ name: 'john', empty: null, undef: undefined }, '?');
            expect(result).toBe('?name=john');
        });

        it('encodes special characters', () => {
            const result = uurl.createQuery({ text: 'hello world' }, '?');
            expect(result).toBe('?text=hello%20world');
        });

        it('returns empty string when all values are falsy', () => {
            expect(uurl.createQuery({ empty: null }, '?')).toBe('');
        });

        it('works without prefix', () => {
            const result = uurl.createQuery({ name: 'john' });
            expect(result).toBe('name=john');
        });
    });

    describe('createSearch', () => {
        it('creates search query with ? prefix', () => {
            const result = uurl.createSearch({ id: '123', view: 'list' });
            expect(result).toBe('?id=123&view=list');
        });

        it('returns empty string for empty params', () => {
            expect(uurl.createSearch({})).toBe('');
        });
    });

    describe('createHash', () => {
        it('creates hash query with # prefix', () => {
            const result = uurl.createHash({ section: 'intro', page: '1' });
            expect(result).toBe('#section=intro&page=1');
        });

        it('returns empty string for empty params', () => {
            expect(uurl.createHash({})).toBe('');
        });
    });

    describe('isEqual', () => {
        it('compares two URLs', () => {
            expect(uurl.isEqual('/path', '/path')).toBe(true);
            expect(uurl.isEqual('/path1', '/path2')).toBe(false);
        });
    });
});
