import { byId, changeNeed, log, say } from './state.js';
import { commandMove } from './movement.js';
import { getObject } from './world.js';

const TARGET_SCORE = 11;
const MAX_SCORE = 15;
const COURT_FLOOR = 6;
const BALL_R = 8;

export function updateBasketballSystem(state, dt) {
  const starters = (state.entities || []).filter(e => basketballAction(e));
  if (!state.basketballGame && starters.length) startGame(state, starters[0]);
  const game = state.basketballGame;
  if (!game) return;

  const players = game.playerIds.map(id => byId(state, id)).filter(Boolean);
  if (players.length < 2 || interrupted(players)) return finishGame(state, 'Game interrupted');
  if (players.some(p => p.floor !== COURT_FLOOR)) return finishGame(state, 'Players left the court');
  if (players.some(criticalNeed)) return finishGame(state, 'Urgent life need interrupted basketball');

  game.t += dt;
  game.phaseT += dt;
  if (game.messageT > 0) game.messageT = Math.max(0, game.messageT - dt);
  game.ball.bounceT += dt;
  const offense = byId(state, game.possessionId);
  const defense = players.find(p => p.id !== game.possessionId);
  if (!offense || !defense) return finishGame(state, 'Game stopped');

  if (game.phase === 'forming') updateForming(state, game, players);
  else if (game.phase === 'check') updateCheck(game, offense, defense);
  else if (game.phase === 'drive') updateDrive(game, offense, defense, dt);
  else if (game.phase === 'gather') updateGather(game, offense, defense);
  else if (game.phase === 'flight') updateFlight(state, game, offense, defense, dt);
  else if (game.phase === 'loose') updateLooseBall(game, players);
  else if (game.phase === 'reset') updateReset(game, players);

  updatePlayerBasketballPose(game, offense, defense);
}

export function drawBasketballSystem(ctx, state) {
  const game = state.basketballGame;
  if (!game || state.floor !== COURT_FLOOR) return;
  const ball = game.ball;
  ctx.save();
  drawScore(ctx, game);
  const shadowScale = 1 - Math.min(.65, ball.z / 110);
  ctx.fillStyle = `rgba(0,0,0,${.25 * shadowScale})`;
  ctx.beginPath();
  ctx.ellipse(ball.x, ball.y + 5, BALL_R * (1.2 - ball.z / 220), BALL_R * .65, 0, 0, Math.PI * 2);
  ctx.fill();
  drawBall(ctx, ball.x, ball.y - ball.z * .34, BALL_R);
  if (game.messageT > 0) {
    round(ctx, 330, 90, 300, 32, 12, 'rgba(7,16,24,.82)');
    ctx.fillStyle = '#f1c66a';
    ctx.font = '900 13px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(game.message, 480, 111);
    ctx.textAlign = 'left';
  }
  ctx.restore();
}

function startGame(state, starter) {
  const court = getObject('basketball_court');
  if (!court) return;
  const opponent = (state.entities || []).find(e => e.type === 'person' && e.id !== starter.id && !e.hidden && !e.labOnly && !criticalNeed(e));
  if (!opponent) {
    starter.action = 'Basketball: waiting for opponent';
    starter.pose = 'stand';
    say(starter, 'HOOPS?');
    return;
  }
  const startA = { x: court.x + court.w * .62, y: court.y + court.h * .72 };
  const startB = { x: court.x + court.w * .40, y: court.y + court.h * .68 };
  commandMove(starter, startA.x, startA.y);
  if (opponent.floor !== COURT_FLOOR) {
    opponent.floor = COURT_FLOOR;
    opponent.x = court.x + court.w + 42;
    opponent.y = court.y + court.h * .55;
  }
  commandMove(opponent, startB.x, startB.y);
  for (const p of [starter, opponent]) {
    p.action = 'Basketball: taking court';
    p.currentActionId = p.id === starter.id ? 'basketball_1v1' : 'basketball_join';
    p.actionT = Math.max(Number(p.actionT || 0), 600);
    p.actionTotal = Math.max(Number(p.actionTotal || 0), 600);
    p.pose = 'walk';
    p.stopped = false;
  }
  state.basketballGame = {
    courtId: court.id,
    playerIds: [starter.id, opponent.id],
    score: { [starter.id]: 0, [opponent.id]: 0 },
    names: { [starter.id]: starter.name, [opponent.id]: opponent.name },
    possessionId: starter.id,
    phase: 'forming',
    phaseT: 0,
    t: 0,
    shotNumber: 0,
    shot: null,
    message: `${starter.name} versus ${opponent.name}`,
    messageT: 2.2,
    ball: { x: startA.x, y: startA.y + 16, z: 0, vx: 0, vy: 0, vz: 0, bounceT: 0 }
  };
  state.floor = COURT_FLOOR;
  state.viewHoldT = 8;
  log(state, `${starter.name} challenged ${opponent.name} to one on one basketball.`);
}

