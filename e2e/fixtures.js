/**
 * Custom Playwright test fixtures.
 *
 * - `test`        — same as base test, but the `page` fixture auto-installs
 *                   mock routes before each test (no real backend needed).
 * - `mockContext` — helper for beforeAll helpers that create their own
 *                   browser contexts (discoverVideoUrl, discoverEPubUrls, etc.).
 *
 * Usage in test files:
 *   const { test, expect }              = require('../fixtures');
 *   const { test, expect, mockContext } = require('../fixtures');
 *
 * Usage in auth.setup.js:
 *   const { test: setup, expect } = require('./fixtures');
 */

const { test: base, expect } = require('@playwright/test');
const { setupMockRoutes } = require('./mocks/api-routes');

const test = base.extend({
  // Install mock routes on the BrowserContext, not just the Page.
  // Context-level routes apply to all pages in the test, including popups
  // opened via target="_blank" — which page-level routes would miss.
  page: async ({ page, context }, use) => {
    await setupMockRoutes(context);
    await use(page);
  },
});

/**
 * Create a browser context with mock routes pre-installed.
 * Use inside beforeAll helpers that navigate the app to discover dynamic URLs.
 *
 * @param {import('@playwright/test').Browser} browser
 * @param {import('@playwright/test').BrowserContextOptions} [options]
 */
async function mockContext(browser, options = {}) {
  const context = await browser.newContext(options);
  await setupMockRoutes(context);
  return context;
}

module.exports = { test, expect, mockContext };
