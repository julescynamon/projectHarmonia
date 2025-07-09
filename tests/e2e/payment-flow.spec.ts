import { test, expect } from './mocks/auth';

test.describe('Flux de paiement', () => {
  test('ajout au panier et processus de paiement', async ({ page }) => {
    // Aller à la boutique
    await page.goto('/boutique');
    await expect(page).toHaveTitle(/Boutique/);
    
    // Vérifier que les produits sont affichés
    await expect(page.locator('.product-card, [data-product]')).toBeVisible();
    
    // Cliquer sur le premier produit pour voir les détails
    await page.click('.product-card a, [data-product] a');
    
    // Vérifier que nous sommes sur la page du produit
    await expect(page).toHaveURL(/\/boutique\/\d+/);
    
    // Ajouter au panier
    await page.click('button:has-text("Ajouter au panier"), [data-add-to-cart]');
    
    // Vérifier que le produit a été ajouté au panier
    await expect(page.locator('.cart-icon, [data-cart-icon]')).toBeVisible();
    
    // Aller au panier
    await page.click('.cart-icon, [data-cart-icon]');
    await expect(page).toHaveURL('/panier');
    
    // Vérifier que le produit est dans le panier
    await expect(page.locator('.cart-item, [data-cart-item]')).toBeVisible();
    
    // Procéder au paiement
    await page.click('button:has-text("Procéder au paiement"), [data-checkout]');
    
    // Vérifier la redirection vers Stripe ou la page de paiement
    await expect(page).toHaveURL(/.*stripe.*|.*checkout.*|.*paiement.*/);
  });

  test('gestion du panier', async ({ page }) => {
    await page.goto('/boutique');
    
    // Ajouter un produit au panier
    await page.click('.product-card button, [data-add-to-cart]');
    
    // Aller au panier
    await page.goto('/panier');
    
    // Modifier la quantité
    const quantityInput = page.locator('input[type="number"], [data-quantity]');
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('2');
      await quantityInput.press('Enter');
    }
    
    // Supprimer un produit du panier
    const removeButton = page.locator('button:has-text("Supprimer"), [data-remove-item]');
    if (await removeButton.isVisible()) {
      await removeButton.click();
    }
    
    // Vérifier que le panier est vide ou mis à jour
    await expect(page.locator('.empty-cart, [data-empty-cart]')).toBeVisible();
  });

  test('téléchargement de produits après achat', async ({ page }) => {
    // Se connecter
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Aller sur mon-compte
    await page.waitForURL('**/mon-compte');
    
    // Vérifier la section "Mes commandes"
    await expect(page.locator('h2:has-text("Mes commandes")')).toBeVisible();
    
    // Si il y a des commandes, tester le téléchargement
    const downloadButton = page.locator('button:has-text("Télécharger")');
    if (await downloadButton.isVisible()) {
      await downloadButton.click();
      
      // Vérifier que le téléchargement a été déclenché
      // Note: Playwright ne peut pas vérifier les téléchargements de fichiers
      // mais on peut vérifier que l'action a été effectuée
      await expect(page.locator('.toast, [data-toast]')).toBeVisible();
    }
  });

  test('confirmation de commande', async ({ page }) => {
    // Simuler une redirection depuis Stripe
    await page.goto('/confirmation?session_id=test_session');
    
    // Vérifier la page de confirmation
    await expect(page).toHaveTitle(/Confirmation|Succès/);
    await expect(page.locator('h1:has-text("Confirmation"), h1:has-text("Succès")')).toBeVisible();
    
    // Vérifier les informations de la commande
    await expect(page.locator('text=Merci pour votre commande')).toBeVisible();
  });
}); 