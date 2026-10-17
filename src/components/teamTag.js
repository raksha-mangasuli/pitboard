import { esc } from '../utils/dom.js';
import { teamInfo } from '../data/teams.js';

export function teamTag(constructorId, label, fallbackName) {
  const [colour] = teamInfo(constructorId, fallbackName || label);
  return `<span class="tag" style="--tc:var(${colour})">${esc(label)}</span>`;
}

export const teamColourVar = (constructorId, fallbackName) => `--tc:var(${teamInfo(constructorId, fallbackName)[0]})`;
