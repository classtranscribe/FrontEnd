const { test, expect } = require('../fixtures');

// CTCookieAgreement (src/components/CTCookieAgreement/index.js):
//   - Shows modal after 1500ms setTimeout
//   - Only when: !localStorage['ct-cookie-accepted'] === 'true' AND !user.isLoggedIn
//   - disableBackdropClick + disableEscapeKeyDown → cannot dismiss by clicking outside
//   - "Accept and Skip Sign In" → sets localStorage, closes modal
//
// This spec uses chromium-no-auth project (no storageState → fresh context, user not logged in)

const COOKIE_KEY = 'ct-cookie-accepted';

test.describe('Cookie Agreement Modal', () => {
  test('cookie modal appears after 1500ms for unauthenticated user', async ({ page }) => {
    // Clear any prior acceptance
    await page.goto('/');
    await page.evaluate((key) => localStorage.removeItem(key), COOKIE_KEY);
    await page.reload();

    // Modal has a 1500ms delay — wait longer
    await page.waitForTimeout(2500);

    // Cookie agreement modal should be visible
    // CTModal renders with id="cookie-agreement-inner-wrapper"
    const modal = page.locator('#cookie-agreement-inner-wrapper, [role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('"Accept and Skip Sign In" closes modal and sets localStorage', async ({ page }) => {
    await page.goto('/');
    await page.evaluate((key) => localStorage.removeItem(key), COOKIE_KEY);
    await page.reload();

    await page.waitForTimeout(2500);

    // Click "Accept and Skip Sign In"
    await page.getByText('Accept and Skip Sign In').click();

    // Modal should close
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).not.toBeVisible({ timeout: 3000 });

    // localStorage key should be set
    const value = await page.evaluate((key) => localStorage.getItem(key), COOKIE_KEY);
    expect(value).toBe('true');
  });

  test('modal does not appear when ct-cookie-accepted is already set', async ({ page }) => {
    // Pre-set the acceptance before navigating
    await page.addInitScript((key) => {
      localStorage.setItem(key, 'true');
    }, COOKIE_KEY);

    await page.goto('/');
    await page.waitForTimeout(2500);

    // Modal should NOT appear
    const modal = page.locator('#cookie-agreement-inner-wrapper').first();
    await expect(modal).not.toBeVisible();
  });

  test('modal cannot be dismissed by clicking the backdrop', async ({ page }) => {
    await page.goto('/');
    await page.evaluate((key) => localStorage.removeItem(key), COOKIE_KEY);
    await page.reload();

    await page.waitForTimeout(2500);

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Click outside the modal dialog (backdrop area)
    await page.mouse.click(10, 10);
    await page.waitForTimeout(300);

    // Modal should still be visible (disableBackdropClick=true)
    await expect(modal).toBeVisible();
  });

  test('"Accept and Sign In" navigates to sign-in page', async ({ page }) => {
    await page.goto('/');
    await page.evaluate((key) => localStorage.removeItem(key), COOKIE_KEY);
    await page.reload();

    await page.waitForTimeout(2500);

    // Click "Accept and Sign In" — should navigate to sign-in
    await page.getByText('Accept and Sign In').click();

    await expect(page).toHaveURL(/sign-in/, { timeout: 5000 });
  });

  test('modal shows ClassTranscribe branding', async ({ page }) => {
    await page.goto('/');
    await page.evaluate((key) => localStorage.removeItem(key), COOKIE_KEY);
    await page.reload();

    await page.waitForTimeout(2500);

    await expect(page.getByText('Welcome To')).toBeVisible({ timeout: 5000 });
    // CTBrand renders an <img alt="ClassTranscribe logo">, not text
    await expect(page.getByAltText('ClassTranscribe logo').first()).toBeVisible();
  });
});
