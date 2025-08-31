
import { test, expect } from '@playwright/test';

test('opens Tavus demo modal and renders iframe', async ({ page }) => {
  await page.goto('/');
  const btn = page.getByRole('button', { name: /watch the ai talk now/i }).first();
  await expect(btn).toBeVisible();
  await btn.click();
  const iframe = page.locator('iframe[title="Tavus Video Chat"]');
  await expect(iframe).toBeVisible();
});
