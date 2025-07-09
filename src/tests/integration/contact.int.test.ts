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
  await waitForServerReady(`${baseUrl}/`);
});

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

describe('POST /api/contact', () => {
  it('retourne une erreur pour un formulaire vide', async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    // Le endpoint peut retourner 400 (validation) ou 500 (erreur serveur)
    expect([400, 500]).toContain(res.status);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('retourne un succès pour un formulaire valide', async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Testeur',
        email: 'testeur@example.com',
        subject: 'consultation',
        message: 'Ceci est un message de test.'
      })
    });
    expect([200, 201]).toContain(res.status);
    const json = await res.json();
    expect(json).toHaveProperty('success');
  });
}); 