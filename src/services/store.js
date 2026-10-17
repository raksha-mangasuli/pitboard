import { CACHE_TTL_MS } from '../config.js';
import { SNAPSHOT } from '../data/snapshot.js';
import { cacheGet, cacheSet } from './cache.js';
import { fetchJson, parseDrivers, parseTeams, parseLastRace } from './api.js';

/**
 * Single source of truth for standings and last race.
 * Order of trust for each dataset: fresh cache, live API, stale cache, built-in snapshot.
 */
const state = {
  drivers: SNAPSHOT.drivers,
  teams: SNAPSHOT.teams,
  last: SNAPSHOT.last,
  /** 'loading' | 'live' | 'cache' | 'stale' | 'snapshot' */
  status: 'loading',
  updatedAt: null,
};

const listeners = new Set();
let started = false;

export const getState = () => state;

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const notify = () => listeners.forEach((fn) => fn(state));

async function loadOne(key, path, parse) {
  const cached = cacheGet(key);
  if (cached && Date.now() - cached.t < CACHE_TTL_MS) return { value: cached.v, source: 'cache', at: cached.t };
  try {
    const value = parse(await fetchJson(path));
    cacheSet(key, value);
    return { value, source: 'live', at: Date.now() };
  } catch {
    if (cached) return { value: cached.v, source: 'stale', at: cached.t };
    return { value: null, source: 'snapshot', at: null };
  }
}

/** Load all datasets once per page load. Safe to call from every page. */
export function ensureLoaded() {
  if (started) return;
  started = true;
  const jobs = [
    ['drivers', 'driverStandings.json', parseDrivers],
    ['teams', 'constructorStandings.json', parseTeams],
    ['last', 'last/results.json', parseLastRace],
  ];
  jobs.forEach(async ([key, path, parse]) => {
    const { value, source, at } = await loadOne(key, path, parse);
    if (value) state[key] = value;
    if (key === 'drivers') {
      state.status = source;
      state.updatedAt = at;
    }
    notify();
  });
}
