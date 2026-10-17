import { esc } from '../utils/dom.js';
import { icon } from '../assets/art.js';

export function pageHeader(title, subtitle = '') {
  return `<header class="page-head"><h1>${esc(title)}</h1>${subtitle ? `<p class="muted">${esc(subtitle)}</p>` : ''}</header>`;
}

export function backLink(href, label) {
  return `<a class="back" href="${href}">${icon('back', 'ico')}<span>${esc(label)}</span></a>`;
}
