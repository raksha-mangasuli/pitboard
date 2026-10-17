import { API_BASE, FETCH_TIMEOUT_MS } from '../config.js';

/** GET a Jolpica (Ergast-compatible) endpoint with a timeout. */
export async function fetchJson(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(API_BASE + path, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const codeOf = (driver) => driver.code || String(driver.familyName).slice(0, 3).toUpperCase();

export function parseDrivers(json) {
  const list = json.MRData.StandingsTable.StandingsLists[0];
  if (!list?.DriverStandings?.length) throw new Error('empty drivers response');
  return {
    round: list.round,
    list: list.DriverStandings.map((s) => ({
      pos: Number(s.position),
      pts: Number(s.points),
      wins: Number(s.wins),
      code: codeOf(s.Driver),
      given: s.Driver.givenName,
      family: s.Driver.familyName,
      cid: s.Constructors?.[0]?.constructorId,
      cname: s.Constructors?.[0]?.name || '',
    })),
  };
}

export function parseTeams(json) {
  const list = json.MRData.StandingsTable.StandingsLists[0];
  if (!list?.ConstructorStandings?.length) throw new Error('empty teams response');
  return {
    round: list.round,
    list: list.ConstructorStandings.map((s) => ({
      pos: Number(s.position),
      pts: Number(s.points),
      wins: Number(s.wins),
      cid: s.Constructor.constructorId,
      name: s.Constructor.name,
    })),
  };
}

export function parseLastRace(json) {
  const race = json.MRData.RaceTable.Races[0];
  if (!race?.Results?.length) throw new Error('empty results response');
  return {
    name: race.raceName,
    round: race.round,
    date: race.date,
    list: race.Results.map((r) => ({
      pos: Number(r.position),
      code: codeOf(r.Driver),
      given: r.Driver.givenName,
      family: r.Driver.familyName,
      cid: r.Constructor?.constructorId,
      cname: r.Constructor?.name || '',
      status: r.status || '',
      time: r.Time?.time || '',
      pts: Number(r.points),
    })),
  };
}
