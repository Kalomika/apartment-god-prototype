import { changeNeed, log, say, setMood } from './state.js';
import { getObject } from './world.js';
import { updateSoccerGame } from './soccerSystem.js';

export function updateGameActivities(state, dt) {
  updatePoolGame(state, dt);
  updateSoccerGame(state, dt);
}

function poolIntents(state) {
  return state.entities.filter(e => !e.hidden && String(e.action || '').toLowerCase().includes('pool'));
}

function tablePositions(table, count = 2) {
  const positions = [
    { x: table.x + table.w * .28, y: table.y + table.h + 44 },
    { x: table.x + table.w * .72, y: table.y - 36 },
    { x: table.x - 34, y: table.y + table.h * .34 },
    { x: table.x + table.w + 34, y: table.y + table.h * .66 }
  ];
  return positions.slice(0, Math.max(1, Math.min(count, positions.length)));
}

function assignedPoolSpot(table, players, player) {
  const positions = tablePositions(table, players.length);
  const index = Math.max(0, players.findIndex(p => p.id === player.id));
  return positions[index % positions.length];
}

function isAtPoolPosition(player, point) {
  return player.floor === 2 && Math.hypot(player.x - point.x, player.y - point.y) <= 38 && !player.path?.length;
}

function guidePoolPlayers(state, table, players) {
  let ready = true;
  for (const player of players) {
    const spot = assignedPoolSpot(table, players, player);
    player.carrying = player.carrying === 'cue_stick' ? player.carrying : 'cue_stick';
    player.pose = player.path?.length ? 'walk' : 'pool';
    if (player.floor !== 2) { ready = false; continue; }
    if (!isAtPoolPosition(player, spot)) {
      ready = false;
      const final = player.path?.[player.path.length - 1];
      if (!final || Math.hypot(final.x - spot.x, final.y - spot.y) > 8) {
        player.path = [spot];
        player.target = null;
        player.pending = null;
        player.pose = 'walk';
      }
    }
  }
  return ready;
}

function updatePoolGame(state, dt) {
  const table = getObject('pool_table');
  const intendedPlayers = poolIntents(state);
  if (!table || !intendedPlayers.length) {
    if (state.poolGame && !state.poolGame.winner) state.poolGame = null;
    return;
  }

  const ready = guidePoolPlayers(state, table, intendedPlayers);
  if (!ready) {
    if (state.poolGame) state.poolGame.message = 'Waiting for players at table';
    return;
  }

  const players = intendedPlayers.filter(p => isAtPoolPosition(p, assignedPoolSpot(table, intendedPlayers, p)));
  if (!players.length) return;
  if (!state.poolGame || state.poolGame.tableId !== table.id || !samePlayers(state.poolGame, players)) startPoolGame(state, table, players);

  const game = state.poolGame;
  if (!game) return;
  game.t += dt;
  game.messageT = Math.max(0, (game.messageT || 0) - dt);
  if (game.cueLine) game.cueLine.t = Math.max(0, (game.cueLine.t || 0) - dt);
  if (game.cueThrust) game.cueThrust.t = Math.max(0, (game.cueThrust.t || 0) - dt);

  updateBalls(game, table, dt);
  if (!game.winner) {
    game.shotT -= dt;
    if (game.shotT <= 0 && ballsSettled(game)) shootPool(state, table, players);
    checkPoolWinner(state, players);
  } else {
    game.winnerT = (game.winnerT ?? 3.5) - dt;
    if (game.winnerT <= 0) finishPoolGame(state, players, game);
  }
}

function samePlayers(game, players) {
  const ids = players.map(p => p.id).join('|');
  return game.playerIds?.join('|') === ids;
}

function startPoolGame(state, table, players) {
  const names = players.map(p => p.name);
  for (const p of players) {
    p.carrying = 'cue_stick';
    p.pose = 'pool';
  }
  state.poolGame = {
    tableId: table.id,
    playerIds: players.map(p => p.id),
    names,
    t: 0,
    shotT: 1.2,
    turn: 0,
    score: Object.fromEntries(players.map(p => [p.id, 0])),
    shots: Object.fromEntries(players.map(p => [p.id, 0])),
    streak: 0,
    message: 'Players at table',
    messageT: 2,
    winner: null,
    winnerT: 0,
    targetId: null,
    cueLine: null,
    cueThrust: null,
    balls: rackBalls(table)
  };
  log(state, `${names.join(' and ')} grabbed cue sticks at the pool table.`);
}

function finishPoolGame(state, players, game) {
  for (const p of players) {
    if (String(p.action || '').toLowerCase().includes('pool')) {
      p.action = 'Idle';
      p.actionT = 0;
      p.actionTotal = 0;
      p.pose = 'stand';
      if (p.carrying === 'cue_stick') p.carrying = null;
    }
  }
  state.poolGame = null;
  log(state, `The pool match ended. ${game.winner} was the winner.`);
}

function rackBalls(table) {
  const cy = table.y + table.h * .5;
  const startX = table.x + table.w * .62;
  const gap = 15;
  const balls = [{ id: 'cue', value: 0, x: table.x + table.w * .30, y: cy, vx: 0, vy: 0, fill: '#f8fbff' }];
  const colors = ['#f1c66a', '#ff75df', '#74e6ff', '#90d68c', '#f08b57', '#a98bff', '#f8fbff', '#e06767', '#74c0a8', '#d2b064'];
  let index = 0;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col <= row; col++) {
      balls.push({ id: `ball_${index + 1}`, value: index < 4 ? 1 : 2, x: startX + row * gap, y: cy + (col - row / 2) * gap, vx: 0, vy: 0, fill: colors[index % colors.length] });
      index += 1;
    }
  }
  return balls;
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

  const shotSpot = assignedPoolSpot(table, players, shooter);
  if (!isAtPoolPosition(shooter, shotSpot)) {
    shooter.path = [shotSpot];
    shooter.pose = 'walk';
    game.shotT = .5;
    game.message = `${shooter.name} is taking position`;
    return;
  }

  shooter.carrying = 'cue_stick';
  shooter.pose = 'pool';
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
    game.message = `${shooter.name} sank a ball`;
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
  game.cueThrust = { x1: shooter.x, y1: shooter.y, x2: cue.x, y2: cue.y, t: .45 };
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
  const maxShots = Math.max(10, players.length * 8);
  const shotCount = Object.values(game.shots || {}).reduce((sum, n) => sum + n, 0);
  if (live > 0 && shotCount < maxShots && game.t < 45) return;
  const ranked = players.map(p => ({ player: p, score: game.score[p.id] || 0 })).sort((a, b) => b.score - a.score);
  const winner = ranked[0]?.player || players[0];
  game.winner = winner?.name || 'Player';
  game.winnerT = 3.5;
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
