import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3005/resources';

test('desktop resources page', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(URL);
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'desktop_resources.png', fullPage: true });
});

test('mobile resources page', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(URL);
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'mobile_resources.png', fullPage: true });
});
