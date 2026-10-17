# Pitboard: notes for Claude Code

Minimal, ad-free F1 info app for personal use and portfolio. Next race with countdown, standings, calendar, race detail, race result. Plain JavaScript (ES modules) with Vite. No framework unless asked.

## Commands

- `npm run dev` live preview
- `npm run build` regenerates `public/pitboard.ics`, then builds to `dist/`
- `npm run tracks` downloads circuit outlines and writes `src/data/tracks.js` (commit the result)
- `npm run maps` downloads country borders and writes `src/data/maps.js`, the regional map in the race banner (commit the result)

## Structure rules

- One file per screen in `src/pages/`. Reusable UI in `src/components/`. Static data in `src/data/`. Fetching, cache and shared state in `src/services/`. Styles in `src/styles/`.
- Keep it simple: no new libraries or folders without a clear reason. Prefer the platform (Intl, details, CSS variables).
- All colours, spacing and radii come from CSS variables in `src/styles/tokens.css`. Light is the default, dark follows the device.
- Escape anything from the API with `esc()` before putting it in HTML.
- Hash routes (`#/standings`, `#/race/18`) because GitHub Pages cannot rewrite URLs.

## Design

- The Figma file (page "App structure v2") is the reference for layout. Calm, light, warm colours, gentle contrast, static SVG illustrations (car scene, per-race icons). No animations unless asked.
- 390px wide first. Check light and dark, no horizontal scroll.

## Working style

- Never use em dashes in any text, comments or docs.
- Step-by-step phone instructions: write the steps in English but use the German menu names (the phone is set to German).
- Commit small, with clear messages. Deploys happen automatically from `main` via GitHub Actions to GitHub Pages.
- Be honest about what was tested. Live API calls and CORS can only be confirmed on the deployed site.

## Workflow (mandatory, in this order)
1. DESIGN: Any new screen, component or visual change is designed in Figma first
   (file key 3mDSdwqjMuByimPsSxid7x). Use the existing tokens and text styles
   (collection "Pitboard colour", styles PB/*). Do not write UI code before the
   design exists there.
   When changing an existing screen (for example Home), do not edit the current
   frame. Add the new version as a new frame next to it, so the old one stays
   available, and show it for approval.
2. READ: Before coding, read the Figma frame with the Figma tools
   (get_design_context, get_screenshot) and build from it. Reuse existing
   components and CSS tokens.
3. CODE: Implement in the structured folders only (pages, components, styles, data).
4. RUN: Start npm run dev, open localhost and compare the result to the Figma frame.
5. SYNC: If the code had to differ from the design, update Figma so both match.
   Once a new version is approved, also update the original frame on the
   "App structure v2" page to the approved design, so v2 always shows the current app.
   Do not leave the approved design only in the extra frame.
Before starting any UI task, state which Figma frame it comes from. If there is none,
stop and ask me to approve a design first.
