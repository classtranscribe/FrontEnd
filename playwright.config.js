const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 2,
  timeout: 60000,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15000,
  },
  expect: {
    timeout: 15000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.js',
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: '**/cookie.spec.js',
    },
    {
      name: 'chromium-no-auth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/cookie.spec.js',
    },
  ],
  webServer: {
    command: 'yarn start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
