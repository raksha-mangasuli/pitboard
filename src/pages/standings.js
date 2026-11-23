import { esc } from '../utils/dom.js';
import { teamInfo } from '../data/teams.js';
import { SEASON_LABEL } from '../config.js';
import { pageHeader } from '../components/pageHeader.js';
import { segmented, onSegment } from '../components/segmented.js';
import { clockTime } from '../utils/time.js';
import { getState, subscribe, ensureLoaded, retry } from '../services/store.js';

const DRIVER_LIMIT = 10;

const ICONS = {
  loading: '<path d="M10 3a7 7 0 1 0 7 7"/>',
  stale: '<circle cx="10" cy="10" r="7"/><path d="M10 6v4.5l3 1.5"/>',
  offline: '<path d="M3 7.5a10 10 0 0 1 14 0M5.5 10.5a6.5 6.5 0 0 1 9 0M8 13.5a3 3 0 0 1 4 0M4 16 16 4"/>',
};

/** Banner for the three problem states, or '' when the data is fine. Layout comes from the Figma status frames. */
function noticeMarkup(s) {
  const round = s.drivers.round;
  const at = s.updatedAt ? clockTime(s.updatedAt) : '';
  const kinds = {
    loading: ['loading', 'Updating standings', `Showing round ${round} for now.`, false],
    stale: ['stale', 'Could not refresh', `Showing saved standings after round ${round}${at ? `, last updated ${at}` : ''}.`, true],
    snapshot: ['offline', 'No live data', `Showing standings saved in the app after round ${round}. They may be out of date.`, true],
  };
  const kind = kinds[s.status];
  if (!kind) return '';
  const [icon, title, body, canRetry] = kind;
  return `<div class="notice notice--${icon}" role="status">
    <svg class="notice__icon" viewBox="0 0 20 20" aria-hidden="true">${ICONS[icon]}</svg>
    <div class="notice__text"><b>${esc(title)}</b><span>${esc(body)}</span></div>
    ${canRetry ? '<button type="button" class="notice__action" data-retry>Try again</button>' : ''}
  </div>`;
}

/** Quiet line under the list when everything is fine. */
function footnote(s) {
  const at = s.updatedAt ? clockTime(s.updatedAt) : '';
  if (s.status === 'live') return `Live data, checked at ${at}. After round ${s.drivers.round}.`;
  if (s.status === 'cache') return `Updated at ${at}. After round ${s.drivers.round}.`;
  return '';
}

function rowMarkup(row, index, lead, isDriver, idle = false) {
  const [colour, abbr] = teamInfo(row.cid, isDriver ? row.cname : row.name);
  const width = lead > 0 ? Math.max(0, Math.round((row.pts / lead) * 100)) : 0;
  const gap = lead - row.pts;
  const gapText = index === 0 && row.pos === 1 ? 'Leader' : gap === 0 ? 'Level' : `-${gap}`;
  const wins = row.wins > 0 ? `${row.wins} ${row.wins === 1 ? 'win' : 'wins'}` : '';
  const title = isDriver ? `<span class="muted">${esc(row.given)}</span> <b>${esc(row.family)}</b>` : `<b>${esc(row.name)}</b>`;
  const sub = isDriver ? `${esc(row.cname)}${wins ? ` · ${wins}` : ''}` : row.wins == null ? '' : wins || 'No wins yet';
  return `<div class="srow${idle ? ' srow--idle' : ''}" style="--tc:var(${colour})">
    <span class="srow__pos">${row.pos}</span>
    <span class="tag">${esc(isDriver ? row.code : abbr)}</span>
    <div class="srow__main"><div class="srow__title">${title}</div><div class="srow__sub">${sub}</div>
      <div class="bar"><i style="width:${width}%"></i></div></div>
    <div class="srow__pts"><b>${row.pts}</b><span>${gapText}</span></div>
  </div>`;
}

function groupHeader(title, count, note = '') {
  return `<div class="sgroup"><b>${esc(title)}</b><span>${count}</span>${note ? `<em>${esc(note)}</em>` : ''}</div>`;
}

export function standingsPage() {
  ensureLoaded();
  const el = document.createElement('div');
  el.className = 'page';
  let tab = 'drivers';
  let showAll = false;

  function listMarkup(s, isDriver) {
    const list = isDriver ? s.drivers.list : s.teams.list;
    const lead = list[0]?.pts ?? 0;
    const limit = isDriver ? DRIVER_LIMIT : list.length;
    const rows = (items, idle) => `<div class="slist">${items.map((r) => rowMarkup(r, list.indexOf(r), lead, isDriver, idle)).join('')}</div>`;

    // Drivers split into racing now and not racing now when the entry list is known.
    const split = isDriver && s.roster && list.some((r) => s.roster.has(r.code));
    if (!split) return rows(showAll ? list : list.slice(0, limit), false);

    const active = list.filter((r) => s.roster.has(r.code));
    const idle = list.filter((r) => !s.roster.has(r.code));
    const shown = showAll ? active : active.slice(0, limit);
    return `${groupHeader('Active drivers', active.length)}${rows(shown, false)}${showAll && idle.length ? `${groupHeader('Inactive drivers', idle.length, 'Points kept from earlier rounds')}${rows(idle, true)}` : ''}`;
  }

  function render() {
    const s = getState();
    const isDriver = tab === 'drivers';
    const list = isDriver ? s.drivers.list : s.teams.list;
    const limit = isDriver ? DRIVER_LIMIT : list.length;
    const racing = isDriver && s.roster ? list.filter((r) => s.roster.has(r.code)).length : 0;
    const subtitle = racing ? `After round ${s.drivers.round} · ${racing} active drivers` : `${SEASON_LABEL} season`;
    const foot = footnote(s);
    el.innerHTML = `${pageHeader('Standings', subtitle)}
      ${noticeMarkup(s)}
      ${segmented([{ id: 'drivers', label: 'Drivers' }, { id: 'teams', label: 'Teams' }], tab, 'Standings type')}
      ${listMarkup(s, isDriver)}
      ${list.length > limit ? `<button type="button" class="btn btn--ghost" data-more>${showAll ? `Show top ${limit}` : `Show all ${list.length} ${isDriver ? 'drivers' : 'teams'}`}</button>` : ''}
      ${foot ? `<p class="muted small">${foot}</p>` : ''}`;
    onSegment(el, (id) => { tab = id; showAll = false; render(); });
    el.querySelector('[data-more]')?.addEventListener('click', () => { showAll = !showAll; render(); });
    el.querySelector('[data-retry]')?.addEventListener('click', retry);
  }

  render();
  const unsubscribe = subscribe(render);
  return { el, destroy: unsubscribe };
}
