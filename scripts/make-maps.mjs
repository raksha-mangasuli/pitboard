/**
 * Builds src/data/maps.js (a small regional map per race for the race detail banner).
 *
 * Source: Natural Earth 1:50m country borders (public domain), naturalearthdata.com.
 * Run once with `npm run maps`, then commit the generated file.
 *
 *   npm run maps                          downloads the GeoJSON, then converts it
 *   MAPS_FILE=./countries.geojson npm run maps    converts a local file instead (offline)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const URL_50M = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';
const OUT = fileURLToPath(new URL('../src/data/maps.js', import.meta.url));
const BANNER = { w: 328, h: 120 }; // race detail banner, in SVG units
const TILE = { w: 100, h: 100 }; // small square tile on Home
const TOLERANCE = 0.3;

/**
 * Race round -> host country (ISO alpha-3), circuit position, how many degrees of longitude the map spans,
 * and an optional map centre (defaults to the circuit) so large countries sit fully in the frame.
 */
const MAPS = {
  17: { host: 'SGP', lat: 1.2914, lon: 103.864, span: 3.2 },
  18: { host: 'USA', lat: 30.1328, lon: -97.6411, span: 86, centre: [-96, 38.5] },
  19: { host: 'MEX', lat: 19.4042, lon: -99.0907, span: 53, centre: [-102, 23.5] },
  20: { host: 'BRA', lat: -23.7036, lon: -46.6997, span: 60, centre: [-50, -19] },
  21: { host: 'USA', lat: 36.1147, lon: -115.1728, span: 86, centre: [-96, 38.5] },
  22: { host: 'QAT', lat: 25.49, lon: 51.4542, span: 7 },
  23: { host: 'ARE', lat: 24.4672, lon: 54.6031, span: 9 },
};

/** Square tile windows: how many degrees of longitude to span and where to centre (defaults to the circuit). */
const TILES = {
  17: { span: 1.6 },
  18: { span: 62, centre: [-96, 37.5] },
  19: { span: 36, centre: [-102, 23.5] },
  20: { span: 46, centre: [-52, -14] },
  21: { span: 62, centre: [-96, 37.5] },
  22: { span: 3.4 },
  23: { span: 5 },
};

async function loadCountries() {
  if (process.env.MAPS_FILE) return JSON.parse(await readFile(process.env.MAPS_FILE, 'utf8'));
  const res = await fetch(URL_50M);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function perpendicularDistance(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  if (len === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / len;
}

/** Douglas-Peucker line simplification. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  let maxDist = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i += 1) {
    const d = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (d > maxDist) { maxDist = d; index = i; }
  }
  if (maxDist <= tolerance) return [points[0], points[points.length - 1]];
  const left = simplify(points.slice(0, index + 1), tolerance);
  const right = simplify(points.slice(index), tolerance);
  return [...left.slice(0, -1), ...right];
}

/** Sutherland-Hodgman clip of a ring against the rectangle (-m, -m) to (W + m, H + m). */
function clipRing(ring, { w: W, h: H }, m = 4) {
  const edges = [
    [(p) => p[0] >= -m, (a, b) => [-m, a[1] + ((b[1] - a[1]) * (-m - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= W + m, (a, b) => [W + m, a[1] + ((b[1] - a[1]) * (W + m - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= -m, (a, b) => [a[0] + ((b[0] - a[0]) * (-m - a[1])) / (b[1] - a[1]), -m]],
    [(p) => p[1] <= H + m, (a, b) => [a[0] + ((b[0] - a[0]) * (H + m - a[1])) / (b[1] - a[1]), H + m]],
  ];
  let out = ring;
  for (const [inside, cut] of edges) {
    const input = out;
    out = [];
    for (let i = 0; i < input.length; i += 1) {
      const cur = input[i];
      const prev = input[(i + input.length - 1) % input.length];
      if (inside(cur)) {
        if (!inside(prev)) out.push(cut(prev, cur));
        out.push(cur);
      } else if (inside(prev)) {
        out.push(cut(prev, cur));
      }
    }
    if (!out.length) return [];
  }
  return out;
}

const r = (n) => Math.round(n * 10) / 10;

function build({ host, lat, lon, span, centre = [lon, lat] }, countries, { w: W, h: H }) {
  const [cx, cy] = centre;
  const k = Math.cos((cy * Math.PI) / 180);
  const width = span * k; // window width in projected degrees
  const scale = W / width;
  const project = ([lo, la]) => [(lo - cx) * k * scale + W / 2, -(la - cy) * scale + H / 2];

  const land = [];
  const hostPaths = [];
  for (const f of countries.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const target = f.properties.ADM0_A3 === host ? hostPaths : land;
    for (const poly of polys) {
      const ring = clipRing(poly[0].map(project), { w: W, h: H });
      if (ring.length < 3) continue;
      const slim = simplify([...ring, ring[0]], TOLERANCE).slice(0, -1);
      if (slim.length < 3) continue;
      target.push(`M${slim.map((p) => `${r(p[0])} ${r(p[1])}`).join('L')}Z`);
    }
  }
  return { land: land.join(''), host: hostPaths.join(''), pin: project([lon, lat]).map(r) };
}

const countries = await loadCountries();
const maps = {};
for (const [round, cfg] of Object.entries(MAPS)) {
  maps[round] = { ...build(cfg, countries, BANNER), tile: build({ ...cfg, ...TILES[round] }, countries, TILE) };
  console.log(`round ${round} (${cfg.host}): banner ${maps[round].land.length + maps[round].host.length} chars, tile ${maps[round].tile.land.length + maps[round].tile.host.length} chars`);
}

const body = `/**
 * Regional maps keyed by race round: the race detail banner (viewBox 0 0 ${BANNER.w} ${BANNER.h})
 * and a square tile for Home (tile, viewBox 0 0 ${TILE.w} ${TILE.h}).
 * Generated by scripts/make-maps.mjs: do not edit by hand. Re-run \`npm run maps\` if the calendar changes.
 * Source: Natural Earth (public domain).
 */
export const MAPS = ${JSON.stringify(maps, null, 2)};
`;
await writeFile(OUT, body);
console.log(`wrote ${OUT}`);
