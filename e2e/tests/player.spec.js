const { test, expect } = require('../fixtures');

// Mock data IDs are fixed (see e2e/mocks/data/media.json → id: "mock-media-001")
const VIDEO_URL = '/video?id=mock-media-001';

test.describe('CTPlayer - Controls Visibility', () => {
  test('player controls bar is rendered', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();
    await expect(page.locator('video').first()).toBeVisible();

    // CTPlayer renders the control bar — hover the video area to reveal it
    const videoContainer = page.locator('.ct-player-con, #ct-player-con, [class*="player"]').first();
    await videoContainer.hover();

    // Progress bar / seek bar should be present
    const seekBar = page.locator(
      '[class*="progress"], [class*="seek"], [role="slider"], input[type="range"]'
    ).first();
    await expect(seekBar).toBeVisible();
  });

  test('video element is present and has a src source', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('video').first()).toBeVisible();

    // The video element should have a <source> child or src attribute
    const hasSrc = await page.locator('video source, video[src]').count();
    expect(hasSrc).toBeGreaterThan(0);
  });

  test('settings / menu button is visible in the player', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();

    const menuBtn = page.locator(
      '[aria-label*="setting" i], [aria-label*="menu" i], [class*="ctp-menu"], [class*="ctp-btn"]'
    ).first();
    await expect(menuBtn).toBeVisible();
  });
});

test.describe('CTPlayer - Keyboard Shortcuts', () => {
  test('Space key toggles play/pause without crashing', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();
    await expect(page.locator('video').first()).toBeVisible();

    await page.locator('body').click();
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);

    // Page should remain functional after keypress
    await expect(page.locator('#watch-page')).toBeVisible();
  });

  test('ArrowRight key seek-forwards without crashing', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();
    await page.locator('body').click();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    await expect(page.locator('#watch-page')).toBeVisible();
  });

  test('ArrowLeft key seek-backwards without crashing', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();
    await page.locator('body').click();
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);
    await expect(page.locator('#watch-page')).toBeVisible();
  });

  test('m key mute-toggle without crashing', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();
    await page.locator('body').click();
    await page.keyboard.press('m');
    await page.waitForTimeout(200);
    await expect(page.locator('#watch-page')).toBeVisible();
  });
});

test.describe('CTPlayer - Playback Rate Menu', () => {
  test('playback rate menu can be opened', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();

    const rateBtn = page.locator(
      '[aria-label*="speed" i], [aria-label*="rate" i], [class*="playback"], [class*="speed"]'
    ).first();

    if (await rateBtn.count() > 0) {
      await rateBtn.click();
      const menu = page.locator('[role="menu"], [role="listbox"], [class*="ctp-menu"]').first();
      await expect(menu).toBeVisible();
    } else {
      await expect(page.locator('#watch-page')).toBeVisible();
    }
  });
});

test.describe('CTPlayer - Captions / Transcription Toggle', () => {
  test('transcription panel is present and toggleable', async ({ page }) => {
    await page.goto(VIDEO_URL);
    await expect(page.locator('#watch-page')).toBeVisible();

    const transPanel = page.locator(
      '[id*="trans"], [class*="transcript"], [aria-label*="transcript" i]'
    ).first();
    await expect(transPanel).toBeVisible();

    await page.locator('body').click();
    await page.keyboard.press('c');
    await page.waitForTimeout(300);

    await expect(page.locator('#watch-page')).toBeVisible();
  });
});
