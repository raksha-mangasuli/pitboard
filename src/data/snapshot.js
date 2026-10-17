/**
 * Saved copy of the standings and last race (after round 17).
 * Shown instantly and used whenever the live API cannot be reached.
 * Row shapes are expanded by `expand*` below so the rest of the app only sees objects.
 */
const DRIVERS = [
  [1, 340, 8, 'ANT', 'Andrea Kimi', 'Antonelli', 'mercedes', 'Mercedes'],
  [2, 238, 3, 'RUS', 'George', 'Russell', 'mercedes', 'Mercedes'],
  [3, 229, 1, 'HAM', 'Lewis', 'Hamilton', 'ferrari', 'Ferrari'],
  [4, 221, 2, 'VER', 'Max', 'Verstappen', 'red_bull', 'Red Bull'],
  [5, 215, 1, 'LEC', 'Charles', 'Leclerc', 'ferrari', 'Ferrari'],
  [6, 201, 2, 'NOR', 'Lando', 'Norris', 'mclaren', 'McLaren'],
  [7, 138, 0, 'PIA', 'Oscar', 'Piastri', 'mclaren', 'McLaren'],
  [8, 97, 0, 'HAD', 'Isack', 'Hadjar', 'red_bull', 'Red Bull'],
  [9, 75, 0, 'LAW', 'Liam', 'Lawson', 'rb', 'RB F1 Team'],
  [10, 41, 0, 'GAS', 'Pierre', 'Gasly', 'alpine', 'Alpine F1 Team'],
  [11, 38, 0, 'LIN', 'Arvid', 'Lindblad', 'rb', 'RB F1 Team'],
  [12, 27, 0, 'COL', 'Franco', 'Colapinto', 'alpine', 'Alpine F1 Team'],
  [13, 23, 0, 'BEA', 'Oliver', 'Bearman', 'haas', 'Haas F1 Team'],
  [14, 13, 0, 'HUL', 'Nico', 'Hülkenberg', 'audi', 'Audi'],
  [15, 10, 0, 'BOR', 'Gabriel', 'Bortoleto', 'audi', 'Audi'],
  [16, 7, 0, 'OCO', 'Esteban', 'Ocon', 'haas', 'Haas F1 Team'],
  [17, 7, 0, 'ALO', 'Fernando', 'Alonso', 'aston_martin', 'Aston Martin'],
  [18, 7, 0, 'SAI', 'Carlos', 'Sainz', 'williams', 'Williams'],
  [19, 5, 0, 'ALB', 'Alexander', 'Albon', 'williams', 'Williams'],
  [20, 1, 0, 'TSU', 'Yuki', 'Tsunoda', 'rb', 'RB F1 Team'],
  [21, 0, 0, 'STR', 'Lance', 'Stroll', 'aston_martin', 'Aston Martin'],
  [22, 0, 0, 'BOT', 'Valtteri', 'Bottas', 'cadillac', 'Cadillac F1 Team'],
  [23, 0, 0, 'PER', 'Sergio', 'Pérez', 'cadillac', 'Cadillac F1 Team'],
];

const TEAMS = [
  [1, 578, 11, 'mercedes', 'Mercedes'], [2, 444, 2, 'ferrari', 'Ferrari'],
  [3, 339, 2, 'mclaren', 'McLaren'], [4, 332, 2, 'red_bull', 'Red Bull'],
  [5, 100, 0, 'rb', 'RB F1 Team'], [6, 68, 0, 'alpine', 'Alpine F1 Team'],
  [7, 30, 0, 'haas', 'Haas F1 Team'], [8, 23, 0, 'audi', 'Audi'],
  [9, 12, 0, 'williams', 'Williams'], [10, 7, 0, 'aston_martin', 'Aston Martin'],
  [11, 0, 0, 'cadillac', 'Cadillac F1 Team'],
];

const LAST = [
  [1, 'VER', 'Max', 'Verstappen', 'red_bull', 'Red Bull', 'Finished', '1:42:00.785', 25],
  [2, 'LEC', 'Charles', 'Leclerc', 'ferrari', 'Ferrari', 'Finished', '+7.335', 18],
  [3, 'ANT', 'Andrea Kimi', 'Antonelli', 'mercedes', 'Mercedes', 'Finished', '+24.573', 15],
  [4, 'NOR', 'Lando', 'Norris', 'mclaren', 'McLaren', 'Finished', '+40.506', 12],
  [5, 'PIA', 'Oscar', 'Piastri', 'mclaren', 'McLaren', 'Finished', '+49.644', 10],
  [6, 'HAM', 'Lewis', 'Hamilton', 'ferrari', 'Ferrari', 'Finished', '+53.188', 8],
  [7, 'LAW', 'Liam', 'Lawson', 'rb', 'RB F1 Team', 'Finished', '+1:21.666', 6],
  [8, 'HUL', 'Nico', 'Hülkenberg', 'audi', 'Audi', 'Finished', '+1:23.386', 4],
  [9, 'RUS', 'George', 'Russell', 'mercedes', 'Mercedes', 'Finished', '+1:24.677', 2],
  [10, 'HAD', 'Isack', 'Hadjar', 'red_bull', 'Red Bull', 'Finished', '+1:30.862', 1],
  [11, 'GAS', 'Pierre', 'Gasly', 'alpine', 'Alpine F1 Team', 'Lapped', '', 0],
  [12, 'BEA', 'Oliver', 'Bearman', 'haas', 'Haas F1 Team', 'Lapped', '', 0],
  [13, 'OCO', 'Esteban', 'Ocon', 'haas', 'Haas F1 Team', 'Lapped', '', 0],
  [14, 'SAI', 'Carlos', 'Sainz', 'williams', 'Williams', 'Lapped', '', 0],
  [15, 'LIN', 'Arvid', 'Lindblad', 'rb', 'RB F1 Team', 'Lapped', '', 0],
  [16, 'ALO', 'Fernando', 'Alonso', 'aston_martin', 'Aston Martin', 'Lapped', '', 0],
  [17, 'PER', 'Sergio', 'Pérez', 'cadillac', 'Cadillac F1 Team', 'Lapped', '', 0],
  [18, 'ALB', 'Alexander', 'Albon', 'williams', 'Williams', 'Retired', '', 0],
  [19, 'BOT', 'Valtteri', 'Bottas', 'cadillac', 'Cadillac F1 Team', 'Lapped', '', 0],
  [20, 'STR', 'Lance', 'Stroll', 'aston_martin', 'Aston Martin', 'Retired', '', 0],
  [21, 'COL', 'Franco', 'Colapinto', 'alpine', 'Alpine F1 Team', 'Retired', '', 0],
  [22, 'BOR', 'Gabriel', 'Bortoleto', 'audi', 'Audi', 'Retired', '', 0],
];

export const SNAPSHOT = {
  drivers: {
    round: '17',
    list: DRIVERS.map(([pos, pts, wins, code, given, family, cid, cname]) => ({ pos, pts, wins, code, given, family, cid, cname })),
  },
  teams: {
    round: '17',
    list: TEAMS.map(([pos, pts, wins, cid, name]) => ({ pos, pts, wins, cid, name })),
  },
  last: {
    name: 'Singapore Grand Prix',
    round: '17',
    date: '2026-10-11',
    list: LAST.map(([pos, code, given, family, cid, cname, status, time, pts]) => ({ pos, code, given, family, cid, cname, status, time, pts })),
  },
};
