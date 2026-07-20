const STYLE_URL = 'https://maps.track-asia.com/styles/v2/streets.json';
const DEFAULT_ORIGIN = 'https://bennharong.onrender.com';
const key = process.env.VITE_TRACKASIA_API_KEY?.trim();

if (!key) {
  console.error('VITE_TRACKASIA_API_KEY is required. The key value will never be printed.');
  process.exit(1);
}

const origin = process.env.TRACKASIA_TEST_ORIGIN?.trim() || DEFAULT_ORIGIN;
const headers = { Origin: origin, Referer: `${origin}/` };

function hostOf(value) {
  try { return new URL(value).hostname; } catch { return null; }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function withSuffix(value, suffix) {
  const url = new URL(value);
  url.pathname += suffix;
  return url.href;
}

function tileFor(lng, lat, zoom) {
  const scale = 2 ** zoom;
  const x = Math.floor(((lng + 180) / 360) * scale);
  const latitude = Math.max(-85.0511, Math.min(85.0511, lat)) * Math.PI / 180;
  const y = Math.floor((1 - Math.asinh(Math.tan(latitude)) / Math.PI) / 2 * scale);
  return { x, y, z: zoom };
}

function expandTile(template, coordinate) {
  return template
    .replaceAll('{z}', String(coordinate.z))
    .replaceAll('{x}', String(coordinate.x))
    .replaceAll('{y}', String(coordinate.y))
    .replaceAll('{ratio}', '');
}

async function request(label, value, responseType = 'text') {
  try {
    const response = await fetch(value, { headers, redirect: 'follow' });
    const body = responseType === 'json' && response.ok ? await response.json() : null;
    if (responseType !== 'json' && response.body) await response.body.cancel();
    return {
      check: {
        resource: label,
        host: hostOf(value),
        status: response.status,
        corsOrigin: response.headers.get('access-control-allow-origin') || null
      },
      body
    };
  } catch (error) {
    return {
      check: {
        resource: label,
        host: hostOf(value),
        status: null,
        corsOrigin: null,
        error: error instanceof Error ? error.name : 'RequestError'
      },
      body: null
    };
  }
}

const styleUrl = new URL(STYLE_URL);
styleUrl.searchParams.set('key', key);
const styleResult = await request('style', styleUrl, 'json');
if (!styleResult.body) {
  console.log(JSON.stringify({ styleHost: styleUrl.hostname, checks: [styleResult.check] }, null, 2));
  process.exit(1);
}

const style = styleResult.body;
const spriteUrls = (Array.isArray(style.sprite) ? style.sprite.map((entry) => entry.url) : [style.sprite]).filter(Boolean);
const glyphUrls = [style.glyphs].filter(Boolean);
const sourceUrls = [];
const tileTemplates = [];
const tileJsonHosts = [];
const checks = [styleResult.check];

for (const source of Object.values(style.sources || {})) {
  if (source.url) sourceUrls.push(source.url);
  if (Array.isArray(source.tiles)) tileTemplates.push(...source.tiles);
}

for (const sourceUrl of unique(sourceUrls)) {
  const result = await request('tilejson', sourceUrl, 'json');
  checks.push(result.check);
  tileJsonHosts.push(hostOf(sourceUrl));
  if (Array.isArray(result.body?.tiles)) tileTemplates.push(...result.body.tiles);
}

for (const spriteUrl of unique(spriteUrls)) {
  checks.push((await request('sprite-json', withSuffix(spriteUrl, '.json'))).check);
  checks.push((await request('sprite-image', withSuffix(spriteUrl, '.png'))).check);
}

const textFonts = style.layers
  ?.map((layer) => layer.layout?.['text-font'])
  .find((font) => Array.isArray(font) && font.every((part) => typeof part === 'string')) || ['Noto Sans Regular'];
for (const glyphUrl of unique(glyphUrls)) {
  const sample = glyphUrl
    .replace('{fontstack}', encodeURIComponent(textFonts.join(',')))
    .replace('{range}', '0-255');
  checks.push((await request('glyph', sample)).check);
}

const center = Array.isArray(style.center) ? style.center : [106.7, 10.8];
for (const template of unique(tileTemplates)) {
  const coordinate = tileFor(Number(center[0]), Number(center[1]), 2);
  checks.push((await request('vector-tile', expandTile(template, coordinate))).check);
}

const report = {
  styleHost: styleUrl.hostname,
  spriteHosts: unique(spriteUrls.map(hostOf)),
  glyphHosts: unique(glyphUrls.map(hostOf)),
  sourceHosts: unique(sourceUrls.map(hostOf)),
  tileJsonHosts: unique(tileJsonHosts),
  tileHosts: unique(tileTemplates.map(hostOf)),
  dependencyHosts: unique([...spriteUrls, ...glyphUrls, ...sourceUrls, ...tileTemplates].map(hostOf)),
  checks
};

console.log(JSON.stringify(report, null, 2));
if (checks.some((check) => check.status !== 200)) process.exitCode = 1;
