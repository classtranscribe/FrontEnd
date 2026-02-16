import { CTSearch } from './CTSearch';

describe('CTSearch', () => {
    describe('getRegExpTests', () => {
        it('returns array of test objects for each word', () => {
            const tests = CTSearch.getRegExpTests('hello world');
            expect(tests).toHaveLength(2);
            expect(tests[0].word).toBe('hello');
            expect(tests[1].word).toBe('world');
        });

        it('each test has testFunc, word, and reg properties', () => {
            const tests = CTSearch.getRegExpTests('test');
            expect(tests[0]).toHaveProperty('word');
            expect(tests[0]).toHaveProperty('testFunc');
            expect(tests[0]).toHaveProperty('reg');
            expect(typeof tests[0].testFunc).toBe('function');
        });

        it('handles empty string', () => {
            const tests = CTSearch.getRegExpTests('');
            expect(tests).toHaveLength(0);
        });

        it('testFunc works with string items when no keys provided', () => {
            const tests = CTSearch.getRegExpTests('hello');
            expect(tests[0].testFunc('hello world')).toBe(true);
            expect(tests[0].testFunc('goodbye')).toBe(false);
        });

        it('testFunc works with object items when keys provided', () => {
            const tests = CTSearch.getRegExpTests('john', ['name']);
            const item = { name: 'John Doe', age: 30 };
            expect(tests[0].testFunc(item)).toBe(true);
        });

        it('accepts string key as well as array of keys', () => {
            const tests = CTSearch.getRegExpTests('test', 'title');
            expect(tests[0].testFunc({ title: 'Test Book' })).toBe(true);
        });

        it('escapes special regex characters', () => {
            const tests = CTSearch.getRegExpTests('test.js');
            // Should not throw and should match literally
            expect(tests[0].testFunc('test.js file')).toBe(true);
            expect(tests[0].testFunc('testXjs file')).toBe(false);
        });
    });

    describe('getMatchFunction', () => {
        it('returns a function', () => {
            const isMatch = CTSearch.getMatchFunction('test', ['title']);
            expect(typeof isMatch).toBe('function');
        });

        it('matches items containing all search words', () => {
            const isMatch = CTSearch.getMatchFunction('hello world', ['text']);
            expect(isMatch({ text: 'hello world' })).toBe(true);
            expect(isMatch({ text: 'hello there world' })).toBe(true);
            expect(isMatch({ text: 'hello' })).toBe(false);
            expect(isMatch({ text: 'world' })).toBe(false);
        });

        it('is case insensitive by default', () => {
            const isMatch = CTSearch.getMatchFunction('HELLO', ['text']);
            expect(isMatch({ text: 'hello world' })).toBe(true);
            expect(isMatch({ text: 'HELLO WORLD' })).toBe(true);
        });

        it('searches across multiple keys', () => {
            const isMatch = CTSearch.getMatchFunction('john programming', ['author', 'title']);
            expect(isMatch({ author: 'John Doe', title: 'Programming Guide' })).toBe(true);
            expect(isMatch({ author: 'Jane', title: 'Programming Guide' })).toBe(false);
        });
    });

    describe('getResults', () => {
        const books = [
            { title: 'JavaScript Guide', author: 'John Doe' },
            { title: 'Python Basics', author: 'Jane Smith' },
            { title: 'Advanced JavaScript', author: 'Bob Wilson' },
            { title: 'React Handbook', author: 'John Smith' }
        ];

        it('returns matching items from array', () => {
            const results = CTSearch.getResults(books, 'javascript', ['title']);
            expect(results).toHaveLength(2);
            expect(results[0].title).toBe('JavaScript Guide');
            expect(results[1].title).toBe('Advanced JavaScript');
        });

        it('returns empty array when no matches', () => {
            const results = CTSearch.getResults(books, 'ruby', ['title']);
            expect(results).toHaveLength(0);
        });

        it('searches across multiple attributes', () => {
            const results = CTSearch.getResults(books, 'john', ['title', 'author']);
            expect(results).toHaveLength(2);
        });

        it('handles empty search value', () => {
            const results = CTSearch.getResults(books, '', ['title']);
            expect(results).toHaveLength(0);
        });

        it('handles empty items array', () => {
            const results = CTSearch.getResults([], 'test', ['title']);
            expect(results).toHaveLength(0);
        });

        it('matches multiple words (AND logic)', () => {
            const results = CTSearch.getResults(books, 'john javascript', ['title', 'author']);
            expect(results).toHaveLength(1);
            expect(results[0].title).toBe('JavaScript Guide');
        });

        it('handles nested object keys', () => {
            const items = [
                { meta: { title: 'Test Book' } },
                { meta: { title: 'Other Book' } }
            ];
            const results = CTSearch.getResults(items, 'test', ['meta.title']);
            expect(results).toHaveLength(1);
        });
    });
});
