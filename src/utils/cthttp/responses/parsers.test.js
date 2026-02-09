import { getFullNumber, parseSingleOffering, parseOfferings, parseMedia } from './parsers';

// Mock dependencies
jest.mock('utils/constants', () => ({
    FLASH_UNKNOWN: 0,
    CROWDEDIT_ALLOW: 0
}));

jest.mock('../../../screens/Watch/Utils', () => ({
    langMap: {
        'en-US': 'English',
        'es': 'Spanish',
        'fr': 'French'
    }
}));

jest.mock('../../user', () => ({
    user: {
        isAdmin: false
    }
}));

jest.mock('../../env', () => ({
    env: {
        baseURL: 'https://classtranscribe.illinois.edu'
    }
}));

describe('Response Parsers', () => {
    describe('getFullNumber', () => {
        it('generates full number from single course', () => {
            const courses = [{ departmentAcronym: 'CS', courseNumber: '101' }];
            expect(getFullNumber(courses)).toBe('CS101');
        });

        it('generates full number from multiple courses', () => {
            const courses = [
                { departmentAcronym: 'CS', courseNumber: '101' },
                { departmentAcronym: 'ECE', courseNumber: '120' }
            ];
            expect(getFullNumber(courses)).toBe('CS101/ECE120');
        });

        it('uses custom separator', () => {
            const courses = [
                { departmentAcronym: 'CS', courseNumber: '101' },
                { departmentAcronym: 'ECE', courseNumber: '120' }
            ];
            expect(getFullNumber(courses, '-')).toBe('CS101-ECE120');
        });

        it('handles courses with acronym instead of departmentAcronym', () => {
            const courses = [{ acronym: 'MATH', courseNumber: '241' }];
            expect(getFullNumber(courses)).toBe('MATH241');
        });

        it('handles courses without acronym', () => {
            const courses = [{ courseNumber: '101' }];
            expect(getFullNumber(courses)).toBe('101');
        });
    });

    describe('parseSingleOffering', () => {
        const rawOffering = {
            offering: {
                id: 'offering-123',
                courseName: 'Introduction to CS',
                description: 'Learn programming basics'
            },
            courses: [
                { departmentAcronym: 'CS', courseNumber: '101', departmentId: 'dept-1' }
            ],
            term: {
                name: 'Fall 2023',
                universityId: 'uni-1'
            },
            instructorIds: [
                { id: 'inst-1', email: 'prof@example.com', firstName: 'John', lastName: 'Doe' }
            ]
        };

        it('parses offering with basic fields', () => {
            const result = parseSingleOffering(rawOffering);
            expect(result.id).toBe('offering-123');
            expect(result.courseName).toBe('Introduction to CS');
            expect(result.description).toBe('Learn programming basics');
        });

        it('generates fullNumber', () => {
            const result = parseSingleOffering(rawOffering);
            expect(result.fullNumber).toBe('CS101');
        });

        it('extracts termName', () => {
            const result = parseSingleOffering(rawOffering);
            expect(result.termName).toBe('Fall 2023');
        });

        it('extracts universityId from term', () => {
            const result = parseSingleOffering(rawOffering);
            expect(result.universityId).toBe('uni-1');
        });

        it('extracts departmentIds from courses', () => {
            const result = parseSingleOffering(rawOffering);
            expect(result.departmentIds).toEqual(['dept-1']);
        });

        it('formats instructor with fullName', () => {
            const result = parseSingleOffering(rawOffering);
            expect(result.instructor.fullName).toBe('John Doe');
            expect(result.instructor.email).toBe('prof@example.com');
        });

        it('includes instructorIds array', () => {
            const result = parseSingleOffering(rawOffering);
            expect(result.instructorIds).toHaveLength(1);
            expect(result.instructorIds[0].id).toBe('inst-1');
        });

        it('identifies test courses by courseNumber 000', () => {
            const testOffering = {
                ...rawOffering,
                courses: [{ departmentAcronym: 'CS', courseNumber: '000', departmentId: 'dept-1' }]
            };
            const result = parseSingleOffering(testOffering);
            expect(result.isTestCourse).toBe(true);
        });

        it('handles offering without instructors', () => {
            const noInstructorOffering = {
                ...rawOffering,
                instructorIds: null
            };
            const result = parseSingleOffering(noInstructorOffering);
            expect(result.instructor).toBeNull();
        });
    });

    describe('parseOfferings', () => {
        const rawOfferings = [
            {
                offering: { id: 'off-1', courseName: 'CS 101' },
                courses: [{ departmentAcronym: 'CS', courseNumber: '101', departmentId: 'd1' }],
                term: { name: 'Fall 2023', universityId: 'u1' },
                instructorIds: []
            },
            {
                offering: { id: 'off-2', courseName: 'CS 102' },
                courses: [{ departmentAcronym: 'CS', courseNumber: '102', departmentId: 'd1' }],
                term: { name: 'Fall 2023', universityId: 'u1' },
                instructorIds: []
            }
        ];

        it('parses array of offerings', () => {
            const result = parseOfferings(rawOfferings);
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('off-1');
            expect(result[1].id).toBe('off-2');
        });

        it('filters test courses when filterTestCourses is true', () => {
            const offeringsWithTest = [
                ...rawOfferings,
                {
                    offering: { id: 'test-off', courseName: 'Test' },
                    courses: [{ departmentAcronym: 'CS', courseNumber: '000', departmentId: 'd1' }],
                    term: { name: 'Fall 2023', universityId: 'u1' },
                    instructorIds: []
                }
            ];
            const result = parseOfferings(offeringsWithTest, true);
            expect(result).toHaveLength(2);
            expect(result.find(o => o.id === 'test-off')).toBeUndefined();
        });
    });

    describe('parseMedia', () => {
        it('returns default object for null/undefined media', () => {
            const result = parseMedia(null);
            expect(result.id).toBe('');
            expect(result.isUnavailable).toBe(true);
        });

        it('returns default object for media without id or jsonMetadata', () => {
            const result = parseMedia({ name: 'test' });
            expect(result.id).toBe('');
        });

        it('parses basic media properties', () => {
            const media = {
                id: 'media-123',
                name: 'Lecture 1.mp4',
                jsonMetadata: {},
                sourceType: 1,
                ready: true,
                duration: 3600
            };
            const result = parseMedia(media);
            expect(result.id).toBe('media-123');
            expect(result.mediaName).toBe('Lecture 1');
            expect(result.sourceType).toBe(1);
            expect(result.transReady).toBe(true);
            expect(result.duration).toBe(3600);
        });

        it('parses video paths', () => {
            const media = {
                id: 'media-123',
                jsonMetadata: {},
                video: {
                    video1Path: '/api/video/123.mp4',
                    video2Path: '/api/video/124.mp4'
                }
            };
            const result = parseMedia(media);
            expect(result.videos[0].srcPath1).toBe('https://classtranscribe.illinois.edu/api/video/123.mp4');
            expect(result.videos[0].srcPath2).toBe('https://classtranscribe.illinois.edu/api/video/124.mp4');
            expect(result.isTwoScreen).toBe(true);
            expect(result.isUnavailable).toBe(false);
        });

        it('parses ASL video path', () => {
            const media = {
                id: 'media-123',
                jsonMetadata: {},
                video: {
                    video1Path: '/api/video/123.mp4',
                    aslPath: '/api/asl/123.mp4'
                }
            };
            const result = parseMedia(media);
            expect(result.aslPath).toBe('https://classtranscribe.illinois.edu/api/asl/123.mp4');
            expect(result.hasASL).toBe(true);
        });

        it('parses watch history', () => {
            const media = {
                id: 'media-123',
                jsonMetadata: {},
                watchHistory: {
                    json: { ratio: 0.5, timestamp: 1800 }
                }
            };
            const result = parseMedia(media);
            expect(result.watchHistory.ratio).toBe(0.5);
            expect(result.watchHistory.timestamp).toBe(1800);
        });

        it('parses options for flashWarning and crowdEditMode', () => {
            const media = {
                id: 'media-123',
                jsonMetadata: {},
                options: {
                    flashWarning: '2',
                    crowdEditMode: '1'
                }
            };
            const result = parseMedia(media);
            expect(result.flashWarning).toBe(2);
            expect(result.crowdEditMode).toBe(1);
        });
    });
});
