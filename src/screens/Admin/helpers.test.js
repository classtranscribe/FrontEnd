import { updateJson, momentToISOString } from './helpers';

describe('Admin helpers', () => {
    describe('updateJson', () => {
        test('it merges old and changed objects', () => {
            const old = { a: 1, b: 2 };
            const changed = { a: 10, b: 20 };
            const result = updateJson(old, changed);
            expect(result).toEqual({ a: 1, b: 2 });
        });

        test('it uses changed value when old value is falsy', () => {
            const old = { a: null, b: undefined, c: '' };
            const changed = { a: 'new-a', b: 'new-b', c: 'new-c' };
            const result = updateJson(old, changed);
            expect(result).toEqual({ a: 'new-a', b: 'new-b', c: 'new-c' });
        });

        test('it uses changed value when old value is 0', () => {
            const old = { count: 0 };
            const changed = { count: 5 };
            const result = updateJson(old, changed);
            expect(result).toEqual({ count: 5 });
        });

        test('it uses changed value when old value is false', () => {
            const old = { active: false };
            const changed = { active: true };
            const result = updateJson(old, changed);
            expect(result).toEqual({ active: true });
        });

        test('it only includes keys from old object', () => {
            const old = { a: 1 };
            const changed = { a: 10, b: 20 };
            const result = updateJson(old, changed);
            expect(result).toEqual({ a: 1 });
            expect(result.b).toBeUndefined();
        });

        test('it does not mutate the original old object', () => {
            const old = { a: 1, b: null };
            const changed = { a: 10, b: 'new-b' };
            const originalOld = { ...old };
            updateJson(old, changed);
            expect(old).toEqual(originalOld);
        });

        test('it handles empty old object', () => {
            const old = {};
            const changed = { a: 1 };
            const result = updateJson(old, changed);
            expect(result).toEqual({});
        });

        test('it handles empty changed object', () => {
            const old = { a: 1 };
            const changed = {};
            const result = updateJson(old, changed);
            expect(result).toEqual({ a: 1 });
        });

        test('it handles both empty objects', () => {
            const result = updateJson({}, {});
            expect(result).toEqual({});
        });

        test('it uses undefined when old is falsy and changed has no matching key', () => {
            const old = { a: null };
            const changed = {};
            const result = updateJson(old, changed);
            expect(result).toEqual({ a: undefined });
        });

        test('it keeps old truthy string value over changed', () => {
            const old = { name: 'Alice' };
            const changed = { name: 'Bob' };
            const result = updateJson(old, changed);
            expect(result).toEqual({ name: 'Alice' });
        });

        test('it keeps old truthy array value over changed', () => {
            const old = { items: [1, 2] };
            const changed = { items: [3, 4] };
            const result = updateJson(old, changed);
            expect(result).toEqual({ items: [1, 2] });
        });

        test('it keeps old truthy object value over changed', () => {
            const old = { nested: { x: 1 } };
            const changed = { nested: { x: 2 } };
            const result = updateJson(old, changed);
            expect(result).toEqual({ nested: { x: 1 } });
        });

        test('it handles multiple keys with mixed truthy/falsy values', () => {
            const old = { a: 'keep', b: null, c: 0, d: 'keep-too' };
            const changed = { a: 'ignore', b: 'use-this', c: 99, d: 'ignore-too' };
            const result = updateJson(old, changed);
            expect(result).toEqual({ a: 'keep', b: 'use-this', c: 99, d: 'keep-too' });
        });
    });

    describe('momentToISOString', () => {
        test('it returns string input as-is', () => {
            const input = '2024-01-15T00:00:00.000Z';
            const result = momentToISOString(input);
            expect(result).toBe(input);
        });

        test('it returns empty string as-is', () => {
            const result = momentToISOString('');
            expect(result).toBe('');
        });

        test('it converts moment-like object to ISO string', () => {
            const mockMoment = {
                toDate: () => new Date('2024-06-15T14:30:00Z'),
            };
            const result = momentToISOString(mockMoment);
            expect(result).toMatch(/2024-06-15T00:00:00/);
        });

        test('it sets UTC hours to midnight', () => {
            const mockMoment = {
                toDate: () => new Date('2024-03-20T18:45:30Z'),
            };
            const result = momentToISOString(mockMoment);
            const date = new Date(result);
            expect(date.getUTCHours()).toBe(0);
            expect(date.getUTCMinutes()).toBe(0);
            expect(date.getUTCSeconds()).toBe(0);
        });

        test('it returns a valid ISO string format', () => {
            const mockMoment = {
                toDate: () => new Date('2024-12-25T10:00:00Z'),
            };
            const result = momentToISOString(mockMoment);
            expect(new Date(result).toISOString()).toBe(result);
        });

        test('it handles year boundary dates', () => {
            const mockMoment = {
                toDate: () => new Date('2024-01-01T23:59:59Z'),
            };
            const result = momentToISOString(mockMoment);
            const date = new Date(result);
            expect(date.getUTCHours()).toBe(0);
        });

        test('it handles leap year dates', () => {
            const mockMoment = {
                toDate: () => new Date('2024-02-29T12:00:00Z'),
            };
            const result = momentToISOString(mockMoment);
            expect(result).toMatch(/2024-02-29T00:00:00/);
        });

        test('it handles any non-string type with toDate method', () => {
            const mockMoment = {
                toDate: () => new Date('2024-07-04T00:00:00Z'),
            };
            const result = momentToISOString(mockMoment);
            expect(typeof result).toBe('string');
            expect(result).toContain('2024-07-04');
        });
    });
});
