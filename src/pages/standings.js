import { esc } from '../utils/dom.js';
import { teamInfo } from '../data/teams.js';
import { SEASON_LABEL } from '../config.js';
import { pageHeader } from '../components/pageHeader.js';
import { segmented, onSegment } from '../components/segmented.js';
import { clockTime } from '../utils/time.js';
import { getState, subscribe, ensureLoaded } from '../services/store.js';

const DRIVER_LIMIT = 10;

function statusLine(s) {
  const round = s.drivers.round;
  const at = s.updatedAt ? clockTime(s.updatedAt) : '';
  switch (s.status) {
    case 'live': return `Live data, checked at ${at}. After round ${round}.`;
    case 'cache': return `Updated at ${at}. After round ${round}.`;
    case 'stale': return `Could not refresh. Showing the last saved data after round ${round}.`;
    case 'snapshot': return `Could not reach the live data. Showing standings after round ${round} saved in the app.`;
    default: return `Loading the latest standings. Showing round ${round} for now.`;
  }
}

function rowMarkup(row, index, lead, isDriver) {
  const [colour, abbr] = teamInfo(row.cid, isDriver ? row.cname : row.name);
  const width = lead > 0 ? Math.max(0, Math.round((row.pts / lead) * 100)) : 0;
  const gap = lead - row.pts;
  const gapText = index === 0 && row.pos === 1 ? 'Leader' : gap === 0 ? 'Level' : `-${gap}`;
  const wins = row.wins > 0 ? `${row.wins} ${row.wins === 1 ? 'win' : 'wins'}` : '';
  const title = isDriver ? `<span class="muted">${esc(row.given)}</span> <b>${esc(row.family)}</b>` : `<b>${esc(row.name)}</b>`;
  const sub = isDriver ? `${esc(row.cname)}${wins ? ` · ${wins}` : ''}` : wins || 'No wins yet';
  return `<div class="srow" style="--tc:var(${colour})">
    <span class="srow__pos">${row.pos}</span>
    <span class="tag">${esc(isDriver ? row.code : abbr)}</span>
    <div class="srow__main"><div class="srow__title">${title}</div><div class="srow__sub">${sub}</div>
      <div class="bar"><i style="width:${width}%"></i></div></div>
    <div class="srow__pts"><b>${row.pts}</b><span>${gapText}</span></div>
  </div>`;
}

export function standingsPage() {
  ensureLoaded();
  const el = document.createElement('div');
  el.className = 'page';
  let tab = 'drivers';
  let showAll = false;

  function render() {
    const s = getState();
    const isDriver = tab === 'drivers';
    const list = isDriver ? s.drivers.list : s.teams.list;
    const limit = isDriver ? DRIVER_LIMIT : list.length;
    const shown = showAll ? list : list.slice(0, limit);
    const lead = list[0]?.pts ?? 0;
    el.innerHTML = `${pageHeader('Standings', `${SEASON_LABEL} season`)}
      ${segmented([{ id: 'drivers', label: 'Drivers' }, { id: 'teams', label: 'Teams' }], tab, 'Standings type')}
      <div class="slist">${shown.map((r, i) => rowMarkup(r, i, lead, isDriver)).join('')}</div>
      ${list.length > limit ? `<button type="button" class="btn btn--ghost" data-more>${showAll ? `Show top ${limit}` : `Show all ${list.length} ${isDriver ? 'drivers' : 'teams'}`}</button>` : ''}
      <p class="muted small">${statusLine(s)}</p>`;
    onSegment(el, (id) => { tab = id; showAll = false; render(); });
    el.querySelector('[data-more]')?.addEventListener('click', () => { showAll = !showAll; render(); });
  }

  render();
  const unsubscribe = subscribe(render);
  return { el, destroy: unsubscribe };
}
