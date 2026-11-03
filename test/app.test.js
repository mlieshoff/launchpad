import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// A small DOM double exercises the real module without adding a browser dependency.
class Node {
  children = [];
  textContent = '';
  value = '';
  dataset = {};
  attributes = {};
  listeners = {};
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute(name, value) { this.attributes[name] = value; }
  addEventListener(name, listener) { this.listeners[name] = listener; }
}

let appImport = 0;
async function loadApp(context, response) {
  const ids = Object.fromEntries(['news', 'tiles', 'search', 'date', 'tile-count', 'empty', 'status'].map((id) => [id, new Node()]));
  ids.status.dataset.error = 'Configured failure';
  const heading = new Node();
  heading.dataset.copy = 'heading';
  const document = {
    documentElement: {}, title: '',
    createElement: () => new Node(),
    getElementById: (id) => ids[id],
    querySelectorAll: () => [heading],
    querySelector: () => new Node(),
  };
  context.mock.method(globalThis, 'fetch', async () => response);
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'document', { configurable: true, value: document });
  context.after(() => {
    if (previous) Object.defineProperty(globalThis, 'document', previous);
    else delete globalThis.document;
  });
  await import(`../public/app.js?test=${++appImport}`);
  return { ids, document, heading };
}

test('app renders configured groups, copy, accessible labels and filtered counts', async (context) => {
  const config = JSON.parse(await readFile(new URL('../public/config.json', import.meta.url)));
  config.heading = '';
  config.groups[0].title = '<Custom group>';
  config.texts.tileCountOne = 'Found {count} item';
  config.texts.openLinkLabel = 'Visit {title}';
  const { ids, document, heading } = await loadApp(context, { ok: true, json: async () => config });
  const initial = ids.tiles.children.map((section) => section.children[0].textContent);
  ids.search.value = 'github';
  ids.search.listeners.input();
  const group = ids.tiles.children[0];
  const card = group.children[1].children[0];
  const filtered = { title: group.children[0].textContent, label: card.attributes['aria-label'], count: ids['tile-count'].textContent, empty: ids.empty.hidden };
  ids.search.value = 'no matches here';
  ids.search.listeners.input();
  assert.deepEqual({ initial, filtered, remaining: ids.tiles.children.length, empty: ids.empty.hidden, title: document.title, heading: heading.textContent, status: ids.status.textContent }, {
    initial: ['<Custom group>', 'Build & learn'],
    filtered: { title: 'Build & learn', label: 'Visit GitHub', count: 'Found 1 item', empty: true },
    remaining: 0, empty: false, title: config.texts.pageTitle, heading: '', status: '',
  });
});

for (const response of [
  { ok: false },
  { ok: true, json: async () => { throw new SyntaxError(); } },
  { ok: true, json: async () => ({ news: [], tiles: [{ title: 'Unsafe', url: 'javascript:bad' }] }) },
]) {
  test('app uses configured failure copy and never renders invalid links', async (context) => {
    const { ids } = await loadApp(context, response);
    assert.deepEqual({ message: ids.status.textContent, tiles: ids.tiles.children }, { message: 'Configured failure', tiles: [] });
  });
}
