import { expect, test } from '@playwright/test';

test('mobile viewport boots visible game and HUD', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto(process.env.QA_URL || 'http://localhost:5173/', { waitUntil: 'networkidle' });
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#selected-name')).not.toHaveText('');
  await expect(page.locator('#needs')).not.toBeEmpty();
  await expect(page.locator('#command-panel button', { hasText: 'Cell' })).toBeVisible();
  expect(errors).toEqual([]);
});
