import { test, expect } from '@playwright/test';

test.describe('Navigation générale', () => {
  test('navigation vers les pages principales', async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('/');
    
    // Vérifier le titre de la page d'accueil
    await expect(page).toHaveTitle(/Naima Tyzra/);
    
    // Vérifier la présence du logo
    await expect(page.locator('img[alt="Naima Tyzra"]')).toBeVisible();
    
    // Navigation vers À propos
    await page.click('a[href="/a-propos"]');
    await expect(page).toHaveURL('/a-propos');
    await expect(page).toHaveTitle(/À propos/);
    
    // Navigation vers Contact
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    await expect(page).toHaveTitle(/Contact/);
    
    // Navigation vers Services
    await page.click('a[href="/services"]');
    await expect(page).toHaveURL('/services');
    await expect(page).toHaveTitle(/Services/);
    
    // Retour à l'accueil
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('navigation mobile', async ({ page }) => {
    // Définir une taille d'écran mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Vérifier que le menu mobile est caché par défaut
    await expect(page.locator('#mobileMenu')).toHaveClass(/translate-x-full/);
    
    // Ouvrir le menu mobile
    await page.click('#menuButton');
    
    // Vérifier que le menu mobile est visible
    await expect(page.locator('#mobileMenu')).not.toHaveClass(/translate-x-full/);
    
    // Fermer le menu mobile
    await page.click('#closeMenuButton');
    
    // Vérifier que le menu mobile est caché
    await expect(page.locator('#mobileMenu')).toHaveClass(/translate-x-full/);
  });

  test('navigation vers les services', async ({ page }) => {
    await page.goto('/');
    
    // Navigation vers Naturopathie humaine
    await page.click('a[href="/naturopathie-humaine"]');
    await expect(page).toHaveURL('/naturopathie-humaine');
    await expect(page).toHaveTitle(/Naturopathie humaine/);
    
    // Navigation vers Naturopathie animale
    await page.click('a[href="/naturopathie-animale"]');
    await expect(page).toHaveURL('/naturopathie-animale');
    await expect(page).toHaveTitle(/Naturopathie animale/);
    
    // Navigation vers Soins chamaniques humains
    await page.click('a[href="/soins-chamaniques-humains"]');
    await expect(page).toHaveURL('/soins-chamaniques-humains');
    await expect(page).toHaveTitle(/Soins chamaniques humains/);
  });

  test('navigation vers la boutique', async ({ page }) => {
    await page.goto('/');
    
    // Navigation vers la boutique
    await page.click('a[href="/boutique"]');
    await expect(page).toHaveURL('/boutique');
    await expect(page).toHaveTitle(/Boutique/);
  });

  test('navigation vers le blog', async ({ page }) => {
    await page.goto('/');
    
    // Navigation vers le blog
    await page.click('a[href="/blog"]');
    await expect(page).toHaveURL('/blog');
    await expect(page).toHaveTitle(/Blog/);
  });

  test('navigation vers les rendez-vous', async ({ page }) => {
    await page.goto('/');
    
    // Navigation vers les rendez-vous
    await page.click('a[href="/rendez-vous"]');
    await expect(page).toHaveURL('/rendez-vous');
    await expect(page).toHaveTitle(/Rendez-vous/);
  });
}); 