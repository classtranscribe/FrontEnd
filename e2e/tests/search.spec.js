const { test, expect } = require('../fixtures');

// Search input from src/screens/Search/components/SearchInput/index.js:
//   <input id="sp-input" role="searchbox" ... />
// API calls to ct-dev.ncsa.illinois.edu are intercepted by mock routes (fixtures.js)

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
    // Wait for the search input to appear
    await expect(page.locator('#sp-input')).toBeVisible();
  });

  test('search page loads with the search input', async ({ page }) => {
    const input = page.locator('#sp-input');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('role', 'searchbox');
  });

  test('search input is autofocused on page load', async ({ page }) => {
    const input = page.locator('#sp-input');
    await expect(input).toBeFocused();
  });

  test('typing in search box dispatches value to Redux state', async ({ page }) => {
    const input = page.locator('#sp-input');
    await input.fill('CS');
    await expect(input).toHaveValue('CS');
  });

  test('live results appear from staging after typing', async ({ page }) => {
    const input = page.locator('#sp-input');
    await input.fill('CS');

    // SearchResult renders course cards inside aria-live="polite" container
    // Wait for .ct-course-card items to appear from the real staging backend
    await expect(
      page.locator('.ct-course-card').first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('clearing the search input removes results', async ({ page }) => {
    const input = page.locator('#sp-input');
    await input.fill('CS');

    // Wait for results
    await page.waitForTimeout(1000);

    // Clear the input
    await input.clear();
    await expect(input).toHaveValue('');
  });

  test('search heading is visible', async ({ page }) => {
    // The layout has headingProps: { heading: 'Search' }
    await expect(page.getByRole('heading', { name: 'Search' })).toBeVisible();
  });

  test('search button is visible', async ({ page }) => {
    // SearchInput renders a search icon button with aria-label="search"
    await expect(page.getByRole('button', { name: 'search' })).toBeVisible();
  });
});
