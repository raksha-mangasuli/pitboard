import { esc } from '../utils/dom.js';

/** Two-or-more option toggle. Wire it with `onSegment(root, handler)`. */
export function segmented(options, activeId, label) {
  const buttons = options
    .map((o) => `<button type="button" data-seg="${esc(o.id)}" aria-pressed="${o.id === activeId}">${esc(o.label)}</button>`)
    .join('');
  return `<div class="seg" role="group" aria-label="${esc(label)}">${buttons}</div>`;
}

export function onSegment(root, handler) {
  root.querySelectorAll('[data-seg]').forEach((btn) => {
    btn.addEventListener('click', () => handler(btn.dataset.seg));
  });
}
