/**
 * Playwright network mock layer for E2E tests.
 *
 * Only intercepts requests to https://ct-dev.ncsa.illinois.edu — the staging
 * backend configured in public/config.js.  Everything else (CDN assets,
 * localhost dev-server, etc.) is left untouched and passes through normally.
 *
 * Mock data lives in ./data/*.json and can be edited to add new test scenarios.
 */

const BASE = 'https://ct-dev.ncsa.illinois.edu';

const universities = require('./data/universities.json');
const terms = require('./data/terms.json');
const departments = require('./data/departments.json');
const offerings = require('./data/offerings.json');
const playlistsByOff = require('./data/playlists-by-offering.json');
const playlist = require('./data/playlist.json');
const media = require('./data/media.json');
const epubList = require('./data/epub-list.json');
const epub = require('./data/epub.json');

/**
 * Generate a mock JWT whose payload jwtDecode() (used client-side) can read.
 * Only the base64url-encoded payload matters; the signature is intentionally fake.
 */
function makeMockJwt() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: 'testuser@classtranscribe.com',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'Test',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'User',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'testuser@classtranscribe.com',
    'classtranscribe/UserId': 'mock-user-001',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': ['Instructor', 'Admin'],
    exp: 9999999999,
  })).toString('base64url');
  return `${header}.${payload}.mock-sig`;
}

const MOCK_JWT = makeMockJwt();

function json(data) {
  return { status: 200, contentType: 'application/json', body: JSON.stringify(data) };
}

// Minimal 1×1 white pixel PNG for mocking image buffer requests
const MOCK_IMAGE_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

/**
 * Route an intercepted ct-dev request to the correct mock response.
 * Unrecognised paths return {} so the app receives valid JSON instead of an error.
 */
function handleRequest(route, path) {
  // Mock cover image — returns a minimal 1×1 PNG buffer
  if (path === '/api/static/mock-cover.png')
    return route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.from(MOCK_IMAGE_B64, 'base64') });

  // Auth
  if (path === '/api/Account/TestSignIn')
    return route.fulfill(json({ authToken: MOCK_JWT, userId: 'mock-user-001', emailId: 'testuser@classtranscribe.com', universityId: 'mock-uni-001' }));

  // Universities — must return an array; non-array triggers InvalidDataError in homeSlice
  if (path === '/api/Universities' || path.startsWith('/api/Universities/'))
    return route.fulfill(json(universities));

  // Terms — must return an array; non-array triggers InvalidDataError + rethrow in homeSlice
  if (path.startsWith('/api/Terms/'))
    return route.fulfill(json(terms));

  // Departments
  if (path.startsWith('/api/Departments'))
    return route.fulfill(json(departments));

  // Watch history — returns array; has graceful catch block
  if (path.startsWith('/api/WatchHistories/'))
    return route.fulfill(json([]));

  // User metadata — has graceful catch block; starredOfferings field is optional
  if (path.startsWith('/api/Account/GetUserMetadata'))
    return route.fulfill(json({}));

  // Captions — transcript lines for the watch page
  if (path.startsWith('/api/Captions/'))
    return route.fulfill(json([]));

  // Offerings — ByStudent returns the full list; any /:id returns the first offering object
  if (path === '/api/Offerings/ByStudent')
    return route.fulfill(json(offerings));
  if (path.startsWith('/api/Offerings/'))
    return route.fulfill(json(offerings[0]));

  // Playlists — check more-specific ByOffering before generic /:id
  if (path.startsWith('/api/Playlists/ByOffering/'))
    return route.fulfill(json(playlistsByOff));
  if (path.startsWith('/api/Playlists/'))
    return route.fulfill(json(playlist));

  // Media — exclude multipart upload at /api/Media/Media/
  if (path.startsWith('/api/Media/') && !path.startsWith('/api/Media/Media/'))
    return route.fulfill(json(media));

  // EPubs — check more-specific BySource before generic /:id
  if (path.startsWith('/api/EPubs/BySource/'))
    return route.fulfill(json(epubList));
  if (path.startsWith('/api/EPubs/'))
    return route.fulfill(json(epub));

  // Anything else on ct-dev (SignalR hubs, swagger, etc.) — return empty JSON
  console.warn(`[mock] unhandled ct-dev path: ${path}`);
  return route.fulfill(json({}));
}

/**
 * Attach mock routes to a Playwright page or browser context.
 * Only ct-dev traffic is intercepted; all other requests pass through.
 *
 * @param {import('@playwright/test').Page | import('@playwright/test').BrowserContext} pageOrContext
 */
async function setupMockRoutes(pageOrContext) {
  await pageOrContext.route(`${BASE}/**`, (route) =>
    handleRequest(route, new URL(route.request().url()).pathname),
  );
}

module.exports = { setupMockRoutes };
