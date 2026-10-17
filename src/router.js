/**
 * Minimal hash router (GitHub Pages cannot rewrite URLs, so we use #/path).
 * A route is { pattern, tab, page } where `page(params)` returns { el, destroy? }.
 */
export function createRouter({ outlet, routes, onNavigate, notFound }) {
  let current = null;

  function match(path) {
    for (const route of routes) {
      const m = route.pattern.exec(path);
      if (m) return { route, params: m.groups || {} };
    }
    return null;
  }

  function render() {
    const path = location.hash.replace(/^#/, '') || '/';
    current?.destroy?.();
    const found = match(path);
    const result = found ? found.route.page(found.params) : notFound();
    current = result;
    outlet.replaceChildren(result.el);
    window.scrollTo(0, 0);
    onNavigate?.(found ? found.route.tab : null);
  }

  window.addEventListener('hashchange', render);
  return { start: render };
}
