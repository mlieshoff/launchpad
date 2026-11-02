export function validateConfig(config) {
  if (!config || !Array.isArray(config.tiles) || !Array.isArray(config.news)) {
    throw new Error('Configuration requires news and tiles arrays');
  }
  for (const field of ['brand', 'eyebrow', 'heading', 'intro', 'footer']) {
    if (config[field] !== undefined && typeof config[field] !== 'string') throw new Error(`Invalid ${field}`);
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
