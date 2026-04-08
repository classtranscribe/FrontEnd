const { test, expect } = require('../fixtures');

// Mock data IDs are fixed (see e2e/mocks/data/):
//   media.json      → id: "mock-media-001"
// So the watch page URL is always /video?id=mock-media-001
const VIDEO_URL = '/video?id=mock-media-001';

test.describe('Watch Page - Full User Flow', () => {
  test('watch page loads with video player', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();

    // ClassTranscribePlayer renders a video element
    const player = page.locator('video').first();
    await expect(player).toBeVisible();
  });

  test('transcription panel is rendered on watch page', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();

    // Transcriptions component renders with class containing "trans"
    const panel = page.locator(
      '[class*="trans"], [id*="trans"], [aria-label*="transcript"]'
    ).first();
    await expect(panel).toBeVisible();
  });

  test('dark mode is applied on watch page', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();
    await expect(page.locator('#ct-nav-header')).toHaveClass(/ct-nav-dark/);
  });
});

test.describe('Watch Page - Edge Cases', () => {
  test('missing media ID shows error state', async ({ page }) => {
    // Watch page with no id param → ERR_INVALID_MEDIA_ID
    await page.goto('/video');
    await expect(page.locator('#watch-page')).toBeVisible();

    // ErrorWrapper should render
    const error = page.locator('[class*="error"], [class*="Error"], [class*="err"]').first();
    await expect(error).toBeVisible();
  });

  test('invalid media ID shows error state', async ({ page }) => {
    await page.goto('/video?id=invalid-id-that-does-not-exist-xyz');
    await expect(page.locator('#watch-page')).toBeVisible();

    const error = page.locator('[class*="error"], [class*="Error"], [class*="err"]').first();
    await expect(error).toBeVisible();
  });
});
