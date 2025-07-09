import { test as base } from '@playwright/test';

// Déclarer les types pour les mocks
declare global {
  interface Window {
    supabase?: any;
    Stripe?: any;
  }
}

// Mock Supabase auth pour les tests
export const mockSupabaseAuth = async (page: any) => {
  await page.addInitScript(() => {
    // Mock Supabase client
    (window as any).supabase = {
      auth: {
        signInWithPassword: async () => ({
          data: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
              user_metadata: { name: 'Test User' }
            },
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token'
            }
          },
          error: null
        }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({
          data: {
            session: {
              user: {
                id: 'test-user-id',
                email: 'test@example.com'
              }
            }
          },
          error: null
        })
      }
    };
  });
};

// Mock Stripe pour les tests
export const mockStripe = async (page: any) => {
  await page.addInitScript(() => {
    // Mock Stripe
    (window as any).Stripe = function() {
      return {
        redirectToCheckout: async () => ({ error: null }),
        confirmPayment: async () => ({ paymentIntent: { status: 'succeeded' } }),
        createToken: async () => ({ token: { id: 'mock-token-id' } })
      };
    };
  });
};

// Type pour les tests avec auth
export type AuthTestFixtures = {
  authenticatedPage: any;
};

export const test = base.extend<AuthTestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Mock Supabase et Stripe
    await mockSupabaseAuth(page);
    await mockStripe(page);
    
    // Simuler une session authentifiée
    await page.addInitScript(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000
      }));
    });
    
    await use(page);
  },
});

export { expect } from '@playwright/test'; 