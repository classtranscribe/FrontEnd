const { test: setup, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate via Test Sign In', async ({ page }) => {
  // Ensure .auth directory exists
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  // Navigate to sign-in with redirect back to home
  // public/config.js already sets TEST_SIGN_IN=true and staging URL
  await page.goto('/sign-in?redirect=%2F');

  // "Test Sign In" button is visible because config.js sets TEST_SIGN_IN=true
  await expect(page.getByText('Test Sign In')).toBeVisible();
  await page.getByText('Test Sign In').click();

  // testSignIn() calls GET /api/Account/TestSignIn on ct-dev.ncsa.illinois.edu,
  // saves authToken+userInfo to localStorage, then does window.location = '/'
  await page.waitForURL('/', { timeout: 15000 });

  // Verify we're on the home page and authenticated
  await expect(page.locator('#ct-nav-header')).toBeVisible();

  // Save localStorage state (authToken + userInfo) for reuse across all tests
  await page.context().storageState({ path: authFile });
});
