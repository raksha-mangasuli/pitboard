import { esc } from '../utils/dom.js';
import { findRace } from '../data/races.js';
import { backLink } from '../components/pageHeader.js';
import { raceIcon } from '../components/raceIcon.js';
import { teamTag, teamColourVar } from '../components/teamTag.js';
import { getState, subscribe, ensureLoaded } from '../services/store.js';

const CLASSIFICATION_LIMIT = 10;
/** Podium columns left to right: P2, P1, P3 with step heights in px. */
const PODIUM = [{ index: 1, height: 64 }, { index: 0, height: 92 }, { index: 2, height: 48 }];

function podiumMarkup(list) {
  return PODIUM.map(({ index, height }) => {
    const r = list[index];
    if (!r) return '<div></div>';
    return `<div class="pcol" style="${teamColourVar(r.cid, r.cname)}">
      ${teamTag(r.cid, r.code, r.cname)}
      <span class="pcol__name">${esc(r.family)}</span>
      <span class="muted small">${esc(r.cname)}</span>
      <div class="pcol__step${index === 0 ? ' pcol__step--win' : ''}" style="height:${height}px">${r.pos}</div>
    </div>`;
  }).join('');
}

function rowMarkup(r) {
  const result = r.status === 'Finished' ? (r.time || 'Finished') : r.status;
  return `<div class="rrow" style="${teamColourVar(r.cid, r.cname)}">
    <span class="srow__pos">${r.pos}</span>
    ${teamTag(r.cid, r.code, r.cname)}
    <div class="rrow__who"><span>${esc(r.given)} <b>${esc(r.family)}</b></span><span class="muted small">${esc(r.cname)}</span></div>
    <div class="rrow__res">${esc(result)}<span class="muted small">${r.pts > 0 ? `${r.pts} pts` : ''}</span></div>
  </div>`;
}

export function raceResultPage({ round }) {
  ensureLoaded();
  const el = document.createElement('div');
  el.className = 'page';
  let showAll = false;

  function render() {
    const { last } = getState();
    if (String(last.round) !== String(round)) {
      el.innerHTML = `${backLink('#/calendar', 'Calendar')}<p class="muted">Results for round ${esc(round)} are not available in the app yet. Only the most recent race is loaded.</p>`;
      return;
    }
    const race = findRace(last.round);
    const shown = showAll ? last.list : last.list.slice(0, CLASSIFICATION_LIMIT);
    el.style.cssText = race ? `--c:var(${race.c});--c2:var(${race.c2})` : '';
    el.innerHTML = `${backLink('#/calendar', 'Calendar')}
      <div class="title-row">
        <div class="title-row__text">
          <span class="eyebrow">Round ${esc(last.round)} · Result</span>
          <h1>${esc(last.name)}</h1>
          ${race ? `<p class="muted">${esc(race.circuit)}, ${esc(race.place)}</p>` : ''}
        </div>
        ${race ? raceIcon(race, 'lg') : ''}
      </div>
      <div class="podium">${podiumMarkup(last.list)}</div>
      <section class="section"><div class="section__head"><h2>Classification</h2><span class="muted small">${last.list.length} drivers</span></div>
        <div class="card list">${shown.map(rowMarkup).join('')}</div></section>
      ${last.list.length > CLASSIFICATION_LIMIT ? `<button type="button" class="btn btn--ghost" data-more>${showAll ? `Show top ${CLASSIFICATION_LIMIT}` : `Show full classification (${last.list.length})`}</button>` : ''}`;
    el.querySelector('[data-more]')?.addEventListener('click', () => { showAll = !showAll; render(); });
  }

  render();
  const unsubscribe = subscribe(render);
  return { el, destroy: unsubscribe };
}
