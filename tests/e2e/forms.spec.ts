import { test, expect } from '@playwright/test';

test.describe('Formulaires et interactions', () => {
  test('formulaire de contact', async ({ page }) => {
    await page.goto('/contact');
    
    // Vérifier que la page de contact est chargée
    await expect(page).toHaveTitle(/Contact/);
    
    // Remplir le formulaire de contact
    await page.fill('input[name="name"], input[placeholder*="nom"]', 'Test User');
    await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
    await page.fill('textarea[name="message"], textarea[placeholder*="message"]', 'Ceci est un message de test pour les tests E2E.');
    
    // Soumettre le formulaire
    await page.click('button[type="submit"], button:has-text("Envoyer")');
    
    // Vérifier la confirmation ou la redirection
    await expect(page.locator('.toast, [data-toast], .success-message')).toBeVisible();
  });

  test('inscription à la newsletter', async ({ page }) => {
    await page.goto('/');
    
    // Trouver le formulaire newsletter
    const newsletterForm = page.locator('form').filter({ hasText: 'Newsletter' });
    
    if (await newsletterForm.isVisible()) {
      await page.fill('input[type="email"]', 'test@example.com');
      await page.click('button:has-text("S\'inscrire"), button:has-text("Newsletter")');
      
      // Vérifier la confirmation
      await expect(page.locator('.toast, [data-toast], .success-message')).toBeVisible();
    }
  });

  test('formulaire de rendez-vous', async ({ page }) => {
    await page.goto('/rendez-vous');
    
    // Vérifier que la page de rendez-vous est chargée
    await expect(page).toHaveTitle(/Rendez-vous/);
    
    // Remplir le formulaire de rendez-vous
    await page.fill('input[name="name"], input[placeholder*="nom"]', 'Test User');
    await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
    await page.fill('input[name="phone"], input[placeholder*="téléphone"]', '0123456789');
    
    // Sélectionner un service si disponible
    const serviceSelect = page.locator('select[name="service"], select[name="type"]');
    if (await serviceSelect.isVisible()) {
      await serviceSelect.selectOption({ index: 1 });
    }
    
    // Soumettre le formulaire
    await page.click('button[type="submit"], button:has-text("Réserver")');
    
    // Vérifier la confirmation
    await expect(page.locator('.toast, [data-toast], .success-message')).toBeVisible();
  });

  test('recherche de produits', async ({ page }) => {
    await page.goto('/boutique');
    
    // Utiliser la barre de recherche si elle existe
    const searchInput = page.locator('input[placeholder*="recherche"], input[name="search"], input[type="search"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('guide');
      await searchInput.press('Enter');
      
      // Vérifier les résultats
      await expect(page.locator('.product-card, [data-product]')).toBeVisible();
    }
  });

  test('filtres de produits', async ({ page }) => {
    await page.goto('/boutique');
    
    // Tester les filtres si disponibles
    const categoryFilter = page.locator('select[name="category"], [data-category-filter]');
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption({ index: 1 });
      
      // Vérifier que les produits sont filtrés
      await expect(page.locator('.product-card, [data-product]')).toBeVisible();
    }
  });

  test('formulaire de mot de passe oublié', async ({ page }) => {
    await page.goto('/mot-de-passe-oublie');
    
    // Vérifier que la page est chargée
    await expect(page).toHaveTitle(/Mot de passe oublié/);
    
    // Remplir le formulaire
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"], button:has-text("Envoyer")');
    
    // Vérifier la confirmation
    await expect(page.locator('.toast, [data-toast], .success-message')).toBeVisible();
  });

  test('inscription d\'un nouvel utilisateur', async ({ page }) => {
    await page.goto('/register');
    
    // Vérifier que la page d'inscription est chargée
    await expect(page).toHaveTitle(/Inscription/);
    
    // Remplir le formulaire d'inscription
    await page.fill('input[name="name"]', 'Nouveau Utilisateur');
    await page.fill('input[name="email"]', 'nouveau@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Soumettre le formulaire
    await page.click('button[type="submit"], button:has-text("S\'inscrire")');
    
    // Vérifier la redirection ou confirmation
    await expect(page).toHaveURL(/.*login.*|.*confirmation.*/);
  });
}); 