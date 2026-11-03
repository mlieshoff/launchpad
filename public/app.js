import { validateConfig, filterTileGroups, formatText } from './config.js';

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
function renderTile(tile, texts) {
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
  top.append(element('span', 'text-xl text-stone-400 transition group-hover:text-emerald-600', texts.linkIcon || ''));
  card.append(top, element('h3', 'text-lg font-semibold tracking-tight', tile.title), element('p', 'mb-6 mt-2 flex-1 text-sm leading-relaxed text-stone-500 dark:text-stone-400', tile.text || ''), element('span', 'text-xs text-stone-400 dark:text-stone-500', new URL(tile.url).hostname));
  card.setAttribute('aria-label', formatText(texts.openLinkLabel, { title: tile.title }));
  return card;
}
function renderNews(item, texts) {
  const card = link(item.url, `${linkClass} news-card p-6`);
  card.append(element('p', 'eyebrow mb-4', item.label ?? texts.newsLabel), element('h3', 'mb-2 text-xl font-semibold tracking-tight', item.title), element('p', 'text-sm leading-relaxed text-stone-500 dark:text-stone-400', item.text || ''));
  const bottom = element('div', 'mt-6 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400');
  bottom.append(element('span', '', item.date ?? texts.newsDate), element('span', 'text-lg', texts.linkIcon || ''));
  card.append(bottom);
  card.setAttribute('aria-label', formatText(texts.openLinkLabel, { title: item.title }));
  return card;
}
try {
  const response = await fetch('/config.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Configuration unavailable');
  const config = validateConfig(await response.json());
  const texts = config.texts || {};
  for (const node of document.querySelectorAll('[data-copy]')) {
    node.textContent = config[node.dataset.copy] ?? texts[node.dataset.copy] ?? '';
  }
  document.title = texts.pageTitle || '';
  document.documentElement.lang = texts.language || '';
  document.querySelector('meta[name="description"]').content = texts.description || '';
  byId('search').placeholder = texts.searchPlaceholder || '';
  byId('date').textContent = texts.dateLocale ? new Intl.DateTimeFormat(texts.dateLocale, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()) : '';
  byId('news').replaceChildren(...config.news.map((item) => renderNews(item, texts)));
  const render = () => {
    const groups = filterTileGroups(config, byId('search').value);
    byId('tiles').replaceChildren(...groups.map((group) => {
      const section = element('section', 'mb-8');
      if (group.title) section.append(element('h3', 'mb-4 text-xl font-semibold tracking-tight', group.title));
      const grid = element('div', 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3');
      grid.append(...group.tiles.map((tile) => renderTile(tile, texts)));
      section.append(grid);
      return section;
    }));
    const count = groups.reduce((total, group) => total + group.tiles.length, 0);
    byId('tile-count').textContent = formatText(count === 1 ? texts.tileCountOne : texts.tileCount, { count });
    byId('empty').hidden = count > 0;
  };
  byId('search').addEventListener('input', render);
  render();
  byId('status').textContent = '';
} catch {
  byId('status').textContent = byId('status').dataset.error;
}
