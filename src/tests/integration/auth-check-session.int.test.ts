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
  await waitForServerReady(`${baseUrl}/api/auth/check-session`);
});

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

describe('GET /api/auth/check-session', () => {
  it('retourne isAuthenticated: false sans cookie', async () => {
    const res = await fetch(`${baseUrl}/api/auth/check-session`, { method: 'GET' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.isAuthenticated).toBe(false);
    expect(json).toHaveProperty('error');
    expect(json).toHaveProperty('message');
  });
}); 