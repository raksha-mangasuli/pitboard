/**
 * Generates public/pitboard.ics from src/data/races.js.
 * Only sessions that have not started yet are included. Each event has two alerts
 * (1 hour and 10 minutes before). Runs automatically before `npm run build`.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RACES } from '../src/data/races.js';

const OUT = fileURLToPath(new URL('../public/pitboard.ics', import.meta.url));
const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const ascii = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const stamp = fmt(new Date());
const now = Date.now();

function fold(line) {
  const out = [];
  let rest = Buffer.from(line, 'utf8');
  while (rest.length > 74) {
    let cut = 74;
    while ((rest[cut] & 0xc0) === 0x80) cut -= 1;
    out.push(rest.subarray(0, cut).toString('utf8'));
    rest = Buffer.concat([Buffer.from(' '), rest.subarray(cut)]);
  }
  out.push(rest.toString('utf8'));
  return out;
}

const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pitboard//F1//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Pitboard F1'];
let count = 0;

function addEvent(uid, summary, startIso, minutes, location) {
  const start = new Date(startIso);
  if (start.getTime() < now) return;
  const end = new Date(start.getTime() + minutes * 60_000);
  count += 1;
  lines.push('BEGIN:VEVENT', `UID:${uid}@pitboard`, `DTSTAMP:${stamp}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`, `SUMMARY:${summary}`, `LOCATION:${location}`);
  for (const [trigger, text] of [['-PT1H', 'starts in 1 hour'], ['-PT10M', 'starts in 10 minutes']]) {
    lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${summary} ${text}`, `TRIGGER:${trigger}`, 'END:VALARM');
  }
  lines.push('END:VEVENT');
}

for (const race of RACES) {
  const short = ascii(race.name).replace(' Grand Prix', ' GP');
  const location = ascii(`${race.circuit}, ${race.place}`);
  addEvent(`r${race.round}-quali`, `F1 Qualifying: ${short}`, race.quali, 60, location);
  addEvent(`r${race.round}-race`, `F1 Race: ${short}`, race.race, 120, location);
}
lines.push('END:VCALENDAR');

writeFileSync(OUT, lines.flatMap((l) => (Buffer.byteLength(l) > 74 ? fold(l) : [l])).join('\r\n') + '\r\n');
console.log(`pitboard.ics written with ${count} events`);
