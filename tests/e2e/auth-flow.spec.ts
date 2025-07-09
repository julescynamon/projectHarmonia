import { test, expect } from './mocks/auth';

test.describe('Flux d\'authentification', () => {
  test('login > mon-compte > logout', async ({ page }) => {
    // 1. Aller à la page de connexion
    await page.goto('/login');
    
    // Vérifier que la page de connexion est chargée
    await expect(page).toHaveTitle(/Connexion/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // 2. Remplir le formulaire de connexion
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // 3. Soumettre le formulaire
    await page.click('button[type="submit"]');
    
    // 4. Attendre la redirection vers mon-compte
    await page.waitForURL('**/mon-compte', { timeout: 10000 });
    
    // 5. Vérifier que nous sommes sur la page mon-compte
    await expect(page).toHaveURL(/.*mon-compte.*/);
    
    // Vérifier les éléments de la page mon-compte
    await expect(page.locator('h1:has-text("Mon compte")')).toBeVisible();
    await expect(page.locator('text=Informations personnelles')).toBeVisible();
    
    // 6. Vérifier la présence du bouton de déconnexion dans la navigation
    await expect(page.locator('button:has-text("Déconnexion")')).toBeVisible();
    
    // 7. Se déconnecter
    await page.click('button:has-text("Déconnexion")');
    
    // 8. Vérifier la redirection vers la page d'accueil
    await page.waitForURL('/', { timeout: 10000 });
    await expect(page).toHaveURL('/');
    
    // Vérifier que nous ne sommes plus connectés
    await expect(page.locator('a:has-text("Connexion")')).toBeVisible();
  });
  
  test('accès refusé à mon-compte sans authentification', async ({ page }) => {
    // Essayer d'accéder directement à mon-compte sans être connecté
    await page.goto('/mon-compte');
    
    // Devrait être redirigé vers la page de connexion
    await expect(page).toHaveURL(/.*login.*/);
  });
  
  test('formulaire de connexion avec données invalides', async ({ page }) => {
    await page.goto('/login');
    
    // Remplir avec des données invalides
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', '');
    
    await page.click('button[type="submit"]');
    
    // Vérifier les messages d'erreur - utiliser un sélecteur plus flexible
    // L'erreur peut apparaître dans différents éléments selon l'implémentation
    const errorSelectors = [
      '#error-message',
      '.error-message',
      '[data-error]',
      'text=Email ou mot de passe incorrect',
      'text=Format d\'email invalide'
    ];
    
    // Attendre qu'au moins un des sélecteurs d'erreur soit visible
    await expect(page.locator(errorSelectors.join(', '))).toBeVisible({ timeout: 10000 });
  });

  test('navigation vers les pages d\'administration pour les admins', async ({ page }) => {
    // Se connecter en tant qu'admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Attendre d'être sur mon-compte
    await page.waitForURL('**/mon-compte', { timeout: 10000 });
    
    // Vérifier la présence de la section administration
    await expect(page.locator('h2:has-text("Administration")')).toBeVisible();
    
    // Vérifier les liens d'administration
    await expect(page.locator('a[href="/admin/boutique"]')).toBeVisible();
    await expect(page.locator('a[href="/admin/disponibilites"]')).toBeVisible();
    await expect(page.locator('a[href="/admin/blog"]')).toBeVisible();
  });
}); 