import { CACHE_TTL_MS } from '../config.js';
import { SNAPSHOT } from '../data/snapshot.js';
import { cacheGet, cacheSet } from './cache.js';
import { fetchJsonWithRetry, parseDrivers, parseTeams, parseLastRace } from './api.js';
import { fetchActiveDrivers, fetchOpenF1Standings } from './openf1.js';

/**
 * Single source of truth for standings and last race.
 * Order of trust for each dataset: fresh cache, Jolpica, OpenF1 (standings only), stale cache, built-in snapshot.
 */
const state = {
  drivers: SNAPSHOT.drivers,
  teams: SNAPSHOT.teams,
  last: SNAPSHOT.last,
  /** 'loading' | 'live' | 'cache' | 'stale' | 'snapshot' */
  status: 'loading',
  updatedAt: null,
  /** Set of three-letter codes of the drivers racing now, or null when unknown. */
  roster: null,
};

const listeners = new Set();
let started = false;

export const getState = () => state;

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const notify = () => listeners.forEach((fn) => fn(state));

/** One OpenF1 request set shared by the drivers and teams jobs. */
let backup;
const loadBackup = () => (backup ??= fetchOpenF1Standings());

async function loadOne(key, path, parse, fromBackup) {
  const cached = cacheGet(key);
  if (cached && Date.now() - cached.t < CACHE_TTL_MS) return { value: cached.v, source: 'cache', at: cached.t };
  try {
    const value = parse(await fetchJsonWithRetry(path));
    cacheSet(key, value);
    return { value, source: 'live', at: Date.now() };
  } catch {
    if (fromBackup) {
      try {
        const value = fromBackup(await loadBackup());
        cacheSet(key, value);
        return { value, source: 'live', at: Date.now() };
      } catch { /* backup failed too: fall through to saved data */ }
    }
    if (cached) return { value: cached.v, source: 'stale', at: cached.t };
    return { value: null, source: 'snapshot', at: null };
  }
}

/** Codes of the drivers racing now, or null when unknown (then the standings show one list). */
async function loadRoster() {
  const cached = cacheGet('roster');
  if (cached && Date.now() - cached.t < CACHE_TTL_MS) return cached.v;
  try {
    const codes = await fetchActiveDrivers();
    cacheSet('roster', codes);
    return codes;
  } catch {
    return cached ? cached.v : null;
  }
}

/** Try the network again after a failure (the "Try again" button). */
export function retry() {
  started = false;
  backup = undefined;
  state.status = 'loading';
  notify();
  ensureLoaded();
}

/** Load all datasets once per page load. Safe to call from every page. */
export function ensureLoaded() {
  if (started) return;
  started = true;
  loadRoster().then((codes) => {
    state.roster = codes ? new Set(codes) : null;
    notify();
  });
  const jobs = [
    ['drivers', 'driverStandings.json', parseDrivers, (b) => b.drivers],
    ['teams', 'constructorStandings.json', parseTeams, (b) => b.teams],
    ['last', 'last/results.json', parseLastRace, null],
  ];
  jobs.forEach(async ([key, path, parse, fromBackup]) => {
    const { value, source, at } = await loadOne(key, path, parse, fromBackup);
    if (value) state[key] = value;
    if (key === 'drivers') {
      state.status = source;
      state.updatedAt = at;
    }
    notify();
  });
}
