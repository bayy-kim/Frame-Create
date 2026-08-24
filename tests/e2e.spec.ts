import { test, expect } from '@playwright/test';

test('has title and landing page content', async ({ page }) => {
  // Go to root page
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Frame Craft/);
  
  // Expect the heading on the landing page
  const mainHeading = page.locator('h1', { hasText: 'Sulap Foto Produk' });
  await expect(mainHeading).toBeVisible();

  // Test the login button redirect
  const loginButton = page.locator('button:has-text("Masuk")');
  await loginButton.click();
  
  await expect(page).toHaveURL(/.*login/);
  
  const googleButton = page.locator('button:has-text("Masuk dengan Google")');
  await expect(googleButton).toBeVisible();
});

