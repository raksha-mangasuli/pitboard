import { OPENF1_BASE, SEASON_LABEL } from '../config.js';
import { fetchJson } from './api.js';

/**
 * Backup source for the standings, used when Jolpica cannot be reached.
 * OpenF1 returns driver numbers, not names, and no win counts, so this file joins
 * the pieces and turns them into the same row shapes as api.js (wins stay null).
 */

/** OpenF1 team name -> [constructorId used in data/teams.js, display name used by Jolpica]. */
const TEAM_IDS = {
  Mercedes: ['mercedes', 'Mercedes'],
  Ferrari: ['ferrari', 'Ferrari'],
  McLaren: ['mclaren', 'McLaren'],
  'Red Bull Racing': ['red_bull', 'Red Bull'],
  'Racing Bulls': ['rb', 'RB F1 Team'],
  Alpine: ['alpine', 'Alpine F1 Team'],
  'Haas F1 Team': ['haas', 'Haas F1 Team'],
  Audi: ['audi', 'Audi'],
  Williams: ['williams', 'Williams'],
  'Aston Martin': ['aston_martin', 'Aston Martin'],
  Cadillac: ['cadillac', 'Cadillac F1 Team'],
};

/** OpenF1 allows about 3 requests per second, so requests queue up with a short gap between them. */
const REQUEST_GAP_MS = 400;
let queue = Promise.resolve();
function get(path) {
  const run = queue.then(() => fetchJson(path, OPENF1_BASE));
  queue = run.catch(() => {}).then(() => new Promise((resolve) => setTimeout(resolve, REQUEST_GAP_MS)));
  return run;
}

const teamOf =(name) => TEAM_IDS[name] || [String(name || '').toLowerCase().replace(/\W+/g, '_'), name || ''];
const byPosition = (a, b) => a.position_current - b.position_current;
const MAX_LOOKBACK = 3;
const MAX_LOOKUPS = 4;

/** The season's race sessions, fetched once. A failed fetch is forgotten so a retry can try again. */
let sessionsOnce;
function raceSessions() {
  // Cancelled races (Bahrain and Saudi Arabia in 2026) stay in the list but never happened, so they must not count as rounds.
  sessionsOnce ??= get(`sessions?session_name=Race&year=${SEASON_LABEL}`).then((all) => all.filter((s) => !s.is_cancelled)).catch((err) => {
    sessionsOnce = undefined;
    throw err;
  });
  return sessionsOnce;
}

/** Latest finished race of the season, plus the sessions before it (newest first). */
async function finishedRaces() {
  const sessions = await raceSessions();
  const done = sessions
    .filter((s) => Date.parse(s.date_end) < Date.now())
    .sort((a, b) => Date.parse(b.date_end) - Date.parse(a.date_end));
  if (!done.length) throw new Error('no finished races yet');
  return done;
}

/** Driver number -> name and team, from the latest race and, if needed, a few earlier ones. */
async function driverNames(races, scorers) {
  const found = new Map();
  const inLatestRace = new Set();
  for (const [i, race] of races.slice(0, MAX_LOOKBACK).entries()) {
    const list = await get(`drivers?session_key=${race.session_key}`);
    list.forEach((d) => {
      if (i === 0) inLatestRace.add(d.driver_number);
      if (!found.has(d.driver_number)) found.set(d.driver_number, d);
    });
    if (scorers.every((n) => found.has(n))) break;
  }
  // A scorer who missed all of those races (injury, swap): look the number up across the whole season.
  for (const n of scorers.filter((n) => !found.has(n)).slice(0, MAX_LOOKUPS)) {
    const seen = await get(`drivers?driver_number=${n}`);
    if (seen.length) found.set(n, seen[seen.length - 1]);
  }
  return { found, inLatestRace };
}

/** A real entry list has the full grid. Anything much smaller means it is not published yet. */
const MIN_ENTRY_LIST = 10;

/**
 * Three-letter codes of the drivers who are racing now: the entry list of the next race,
 * or of the latest finished race while the next list is not published yet.
 */
export async function fetchActiveDrivers() {
  const sessions = await raceSessions();
  const upcoming = sessions
    .filter((s) => Date.parse(s.date_end) >= Date.now())
    .sort((a, b) => Date.parse(a.date_start) - Date.parse(b.date_start));
  const latest = await finishedRaces().catch(() => []);
  for (const race of [upcoming[0], latest[0]].filter(Boolean)) {
    const list = await get(`drivers?session_key=${race.session_key}`);
    if (list.length >= MIN_ENTRY_LIST) return list.map((d) => d.name_acronym).filter(Boolean);
  }
  throw new Error('no entry list available');
}

export async function fetchOpenF1Standings() {
  const races = await finishedRaces();
  const key = races[0].session_key;
  const round = String(races.length);

  const [drivers, teams] = await Promise.all([
    get(`championship_drivers?session_key=${key}`),
    get(`championship_teams?session_key=${key}`),
  ]);
  if (!drivers.length || !teams.length) throw new Error('empty OpenF1 standings');

  const scorers = drivers.filter((d) => d.points_current > 0).map((d) => d.driver_number);
  const { found: names, inLatestRace } = await driverNames(races, scorers);
  const rows = drivers.slice().sort(byPosition);

  // Keep scorers and the drivers who took part in the latest race. Zero-point reserves who did not race are dropped.
  const list = rows
    .filter((r) => r.points_current > 0 || inLatestRace.has(r.driver_number))
    .map((r, i) => {
      const d = names.get(r.driver_number);
      const [cid, cname] = teamOf(d?.team_name);
      return {
        pos: i + 1,
        pts: Number(r.points_current),
        wins: null,
        code: d?.name_acronym || String(r.driver_number),
        given: d?.first_name || '',
        family: d?.last_name || `Driver ${r.driver_number}`,
        cid,
        cname,
      };
    });

  return {
    drivers: { round, list },
    teams: {
      round,
      list: teams.slice().sort(byPosition).map((t, i) => {
        const [cid, name] = teamOf(t.team_name);
        return { pos: i + 1, pts: Number(t.points_current), wins: null, cid, name };
      }),
    },
  };
}
