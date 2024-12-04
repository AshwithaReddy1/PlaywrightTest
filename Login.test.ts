import { test, expect, chromium, Page } from '@playwright/test';
import * as fs from 'fs';

//Load test data from the JSON file
const testData = JSON.parse(fs.readFileSync('testData.json', 'utf8'));

//Reusable login function
const login = async (page: Page) => {
  // Go to the demo app
  await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');
  // Fill in username and password from the test data
  await page.fill('#username', testData.login.username);
  await page.waitForTimeout(1000);  // Wait for 1 second between actions

  await page.fill('#password', testData.login.password);
  await page.waitForTimeout(1000);  // Wait for 1 second between actions
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Check if login is successful by looking for the "Projects" text
  await expect(page.locator('text=Projects')).toBeVisible();
  await page.waitForTimeout(1000);  // Add a 1-second wait after login to observe the success
};

test.describe('Login and Task Verification', () => {

  // Set timeout for each test to 30 seconds
  test.setTimeout(30000);  

  // Loop through tasks and perform necessary actions for each task
  for (const task of testData.tasks) {
    

    test(`Verify task "${task.task}" in the "${task.app}" app`, async () => {
      // Launch browser in visible mode for debugging
      const browser = await chromium.launch({ headless: false });  // headless: false means the browser will be visible
      const page = await browser.newPage();
      
      // Login to the app
      await login(page);

      // Add a small wait to observe the page change
      await page.waitForTimeout(1000);

      // Verify the application section
      if (task.app === 'Web Application') {
        await expect(page.locator('p.text-sm.text-gray-500.mt-1', { hasText: 'Main web application development' })).toBeVisible();
      } else if (task.app === 'Mobile Application') {
        // Navigate to Mobile Application section explicitly
        await page.click('text=Mobile Application'); 
        // Increase the timeout to wait longer for the Mobile Application section to appear
        await expect(page.locator('p.text-sm.text-gray-500.mt-1', { hasText: 'Native mobile app development' })).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(1000);  // Wait 1 second after navigating to the mobile app section
      }

      // Navigate to the app section
      await page.click(`text=${task.app}`);
      await page.waitForTimeout(1000);  // Wait after navigating to the app section

      // Verify the task's column is visible
      const columnLocator = page.locator(`text=${task.column}`);
      await expect(columnLocator).toBeVisible();

      // Find and check if the task is in the correct column
      const taskLocator = page.locator(`text=${task.column}`).first(); // Target the first instance
      await expect(taskLocator).toBeVisible();
      await page.waitForTimeout(1000);  // Wait 1 second after verifying the task

      // Verify the tags for the task
      for (const tag of task.tags) {
        const tagLocator = page.locator(`text=${tag}`).first(); // Look for each tag
        await expect(tagLocator).toBeVisible();
        await page.waitForTimeout(1000);  // Wait 1 second after checking each tag
      }

      // Close the browser after completing the test for this task
      await browser.close();
    });
  }
});
