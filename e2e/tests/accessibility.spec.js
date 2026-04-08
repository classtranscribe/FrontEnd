const { test, expect } = require('../fixtures');

// Basic accessibility (a11y) behavior tests.
// Checks landmark roles, focus management, keyboard navigation, and ARIA attributes
// across the main pages of the application.
//
// These tests do NOT require an axe-core audit — they validate concrete, observable
// a11y behaviors that real assistive-technology users depend on.

test.describe('Accessibility - Landmark Roles', () => {
  test('home page has a <main> landmark', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#root')).toBeVisible();
    // Every page should expose a <main> or role="main" for screen readers
    const main = page.locator('main, [role="main"]').first();
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('home page has a navigation landmark', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ct-nav-header')).toBeVisible();
    // NavHeader should be a <nav> or have role="navigation"
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 5000 });
  });

  test('search page has a <main> landmark', async ({ page }) => {
    await page.goto('/search');
    const main = page.locator('main, [role="main"]').first();
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('404 page renders error content wrapper', async ({ page }) => {
    await page.goto('/404');
    // CTErrorWrapper renders <div class="ct-error-wrapper"> (not a <main> landmark)
    await expect(page.getByText('The page cannot be found')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.ct-error-wrapper')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Accessibility - Headings', () => {
  test('home page has an h1 heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#root')).toBeVisible();
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 10000 });
    const text = await h1.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('search page has a heading', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('heading', { name: 'Search' })).toBeVisible({ timeout: 10000 });
  });

  test('404 page h1 contains the error message', async ({ page }) => {
    await page.goto('/404');
    await expect(page.locator('h1')).toContainText('page', { timeout: 15000 });
  });
});

test.describe('Accessibility - Focus Management', () => {
  test('search input is auto-focused when navigating to /search', async ({ page }) => {
    await page.goto('/search');
    await expect(page.locator('#sp-input')).toBeFocused({ timeout: 5000 });
  });

  test('interactive nav elements are keyboard-reachable (Tab key)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ct-nav-header')).toBeVisible();

    // Tab from body — should reach a focusable element inside the nav header
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible({ timeout: 3000 });
  });

  test('brand logo link is focusable and has accessible label', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#root')).toBeVisible();

    // CTBrand renders <Link aria-label="Home">
    const brand = page.getByRole('link', { name: /home/i }).first();
    await expect(brand).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Accessibility - ARIA Attributes', () => {
  test('search input has role="searchbox"', async ({ page }) => {
    await page.goto('/search');
    const input = page.locator('#sp-input');
    await expect(input).toHaveAttribute('role', 'searchbox');
  });

  test('nav header has an accessible id', async ({ page }) => {
    await page.goto('/');
    // The nav header carries id="ct-nav-header" which allows skip-links to target it
    const nav = page.locator('#ct-nav-header');
    await expect(nav).toBeVisible({ timeout: 15000 });
  });

  test('user profile menu button has an aria-label when logged in', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ct-nav-header')).toBeVisible();

    // MenuTrigger renders [aria-label="Profile Menu"]
    const menuBtn = page.locator('[aria-label="Profile Menu"]');
    await expect(menuBtn).toBeVisible({ timeout: 10000 });
  });

  test('course cards on home page are links with non-empty accessible text', async ({ page }) => {
    await page.goto('/');
    // Wait for course cards to load
    const firstCard = page.locator('a.ct-course-card').first();
    await expect(firstCard).toBeVisible({ timeout: 20000 });

    const linkText = await firstCard.textContent();
    expect(linkText?.trim().length).toBeGreaterThan(0);
  });
});

test.describe('Accessibility - Images', () => {
  test('ClassTranscribe logo has a non-empty alt attribute', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#root')).toBeVisible();

    // CTBrand renders <img alt="ClassTranscribe logo">
    const logo = page.getByAltText('ClassTranscribe logo').first();
    await expect(logo).toBeVisible({ timeout: 10000 });
    const alt = await logo.getAttribute('alt');
    expect(alt?.trim().length).toBeGreaterThan(0);
  });
});
