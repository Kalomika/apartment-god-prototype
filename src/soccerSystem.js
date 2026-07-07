import { changeNeed, log, say, setMood } from './state.js';

const FIELD = { floor: 4, x: 82, y: 190, w: 420, h: 300, goalTop: { x: 230, y: 190, w: 120, h: 18 }, goalBottom: { x: 230, y: 472, w: 120, h: 18 } };

export function startSoccerPractice(state, actor) {
  if (!actor) return false;
  state.floor = FIELD.floor;
  state.viewHoldT = 18;
  actor.floor = FIELD.floor;
  actor.hidden = false;
  actor.x = FIELD.x + FIELD.w * 0.5;
  actor.y = FIELD.y + FIELD.h * 0.68;
  actor.path = [];
  actor.target = null;
  actor.pose = 'soccer';
  actor.action = 'Soccer practice';
  actor.actionT = 16;
  actor.actionTotal = 16;
  state.soccerGame = createSoccerGame(state, [actor], 'practice');
  say(actor, 'KICK');
  log(state, `${actor.name} started backyard soccer practice.`);
  return true;
}

export function startMiniSoccer(state, actor) {
  if (!actor) return false;
  state.floor = FIELD.floor;
  state.viewHoldT = 18;
  const people = state.entities.filter(e => e.type === 'person' && !e.hidden);
  const players = people.length > 1 ? people.slice(0, 2) : [actor];
  players.forEach((p, i) => {
    p.floor = FIELD.floor;
    p.hidden = false;
    p.x = FIELD.x + FIELD.w * (i ? 0.62 : 0.38);
    p.y = FIELD.y + FIELD.h * (i ? 0.62 : 0.38);
    p.path = [];
    p.target = null;
    p.pose = 'soccer';
    p.action = players.length > 1 ? 'Mini soccer match' : 'Soccer practice';
    p.actionT = 20;
    p.actionTotal = 20;
    say(p, i ? 'DEFEND' : 'KICK');
  });
  state.soccerGame = createSoccerGame(state, players, players.length > 1 ? 'match' : 'practice');
  log(state, players.length > 1 ? `${players.map(p => p.name).join(' and ')} started mini soccer.` : `${actor.name} started soccer practice.`);
  return true;
}

function createSoccerGame(state, players, mode) {
  return {
    mode,
    floor: FIELD.floor,
    playerIds: players.map(p => p.id),
    names: players.map(p => p.name),
    t: 0,
    kickT: .8,
    turn: 0,
    score: Object.fromEntries(players.map(p => [p.id, 0])),
    shots: Object.fromEntries(players.map(p => [p.id, 0])),
    message: mode === 'match' ? 'Kickoff' : 'Solo practice',
    messageT: 2,
    winner: null,
    ball: { x: FIELD.x + FIELD.w * 0.5, y: FIELD.y + FIELD.h * 0.5, vx: 0, vy: 0 },
    trail: []
  };
}

export function updateSoccerGame(state, dt) {
  const game = state.soccerGame;
  if (!game) return;
  const players = game.playerIds.map(id => state.entities.find(e => e.id === id)).filter(Boolean);
  if (!players.length) { state.soccerGame = null; return; }
  game.t += dt;
  game.kickT -= dt;
  game.messageT = Math.max(0, (game.messageT || 0) - dt);
  updateSoccerBall(game, dt);
  players.forEach((p, i) => updateSoccerPlayerPosition(p, game, i, players.length));
  if (!game.winner && game.kickT <= 0) takeSoccerTurn(state, game, players);
  if (!game.winner && (game.t > (game.mode === 'match' ? 22 : 16) || totalShots(game) >= (game.mode === 'match' ? 10 : 8))) finishSoccer(state, game, players);
}

function updateSoccerBall(game, dt) {
  const b = game.ball;
  game.trail.unshift({ x: b.x, y: b.y, a: .55 });
  game.trail = game.trail.slice(0, 8).map((p, i) => ({ ...p, a: Math.max(0, .45 - i * .05) }));
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.vx *= Math.pow(.62, dt);
  b.vy *= Math.pow(.62, dt);
  if (b.x < FIELD.x + 12) { b.x = FIELD.x + 12; b.vx = Math.abs(b.vx) * .7; }
  if (b.x > FIELD.x + FIELD.w - 12) { b.x = FIELD.x + FIELD.w - 12; b.vx = -Math.abs(b.vx) * .7; }
  if (b.y < FIELD.y + 12) { b.y = FIELD.y + 12; b.vy = Math.abs(b.vy) * .7; }
  if (b.y > FIELD.y + FIELD.h - 12) { b.y = FIELD.y + FIELD.h - 12; b.vy = -Math.abs(b.vy) * .7; }
}

function updateSoccerPlayerPosition(player, game, i, count) {
  const angle = game.t * 1.6 + i * Math.PI * 1.1;
  const radius = count > 1 ? 54 : 38;
  player.x = clamp(FIELD.x + FIELD.w * 0.5 + Math.cos(angle) * radius, FIELD.x + 26, FIELD.x + FIELD.w - 26);
  player.y = clamp(FIELD.y + FIELD.h * 0.5 + Math.sin(angle) * radius, FIELD.y + 32, FIELD.y + FIELD.h - 32);
  player.pose = 'soccer';
}

