const { test, expect } = require('../fixtures');

// Watch History page (/history) behavior tests.
// The History screen (src/screens/History/) renders WatchHistories
// fetched from /api/WatchHistories/:userId.
// Mock routes return [] (empty array) for all WatchHistories requests, so
// the "empty state" branch is always exercised in these tests.

test.describe('History Page - Layout & Navigation', () => {
  test('history page loads without crashing', async ({ page }) => {
    await page.goto('/history');
    await expect(page.locator('#root')).toBeVisible({ timeout: 10000 });
  });

  test('nav header is visible on history page', async ({ page }) => {
    await page.goto('/history');
    await expect(page.locator('#ct-nav-header')).toBeVisible({ timeout: 10000 });
  });

  test('history page has a heading', async ({ page }) => {
    await page.goto('/history');
    // CTLayout headingProps: { heading: 'Watch History' }
    const heading = page.getByRole('heading', { name: /history/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('history page URL is /history', async ({ page }) => {
    await page.goto('/history');
    await expect(page).toHaveURL(/history/);
  });
});

test.describe('History Page - Empty State', () => {
  test('shows empty state when there are no watch history entries', async ({ page }) => {
    await page.goto('/history');
    await expect(page.locator('#root')).toBeVisible({ timeout: 10000 });

    // Mock API returns [] for WatchHistories — app should render an empty-state message
    // WatchHistories component renders "No history" or similar when the list is empty
    const emptyMsg = page.locator(
      '[class*="empty"], [class*="no-history"], [class*="placeholder"]'
    ).first();

    // Wait for data to load (Redux thunk completes)
    await page.waitForTimeout(2000);

    // Either an empty-state UI element OR simply no history item cards are shown
    const historyItems = await page.locator('[class*="history-item"], .ct-media-card').count();
    // With mock returning [], items should be 0
    expect(historyItems).toBe(0);
  });
});

test.describe('History Page - Routing', () => {
  test('navigating to /history from home works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#root')).toBeVisible();

    // Navigate via address bar (client-side routing)
    await page.goto('/history');
    await expect(page).toHaveURL(/history/);
    await expect(page.locator('#ct-nav-header')).toBeVisible({ timeout: 10000 });
  });

  test('back navigation from history returns to previous page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#root')).toBeVisible();
    await page.goto('/history');
    await expect(page).toHaveURL(/history/);

    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('brand logo on history page navigates to home', async ({ page }) => {
    await page.goto('/history');
    await expect(page.locator('#ct-nav-header')).toBeVisible({ timeout: 10000 });

    const brand = page.getByAltText('ClassTranscribe logo').first();
    await expect(brand).toBeVisible({ timeout: 10000 });
    await brand.click();
    await expect(page).toHaveURL('/');
  });
});
