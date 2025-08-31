
import { test, expect } from '@playwright/test';

test('case studies section links render', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /customer stories/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /SaaS A/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /E-comm B/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Edu C/i })).toBeVisible();
});
