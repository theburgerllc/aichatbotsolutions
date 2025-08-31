
import { test, expect } from '@playwright/test';

test('plans table renders with CTAs', async ({ page }) => {
  await page.goto('/pricing').catch(async () => { await page.goto('/'); });
  await expect(page.getByRole('region', { name: /compare plans/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /scale up/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /talk to sales/i })).toBeVisible();
});
