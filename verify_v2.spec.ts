import { test, expect } from '@playwright/test';

test('landing page', async ({ page }) => {
  await page.goto('http://localhost:3005');
  await page.waitForTimeout(5000); // Wait for fonts/animations
  await page.screenshot({ path: 'landing_v2.png', fullPage: true });
});

test('feed page', async ({ page }) => {
  await page.goto('http://localhost:3005/feed');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'feed_v2.png', fullPage: true });
});
