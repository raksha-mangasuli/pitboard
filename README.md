# Pitboard

A small, calm F1 companion: the next race with a live countdown, driver and team standings, the season calendar, and the latest race result. Times are shown in your own time zone. It installs to the home screen as a web app.

Built with plain JavaScript (ES modules) and [Vite](https://vite.dev). No framework, no ads, one runtime request (the Jolpica F1 API, with a built-in fallback).

## Screens

| Route | Page | File |
| --- | --- | --- |
| `#/` | Home: next race, countdown, session times, later races, last race link | `src/pages/home.js` |
| `#/standings` | Drivers and Teams standings with gap bars | `src/pages/standings.js` |
| `#/calendar` | Upcoming and past races | `src/pages/calendar.js` |
| `#/race/:round` | Race detail, circuit facts, calendar alerts | `src/pages/raceDetail.js` |
| `#/result/:round` | Podium and full classification | `src/pages/raceResult.js` |

## Getting started

```bash
npm install
npm run dev        # local dev server with live reload
npm run build      # regenerates pitboard.ics, then builds to dist/
npm run preview    # serve the production build locally
npm run tracks     # download circuit outlines and generate src/data/tracks.js (run once, then commit)
```

Requires Node 20 or newer.

## Project structure

```
pitboard/
├─ index.html               App shell (view + tab bar), meta tags, manifest link
├─ vite.config.js           Relative base so it works under /pitboard/ on GitHub Pages
├─ public/                  Copied as-is into the build
│  ├─ manifest.webmanifest  Home screen install settings
│  ├─ icons/                180, 192, 512 px app icons
│  └─ pitboard.ics          Generated calendar file (do not edit by hand)
├─ scripts/
│  ├─ make-ics.mjs          Builds pitboard.ics from src/data/races.js
│  └─ make-tracks.mjs       Downloads circuit outlines and writes src/data/tracks.js
├─ src/
│  ├─ main.js               Entry point: routes, tab bar, styles
│  ├─ router.js             Tiny hash router (#/path)
│  ├─ config.js             API URL, cache lifetime, timeouts
│  ├─ data/                 Static data: races.js, teams.js, snapshot.js
│  ├─ services/             api.js (fetch + parse), cache.js, store.js (state + loading)
│  ├─ pages/                One file per screen
│  ├─ components/           Reusable pieces: tabBar, raceIcon, teamTag, countdown, ...
│  ├─ assets/art.js         SVG illustrations and UI icons
│  ├─ utils/                dom.js (escaping), time.js (Intl formatting)
│  └─ styles/               tokens.css, base.css, art.css, components.css, pages.css
└─ .github/workflows/deploy.yml   Builds and publishes to GitHub Pages on every push to main
```

### How data flows

1. `data/snapshot.js` holds a saved copy of the standings and last race, so the app is never empty.
2. `services/store.js` loads each dataset once per visit: fresh cache, then live API, then stale cache, then the snapshot.
3. Pages read from the store with `getState()` and re-render through `subscribe()`.
4. Static schedule data lives in `data/races.js`. Update it when the calendar changes; the calendar file and every page follow.

### Design tokens

All colours, spacing and radii are CSS variables in `src/styles/tokens.css`. Light is the default; dark follows the device setting. The Figma file uses the same names.

## Deploying to GitHub Pages

One-time setup: in the repository go to **Settings, Pages**, and set **Source** to **GitHub Actions**.
After that, every push to `main` runs `.github/workflows/deploy.yml`, builds the app and publishes it.

## Updating data

- **Schedule or session times:** edit `src/data/races.js`, commit, push. The `.ics` file is rebuilt during the build.
- **Circuit facts** (lap length, laps, turns) in `races.js` were entered by hand. Verify them before relying on them.
- **Snapshot:** refresh `src/data/snapshot.js` now and then so the offline fallback stays recent.

## Circuit outlines

Each race page can show the circuit layout. The outlines are generated from open GeoJSON centre lines
([bacinger/f1-circuits](https://github.com/bacinger/f1-circuits), derived from OpenStreetMap contributors) by `scripts/make-tracks.mjs`.

1. Run `npm run tracks` once (needs internet). It writes `src/data/tracks.js`.
2. Commit that file. The app hides the layout card for any round without an outline.
3. The Singapore file in the source repo may be the older layout. Check the repo for a newer file name and update the map at the top of the script if so.

Check the source repository's licence and keep the OpenStreetMap credit if you publish the app.

## Known limits

- Live standings need the Jolpica API to allow requests from the browser. If it does not, the app shows the saved snapshot and says so.
- Calendar alerts use an `.ics` file. Real push notifications would need a service worker and a small sender service.
- Results are loaded for the latest race only.
