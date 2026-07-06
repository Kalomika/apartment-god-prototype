import { log, say } from './state.js';
import { getObject } from './world.js';

export function updateGameActivities(state, dt) {
  updatePoolGame(state, dt);
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
  if (!state.poolGame || state.poolGame.tableId !== table.id) startPoolGame(state, table, players);
  const game = state.poolGame;
  if (!game || game.winner) return;
  game.t += dt;
  game.shotT -= dt;
  for (const b of game.balls) {
    if (b.pocketed) continue;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.vx *= .95;
    b.vy *= .95;
    if (b.x < table.x + 24 || b.x > table.x + table.w - 24) b.vx *= -1;
    if (b.y < table.y + 24 || b.y > table.y + table.h - 24) b.vy *= -1;
  }
  if (game.shotT <= 0) shootPool(state, table, players);
  const live = game.balls.filter(b => !b.pocketed && b.id !== 'cue').length;
  if (live <= 0 || game.t > 18) {
    const winnerIndex = game.score[0] >= game.score[1] ? 0 : 1;
    game.winner = players[winnerIndex]?.name || players[0]?.name || 'Player';
    log(state, `${game.winner} won the pool game ${game.score[0]} to ${game.score[1]}.`);
  }
}

function startPoolGame(state, table, players) {
  state.poolGame = {
    tableId: table.id,
    players: players.map(p => p.id),
    t: 0,
    shotT: .6,
    turn: 0,
    score: [0, 0],
    winner: null,
    balls: [
      { id: 'cue', x: table.x + table.w * .38, y: table.y + table.h * .55, vx: 0, vy: 0, fill: '#f8fbff' },
      { id: 'one', x: table.x + table.w * .58, y: table.y + table.h * .45, vx: 0, vy: 0, fill: '#f1c66a' },
      { id: 'two', x: table.x + table.w * .66, y: table.y + table.h * .56, vx: 0, vy: 0, fill: '#ff75df' },
      { id: 'three', x: table.x + table.w * .72, y: table.y + table.h * .42, vx: 0, vy: 0, fill: '#74e6ff' }
    ]
  };
  log(state, `${players.map(p => p.name).join(' and ')} started a pool game.`);
}

function shootPool(state, table, players) {
  const game = state.poolGame;
  const shooter = players[game.turn % players.length] || players[0];
  const cue = game.balls.find(b => b.id === 'cue');
  const targets = game.balls.filter(b => !b.pocketed && b.id !== 'cue');
  if (!cue || !targets.length) return;
  const target = targets[Math.floor((game.t * 10 + game.turn) % targets.length)];
  const dx = target.x - cue.x;
  const dy = target.y - cue.y;
  const mag = Math.max(1, Math.hypot(dx, dy));
  cue.vx = dx / mag * 135;
  cue.vy = dy / mag * 135;
  target.vx = dx / mag * 95;
  target.vy = dy / mag * 95;
  if ((game.t + game.turn) % 2 > .7) {
    target.pocketed = true;
    game.score[game.turn % 2] += 1;
    say(shooter, 'SINK');
  } else {
    say(shooter, 'SHOT');
  }
  game.turn = (game.turn + 1) % Math.max(1, players.length);
  game.shotT = 1.4;
}
