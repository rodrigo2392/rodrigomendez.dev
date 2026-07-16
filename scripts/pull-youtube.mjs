// PULL OFFLINE del canal de YouTube → escribe src/data/videos.json + baja miniaturas
// a public/img/videos/. Los datos se COMMITEAN (como el blog); el sitio los lee en build.
// Solo videos LARGOS (la pestaña /videos ya excluye Shorts; además descartamos <= 60s).
// Sin API key.
//
// Uso:  node scripts/pull-youtube.mjs
//       YT_HANDLE=@otro YT_COUNT=8 node scripts/pull-youtube.mjs
import fs from 'node:fs';
import path from 'node:path';

const HANDLE = process.env.YT_HANDLE || '@rodrigomendezdev';
const COUNT = Number(process.env.YT_COUNT || 6);
const MIN_SECONDS = Number(process.env.YT_MIN_SECONDS || 60); // descarta Shorts que se cuelen
const OUT_JSON = 'src/data/videos.json';
const IMG_DIR = 'public/img/videos';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36';
const HEADERS = { 'user-agent': UA, 'accept-language': 'es-MX,es;q=0.9', cookie: 'CONSENT=YES+1' };

function decodeHtml(s = '') {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function jsonStr(raw) {
  try { return JSON.parse('"' + raw + '"'); } catch { return raw; }
}

function shortDesc(desc = '') {
  const first = desc.split(/\n{2,}|\n/).map((l) => l.trim()).find(Boolean) || '';
  const clean = first.replace(/\s+/g, ' ');
  if (clean.length <= 150) return clean;
  return clean.slice(0, 147).replace(/\s+\S*$/, '') + '…';
}

async function get(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} en ${url}`);
  return res.text();
}

// Lista ordenada de videoIds de la pestaña /videos (más reciente primero, sin Shorts).
async function listVideoIds() {
  const html = await get(`https://www.youtube.com/${HANDLE}/videos`);
  const start = html.indexOf('ytInitialData');
  const scope = start >= 0 ? html.slice(start, start + 400000) : html;
  const ids = [];
  const seen = new Set();
  for (const m of scope.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)) {
    if (!seen.has(m[1])) { seen.add(m[1]); ids.push(m[1]); }
  }
  return ids;
}

async function videoMeta(id) {
  const html = await get(`https://www.youtube.com/watch?v=${id}`);
  const length = Number((html.match(/"lengthSeconds":"(\d+)"/) || [])[1] || 0);
  const ogTitle = (html.match(/<meta property="og:title" content="([^"]*)"/) || [])[1];
  const dvTitle = (html.match(/"videoDetails":\{[^}]*?"title":"((?:\\.|[^"\\])*)"/) || [])[1];
  const title = decodeHtml(ogTitle || '') || jsonStr(dvTitle || '') || '(sin título)';
  const rawDesc = (html.match(/"shortDescription":"((?:\\.|[^"\\])*)"/) || [])[1];
  const ogDesc = (html.match(/<meta property="og:description" content="([^"]*)"/) || [])[1];
  const description = shortDesc(rawDesc ? jsonStr(rawDesc) : decodeHtml(ogDesc || ''));
  const publishedAt =
    (html.match(/<meta itemprop="datePublished" content="([^"]+)"/) || [])[1] ||
    (html.match(/"publishDate":"([^"]+)"/) || [])[1] || null;
  return { length, title, description, publishedAt };
}

function fmtDuration(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

async function downloadThumb(id) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  for (const q of ['maxresdefault', 'hqdefault']) {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/${q}.jpg`, { headers: HEADERS });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 3000) {
        fs.writeFileSync(path.join(IMG_DIR, `${id}.jpg`), buf);
        return `/img/videos/${id}.jpg`;
      }
    }
  }
  return null;
}

async function main() {
  const ids = await listVideoIds();
  console.log(`pestaña /videos: ${ids.length} candidatos`);
  const videos = [];
  for (const id of ids) {
    if (videos.length >= COUNT) break;
    let meta;
    try { meta = await videoMeta(id); } catch (e) { console.log(` - ${id}: error (${e.message}), salto`); continue; }
    if (meta.length && meta.length <= MIN_SECONDS) {
      console.log(` - [SHORT ${meta.length}s] ${meta.title.slice(0, 55)}`);
      continue;
    }
    const thumbnail = await downloadThumb(id);
    videos.push({
      id,
      title: meta.title,
      url: `https://www.youtube.com/watch?v=${id}`,
      description: meta.description,
      duration: meta.length ? fmtDuration(meta.length) : null,
      thumbnail,
      publishedAt: meta.publishedAt,
    });
    console.log(` - [video ${fmtDuration(meta.length)}] ${meta.title.slice(0, 55)}`);
  }
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(videos, null, 2) + '\n');
  console.log(`\n✅ ${videos.length} videos → ${OUT_JSON}`);
}

main().catch((e) => { console.error('pull-youtube:', e.message); process.exit(1); });
