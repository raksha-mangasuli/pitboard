import { esc } from '../utils/dom.js';
import { findRace } from '../data/races.js';
import { raceIcon, raceVars } from '../components/raceIcon.js';
import { raceMap, hasMap } from '../components/raceMap.js';
import { backLink } from '../components/pageHeader.js';
import { trackShape, hasTrack } from '../components/trackShape.js';
import { formatInstant, userTimeZone, splitDuration } from '../utils/time.js';
import { getState } from '../services/store.js';

const HOUR = 3_600_000;

function sessionRow(label, iso, tz, now, isRace) {
  const local = formatInstant(iso);
  const track = formatInstant(iso, tz);
  const done = new Date(iso).getTime() + (isRace ? 2 : 1) * HOUR < now;
  return `<div class="session${done ? ' session--done' : ''}">
    <div><span class="session__name">${label}${done ? ' · done' : ''}</span><span class="muted small">${local.day}</span></div>
    <div class="session__time"><b>${local.time}</b><span class="muted small">Track time ${track.time}</span></div>
  </div>`;
}

function startsIn(race, now) {
  const q = new Date(race.quali).getTime();
  const r = new Date(race.race).getTime();
  const target = q > now ? q : r > now ? r : null;
  if (!target) return 'Weekend finished';
  const { d, h } = splitDuration((target - now) / 1000);
  return `${q > now ? 'Qualifying' : 'Race'} starts in ${Number(d)}d ${Number(h)}h`;
}

export function raceDetailPage({ round }) {
  const el = document.createElement('div');
  el.className = 'page';
  const race = findRace(round);
  if (!race) {
    el.innerHTML = `${backLink('#/calendar', 'Calendar')}<p class="muted">That race is not in the schedule.</p>`;
    return { el };
  }
  const now = Date.now();
  const finished = new Date(race.race).getTime() + 2 * HOUR < now;
  const hasResult = Number(getState().last.round) === race.round;
  el.style.cssText = raceVars(race);
  el.innerHTML = `
    ${backLink('#/calendar', 'Calendar')}
    ${hasMap(race.round) ? `<div class="banner" aria-hidden="true">${raceMap(race.round)}</div>` : ''}
    <div class="title-row">
      <div class="title-row__text">
        <span class="eyebrow eyebrow--accent">Round ${race.round}${race.sprint ? ' · Sprint weekend' : ''}</span>
        <h1>${esc(race.name)}</h1>
        <p class="muted">${esc(race.circuit)}, ${esc(race.place)}</p>
      </div>
      ${raceIcon(race, 'lg')}
    </div>
    <span class="pill pill--quiet pill--wide">${startsIn(race, now)}</span>
    <div class="card sessions">${sessionRow('Qualifying', race.quali, race.tz, now, false)}${sessionRow('Race', race.race, race.tz, now, true)}</div>
    ${hasTrack(race.round) ? `<div class="card track-card"><span class="eyebrow">Circuit layout</span>${trackShape(race.round, `${race.circuit} layout`)}<span class="track-key muted small">Start and finish</span></div>` : ''}
    <div class="facts">
      <div class="card fact"><b>${race.facts.km}</b><span class="muted small">Lap length</span></div>
      <div class="card fact"><b>${race.facts.laps}</b><span class="muted small">Laps</span></div>
      <div class="card fact"><b>${race.facts.turns}</b><span class="muted small">Turns</span></div>
    </div>
    ${hasResult && finished ? `<a class="btn btn--ghost" href="#/result/${race.round}">View race result</a>` : ''}
    <p class="muted small">Times shown in ${esc((userTimeZone() || 'your local time').replace('_', ' '))}.</p>`;
  return { el };
}
