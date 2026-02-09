import TimeString from './use-time';

describe('TimeString', () => {
    describe('toTimeString', () => {
        it('converts seconds to mm:ss format for times under an hour', () => {
            expect(TimeString.toTimeString(0)).toBe('00:00');
            expect(TimeString.toTimeString(30)).toBe('00:30');
            expect(TimeString.toTimeString(65)).toBe('01:05');
            expect(TimeString.toTimeString(599)).toBe('09:59');
            expect(TimeString.toTimeString(3599)).toBe('59:59');
        });

        it('converts seconds to H:mm:ss format for times over an hour', () => {
            expect(TimeString.toTimeString(3600)).toBe('1:00:00');
            expect(TimeString.toTimeString(3661)).toBe('1:01:01');
            expect(TimeString.toTimeString(7200)).toBe('2:00:00');
            expect(TimeString.toTimeString(36000)).toBe('10:00:00');
        });

        it('returns empty string for non-number input', () => {
            expect(TimeString.toTimeString('invalid')).toBe('');
            expect(TimeString.toTimeString(null)).toBe('');
            expect(TimeString.toTimeString(undefined)).toBe('');
        });
    });

    describe('toDecimalTimeString', () => {
        it('converts seconds to HH:mm:ss.xx format with decimal', () => {
            expect(TimeString.toDecimalTimeString(0)).toBe('00:00:00.0');
            expect(TimeString.toDecimalTimeString(30.5)).toBe('00:00:30.5');
            expect(TimeString.toDecimalTimeString(65.25)).toBe('00:01:05.25');
        });

        it('includes decimal fraction for whole seconds', () => {
            const result = TimeString.toDecimalTimeString(60);
            expect(result).toMatch(/00:01:00/);
        });
    });

    describe('toSeconds', () => {
        it('converts mm:ss format to seconds', () => {
            expect(TimeString.toSeconds('00:00')).toBe(0);
            expect(TimeString.toSeconds('00:30')).toBe(30);
            expect(TimeString.toSeconds('01:00')).toBe(60);
            expect(TimeString.toSeconds('01:30')).toBe(90);
            expect(TimeString.toSeconds('59:59')).toBe(3599);
        });

        it('converts H:mm:ss format to seconds', () => {
            expect(TimeString.toSeconds('1:00:00')).toBe(3600);
            expect(TimeString.toSeconds('1:30:30')).toBe(5430);
            expect(TimeString.toSeconds('2:00:00')).toBe(7200);
        });

        it('converts HH:mm:ss format to seconds', () => {
            expect(TimeString.toSeconds('01:00:00')).toBe(3600);
            expect(TimeString.toSeconds('10:00:00')).toBe(36000);
        });

        it('handles decimal seconds', () => {
            expect(TimeString.toSeconds('00:30.5')).toBe(30.5);
        });

        it('returns empty string for non-string input', () => {
            expect(TimeString.toSeconds(123)).toBe('');
            expect(TimeString.toSeconds(null)).toBe('');
            expect(TimeString.toSeconds(undefined)).toBe('');
        });
    });

    describe('toPrettierTimeString', () => {
        it('removes leading 00: from time strings', () => {
            expect(TimeString.toPrettierTimeString('00:30:15')).toBe('30:15');
            expect(TimeString.toPrettierTimeString('00:05:30')).toBe('05:30');
        });

        it('keeps time strings that do not start with 00:', () => {
            expect(TimeString.toPrettierTimeString('01:30:15')).toBe('01:30:15');
            expect(TimeString.toPrettierTimeString('10:05:30')).toBe('10:05:30');
        });

        it('truncates to first 8 characters', () => {
            expect(TimeString.toPrettierTimeString('00:30:15.123')).toBe('30:15');
            expect(TimeString.toPrettierTimeString('01:30:15.456')).toBe('01:30:15');
        });

        it('returns empty string for non-string input', () => {
            expect(TimeString.toPrettierTimeString(123)).toBe('');
            expect(TimeString.toPrettierTimeString(null)).toBe('');
            expect(TimeString.toPrettierTimeString(undefined)).toBe('');
        });
    });

    describe('round-trip conversion', () => {
        it('converts seconds to time string and back', () => {
            const testSeconds = [0, 30, 90, 3600, 5430];
            testSeconds.forEach(sec => {
                const timeStr = TimeString.toTimeString(sec);
                const backToSec = TimeString.toSeconds(timeStr);
                expect(backToSec).toBe(sec);
            });
        });
    });
});
