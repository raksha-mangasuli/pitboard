import './styles/tokens.css';
import './styles/base.css';
import './styles/art.css';
import './styles/components.css';
import './styles/pages.css';

import { createRouter } from './router.js';
import { renderTabBar } from './components/tabBar.js';
import { homePage } from './pages/home.js';
import { standingsPage } from './pages/standings.js';
import { calendarPage } from './pages/calendar.js';
import { raceDetailPage } from './pages/raceDetail.js';
import { raceResultPage } from './pages/raceResult.js';
import { backLink } from './components/pageHeader.js';

const view = document.getElementById('view');
const tabbar = document.getElementById('tabbar');

const routes = [
  { pattern: /^\/$/, tab: 'home', page: homePage },
  { pattern: /^\/standings$/, tab: 'standings', page: standingsPage },
  { pattern: /^\/calendar$/, tab: 'calendar', page: calendarPage },
  { pattern: /^\/race\/(?<round>\d+)$/, tab: 'calendar', page: raceDetailPage },
  { pattern: /^\/result\/(?<round>\d+)$/, tab: 'calendar', page: raceResultPage },
];

function notFound() {
  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `${backLink('#/', 'Home')}<p class="muted">Page not found.</p>`;
  return { el };
}

createRouter({
  outlet: view,
  routes,
  notFound,
  onNavigate: (tab) => renderTabBar(tabbar, tab),
}).start();