function updateForming(state, game, players) {
  if (players.some(p => p.path?.length)) return;
  game.phase = 'check';
  game.phaseT = 0;
  game.message = 'Check ball';
  game.messageT = 1.2;
}

function updateCheck(game, offense, defense) {
  const court = getObject(game.courtId);
  if (!court) return;
  const top = { x: court.x + court.w * .58, y: court.y + court.h * .70 };
  const guard = { x: top.x - 50, y: top.y - 16 };
  moveDirect(offense, top, 'Basketball: check ball');
  moveDirect(defense, guard, 'Basketball: guarding');
  game.ball.x = offense.x + 12;
  game.ball.y = offense.y + 17;
  game.ball.z = dribbleHeight(game.ball.bounceT);
  if (near(offense, top, 8) && near(defense, guard, 12) && game.phaseT > 1.2) chooseDrive(game, offense, court);
}

function chooseDrive(game, offense, court) {
  game.phase = 'drive';
  game.phaseT = 0;
  const roll = (hash(`${offense.id}-${game.shotNumber}-${Math.floor(game.t * 4)}`) >>> 0) % 100;
  const type = roll < 18 ? 'dunk' : roll < 42 ? 'layup' : roll < 70 ? 'two' : 'three';
  const spots = {
    dunk: { x: court.x + court.w * .22, y: court.y + court.h * .50 },
    layup: { x: court.x + court.w * .30, y: court.y + court.h * .54 },
    two: { x: court.x + court.w * .50, y: court.y + court.h * .42 },
    three: { x: court.x + court.w * .78, y: court.y + court.h * .30 }
  };
  game.shot = { type, spot: spots[type], made: false, rim: false, backboard: false };
  game.message = type === 'three' ? 'Setting up a three' : type === 'two' ? 'Pull up jumper' : type === 'layup' ? 'Driving for layup' : 'Driving for dunk';
  game.messageT = 1.3;
}

function updateDrive(game, offense, defense) {
  const spot = game.shot?.spot;
  if (!spot) return;
  moveDirect(offense, spot, 'Basketball: dribbling');
  const guard = { x: offense.x - 34, y: offense.y + Math.sin(game.t * 4) * 18 };
  moveDirect(defense, guard, 'Basketball: defending');
  game.ball.x = offense.x + 11;
  game.ball.y = offense.y + 16;
  game.ball.z = dribbleHeight(game.ball.bounceT);
  if (near(offense, spot, 8)) {
    game.phase = 'gather';
    game.phaseT = 0;
    offense.path = [];
    defense.path = [];
  }
}

function updateGather(game, offense, defense) {
  game.ball.x = offense.x;
  game.ball.y = offense.y - 8;
  game.ball.z = Math.min(34, game.phaseT * 38);
  if (game.phaseT >= .65) launchShot(game, offense, defense);
}

