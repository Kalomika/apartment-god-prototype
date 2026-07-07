import { changeNeed, log, say, setMood } from './state.js';
import { getObject } from './world.js';
import { updateSoccerGame } from './soccerSystem.js';

export function updateGameActivities(state, dt) {
  updatePoolGame(state, dt);
  updateSoccerGame(state, dt);
}

function poolPlayers(state) {
  return state.entities.filter(e => !e.hidden && e.floor === 2 && String(e.action || '').toLowerCase().includes('pool'));
}

function updatePoolGame(state, dt) {
  const table = getObject('pool_table');
  const players = poolPlayers(state);
  if (!table || !players.length) {
    if (state.poolGame && !state.poolGame.winner) state.poolGame = null;
    return;
  }
  if (!state.poolGame || state.poolGame.tableId !== table.id || !samePlayers(state.poolGame, players)) startPoolGame(state, table, players);
  const game = state.poolGame;
  if (!game) return;
  game.t += dt;
  game.messageT = Math.max(0, (game.messageT || 0) - dt);

  updateBalls(game, table, dt);
  if (!game.winner) {
    game.shotT -= dt;
    if (game.shotT <= 0 && ballsSettled(game)) shootPool(state, table, players);
    checkPoolWinner(state, players);
  }
}

function samePlayers(game, players) {
  const ids = players.map(p => p.id).join('|');
  return game.playerIds?.join('|') === ids;
}

function startPoolGame(state, table, players) {
  const names = players.map(p => p.name);
  state.poolGame = {
    tableId: table.id,
    playerIds: players.map(p => p.id),
    names,
    t: 0,
    shotT: .8,
    turn: 0,
    score: Object.fromEntries(players.map(p => [p.id, 0])),
    shots: Object.fromEntries(players.map(p => [p.id, 0])),
    streak: 0,
    message: 'Rack broken',
    messageT: 2,
    winner: null,
    targetId: null,
    cueLine: null,
    balls: rackBalls(table)
  };
  log(state, `${names.join(' and ')} started a pool mini game.`);
}

function rackBalls(table) {
  const cy = table.y + table.h * .5;
  return [
    { id: 'cue', value: 0, x: table.x + table.w * .30, y: cy, vx: 0, vy: 0, fill: '#f8fbff' },
    { id: 'one', value: 1, x: table.x + table.w * .58, y: cy, vx: 0, vy: 0, fill: '#f1c66a' },
    { id: 'two', value: 1, x: table.x + table.w * .64, y: cy - 15, vx: 0, vy: 0, fill: '#ff75df' },
    { id: 'three', value: 1, x: table.x + table.w * .64, y: cy + 15, vx: 0, vy: 0, fill: '#74e6ff' },
    { id: 'four', value: 2, x: table.x + table.w * .70, y: cy - 30, vx: 0, vy: 0, fill: '#90d68c' },
    { id: 'five', value: 2, x: table.x + table.w * .70, y: cy, vx: 0, vy: 0, fill: '#f08b57' },
    { id: 'six', value: 2, x: table.x + table.w * .70, y: cy + 30, vx: 0, vy: 0, fill: '#a98bff' }
  ];
}

function updateBalls(game, table, dt) {
  const pockets = pocketPoints(table);
  for (const b of game.balls) {
    if (b.pocketed) continue;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.vx *= Math.pow(.72, dt);
    b.vy *= Math.pow(.72, dt);
    const r = b.id === 'cue' ? 6 : 7;
    if (b.x < table.x + 18) { b.x = table.x + 18; b.vx = Math.abs(b.vx) * .82; }
    if (b.x > table.x + table.w - 18) { b.x = table.x + table.w - 18; b.vx = -Math.abs(b.vx) * .82; }
    if (b.y < table.y + 18) { b.y = table.y + 18; b.vy = Math.abs(b.vy) * .82; }
    if (b.y > table.y + table.h - 18) { b.y = table.y + table.h - 18; b.vy = -Math.abs(b.vy) * .82; }
    const pocket = pockets.find(p => Math.hypot(b.x - p.x, b.y - p.y) < p.r + r * .25);
    if (pocket && b.id !== 'cue') b.pocketed = true;
    if (pocket && b.id === 'cue') resetCueBall(b, table);
  }
  collideBalls(game.balls);
}

function collideBalls(balls) {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i];
      const b = balls[j];
      if (a.pocketed || b.pocketed) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.max(.1, Math.hypot(dx, dy));
      const min = 15;
      if (dist >= min) continue;
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = (min - dist) / 2;
      a.x -= nx * overlap; a.y -= ny * overlap; b.x += nx * overlap; b.y += ny * overlap;
      const push = ((a.vx - b.vx) * nx + (a.vy - b.vy) * ny) * .72;
      a.vx -= push * nx; a.vy -= push * ny; b.vx += push * nx; b.vy += push * ny;
    }
  }
}

function ballsSettled(game) {
  return game.balls.every(b => b.pocketed || Math.hypot(b.vx, b.vy) < 10);
}

