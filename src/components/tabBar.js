import { icon } from '../assets/art.js';

export const TABS = [
  { id: 'home', label: 'Home', href: '#/', icon: 'home' },
  { id: 'standings', label: 'Standings', href: '#/standings', icon: 'standings' },
  { id: 'calendar', label: 'Calendar', href: '#/calendar', icon: 'calendar' },
];

export function renderTabBar(nav, activeId) {
  nav.innerHTML = TABS.map((t) => {
    const active = t.id === activeId;
    return `<a class="tab" href="${t.href}"${active ? ' aria-current="page"' : ''}>${icon(t.icon, 'tab__ico')}<span>${t.label}</span></a>`;
  }).join('');
}
