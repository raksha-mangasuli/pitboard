/** Escape text before putting it into an HTML string. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** Create an element from an HTML string. */
export function html(markup, tag = 'div', className = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.innerHTML = markup;
  return el;
}
