/**
 * Rounds 1 to 16 of the 2026 season, shown as slim rows on the Calendar "Past" tab.
 * They have no icon, colourway or detail page, so they live apart from the full schedule in races.js.
 * Race start is a UTC instant. Source: OpenF1 race sessions (the cancelled Bahrain and Saudi Arabia races are not rounds).
 */
export const EARLIER_RACES = [
  { round: 1, name: 'Australian Grand Prix', place: 'Melbourne', race: '2026-03-08T04:00:00Z' },
  { round: 2, name: 'Chinese Grand Prix', place: 'Shanghai', race: '2026-03-15T07:00:00Z' },
  { round: 3, name: 'Japanese Grand Prix', place: 'Suzuka', race: '2026-03-29T05:00:00Z' },
  { round: 4, name: 'Miami Grand Prix', place: 'Miami Gardens', race: '2026-05-03T17:00:00Z' },
  { round: 5, name: 'Canadian Grand Prix', place: 'Montréal', race: '2026-05-24T20:00:00Z' },
  { round: 6, name: 'Monaco Grand Prix', place: 'Monte Carlo', race: '2026-06-07T13:00:00Z' },
  { round: 7, name: 'Barcelona Grand Prix', place: 'Barcelona', race: '2026-06-14T13:00:00Z' },
  { round: 8, name: 'Austrian Grand Prix', place: 'Spielberg', race: '2026-06-28T13:00:00Z' },
  { round: 9, name: 'British Grand Prix', place: 'Silverstone', race: '2026-07-05T14:00:00Z' },
  { round: 10, name: 'Belgian Grand Prix', place: 'Spa-Francorchamps', race: '2026-07-19T13:00:00Z' },
  { round: 11, name: 'Hungarian Grand Prix', place: 'Budapest', race: '2026-07-26T13:00:00Z' },
  { round: 12, name: 'Dutch Grand Prix', place: 'Zandvoort', race: '2026-08-23T13:00:00Z' },
  { round: 13, name: 'Italian Grand Prix', place: 'Monza', race: '2026-09-06T13:00:00Z' },
  { round: 14, name: 'Spanish Grand Prix', place: 'Madrid', race: '2026-09-13T13:00:00Z' },
  { round: 15, name: 'Azerbaijan Grand Prix', place: 'Baku', race: '2026-09-26T11:00:00Z' },
  { round: 16, name: 'Bahrain Grand Prix', place: 'Kuala Lumpur', race: '2026-10-04T07:00:00Z' },
];
