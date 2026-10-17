import { esc } from '../utils/dom.js';
import { RACES, nextRaceIndex, findRace } from '../data/races.js';
import { SCENE, icon } from '../assets/art.js';
import { raceIcon, raceVars } from '../components/raceIcon.js';
import { trackShape, hasTrack } from '../components/trackShape.js';
import { countdownMarkup, startCountdown } from '../components/countdown.js';
import { raceListRow } from '../components/raceRow.js';
import { formatInstant, userTimeZone } from '../utils/time.js';
import { getState, subscribe, ensureLoaded } from '../services/store.js';

const HOUR = 3_600_000;

function sessionTile(label, iso, now, isRace) {
  const local = formatInstant(iso);
  const done = new Date(iso).getTime() + (isRace ? 2 : 1) * HOUR < now;
  return `<div class="tile${isRace ? ' tile--race' : ''}${done ? ' tile--done' : ''}">
    <span class="eyebrow">${label}${done ? ' · done' : ''}</span>
    <span class="tile__time">${local.time}</span>
    <span class="tile__day">${local.day}</span>
  </div>`;
}

function heroMarkup(race, now) {
  const head = `<div class="hero__strip" aria-hidden="true"></div><div class="scene" aria-hidden="true">${SCENE}</div>`;
  if (!race) {
    return `<section class="hero card" style="--c:var(--c-blue)">${head}
      <div class="hero__body"><span class="pill">SEASON COMPLETE</span><h2 class="hero__title">See you in 2027</h2></div></section>`;
  }
  const q = new Date(race.quali).getTime();
  const r = new Date(race.race).getTime();
  const label = q > now ? 'Qualifying in' : r > now ? 'Race starts in' : 'Race under way';
  const target = q > now ? q : r > now ? r : null;
  return `<a class="hero card" href="#/race/${race.round}" style="${raceVars(race)}" data-target="${target ?? ''}">${head}
    <div class="hero__body">
      <div class="hero__head">
        <div class="hero__text">
          <div class="pills"><span class="pill">NEXT UP · ROUND ${race.round}</span>${race.sprint ? '<span class="pill pill--quiet">SPRINT WEEKEND</span>' : ''}</div>
          <h2 class="hero__title">${esc(race.name)}</h2>
        </div>
        ${hasTrack(race.round) ? '' : raceIcon(race, 'lg')}
      </div>
      <div class="hero__split">
        <div class="hero__info">
          <p class="muted hero__where">${esc(race.circuit)}, ${esc(race.place.split(",")[0])}</p>
          <div class="hero__count"><p class="eyebrow">${label}</p>${target ? countdownMarkup() : ''}</div>
        </div>
        ${hasTrack(race.round) ? `<span class="hero__track">${trackShape(race.round, `${race.circuit} layout`)}</span>` : ''}
      </div>
      <div class="tiles">${sessionTile('Qualifying', race.quali, now, false)}${sessionTile('Race', race.race, now, true)}</div>
    </div></a>`;
}

function lastRaceMarkup(last) {
  const winner = last.list[0];
  const race = findRace(last.round);
  return `<a class="card link-card" href="#/result/${esc(last.round)}"${race ? ` style="${raceVars(race)}"` : ''}>
    <svg class="mini-podium" viewBox="0 0 56 52" aria-hidden="true">
      <path class="mini-podium__step" d="M0 52V33a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v19Z"/>
      <path class="mini-podium__step mini-podium__step--win" d="M19 52V17a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v35Z"/>
      <path class="mini-podium__step" d="M38 52V37a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v15Z"/>
      <text class="mini-podium__n" x="8.5" y="43">2</text><text class="mini-podium__n mini-podium__n--win" x="27.5" y="27">1</text><text class="mini-podium__n" x="46.5" y="47">3</text>
    </svg>
    <span class="link-card__text">
      <span class="eyebrow eyebrow--accent">Last race · Round ${esc(last.round)}</span>
      <span class="link-card__title">${esc(last.name)}</span>
      ${winner ? `<span class="muted small">Winner: ${esc(winner.given)} ${esc(winner.family)}</span>` : ''}
    </span>
    ${icon('chevronRight', 'ico ico--muted')}
  </a>`;
}

export function homePage() {
  ensureLoaded();
  const el = document.createElement('div');
  el.className = 'page';
  let stopCountdown = null;

  function render() {
    stopCountdown?.();
    const now = Date.now();
    const index = nextRaceIndex(now);
    const race = index >= 0 ? RACES[index] : null;
    const upcoming = index >= 0 ? RACES.slice(index + 1, index + 3) : [];
    const zone = userTimeZone();
    el.innerHTML = `
      <header class="topbar">
        <span class="brand"><i aria-hidden="true"></i>PITBOARD</span>
        <span class="muted small">${zone ? `Times in ${esc(zone.replace('_', ' '))}` : 'Times in your local time'}</span>
      </header>
      ${heroMarkup(race, now)}
      ${upcoming.length ? `<section class="section" aria-labelledby="later-h">
        <div class="section__head"><h2 id="later-h">Later this season</h2><a class="link" href="#/calendar">See all</a></div>
        <div class="card list">${upcoming.map((r) => raceListRow(r, now)).join('')}</div>
      </section>` : ''}
      <div data-last>${lastRaceMarkup(getState().last)}</div>`;
    const hero = el.querySelector('.hero[data-target]');
    const target = Number(hero?.dataset.target);
    if (hero && target) stopCountdown = startCountdown(hero, target, render);
  }

  render();
  const unsubscribe = subscribe(() => {
    const slot = el.querySelector('[data-last]');
    if (slot) slot.innerHTML = lastRaceMarkup(getState().last);
  });
  return { el, destroy: () => { stopCountdown?.(); unsubscribe(); } };
}
