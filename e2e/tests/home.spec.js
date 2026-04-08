const { test, expect } = require('../fixtures');

// storageState (auth) is injected via playwright.config.js → chromium project
// API calls to https://ct-dev.ncsa.illinois.edu are intercepted by mock routes (fixtures.js)

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the loading placeholder to disappear and real content to appear
    await expect(page.locator('#root')).toBeVisible();
  });

  test('home page loads with course browser heading', async ({ page }) => {
    // sr-only h1 should exist in the DOM
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Course Browser');
  });

  test('shows loading state then course sections from staging', async ({ page }) => {
    // Wait for actual sections to load (real data from ct-dev.ncsa.illinois.edu)
    await expect(page.locator('.ct-section-list, [class*="section"]').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('filter UI is visible after data loads', async ({ page }) => {
    // The CourseFilter renders a filter input — wait for it
    await expect(page.locator('input[type="text"], input[placeholder]').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('nav header is visible on home page', async ({ page }) => {
    await expect(page.locator('#ct-nav-header')).toBeVisible();
  });

  test('department filter select is present and openable', async ({ page }) => {
    // CourseFilter renders CTSelect with id="home-departs-filter"
    // Wait for filter UI to appear (after data loads from staging)
    const filterContainer = page.locator('.course-filter');
    await expect(filterContainer).toBeVisible({ timeout: 15000 });

    // The departments select renders as a MUI Select — find by its label
    const deptSelect = page.locator('#home-departs-filter');
    await expect(deptSelect).toBeVisible();

    // Click the select to open dropdown
    await deptSelect.click();

    // Dropdown listbox should open
    await expect(page.locator('[role="listbox"]')).toBeVisible({ timeout: 5000 });
  });
});