function launchShot(game, offense, defense) {
  const court = getObject(game.courtId);
  if (!court) return;
  const hoop = hoopPoint(court);
  const type = game.shot.type;
  const contest = Math.max(0, 1 - Math.hypot(defense.x - offense.x, defense.y - offense.y) / 90);
  const base = type === 'dunk' ? .94 : type === 'layup' ? .72 : type === 'two' ? .56 : .39;
  const chance = base - contest * (type === 'dunk' ? .12 : .24);
  const random = ((hash(`${offense.id}-${game.shotNumber}-${Math.floor(game.t * 10)}`) >>> 0) % 1000) / 1000;
  game.shot.made = random < chance;
  game.shot.backboard = !game.shot.made && random < chance + .26;
  game.shot.rim = !game.shot.made && !game.shot.backboard;
  const flight = type === 'dunk' ? .55 : type === 'layup' ? .72 : type === 'two' ? .95 : 1.14;
  Object.assign(game.shot, { flight, elapsed: 0, from: { x: offense.x, y: offense.y, z: type === 'dunk' ? 42 : 28 }, to: hoop });
  game.ball.x = offense.x;
  game.ball.y = offense.y;
  game.ball.z = game.shot.from.z;
  game.phase = 'flight';
  game.phaseT = 0;
  game.shotNumber += 1;
  offense.action = `Basketball: ${type}`;
  offense.pose = `basketball_${type}`;
}

function updateFlight(state, game, offense, defense, dt) {
  const shot = game.shot;
  shot.elapsed += dt;
  const t = clamp(shot.elapsed / shot.flight, 0, 1);
  game.ball.x = lerp(shot.from.x, shot.to.x, t);
  game.ball.y = lerp(shot.from.y, shot.to.y, t);
  game.ball.z = lerp(shot.from.z, 34, t) + Math.sin(t * Math.PI) * (shot.type === 'three' ? 105 : shot.type === 'two' ? 82 : 48);
  if (t < 1) return;
  if (shot.made) {
    const points = shot.type === 'three' ? 3 : 2;
    game.score[offense.id] += points;
    game.message = `${offense.name} scores ${points}`;
    game.messageT = 1.8;
    changeNeed(offense, 'fun', 4);
    changeNeed(defense, 'fun', 2);
    if (gameOver(game)) return finishGame(state, `${offense.name} wins ${game.score[offense.id]} to ${game.score[defense.id]}`);
    game.possessionId = defense.id;
    game.phase = 'reset';
    game.phaseT = 0;
    game.ball.x = shot.to.x;
    game.ball.y = shot.to.y + 22;
    game.ball.z = 0;
    return;
  }
  createRebound(game, shot, offense, defense);
}

function createRebound(game, shot, offense, defense) {
  const court = getObject(game.courtId);
  const hoop = hoopPoint(court);
  const seed = (hash(`${game.shotNumber}-${offense.id}`) >>> 0) % 1000 / 1000;
  const angle = seed * Math.PI * 1.5 - Math.PI * .25;
  const distance = shot.backboard ? 90 + seed * 80 : 55 + seed * 130;
  game.ball.x = clamp(hoop.x + Math.cos(angle) * distance, 28, 930);
  game.ball.y = clamp(hoop.y + Math.sin(angle) * distance, 60, 670);
  game.ball.z = 0;
  game.phase = 'loose';
  game.phaseT = 0;
  game.message = shot.backboard ? 'Backboard rebound, loose ball' : 'Rim out, chase it';
  game.messageT = 1.7;
  offense.action = 'Basketball: chasing rebound';
  defense.action = 'Basketball: chasing rebound';
}

function updateLooseBall(game, players) {
  for (const p of players) {
    if (!p.path?.length && !near(p, game.ball, 14)) commandMove(p, game.ball.x + (p.id === game.possessionId ? 7 : -7), game.ball.y);
    p.action = 'Basketball: chasing loose ball';
    p.pose = p.path?.length ? 'walk' : 'basketball_rebound';
  }
  const winners = players.filter(p => near(p, game.ball, 18) && !p.path?.length);
  if (!winners.length) return;
  const winner = winners.sort((a, b) => Math.hypot(a.x - game.ball.x, a.y - game.ball.y) - Math.hypot(b.x - game.ball.x, b.y - game.ball.y))[0];
  game.possessionId = winner.id;
  game.phase = 'check';
  game.phaseT = 0;
  game.message = `${winner.name} gets the rebound`;
  game.messageT = 1.4;
}

