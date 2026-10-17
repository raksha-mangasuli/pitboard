import { splitDuration } from '../utils/time.js';

export function countdownMarkup() {
  return `<div class="cd" aria-live="off">
    <div><b data-u="d">00</b><span>DAYS</span></div>
    <div><b data-u="h">00</b><span>HRS</span></div>
    <div><b data-u="m">00</b><span>MIN</span></div>
    <div><b data-u="s">00</b><span>SEC</span></div>
  </div>`;
}

/**
 * Tick a countdown rendered by `countdownMarkup()` inside `root`.
 * Calls `onDone` once the target passes. Returns a function that stops the timer.
 */
export function startCountdown(root, targetMs, onDone) {
  const nodes = Object.fromEntries(['d', 'h', 'm', 's'].map((u) => [u, root.querySelector(`[data-u=${u}]`)]));
  const tick = () => {
    const left = (targetMs - Date.now()) / 1000;
    if (left <= 0) {
      stop();
      onDone?.();
      return;
    }
    const parts = splitDuration(left);
    for (const u of ['d', 'h', 'm', 's']) nodes[u].textContent = parts[u];
  };
  const timer = setInterval(tick, 1000);
  const stop = () => clearInterval(timer);
  tick();
  return stop;
}
