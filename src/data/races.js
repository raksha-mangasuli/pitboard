/**
 * Season schedule (UTC instants) plus per-race colours and circuit facts.
 * `c` and `c2` are CSS custom properties from styles/tokens.css.
 * `facts` (lap length, laps, turns) were entered by hand: verify before relying on them.
 */
const SCHEDULE = [
  { round: 17, name: 'Singapore Grand Prix', circuit: 'Marina Bay Street Circuit', place: 'Singapore', tz: 'Asia/Singapore', sprint: true,
    quali: '2026-10-10T13:00:00Z', race: '2026-10-11T12:00:00Z', c: '--c-blue', c2: '--c-yellow', art: 'sg',
    facts: { km: '4.9 km', laps: 62, turns: 19 } },
  { round: 18, name: 'United States Grand Prix', circuit: 'Circuit of the Americas', place: 'Austin, USA', tz: 'America/Chicago',
    quali: '2026-10-24T21:00:00Z', race: '2026-10-25T20:00:00Z', c: '--c-red', c2: '--c-yellow', art: 'us',
    facts: { km: '5.5 km', laps: 56, turns: 20 } },
  { round: 19, name: 'Mexico City Grand Prix', circuit: 'Autódromo Hermanos Rodríguez', place: 'Mexico City', tz: 'America/Mexico_City',
    quali: '2026-10-31T21:00:00Z', race: '2026-11-01T20:00:00Z', c: '--c-mint', c2: '--c-yellow', art: 'mx',
    facts: { km: '4.3 km', laps: 71, turns: 17 } },
  { round: 20, name: 'Brazilian Grand Prix', circuit: 'Autódromo José Carlos Pace', place: 'São Paulo', tz: 'America/Sao_Paulo',
    quali: '2026-11-07T18:00:00Z', race: '2026-11-08T17:00:00Z', c: '--c-orange', c2: '--c-yellow', art: 'br',
    facts: { km: '4.3 km', laps: 71, turns: 15 } },
  { round: 21, name: 'Las Vegas Grand Prix', circuit: 'Las Vegas Strip Street Circuit', place: 'Las Vegas, USA', tz: 'America/Los_Angeles',
    quali: '2026-11-21T04:00:00Z', race: '2026-11-22T04:00:00Z', c: '--c-pink', c2: '--c-yellow', art: 'lv',
    facts: { km: '6.2 km', laps: 50, turns: 17 } },
  { round: 22, name: 'Qatar Grand Prix', circuit: 'Lusail International Circuit', place: 'Lusail', tz: 'Asia/Qatar',
    quali: '2026-11-28T18:00:00Z', race: '2026-11-29T16:00:00Z', c: '--c-lilac', c2: '--c-yellow', art: 'qa',
    facts: { km: '5.4 km', laps: 57, turns: 16 } },
  { round: 23, name: 'Abu Dhabi Grand Prix', circuit: 'Yas Marina Circuit', place: 'Abu Dhabi, UAE', tz: 'Asia/Dubai',
    quali: '2026-12-05T14:00:00Z', race: '2026-12-06T13:00:00Z', c: '--c-yellow', c2: '--c-blue', art: 'ad',
    facts: { km: '5.3 km', laps: 58, turns: 16 } },
];

/**
 * Colourway per race: bg is the banner and map colour, tone a shade that reads on light cards,
 * on the colour of the country on the map and pin the circuit marker.
 * Used in the race banner and as small accents (see raceVars).
 */
const THEMES = {
  17: { bg: '#14233F', tone: '#14233F', on: '#F4EFE6', pin: '#FFB454' }, // Midnight
  18: { bg: '#B8573A', tone: '#A94B2F', on: '#FFF4E6', pin: '#FFE08A' }, // Clay
  19: { bg: '#123D33', tone: '#123D33', on: '#F3EEDF', pin: '#F2C14E' }, // Forest
  20: { bg: '#F2C14E', tone: '#8A5A00', on: '#1F1A12', pin: '#8A2B14' }, // Sun
  21: { bg: '#3B2147', tone: '#3B2147', on: '#F6EDF2', pin: '#F7A8B8' }, // Plum
  22: { bg: '#5E1B34', tone: '#5E1B34', on: '#F8ECEC', pin: '#F5B7A0' }, // Berry
  23: { bg: '#0E4650', tone: '#0E4650', on: '#EDF5F2', pin: '#F2D28B' }, // Ocean
};

export const RACES = SCHEDULE.map((r) => ({ ...r, theme: THEMES[r.round] }));

export const RACE_DURATION_MS = 2 * 3_600_000;

export function findRace(round) {
  return RACES.find((r) => r.round === Number(round)) || null;
}

/** Index of the first race that has not finished yet, or -1 when the season is over. */
export function nextRaceIndex(now = Date.now()) {
  return RACES.findIndex((r) => new Date(r.race).getTime() + RACE_DURATION_MS > now);
}
