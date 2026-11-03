import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';

async function withServer(check) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try { await check(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}
test('serves the page, configuration, images, and health check', () => withServer(async (base) => {
  for (const [path, type] of [['/', 'text/html'], ['/config.json', 'application/json'], ['/images/google.svg', 'image/svg+xml'], ['/healthz', 'text/plain']]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').startsWith(type));
  }
}));

test('renders JSON copy into the initial page including no-script and failure messages', () => withServer(async (base) => {
  const config = await (await fetch(base + '/config.json')).json();
  const html = await (await fetch(base)).text();
  assert.ok(html.includes(`<title>${config.texts.pageTitle}</title>`) && html.includes(config.texts.noScript) && html.includes(config.texts.loadError) && !html.includes('{{'));
}));
test('does not expose server source, traversal paths or missing files', () => withServer(async (base) => {
  for (const path of ['/server.js', '/%2e%2e%2fserver.js', '/missing', '/images/']) {
    assert.equal((await fetch(base + path)).status, 404);
  }
}));
test('rejects mutations and malformed escaping', () => withServer(async (base) => {
  assert.equal((await fetch(base, { method: 'POST' })).status, 405);
  assert.equal((await fetch(base + '/%ZZ')).status, 400);
}));
test('HEAD returns headers without a response body and sets security headers', () => withServer(async (base) => {
  const response = await fetch(base, { method: 'HEAD' });
  assert.equal(await response.text(), '');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.ok(response.headers.get('content-security-policy').includes("object-src 'none'"));
}));

test('refuses symlinks pointing outside the served directory', async () => {
  const { mkdir, writeFile, symlink, rm } = await import('node:fs/promises');
  const { resolve } = await import('node:path');
  const fixture = resolve('test/.fixture');
  await mkdir(`${fixture}/public`, { recursive: true });
  await writeFile(`${fixture}/private.txt`, 'not public');
  await symlink('../private.txt', `${fixture}/public/leak.txt`);
  const server = createServer(`${fixture}/public`);
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const response = await fetch(`http://127.0.0.1:${server.address().port}/leak.txt`);
    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(fixture, { recursive: true, force: true });
  }
});
