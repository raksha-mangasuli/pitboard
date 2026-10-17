/**
 * Static SVG sketches. Colours come from CSS classes (see styles/art.css) so they follow
 * the light and dark themes. `--c` and `--c2` are set per race by the parent element.
 */

/** 48x48 icon per race, keyed by `race.art`. */
export const RACE_ART = {
  sg: '<path class="sk fc2" d="M5 17 Q24 10 43 17 L40 21 L8 21 Z"/><rect class="sk fc" x="10" y="21" width="7" height="19"/><rect class="sk fc" x="20.5" y="21" width="7" height="19"/><rect class="sk fc" x="31" y="21" width="7" height="19"/><path class="sk nf" d="M4 43 Q9 39 14 43 T24 43 T34 43 T44 43"/>',
  us: '<polygon class="sk fc" points="24,9 27.8,19.8 39.2,20.1 30.1,27 33.4,37.9 24,31.4 14.6,37.9 17.9,27 8.8,20.1 20.2,19.8"/><path class="sk nf" d="M12 44 H36"/>',
  mx: '<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M24 14 V36 M24 30 H15 V22 M24 26 H33 V18" style="stroke:var(--fg)" stroke-width="11"/><path d="M24 14 V36 M24 30 H15 V22 M24 26 H33 V18" style="stroke:var(--c)" stroke-width="7"/></g><path class="sk nf" d="M8 44 H40"/>',
  br: '<circle class="sk fc2" cx="31" cy="15" r="7"/><path class="sk nf" d="M31 3 V5 M43 15 H41 M19 15 H21 M40 6 L38.6 7.4 M22 6 L23.4 7.4"/><path class="sk fc" d="M5 42 C5 30 17 27 21 42 Z"/><path class="sk fc" d="M17 42 C19 25 38 25 43 42 Z"/>',
  lv: '<g transform="rotate(-12 24 24)"><rect class="sk fc" x="9" y="9" width="30" height="30" rx="6"/><circle class="fw" cx="17" cy="17" r="2.7"/><circle class="fw" cx="31" cy="17" r="2.7"/><circle class="fw" cx="24" cy="24" r="2.7"/><circle class="fw" cx="17" cy="31" r="2.7"/><circle class="fw" cx="31" cy="31" r="2.7"/></g>',
  qa: '<path class="sk fc2" d="M34 7 A11 11 0 1 0 38 27 A9 9 0 1 1 34 7 Z"/><path class="sk fc" d="M4 42 Q14 28 25 37 T44 35 V45 H4 Z"/>',
  ad: '<path class="sk fc" d="M8 34 H40 L35 41 H13 Z"/><path class="sk nf" d="M24 9 V34"/><path class="sk fc2" d="M24 9 V32 H11 Z"/><path class="sk fw" d="M27 15 V32 H38 Z"/><path class="sk nf" d="M4 45 Q9 42 14 45 T24 45 T34 45 T44 45"/>'
};

/** Wide hero illustration (320x124) shown on Home and Race detail. */
export const SCENE =
  '<svg viewBox="0 0 320 124" aria-hidden="true">' +
  '<circle class="sk fy" cx="268" cy="34" r="18"/>' +
  '<path class="sk nf" d="M268 6 V0 M296 34 H304 M240 34 H232 M288 14 L294 8 M248 14 L242 8" opacity=".5"/>' +
  '<rect x="30" y="34" width="56" height="14" rx="7" style="fill:var(--card)" opacity=".9"/><circle cx="48" cy="34" r="9" style="fill:var(--card)" opacity=".9"/><circle cx="64" cy="32" r="11" style="fill:var(--card)" opacity=".9"/>' +
  '<rect x="150" y="18" width="40" height="11" rx="5.5" style="fill:var(--card)" opacity=".9"/><circle cx="163" cy="18" r="7" style="fill:var(--card)" opacity=".9"/>' +
  '<rect x="0" y="100" width="320" height="24" style="fill:color-mix(in srgb,var(--fg) 16%,var(--card))"/>' +
  '<path d="M0 101 H320" stroke-width="4" style="stroke:var(--c-red)" stroke-dasharray="12 12"/>' +
  '<path d="M0 101 H320" stroke-width="4" style="stroke:var(--card)" stroke-dasharray="12 12" stroke-dashoffset="12"/>' +
  '<path d="M0 113 H320" stroke-width="3" style="stroke:var(--card)" stroke-dasharray="16 12" opacity=".8"/>' +
  '<path class="sk nf" d="M8 62 H36 M0 74 H28 M12 86 H34" opacity=".4"/>' +
  '<svg x="40" y="20" width="240" height="90" viewBox="0 0 280 100">' +
    '<path class="fy" d="M48 78 L48 56 L100 52 L118 38 L138 36 L146 50 L170 54 L262 70 L268 74 L262 80 Z" transform="translate(5 5)"/>' +
    '<rect class="sk fb" x="28" y="32" width="30" height="6" rx="2"/><rect class="sk fb" x="28" y="30" width="4" height="22" rx="1.5"/><path class="sk nf" d="M44 38 V56"/>' +
    '<path class="sk fr" d="M48 78 L48 56 L100 52 L118 38 L138 36 L146 50 L170 54 L262 70 L268 74 L262 80 Z"/>' +
    '<path class="sk nf" d="M62 66 H246" style="stroke:var(--card)" stroke-width="3"/>' +
    '<circle class="sk fb" cx="151" cy="45" r="8"/><path class="sk nf" d="M149 43 Q155 40 159 45"/>' +
    '<path class="sk fb" d="M242 86 H278 V92 H238 Z"/><rect class="sk fb" x="270" y="80" width="4" height="14" rx="1.5"/><path class="sk nf" d="M254 80 V86"/>' +
    '<circle class="sk fk" cx="80" cy="76" r="20"/><circle class="sk fw" cx="80" cy="76" r="9"/><circle class="ff" cx="80" cy="76" r="3"/>' +
    '<circle class="sk fk" cx="232" cy="79" r="17"/><circle class="sk fw" cx="232" cy="79" r="8"/><circle class="ff" cx="232" cy="79" r="2.6"/>' +
  '</svg></svg>';

/** 24x24 UI icons. */
export const ICONS = {
  home: '<path class="icon" d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  standings: '<path class="icon" d="M5 20v-8M12 20V5M19 20v-5"/>',
  calendar: '<rect class="icon" x="4" y="5" width="16" height="15" rx="2.5"/><path class="icon" d="M4 10h16M9 3v4M15 3v4"/>',
  calendarAlert: '<rect class="icon" x="4" y="5" width="16" height="15" rx="2.5"/><path class="icon" d="M4 10h16M9 3v4M15 3v4M12 13v3l2 1"/>',
  close: '<path class="icon" d="M6 6l12 12M18 6L6 18"/>',
  chevronRight: '<path class="icon" d="M9 6l6 6-6 6"/>',
  chevronDown: '<path class="icon" d="M6 9l6 6 6-6"/>',
  back: '<path class="icon" d="M15 6l-6 6 6 6"/>',
};

export function icon(name, className = 'ico') {
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
}
