/** constructorId -> [colour token, 3-letter tag]. */
export const TEAMS = {
  mercedes: ['--c-mint', 'MER'],
  ferrari: ['--c-red', 'FER'],
  mclaren: ['--c-orange', 'MCL'],
  red_bull: ['--c-blue', 'RBR'],
  rb: ['--c-teal', 'RB'],
  alpine: ['--c-pink', 'ALP'],
  haas: ['--c-gray', 'HAA'],
  audi: ['--c-slate', 'AUD'],
  williams: ['--c-lilac', 'WIL'],
  aston_martin: ['--c-green', 'AMR'],
  cadillac: ['--c-yellow', 'CAD'],
};

export function teamInfo(constructorId, fallbackName) {
  return TEAMS[constructorId] || ['--c-gray', String(fallbackName || constructorId || '?').slice(0, 3).toUpperCase()];
}
