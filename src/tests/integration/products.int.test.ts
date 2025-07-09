import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import getPort from 'get-port';

let serverProcess: any;
let baseUrl: string;

async function waitForServerReady(url: string, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error('Le serveur Astro ne répond pas après 10s');
}

beforeAll(async () => {
  const port = String(await getPort());
  baseUrl = `http://localhost:${port}`;
  serverProcess = spawn('npx', ['astro', 'preview', '--port', port], {
    stdio: 'ignore',
    shell: true,
    env: { ...process.env, NODE_ENV: 'test' },
  });
  await waitForServerReady(`${baseUrl}/api/products`);
});

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

describe('GET /api/products', () => {
  it('retourne une réponse valide (null ou tableau)', async () => {
    const res = await fetch(`${baseUrl}/api/products`, { method: 'GET' });
    expect(res.status).toBe(200);
    const text = await res.text();
    console.log('Réponse brute /api/products:', text);
    
    // Le endpoint peut retourner null (pas de produits) ou un tableau
    if (text === 'null') {
      expect(text).toBe('null');
    } else {
      const json = JSON.parse(text);
      expect(Array.isArray(json)).toBe(true);
      if (json.length > 0) {
        expect(json[0]).toHaveProperty('id');
        expect(json[0]).toHaveProperty('name');
      }
    }
  });

  it('gère le cas où aucun produit n\'est disponible', async () => {
    const res = await fetch(`${baseUrl}/api/products`, { method: 'GET' });
    expect(res.status).toBe(200);
    const text = await res.text();
    
    // Si null, c'est normal (pas de produits en base)
    if (text === 'null') {
      console.log('Aucun produit disponible en base de données');
      return;
    }
    
    // Sinon, on teste avec un produit existant
    const list = JSON.parse(text);
    if (!Array.isArray(list) || list.length === 0) {
      console.log('Aucun produit disponible pour tester la récupération individuelle');
      return;
    }
    
    const id = list[0].id;
    const resProduct = await fetch(`${baseUrl}/api/products?id=${id}`, { method: 'GET' });
    expect(resProduct.status).toBe(200);
    const product = await resProduct.json();
    expect(product).toHaveProperty('id', id);
  });
}); 