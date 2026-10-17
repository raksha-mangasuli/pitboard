import { STORAGE_PREFIX } from '../config.js';

/** Small localStorage cache with timestamps. Every call is safe when storage is blocked. */
export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function cacheSet(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    /* storage full or blocked: the app still works without it */
  }
}
