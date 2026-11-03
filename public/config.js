export function validateConfig(config) {
  if (!config || !Array.isArray(config.tiles) || !Array.isArray(config.news)) {
    throw new Error('Configuration requires news and tiles arrays');
  }
  for (const field of ['brand', 'eyebrow', 'heading', 'intro', 'footer']) {
    if (config[field] !== undefined && typeof config[field] !== 'string') throw new Error(`Invalid ${field}`);
  }
  if (config.texts !== undefined) {
    if (!config.texts || Array.isArray(config.texts) || typeof config.texts !== 'object') throw new Error('Invalid texts');
    for (const value of Object.values(config.texts)) {
      if (typeof value !== 'string') throw new Error('Text values must be strings');
    }
    if (config.texts.dateLocale) new Intl.DateTimeFormat(config.texts.dateLocale);
  }
  if (config.groups !== undefined && !Array.isArray(config.groups)) throw new Error('Groups must be an array');
  const groupIds = new Set();
  for (const group of config.groups || []) {
    if (!group || typeof group.id !== 'string' || !group.id.trim() || typeof group.title !== 'string' || !group.title.trim() || groupIds.has(group.id)) throw new Error('Groups require unique IDs and titles');
    groupIds.add(group.id);
  }
  for (const tile of config.tiles) {
    if (tile?.group !== undefined && !groupIds.has(tile.group)) throw new Error('Tile references an unknown group');
  }
  for (const item of [...config.news, ...config.tiles]) {
    if (!item || typeof item.title !== 'string' || !item.title.trim() || typeof item.url !== 'string') throw new Error('Every entry requires a title and URL');
    if (!['https:', 'http:'].includes(new URL(item.url).protocol)) throw new Error('Only HTTP(S) links are supported');
    for (const field of ['text', 'label', 'date']) {
      if (item[field] !== undefined && typeof item[field] !== 'string') throw new Error(`Invalid ${field}`);
    }
    if (item.image !== undefined && (typeof item.image !== 'string' || !/^\/images\/(?!.*(?:\.\.|[\\?#%]))[a-zA-Z0-9_./-]+$/.test(item.image))) {
      throw new Error('Images must be paths inside /images/');
    }
  }
  return config;
}

export function filterTileGroups(config, query = '') {
  const search = query.trim().toLocaleLowerCase();
  const tiles = config.tiles.filter((tile) => `${tile.title} ${tile.text || ''}`.toLocaleLowerCase().includes(search));
  const groups = (config.groups || []).map((group) => ({
    title: group.title,
    tiles: tiles.filter((tile) => tile.group === group.id),
  })).filter((group) => group.tiles.length);
  const ungrouped = tiles.filter((tile) => tile.group === undefined);
  if (ungrouped.length) groups.push({ title: config.texts?.ungroupedTitle || '', tiles: ungrouped });
  return groups;
}

export function formatText(template = '', values = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key) => Object.hasOwn(values, key) ? String(values[key]) : match);
}

// Escape for both HTML text and quoted attributes; configured content is never markup.
export function renderPage(template, config) {
  const copy = { ...config.texts, ...Object.fromEntries(['brand', 'eyebrow', 'heading', 'intro', 'footer'].map((key) => [key, config[key] || ''])) };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (typeof copy[key] === 'string' ? copy[key] : '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]));
}
