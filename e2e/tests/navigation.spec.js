const { test, expect } = require('@playwright/test');

// Tests NavHeader navigation, user menu (logged-in state), routing, and sign-out
// storageState (authToken + userInfo) is injected via playwright.config.js → chromium project

test.describe('Navigation', () => {
  test('nav header is visible on all main pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ct-nav-header')).toBeVisible();

    await page.goto('/search');
    await expect(page.locator('#ct-nav-header')).toBeVisible();

    await page.goto('/history');
    await expect(page.locator('#ct-nav-header')).toBeVisible();
  });

  test('brand logo navigates to home', async ({ page }) => {
    await page.goto('/search');

    // CTBrand renders <Link aria-label="Home"><img alt="ClassTranscribe logo" /></Link>
    // In CTLayout sidebar pages the brand is in the sidebar, not inside #ct-nav-header
    // Locate by img alt text (globally) — there is exactly one such img on any page
    const brand = page.getByAltText('ClassTranscribe logo').first();
    await expect(brand).toBeVisible({ timeout: 10000 });
    await brand.click();

    await expect(page).toHaveURL('/');
  });

  test('can navigate to /search route', async ({ page }) => {
    await page.goto('/search');
    await expect(page).toHaveURL(/search/);
    await expect(page.locator('#sp-input')).toBeVisible();
  });

  test('can navigate to /history route', async ({ page }) => {
    await page.goto('/history');
    await expect(page).toHaveURL(/history/);
    await expect(page.locator('#ct-nav-header')).toBeVisible();
  });

  test('can navigate to /glossary route', async ({ page }) => {
    await page.goto('/glossary');
    await expect(page).toHaveURL(/glossary/);
    await expect(page.locator('#ct-nav-header')).toBeVisible();
  });

  test('404 page is shown for unknown routes', async ({ page }) => {
    // Use the explicit /404 route defined in App.js → renders NotFound404 reliably
    await page.goto('/404');
    // CTErrorWrapper renders: <div class="ct-ew-code">404</div>
    //                         <h1 class="ct-ew-header">The page cannot be found</h1>
    await expect(page.getByText('The page cannot be found')).toBeVisible({ timeout: 15000 });
    // CTErrorWrapper with navbar=true also renders #ct-nav-header
    await expect(page.locator('#ct-nav-header')).toBeVisible({ timeout: 5000 });
  });

  test('user menu is visible when logged in', async ({ page }) => {
    // storageState has authToken+userInfo from auth.setup.js
    await page.goto('/');

    // MenuTrigger renders [aria-label="Profile Menu"] when logged in
    const userMenuTrigger = page.locator('[aria-label="Profile Menu"]');
    await expect(userMenuTrigger).toBeVisible({ timeout: 10000 });
  });

  test('sign-out clears auth state and redirects to origin', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ct-nav-header')).toBeVisible();

    // MenuTrigger renders [aria-label="Profile Menu"] (div/img with role="button", not a <button>)
    const userMenuTrigger = page.locator('[aria-label="Profile Menu"]');
    await userMenuTrigger.waitFor({ timeout: 10000 });
    await userMenuTrigger.click();

    // ProfileMenu renders MenuItem with aria-label="Sign out"
    const signOutOption = page.locator('[aria-label="Sign out"], [title="Sign out"]').first();
    await signOutOption.waitFor({ timeout: 5000 });
    await signOutOption.click();

    // testSignOut() calls: window.location = window.location.origin → full page reload to "/"
    // (not /sign-in — test auth method redirects to origin, not sign-in page)
    await expect(page).toHaveURL('/', { timeout: 10000 });
    // Wait for the new page to fully load before evaluating localStorage
    // (window.location navigation destroys the old JS context mid-flight)
    await page.waitForLoadState('load');

    // Auth state should be cleared from localStorage
    const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(authToken).toBeNull();
  });
});
