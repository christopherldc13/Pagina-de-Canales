import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 820 });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.querySelectorAll('aside button').length > 5, { timeout: 12000 }).catch(() => {});
// Click Color Vision (canal 9)
const colorVision = page.locator('aside button', { hasText: 'Color Vision' }).first();
if (await colorVision.isVisible()) {
  await colorVision.click();
  await page.waitForTimeout(2500);
}
await page.screenshot({ path: 'v4.png' });
await browser.close();
console.log('done');
