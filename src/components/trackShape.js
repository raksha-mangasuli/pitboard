import { TRACKS } from '../data/tracks.js';

/** Circuit outline for a race round, or an empty string when none has been generated. */
export function trackShape(round, label) {
  const t = TRACKS[round];
  if (!t) return '';
  const [x, y] = t.start;
  const [nx, ny] = t.d.match(/L(-?[\d.]+) (-?[\d.]+)/).slice(1).map(Number);
  const len = Math.hypot(nx - x, ny - y) || 1;
  // Start and finish bar sits across the direction of travel
  const px = (-(ny - y) / len) * 3;
  const py = ((nx - x) / len) * 3;
  return `<svg class="track" viewBox="${t.viewBox}" role="img" aria-label="${label}">
    <path class="track__road" d="${t.d}"/>
    <line class="track__start" x1="${(x - px).toFixed(1)}" y1="${(y - py).toFixed(1)}" x2="${(x + px).toFixed(1)}" y2="${(y + py).toFixed(1)}"/>
  </svg>`;
}

export const hasTrack = (round) => Boolean(TRACKS[round]);
