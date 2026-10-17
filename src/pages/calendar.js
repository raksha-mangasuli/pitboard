import { RACES, nextRaceIndex } from '../data/races.js';
import { SEASON_LABEL } from '../config.js';
import { pageHeader } from '../components/pageHeader.js';
import { segmented, onSegment } from '../components/segmented.js';
import { raceCard } from '../components/raceRow.js';
import { icon } from '../assets/art.js';
import { getState } from '../services/store.js';

/** iOS menu names in the visitor's language, so the steps match what their phone shows. */
const MENU = (navigator.language || '').toLowerCase().startsWith('de')
  ? { addAll: 'Alle hinzufügen', notifications: 'Mitteilungen', calendar: 'Kalender', settings: 'Einstellungen' }
  : { addAll: 'Add All', notifications: 'Notifications', calendar: 'Calendar', settings: 'Settings' };

const HIDDEN_KEY = 'pitboard.alertsHidden';

function alertsHidden() {
  try { return localStorage.getItem(HIDDEN_KEY) === '1'; } catch { return false; }
}

function setAlertsHidden(hidden) {
  try { hidden ? localStorage.setItem(HIDDEN_KEY, '1') : localStorage.removeItem(HIDDEN_KEY); } catch { /* storage unavailable */ }
}

/** One-time setup card: a single .ics file adds every remaining qualifying and race. Can be dismissed. */
function alertsCard(count) {
  return `<section class="card alerts">
    <button type="button" class="alerts__close" data-dismiss aria-label="Hide calendar alerts">${icon('close', 'ico')}</button>
    <div class="alerts__head">
      <span class="alerts__icon">${icon('calendarAlert', 'ico')}</span>
      <div class="alerts__text">
        <h2>Get alerts for every race</h2>
        <p class="muted small">One file adds all ${count} remaining qualifying sessions and races to your calendar, with a reminder 1 hour and 10 minutes before each. You only need to do this once.</p>
      </div>
    </div>
    <a class="btn btn--primary" href="${import.meta.env.BASE_URL}pitboard.ics" download>Add alerts to Calendar</a>
    <details class="alerts__help">
      <summary>How it works</summary>
      <ol class="steps">
        <li>Tap the button above on your iPhone.</li>
        <li>Tap ${MENU.addAll}, then pick a calendar.</li>
        <li>Check that ${MENU.notifications} are on for ${MENU.calendar} in ${MENU.settings}.</li>
      </ol>
    </details>
  </section>`;
}

export function calendarPage() {
  const el = document.createElement('div');
  el.className = 'page';
  let tab = 'upcoming';

  function render() {
    const now = Date.now();
    const next = nextRaceIndex(now);
    const upcoming = next >= 0 ? RACES.slice(next) : [];
    const past = (next >= 0 ? RACES.slice(0, next) : RACES).slice().reverse();
    const lastRound = Number(getState().last.round);
    const cards = tab === 'upcoming'
      ? upcoming.map((r, i) => raceCard(r, { now, isNext: i === 0, href: `#/race/${r.round}` }))
      : past.map((r) => raceCard(r, { now, past: true, href: r.round === lastRound ? `#/result/${r.round}` : `#/race/${r.round}` }));
    el.innerHTML = `${pageHeader('Calendar', `${SEASON_LABEL} season · ${upcoming.length} ${upcoming.length === 1 ? 'race' : 'races'} left`)}
      ${segmented([{ id: 'upcoming', label: 'Upcoming' }, { id: 'past', label: 'Past' }], tab, 'Calendar filter')}
      <div class="stack">${cards.join('') || '<p class="muted">Nothing here yet.</p>'}</div>
      ${tab === 'upcoming' && upcoming.length
        ? (alertsHidden() ? '<button type="button" class="link alerts__restore" data-restore>Show calendar alerts</button>' : alertsCard(upcoming.length))
        : ''}`;
    onSegment(el, (id) => { tab = id; render(); });
    el.querySelector('[data-dismiss]')?.addEventListener('click', () => { setAlertsHidden(true); render(); });
    el.querySelector('[data-restore]')?.addEventListener('click', () => { setAlertsHidden(false); render(); });
  }

  render();
  return { el };
}
