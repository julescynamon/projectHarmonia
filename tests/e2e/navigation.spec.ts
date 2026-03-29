import { test, expect } from '@playwright/test';

test.describe('Navigation générale', () => {
  test('navigation vers les pages principales', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Aïa/);

    await expect(page.locator('img[alt="Maison Sattvaïa"]').first()).toBeVisible();

    await page.click('a[href="/a-propos"]');
    await expect(page).toHaveURL('/a-propos');
    await expect(page).toHaveTitle(/À propos/);

    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    await expect(page).toHaveTitle(/Contact/);

    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('navigation mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    await expect(page.locator('#mobileMenu')).toHaveClass(/translate-x-full/);

    await page.click('#menuButton');

    await expect(page.locator('#mobileMenu')).not.toHaveClass(/translate-x-full/);

    await page.click('#closeMenuButton');

    await expect(page.locator('#mobileMenu')).toHaveClass(/translate-x-full/);
  });

  test('navigation vers les offres MAISON, SATTVA et AÏA', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const openAccompagnements = () =>
      page.locator('#mainNav').getByRole('link', { name: 'Accompagnements' }).hover();

    await openAccompagnements();
    await page.locator('#mainNav .hidden.xl\\:flex a[href="/maison"]').click();
    await expect(page).toHaveURL('/maison');
    await expect(page).toHaveTitle(/MAISON/);

    await page.goto('/');

    await openAccompagnements();
    await page.locator('#mainNav .hidden.xl\\:flex a[href="/sattva"]').click();
    await expect(page).toHaveURL('/sattva');
    await expect(page).toHaveTitle(/SATTVA/);

    await page.goto('/');

    await openAccompagnements();
    await page.locator('#mainNav .hidden.xl\\:flex a[href="/aia"]').click();
    await expect(page).toHaveURL('/aia');
    await expect(page).toHaveTitle(/AÏA/);
  });

  test('navigation vers la boutique', async ({ page }) => {
    await page.goto('/');

    await page.click('a[href="/boutique"]');
    await expect(page).toHaveURL('/boutique');
    await expect(page).toHaveTitle(/Boutique/);
  });

  test('navigation vers le blog', async ({ page }) => {
    await page.goto('/');

    await page.click('a[href="/blog"]');
    await expect(page).toHaveURL('/blog');
    await expect(page).toHaveTitle(/Blog/);
  });
});
