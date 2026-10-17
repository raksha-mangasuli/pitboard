export const HOUR = 3_600_000;
export const DAY = 86_400_000;

export function userTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

/** Format an ISO instant as { day, time } in a time zone (device zone when tz is omitted). */
export function formatInstant(iso, tz) {
  const date = new Date(iso);
  const zone = tz ? { timeZone: tz } : {};
  const day = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', ...zone }).format(date);
  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, ...zone }).format(date);
  return { day, time };
}

/** Short month and day number, e.g. { month: 'OCT', day: '25' }. */
export function dateBadge(iso) {
  const date = new Date(iso);
  return {
    month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date).toUpperCase(),
    day: String(date.getDate()),
  };
}

export function clockTime(timestamp) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(timestamp));
}

export function daysUntil(iso, now) {
  return Math.max(1, Math.ceil((new Date(iso).getTime() - now) / DAY));
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Split a duration in seconds into zero-padded parts. */
export function splitDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  return {
    d: pad2(Math.floor(s / 86400)),
    h: pad2(Math.floor((s % 86400) / 3600)),
    m: pad2(Math.floor((s % 3600) / 60)),
    s: pad2(s % 60),
  };
}
