import { RACE_ART } from '../assets/art.js';

/** Race colour custom properties (colours and colourway) as an inline style string. */
export const raceVars = (race) => {
  const t = race.theme;
  return `--c:var(${race.c});--c2:var(${race.c2});--rbg:${t.bg};--rtone-l:${t.tone};--ron:${t.on};--rpin:${t.pin}`;
};

export function raceIcon(race, size = 'md') {
  return `<span class="art art--${size}" style="${raceVars(race)}" aria-hidden="true"><svg viewBox="0 0 48 48">${RACE_ART[race.art]}</svg></span>`;
}
