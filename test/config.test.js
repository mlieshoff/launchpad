import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateConfig } from '../public/config.js';

test('sample configuration is valid and every image exists', async () => {
  const config = validateConfig(JSON.parse(await readFile(new URL('../public/config.json', import.meta.url))));
  for (const tile of config.tiles) await readFile(new URL(`../public${tile.image}`, import.meta.url));
  assert.equal(config.tiles.length, 6);
});
test('supports zero or arbitrary numbers of tiles and optional images/text', () => {
  for (const count of [0, 1, 25]) {
    const config = { news: [], tiles: Array.from({ length: count }, () => ({ title: 'Example', url: 'https://example.com' })) };
    assert.equal(validateConfig(config).tiles.length, count);
  }
});
for (const url of ['javascript:alert(1)', 'data:text/html,test', '/relative', 'invalid']) {
  test(`rejects unsafe or invalid URL ${url}`, () => {
    assert.throws(() => validateConfig({ news: [], tiles: [{ title: 'Test', url }] }));
  });
}
for (const image of ['https://example.com/x.png', '/images/../secret', '/images/%2e%2e/secret', '/images/x.svg?bad', '//example.com/a']) {
  test(`rejects image outside public images ${image}`, () => {
    assert.throws(() => validateConfig({ news: [], tiles: [{ title: 'Test', url: 'https://example.com', image }] }));
  });
}
test('rejects malformed content rather than rendering partial configuration', () => {
  assert.throws(() => validateConfig({ news: [{ title: 'Bad', url: 'https://example.com', text: {} }], tiles: [] }));
});