function shootPool(state, table, players) {
  const game = state.poolGame;
  const shooter = players[game.turn % players.length] || players[0];
  const cue = game.balls.find(b => b.id === 'cue');
  const targets = game.balls.filter(b => !b.pocketed && b.id !== 'cue');
  if (!cue || !targets.length) return checkPoolWinner(state, players);

  const before = targets.filter(b => b.pocketed).length;
  const skill = shooter.skills?.learning ?? shooter.skills?.intellect ?? 3;
  const stamina = shooter.needs?.stamina ?? 60;
  const pressure = Math.max(0, 1 - stamina / 120);
  const accuracy = Math.max(.18, Math.min(.92, .28 + skill * .075 - pressure * .22));
  const target = chooseTarget(cue, targets, game, accuracy);
  const aim = aimAtPocket(target, table, game.turn);
  const angleNoise = (1 - accuracy) * (Math.sin(game.t * 13 + game.turn * 7) * .9);
  const power = 145 + skill * 12 + Math.max(0, stamina - 50) * .4;
  const dx = aim.x - cue.x;
  const dy = aim.y - cue.y;
  const mag = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / mag;
  const uy = dy / mag;
  const cos = Math.cos(angleNoise);
  const sin = Math.sin(angleNoise);
  cue.vx = (ux * cos - uy * sin) * power;
  cue.vy = (ux * sin + uy * cos) * power;
  target.vx += ux * (power * .62 + accuracy * 80);
  target.vy += uy * (power * .62 + accuracy * 80);

  const madeShot = Math.sin(game.t * 5 + game.turn * 3 + skill) < accuracy - .22;
  if (madeShot) {
    target.pocketed = true;
    game.score[shooter.id] = (game.score[shooter.id] || 0) + target.value;
    game.streak += 1;
    game.message = `${shooter.name} sank ${target.id}`;
    say(shooter, 'SINK');
    changeNeed(shooter, 'fun', 2 + game.streak);
    setMood(shooter, 'hyped');
  } else {
    game.streak = 0;
    game.message = `${shooter.name} missed`;
    say(shooter, 'MISS');
    changeNeed(shooter, 'fun', 1);
  }
  game.messageT = 2.2;
  game.targetId = target.id;
  game.cueLine = { x1: cue.x, y1: cue.y, x2: aim.x, y2: aim.y, t: 1.1 };
  game.shots[shooter.id] = (game.shots[shooter.id] || 0) + 1;
  if (!madeShot) game.turn = (game.turn + 1) % Math.max(1, players.length);
  game.shotT = madeShot ? 1.15 : 1.55;

  const after = targets.filter(b => b.pocketed).length;
  if (after > before) changeNeed(shooter, 'social', players.length > 1 ? 2 : 0);
}

function chooseTarget(cue, targets, game, accuracy) {
  const sorted = [...targets].sort((a, b) => Math.hypot(a.x - cue.x, a.y - cue.y) - Math.hypot(b.x - cue.x, b.y - cue.y));
  if (accuracy > .62) return sorted[0];
  return sorted[(game.turn + Math.floor(game.t)) % sorted.length];
}

function aimAtPocket(target, table, turn) {
  const pockets = pocketPoints(table);
  return pockets[(turn + Math.floor(target.x + target.y)) % pockets.length];
}

function pocketPoints(table) {
  return [
    { x: table.x + 18, y: table.y + 18, r: 12 },
    { x: table.x + table.w / 2, y: table.y + 14, r: 10 },
    { x: table.x + table.w - 18, y: table.y + 18, r: 12 },
    { x: table.x + 18, y: table.y + table.h - 18, r: 12 },
    { x: table.x + table.w / 2, y: table.y + table.h - 14, r: 10 },
    { x: table.x + table.w - 18, y: table.y + table.h - 18, r: 12 }
  ];
}

function resetCueBall(cue, table) {
  cue.x = table.x + table.w * .30;
  cue.y = table.y + table.h * .5;
  cue.vx = 0;
  cue.vy = 0;
}

function checkPoolWinner(state, players) {
  const game = state.poolGame;
  const live = game.balls.filter(b => !b.pocketed && b.id !== 'cue').length;
  const maxShots = Math.max(8, players.length * 6);
  const shotCount = Object.values(game.shots || {}).reduce((sum, n) => sum + n, 0);
  if (live > 0 && shotCount < maxShots && game.t < 28) return;
  const ranked = players.map(p => ({ player: p, score: game.score[p.id] || 0 })).sort((a, b) => b.score - a.score);
  const winner = ranked[0]?.player || players[0];
  game.winner = winner?.name || 'Player';
  game.message = `${game.winner} wins ${ranked.map(r => r.score).join(' to ')}`;
  game.messageT = 4;
  for (const p of players) {
    const won = p.id === winner?.id;
    changeNeed(p, 'fun', won ? 14 : 7);
    changeNeed(p, 'social', players.length > 1 ? 8 : 2);
    changeNeed(p, 'stamina', -3);
    setMood(p, won ? 'hyped' : 'happy');
    say(p, won ? 'WIN' : 'GG');
  }
  log(state, `${game.winner} won the pool mini game ${ranked.map(r => r.score).join(' to ')}.`);
}
