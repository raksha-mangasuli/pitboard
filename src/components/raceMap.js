import { MAPS } from '../data/maps.js';

/** Regional map for a race round (host country highlighted, circuit pinned), or an empty string when none exists. */
export function raceMap(round) {
  const m = MAPS[round];
  if (!m) return '';
  return `<svg class="map" viewBox="0 0 328 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path class="map__land" d="${m.land}"/>
    <path class="map__host" d="${m.host}"/>
    <circle class="map__pin" cx="${m.pin[0]}" cy="${m.pin[1]}" r="4.5"/>
  </svg>`;
}

export const hasMap = (round) => Boolean(MAPS[round]);
