import { links, ClassTranscribeLinks } from './links';

// Mock dependencies
jest.mock('utils/env', () => ({
    env: {
        baseURL: 'https://classtranscribe.illinois.edu'
    }
}));

jest.mock('./use-url', () => ({
    uurl: {
        createSearch: (params) => {
            const entries = Object.entries(params).filter(([, v]) => v);
            if (entries.length === 0) return '';
            return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
        },
        createHash: (params) => {
            const entries = Object.entries(params).filter(([, v]) => v);
            if (entries.length === 0) return '';
            return '#' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
        }
    }
}));

describe('ClassTranscribeLinks', () => {
    describe('title', () => {
        it('sets document.title with ClassTranscribe suffix', () => {
            links.title('Test Page');
            expect(document.title).toBe('Test Page | ClassTranscribe');
        });

        it('sets just ClassTranscribe when no title provided', () => {
            links.title('');
            expect(document.title).toBe('ClassTranscribe');
        });

        it('replaces entire title when replace is true', () => {
            links.title('Custom Title', true);
            expect(document.title).toBe('');
        });
    });

    describe('static routes', () => {
        it('home returns /', () => {
            expect(links.home()).toBe('/');
        });

        it('history returns /history', () => {
            expect(links.history()).toBe('/history');
        });

        it('personalAnalytics returns /personal-analytics', () => {
            expect(links.personalAnalytics()).toBe('/personal-analytics');
        });

        it('glossary returns /glossary', () => {
            expect(links.glossary()).toBe('/glossary');
        });

        it('asl returns /asl', () => {
            expect(links.asl()).toBe('/asl');
        });

        it('instructor returns /instructor', () => {
            expect(links.instructor()).toBe('/instructor');
        });

        it('myCourses returns /instructor/my-courses', () => {
            expect(links.myCourses()).toBe('/instructor/my-courses');
        });

        it('newCourse returns /instructor/new-course', () => {
            expect(links.newCourse()).toBe('/instructor/new-course');
        });

        it('notfound404 returns /404', () => {
            expect(links.notfound404()).toBe('/404');
        });

        it('auth0Callback returns /auth0-callback', () => {
            expect(links.auth0Callback()).toBe('/auth0-callback');
        });

        it('ciLogonCallback returns /cilogon-callback', () => {
            expect(links.ciLogonCallback()).toBe('/cilogon-callback');
        });

        it('contactUs returns mailto link', () => {
            expect(links.contactUs()).toBe('mailto:classtranscribe@illinois.edu');
        });
    });

    describe('dynamic routes', () => {
        it('search with query', () => {
            expect(links.search('test query')).toBe('/search?q=test%20query');
        });

        it('search without query', () => {
            expect(links.search()).toBe('/search');
        });

        it('course with offering id', () => {
            expect(links.course('offering123')).toBe('/offering/offering123');
        });

        it('course with playlist id', () => {
            expect(links.course('offering123', 'playlist456')).toBe(
                '/offering/offering123#plid=playlist456'
            );
        });

        it('course with playlist and media id', () => {
            expect(links.course('offering123', 'playlist456', 'media789')).toBe(
                '/offering/offering123#plid=playlist456&mid=media789'
            );
        });

        it('watch with media id', () => {
            expect(links.watch('media123')).toBe('/video?id=media123');
        });

        it('watch with begin time', () => {
            expect(links.watch('media123', { begin: 30 })).toBe('/video?id=media123&begin=30');
        });

        it('watch floors begin time to integer', () => {
            expect(links.watch('media123', { begin: 30.7 })).toBe('/video?id=media123&begin=30');
        });

        it('watch ignores negative begin time', () => {
            expect(links.watch('media123', { begin: -5 })).toBe('/video?id=media123');
        });

        it('admin without tab', () => {
            expect(links.admin()).toBe('/admin');
        });

        it('admin with tab', () => {
            expect(links.admin('users')).toBe('/admin/users');
        });

        it('courseSettings', () => {
            expect(links.courseSettings('offering123')).toBe('/offering/offering123/settings');
        });

        it('courseAnalytics', () => {
            expect(links.courseAnalytics('offering123')).toBe('/offering/offering123/analytics');
        });

        it('instNewPlaylist', () => {
            expect(links.instNewPlaylist('offering123')).toBe('/offering/offering123/new-playlist');
        });

        it('playlist', () => {
            expect(links.playlist('playlist123')).toBe('/playlist/playlist123');
        });

        it('playlistUploadFiles', () => {
            expect(links.playlistUploadFiles('playlist123')).toBe('/playlist/playlist123/upload-files');
        });

        it('instMediaSettings without tab', () => {
            expect(links.instMediaSettings('media123')).toBe('/media-settings/media123');
        });

        it('instMediaSettings with tab', () => {
            expect(links.instMediaSettings('media123', 'trans')).toBe('/media-settings/media123/trans');
        });

        it('mspEpubSettings', () => {
            expect(links.mspEpubSettings('media123')).toBe('/media-settings/media123/epub');
        });

        it('mspTransSettings', () => {
            expect(links.mspTransSettings('media123')).toBe('/media-settings/media123/trans');
        });

        it('epub with id only', () => {
            expect(links.epub('epub123')).toBe('/epub/epub123');
        });

        it('epub with view', () => {
            expect(links.epub('epub123', 'edit')).toBe('/epub/epub123#view=edit');
        });

        it('componentAPI', () => {
            expect(links.componentAPI('Button')).toBe('/docs/component-api/Button');
        });

        it('videoUploadASL', () => {
            expect(links.videoUploadASL('playlist123', 'media456')).toBe(
                '/playlist/playlist123/media/media456/upload-asl'
            );
        });
    });

    describe('external URLs', () => {
        it('pgadmin returns baseURL + /pgadmin/', () => {
            expect(links.pgadmin()).toBe('https://classtranscribe.illinois.edu/pgadmin/');
        });

        it('rabbitmq returns baseURL + /rabbitmq/', () => {
            expect(links.rabbitmq()).toBe('https://classtranscribe.illinois.edu/rabbitmq/');
        });

        it('traefik returns baseURL + /traefik/', () => {
            expect(links.traefik()).toBe('https://classtranscribe.illinois.edu/traefik/');
        });

        it('swag returns baseURL + /swag/', () => {
            expect(links.swag()).toBe('https://classtranscribe.illinois.edu/swag/');
        });
    });

    describe('signIn', () => {
        it('returns sign-in path with redirect', () => {
            // Mock window.location.href
            Object.defineProperty(window, 'location', {
                value: { href: 'https://example.com/current' },
                writable: true
            });

            const result = links.signIn();
            expect(result).toContain('/sign-in');
            expect(result).toContain('redirect=');
        });

        it('accepts custom redirect', () => {
            const result = links.signIn({ redirect: '/custom' });
            expect(result).toContain('redirect=%2Fcustom');
        });

        it('accepts method parameter', () => {
            const result = links.signIn({ method: 'auth0' });
            expect(result).toContain('method=auth0');
        });
    });
});