function takeSoccerTurn(state, game, players) {
  const shooter = players[game.turn % players.length] || players[0];
  const b = game.ball;
  const attackingTop = game.mode === 'practice' || game.turn % 2 === 0;
  const goal = attackingTop ? FIELD.goalTop : FIELD.goalBottom;
  const targetX = goal.x + goal.w * (.25 + deterministic(game.t + game.turn) * .5);
  const targetY = attackingTop ? goal.y - 24 : goal.y + goal.h + 24;
  const dx = targetX - b.x;
  const dy = targetY - b.y;
  const mag = Math.max(1, Math.hypot(dx, dy));
  const skill = shooter.skills?.strength ?? 3;
  const stamina = shooter.needs?.stamina ?? 60;
  const accuracy = Math.max(.18, Math.min(.9, .24 + skill * .07 + stamina * .004));
  const power = 150 + skill * 16;
  const noise = (1 - accuracy) * Math.sin(game.t * 9 + game.turn * 3) * .8;
  const cos = Math.cos(noise);
  const sin = Math.sin(noise);
  const ux = dx / mag;
  const uy = dy / mag;
  b.vx = (ux * cos - uy * sin) * power;
  b.vy = (ux * sin + uy * cos) * power;
  const roll = deterministic(game.t * 2.31 + game.turn * 7.17 + skill);
  const scored = roll < accuracy * (game.mode === 'practice' ? .6 : .45);
  game.shots[shooter.id] = (game.shots[shooter.id] || 0) + 1;
  if (scored) {
    game.score[shooter.id] = (game.score[shooter.id] || 0) + 1;
    game.message = `${shooter.name} scored`;
    game.messageT = 2;
    say(shooter, 'GOAL');
    setMood(shooter, 'hyped');
    changeNeed(shooter, 'fun', 4);
  } else {
    game.message = `${shooter.name} shot wide`;
    game.messageT = 1.8;
    say(shooter, 'SHOT');
    changeNeed(shooter, 'fun', 1);
  }
  game.turn = (game.turn + 1) % Math.max(1, players.length);
  game.kickT = scored ? 1.3 : 1.0;
}

function finishSoccer(state, game, players) {
  const ranked = players.map(p => ({ player: p, score: game.score[p.id] || 0 })).sort((a, b) => b.score - a.score);
  const winner = ranked[0]?.player;
  game.winner = winner?.name || 'Practice complete';
  game.message = game.mode === 'match' ? `${game.winner} wins ${ranked.map(r => r.score).join(' to ')}` : `Practice complete, ${ranked[0]?.score || 0} goals`;
  game.messageT = 5;
  for (const p of players) {
    const won = p.id === winner?.id;
    changeNeed(p, 'fun', game.mode === 'match' ? won ? 14 : 8 : 10);
    changeNeed(p, 'stamina', -12);
    changeNeed(p, 'freshness', -6);
    changeNeed(p, 'social', players.length > 1 ? 8 : 1);
    setMood(p, won ? 'hyped' : 'happy');
    say(p, game.mode === 'match' ? won ? 'WIN' : 'GG' : 'DONE');
  }
  log(state, game.message);
}

function totalShots(game) {
  return Object.values(game.shots || {}).reduce((sum, n) => sum + n, 0);
}

function deterministic(n) {
  return Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function drawSoccer(ctx, state) {
  if (state.floor !== FIELD.floor) return;
  ctx.save();
  ctx.fillStyle = 'rgba(47,91,54,.42)';
  ctx.fillRect(FIELD.x, FIELD.y, FIELD.w, FIELD.h);
  ctx.strokeStyle = 'rgba(248,251,255,.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(FIELD.x, FIELD.y, FIELD.w, FIELD.h);
  ctx.beginPath();
  ctx.arc(FIELD.x + FIELD.w / 2, FIELD.y + FIELD.h / 2, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(FIELD.x, FIELD.y + FIELD.h / 2);
  ctx.lineTo(FIELD.x + FIELD.w, FIELD.y + FIELD.h / 2);
  ctx.stroke();
  drawGoal(ctx, FIELD.goalTop);
  drawGoal(ctx, FIELD.goalBottom);
  const game = state.soccerGame;
  const ball = game?.ball || { x: FIELD.x + FIELD.w / 2, y: FIELD.y + FIELD.h / 2 };
  for (const p of game?.trail || []) {
    ctx.fillStyle = `rgba(241,198,106,${p.a})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#f8fbff';
  ctx.strokeStyle = '#11151c';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#11151c'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ball.x - 6, ball.y); ctx.lineTo(ball.x + 6, ball.y); ctx.moveTo(ball.x, ball.y - 6); ctx.lineTo(ball.x, ball.y + 6); ctx.stroke();
  if (game) drawSoccerScore(ctx, game);
  ctx.restore();
}

function drawGoal(ctx, goal) {
  ctx.fillStyle = 'rgba(248,251,255,.18)';
  ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
  ctx.strokeStyle = '#f8fbff';
  ctx.strokeRect(goal.x, goal.y, goal.w, goal.h);
}

function drawSoccerScore(ctx, game) {
  const x = FIELD.x + 20;
  const y = FIELD.y + 18;
  ctx.fillStyle = 'rgba(8,10,15,.78)';
  ctx.fillRect(x, y, 300, 72);
  ctx.strokeStyle = 'rgba(241,198,106,.7)';
  ctx.strokeRect(x, y, 300, 72);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 13px system-ui';
  const rows = (game.names || []).map((name, i) => `${i === game.turn % Math.max(1, game.names.length) && !game.winner ? '▶ ' : ''}${name}: ${game.score?.[game.playerIds?.[i]] || 0}`).join('   ');
  ctx.fillText(rows || 'Soccer', x + 12, y + 24);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '800 12px system-ui';
  ctx.fillText(game.winner ? `Winner: ${game.winner}` : game.message || 'Playing', x + 12, y + 48);
  ctx.fillStyle = '#b6c1d2';
  ctx.fillText(`Shots ${totalShots(game)}`, x + 12, y + 64);
}
