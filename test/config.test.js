import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateConfig, filterTileGroups, formatText, renderPage } from '../public/config.js';

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

test('groups tiles in configuration order and keeps ungrouped tiles', () => {
  const first = { title: 'First', url: 'https://example.com', group: 'a' };
  const second = { title: 'Second', url: 'https://example.com', group: 'b' };
  const other = { title: 'Other', url: 'https://example.com' };
  const config = validateConfig({ news: [], tiles: [first, other, second], groups: [{ id: 'b', title: 'B' }, { id: 'a', title: 'A' }], texts: { ungroupedTitle: 'Other links' } });
  assert.deepEqual(filterTileGroups(config), [{ title: 'B', tiles: [second] }, { title: 'A', tiles: [first] }, { title: 'Other links', tiles: [other] }]);
});

test('search matches title and description and removes empty groups', () => {
  const tile = { title: 'Docs', text: 'JavaScript reference', url: 'https://example.com', group: 'work' };
  const config = { news: [], tiles: [tile], groups: [{ id: 'work', title: 'Work' }, { id: 'empty', title: 'Empty' }] };
  assert.deepEqual([filterTileGroups(config, '  JAVASCRIPT '), filterTileGroups(config, 'docs'), filterTileGroups(config, 'missing')], [[{ title: 'Work', tiles: [tile] }], [{ title: 'Work', tiles: [tile] }], []]);
});

for (const invalid of [
  { groups: {} },
  { groups: [null] },
  { groups: [{ id: 'a', title: '' }] },
  { groups: [{ id: 'a', title: 'A' }, { id: 'a', title: 'Again' }] },
  { tiles: [{ title: 'Bad', url: 'https://example.com', group: 'missing' }] },
  { texts: null }, { texts: [] }, { texts: { heading: 42 } }, { texts: { dateLocale: 'invalid_locale' } },
]) {
  test(`rejects invalid grouping or copy ${JSON.stringify(invalid)}`, () => {
    assert.throws(() => validateConfig({ news: [], tiles: [], ...invalid }));
  });
}

test('formats configurable counts and accessible labels without recursive replacement', () => {
  assert.deepEqual([
    formatText('{count} links', { count: 2 }),
    formatText('Open {title}', { title: '{count}' }),
    formatText('', { count: 1 }),
  ], ['2 links', 'Open {count}', '']);
});

test('renders configured initial copy safely in HTML and attributes', () => {
  assert.equal(renderPage('<title>{{pageTitle}}</title><input placeholder="{{searchPlaceholder}}"><p>{{loading}}</p>{{unknown}}', {
    texts: { pageTitle: '<script>&', searchPlaceholder: '\" onfocus=\"bad', loading: 'Please wait' },
  }), '<title>&lt;script&gt;&amp;</title><input placeholder="&quot; onfocus=&quot;bad"><p>Please wait</p>');
});

test('every HTML copy placeholder has a configured string', async () => {
  const config = JSON.parse(await readFile(new URL('../public/config.json', import.meta.url)));
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  const keys = [...html.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]);
  assert.deepEqual(keys.filter((key) => typeof (config[key] ?? config.texts[key]) !== 'string'), []);
});
