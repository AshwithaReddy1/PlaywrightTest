import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Set the default timeout for each test to 30 seconds
  timeout: 30000, // 30 seconds timeout for each test
  retries: 2, // Retry failed tests up to 2 times
  use: {
    headless: false, // Set to false for visible browser (headful)
    viewport: { width: 1280, height: 720 }, // Set default viewport size
    actionTimeout: 10000, // 10 seconds timeout for each action
  },
  workers: 1, // Number of workers to run tests (1 for serial execution)
  projects: [
    {
      name: 'Web', // Name of the project, which is 'Web' here
      use: { ...devices['Desktop Chrome'] },// Use Chrome browser for Desktop testing
    },
  ],
});
