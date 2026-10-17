import { esc } from '../utils/dom.js';
import { icon } from '../assets/art.js';
import { raceIcon, raceVars } from './raceIcon.js';
import { formatInstant, daysUntil, dateBadge } from '../utils/time.js';

/** Calendar card: icon, round, name, date and a status chip. */
export function raceCard(race, { now, isNext = false, past = false, href }) {
  const date = formatInstant(race.race);
  let chip;
  if (past) chip = '<span class="chip">Result</span>';
  else if (isNext) chip = '<span class="chip chip--accent">Next</span>';
  else {
    const d = daysUntil(race.race, now);
    chip = `<span class="chip">in ${d} ${d === 1 ? 'day' : 'days'}</span>`;
  }
  return `<a class="race-card" href="${href}" style="${raceVars(race)}">
    ${raceIcon(race)}
    <span class="race-card__text">
      <span class="eyebrow">Round ${race.round}</span>
      <span class="race-card__name">${esc(race.name)}</span>
      <span class="race-card__meta">${date.day}  ·  ${esc(race.place.split(',')[0])}</span>
    </span>
    ${chip}
  </a>`;
}

/** Row in the "Later this season" list on Home: race art, round, name, date and days to go. */
export function raceListRow(race, now = Date.now()) {
  const badge = dateBadge(race.race);
  const d = daysUntil(race.race, now);
  return `<a class="list-row" href="#/race/${race.round}" style="${raceVars(race)}">
    ${raceIcon(race)}
    <span class="list-row__text">
      <span class="eyebrow eyebrow--accent">Round ${race.round}</span>
      <span class="list-row__name">${esc(race.name)}</span>
      <span class="list-row__meta">${esc(race.circuit)}</span>
    </span>
    <span class="list-row__side"><b>${badge.day} ${badge.month}</b><span>in ${d} ${d === 1 ? 'day' : 'days'}</span></span>
    ${icon('chevronRight', 'ico ico--muted')}
  </a>`;
}
