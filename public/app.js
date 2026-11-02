import { validateConfig } from './config.js';

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const byId = (id) => document.getElementById(id);
const linkClass = 'group block rounded-2xl border border-stone-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-stone-400 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600';
function link(url, className) {
  const node = element('a', className);
  node.href = url;
  node.target = '_blank';
  node.rel = 'noopener noreferrer';
  return node;
}
function renderTile(tile) {
  const card = link(tile.url, `${linkClass} flex flex-col p-6`);
  const top = element('div', 'mb-7 flex items-center justify-between');
  if (tile.image) {
    const image = element('img', 'h-12 w-12 rounded-xl object-contain');
    image.src = tile.image;
    image.alt = '';
    image.width = image.height = 48;
    image.loading = 'lazy';
    top.append(image);
  } else top.append(element('span', 'tile-initial', tile.title.slice(0, 1)));
  top.append(element('span', 'text-xl text-stone-400 transition group-hover:text-emerald-600', '↗'));
  card.append(top, element('h3', 'text-lg font-semibold tracking-tight', tile.title), element('p', 'mb-6 mt-2 flex-1 text-sm leading-relaxed text-stone-500 dark:text-stone-400', tile.text || ''), element('span', 'text-xs text-stone-400 dark:text-stone-500', new URL(tile.url).hostname));
  card.setAttribute('aria-label', `${tile.title} (opens in a new tab)`);
  return card;
}
function renderNews(item) {
  const card = link(item.url, `${linkClass} news-card p-6`);
  card.append(element('p', 'eyebrow mb-4', item.label || 'NEWS'), element('h3', 'mb-2 text-xl font-semibold tracking-tight', item.title), element('p', 'text-sm leading-relaxed text-stone-500 dark:text-stone-400', item.text || ''));
  const bottom = element('div', 'mt-6 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400');
  bottom.append(element('span', '', item.date || 'Worth a look'), element('span', 'text-lg', '↗'));
  card.append(bottom);
  card.setAttribute('aria-label', `${item.title} (opens in a new tab)`);
  return card;
}
byId('date').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
try {
  const response = await fetch('/config.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Configuration unavailable');
  const config = validateConfig(await response.json());
  for (const field of ['brand', 'eyebrow', 'heading', 'intro', 'footer']) {
    if (config[field]) byId(field).textContent = config[field];
  }
  document.title = config.brand || 'Launchpad';
  byId('news').replaceChildren(...config.news.map(renderNews));
  const render = () => {
    const query = byId('search').value.trim().toLocaleLowerCase();
    const tiles = config.tiles.filter((tile) => `${tile.title} ${tile.text || ''}`.toLocaleLowerCase().includes(query));
    byId('tiles').replaceChildren(...tiles.map(renderTile));
    byId('tile-count').textContent = `${tiles.length} shortcuts. A world of possibilities.`;
    byId('empty').hidden = tiles.length > 0;
  };
  byId('search').addEventListener('input', render);
  render();
  byId('status').textContent = '';
} catch {
  byId('status').textContent = 'We couldn’t load your launchpad. Check config.json and refresh to try again.';
}
