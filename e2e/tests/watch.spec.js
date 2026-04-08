const { test, expect, mockContext } = require('../fixtures');

// Full user flow: Home → Course (/offering/:id) → Playlist → Watch page (/video?id=...)
// API calls to ct-dev.ncsa.illinois.edu are intercepted by mock routes (fixtures.js)

// Navigate the full user path and return a /video?id=... URL.
// Must use an authenticated context — browser.newPage() bypasses storageState.
async function discoverVideoUrl(browser) {
  // Create an authenticated context with mock routes pre-installed
  const context = await mockContext(browser, { storageState: 'e2e/.auth/user.json' });
  const page = await context.newPage();

  await page.goto('/');

  // Wait for course cards to load from staging
  const courseCard = page.locator('a.ct-course-card').first();
  await courseCard.waitFor({ timeout: 20000 });
  const courseHref = await courseCard.getAttribute('href');

  // Navigate directly to the course page (avoids SPA click timing issues)
  await page.goto(courseHref);
  await page.waitForURL(/\/offering\//, { timeout: 10000 });

  // Course page renders playlists in #cp-pls-view.
  // Use .pl-item a to target only actual playlist items — not the "New Playlist" button
  // which sits in the .title header section and is shown when user is an instructor.
  const playlistLink = page.locator('#cp-pls-view .pl-item a').first();
  await playlistLink.waitFor({ timeout: 15000 });
  const playlistHref = await playlistLink.getAttribute('href');
  await playlistLink.click();

  let href;
  if (playlistHref && playlistHref.startsWith('#')) {
    // Student mode: hash navigation on same page, VideosView renders ct-media-card items
    const mediaCard = page.locator('.ct-media-card').first();
    await mediaCard.waitFor({ timeout: 20000 });
    href = await mediaCard.getAttribute('href');
  } else {
    // Instructor mode: navigates to /playlist/:id (InstPlaylistPage)
    // Media items render as accordions (.media-item) with a "Watch" button: <a href="/video?id=...">
    await page.waitForURL(/\/playlist\//, { timeout: 10000 });
    await page.locator('.media-item').first().waitFor({ timeout: 20000 });
    // getAttribute works even on collapsed accordion details (element in DOM but hidden)
    href = await page.locator('a[href*="/video"]').first().getAttribute('href');
  }

  await context.close();
  return href;
}

test.describe('Watch Page - Full User Flow', () => {
  let videoUrl;

  test.beforeAll(async ({ browser }) => {
    videoUrl = await discoverVideoUrl(browser);
  });

  test('navigating from home discovers a real video URL', async () => {
    expect(videoUrl).toBeTruthy();
    expect(videoUrl).toMatch(/video/);
  });

  test('watch page loads with video player', async ({ page }) => {
    await page.goto(videoUrl);
    await expect(page.locator('#watch-page')).toBeVisible({ timeout: 15000 });

    // ClassTranscribePlayer renders a video element
    const player = page.locator('video').first();
    await expect(player).toBeVisible({ timeout: 15000 });
  });

  test('transcription panel is rendered on watch page', async ({ page }) => {
    await page.goto(videoUrl);
    await expect(page.locator('#watch-page')).toBeVisible({ timeout: 15000 });

    // Transcriptions component renders with class containing "trans"
    const panel = page.locator(
      '[class*="trans"], [id*="trans"], [aria-label*="transcript"]'
    ).first();
    await expect(panel).toBeVisible({ timeout: 20000 });
  });

  test('dark mode is applied on watch page', async ({ page }) => {
    await page.goto(videoUrl);
    await expect(page.locator('#watch-page')).toBeVisible({ timeout: 15000 });

    await expect(page.locator('#ct-nav-header')).toHaveClass(/ct-nav-dark/);
  });
});

test.describe('Watch Page - Edge Cases', () => {
  test('missing media ID shows error state', async ({ page }) => {
    // Watch page with no id param → ERR_INVALID_MEDIA_ID
    await page.goto('/video');
    await expect(page.locator('#watch-page')).toBeVisible({ timeout: 10000 });

    // ErrorWrapper should render
    const error = page.locator('[class*="error"], [class*="Error"], [class*="err"]').first();
    await expect(error).toBeVisible({ timeout: 5000 });
  });

  test('invalid media ID shows error state', async ({ page }) => {
    await page.goto('/video?id=invalid-id-that-does-not-exist-xyz');
    await expect(page.locator('#watch-page')).toBeVisible({ timeout: 10000 });

    const error = page.locator('[class*="error"], [class*="Error"], [class*="err"]').first();
    await expect(error).toBeVisible({ timeout: 10000 });
  });
});