function updateReset(game, players) {
  const court = getObject(game.courtId);
  if (!court) return;
  const possession = players.find(p => p.id === game.possessionId);
  const other = players.find(p => p.id !== game.possessionId);
  const top = { x: court.x + court.w * .60, y: court.y + court.h * .72 };
  moveDirect(possession, top, 'Basketball: reset possession');
  moveDirect(other, { x: top.x - 48, y: top.y - 18 }, 'Basketball: reset defense');
  game.ball.x = possession.x + 10;
  game.ball.y = possession.y + 16;
  game.ball.z = dribbleHeight(game.ball.bounceT);
  if (near(possession, top, 9) && game.phaseT > .8) {
    game.phase = 'check';
    game.phaseT = 0;
  }
}

function updatePlayerBasketballPose(game, offense, defense) {
  if (game.phase === 'flight') defense.pose = 'basketball_contest';
  if (game.phase === 'drive') {
    offense.pose = offense.path?.length ? 'walk' : 'basketball_dribble';
    defense.pose = defense.path?.length ? 'walk' : 'basketball_defense';
  }
}

function finishGame(state, reason) {
  const game = state.basketballGame;
  if (!game) return;
  for (const id of game.playerIds || []) {
    const p = byId(state, id);
    if (!p) continue;
    p.path = [];
    p.target = null;
    p.pending = null;
    p.action = 'Idle';
    p.actionT = 0;
    p.actionTotal = 0;
    p.currentActionId = null;
    p.pose = 'stand';
    p.carrying = null;
  }
  log(state, reason);
  state.basketballGame = null;
}

function basketballAction(e) {
  const id = String(e?.currentActionId || '').toLowerCase();
  return !e?.hidden && e?.type === 'person' && Number(e.actionT || 0) > 0 && (id === 'basketball_1v1' || id === 'basketball_join' || String(e.action || '').toLowerCase().includes('basketball'));
}

function interrupted(players) { return players.some(p => !basketballAction(p)); }
function criticalNeed(p) { const n = p.needs || {}; return (n.bladder ?? 100) < 14 || (n.hunger ?? 100) < 12 || (n.energy ?? 100) < 10 || (n.stamina ?? 100) < 10; }
function gameOver(game) { const values = Object.values(game.score); const hi = Math.max(...values); const lo = Math.min(...values); return (hi >= TARGET_SCORE && hi - lo >= 2) || hi >= MAX_SCORE; }
function hoopPoint(court) { return { x: court.x + 46, y: court.y + court.h / 2, z: 34 }; }
function moveDirect(actor, point, action) { if (!actor) return; if (!actor.path?.length && !near(actor, point, 7)) commandMove(actor, point.x, point.y); actor.action = action; actor.pose = actor.path?.length ? 'walk' : actor.pose; }
function near(a, b, radius) { return Math.hypot(a.x - b.x, a.y - b.y) <= radius; }
function dribbleHeight(t) { return Math.abs(Math.sin(t * 7.2)) * 22; }
function drawScore(ctx, game) { round(ctx, 310, 48, 340, 34, 12, 'rgba(7,16,24,.84)'); ctx.fillStyle = '#f8fbff'; ctx.font = '900 14px system-ui'; ctx.textAlign = 'center'; const ids = game.playerIds; ctx.fillText(`${nameFor(game, ids[0])} ${game.score[ids[0]]}   •   ${game.score[ids[1]]} ${nameFor(game, ids[1])}`, 480, 70); ctx.textAlign = 'left'; }
function nameFor(game, id) { return String(game.names?.[id] || id).toUpperCase().slice(0, 12); }
function drawBall(ctx, x, y, r) { circle(ctx, x, y, r, '#d87d2d'); ctx.strokeStyle = '#5d3219'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r); ctx.stroke(); }
function hash(text) { let h = 0; for (let i = 0; i < String(text).length; i++) h = ((h << 5) - h + text.charCodeAt(i)) | 0; return h; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function round(ctx, x, y, w, h, r, fill) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); ctx.fillStyle = fill; ctx.fill(); }
function circle(ctx, x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
