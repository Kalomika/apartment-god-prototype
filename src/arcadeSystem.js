import { getObject } from './world.js';

const ARCADE_ACTIONS = new Set(['arcade', 'arcade_together', 'arcade_fighter', 'arcade_pong', 'arcade_racer']);
const MODES = ['fighter', 'pong', 'racer'];

export function updateArcadeSystem(state, dt) {
  const actors = (state.entities || []).filter(e => isArcadeActor(e));
  if (!actors.length) {
    state.arcadeGame = null;
    return;
  }
  const machine = actors.map(a => nearestArcade(a)).find(Boolean);
  if (!machine) return;
  const requested = requestedMode(actors[0]);
  if (!state.arcadeGame || state.arcadeGame.machineId !== machine.id || state.arcadeGame.mode !== requested) {
    state.arcadeGame = createGame(machine, requested, actors.map(a => a.id));
  }
  const game = state.arcadeGame;
  game.actorIds = actors.map(a => a.id);
  game.time += dt;
  for (const actor of actors) {
    actor.pose = 'arcade_play';
    actor.action = `Arcade: ${modeLabel(game.mode)}`;
    actor.lastHeading = 0;
  }
  if (game.mode === 'fighter') updateFighter(game, dt);
  else if (game.mode === 'pong') updatePong(game, dt);
  else updateRacer(game, dt);
}

export function drawArcadeSystem(ctx, state) {
  const game = state.arcadeGame;
  if (!game || game.floor !== state.floor) return;
  const machine = getObject(game.machineId);
  if (!machine) return;
  const screen = { x: clamp(machine.x + machine.w + 24, 18, 710), y: clamp(machine.y - 18, 62, 470), w: 220, h: 142 };
  ctx.save();
  round(ctx, screen.x - 8, screen.y - 8, screen.w + 16, screen.h + 30, 14, 'rgba(7,16,24,.86)');
  round(ctx, screen.x, screen.y, screen.w, screen.h, 9, '#101820');
  ctx.save();
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(screen.x + 5, screen.y + 5, screen.w - 10, screen.h - 10, 6);
  else ctx.rect(screen.x + 5, screen.y + 5, screen.w - 10, screen.h - 10);
  ctx.clip();
  if (game.mode === 'fighter') drawFighter(ctx, game, screen);
  else if (game.mode === 'pong') drawPong(ctx, game, screen);
  else drawRacer(ctx, game, screen);
  ctx.restore();
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 12px system-ui';
  ctx.fillText(modeLabel(game.mode), screen.x + 8, screen.y + screen.h + 20);
  drawArcadeHands(ctx, state, game, machine);
  ctx.restore();
}

function isArcadeActor(entity) {
  if (!entity || entity.hidden || entity.type !== 'person' || Number(entity.actionT || 0) <= 0) return false;
  const id = String(entity.currentActionId || '').toLowerCase();
  return ARCADE_ACTIONS.has(id) || String(entity.action || '').toLowerCase().includes('arcade');
}

function nearestArcade(actor) {
  const candidates = ['arcade_machine', 'lab_game_console'].map(getObject).filter(o => o && o.floor === actor.floor);
  return candidates.sort((a, b) => distanceTo(actor, a) - distanceTo(actor, b))[0] || null;
}

function distanceTo(actor, obj) { return Math.hypot(actor.x - (obj.x + obj.w / 2), actor.y - (obj.y + obj.h / 2)); }

function requestedMode(actor) {
  const id = String(actor.currentActionId || '').toLowerCase();
  if (id.includes('fighter')) return 'fighter';
  if (id.includes('pong')) return 'pong';
  if (id.includes('racer')) return 'racer';
  const seed = Math.abs(hash(actor.id + Math.floor((actor.actionTotal || 1) * 10)));
  return MODES[seed % MODES.length];
}

function createGame(machine, mode, actorIds) {
  return {
    machineId: machine.id,
    floor: machine.floor,
    actorIds,
    mode,
    time: 0,
    inputX: 0,
    inputY: 0,
    buttons: [false, false, false],
    fighter: { hpA: 100, hpB: 100, xA: 48, xB: 172, hitT: 0, round: 1 },
    pong: { leftY: 66, rightY: 66, ballX: 110, ballY: 66, vx: 92, vy: 58, scoreA: 0, scoreB: 0 },
    racer: { progressA: 0, progressB: 0, speedA: .18, speedB: .17, lapA: 0, lapB: 0, steer: 0 }
  };
}

function updateFighter(game, dt) {
  const f = game.fighter;
  f.hitT -= dt;
  const phase = Math.sin(game.time * 2.1);
  game.inputX = phase;
  game.inputY = Math.cos(game.time * 1.4);
  game.buttons[0] = Math.sin(game.time * 4.6) > .72;
  game.buttons[1] = Math.cos(game.time * 3.7) > .76;
  f.xA = clamp(f.xA + phase * dt * 24, 38, 92);
  f.xB = clamp(f.xB - phase * dt * 21, 128, 182);
  if (f.hitT <= 0 && (game.buttons[0] || game.buttons[1])) {
    const aHits = Math.sin(game.time * 1.17) > 0;
    if (aHits) f.hpB = Math.max(0, f.hpB - 7);
    else f.hpA = Math.max(0, f.hpA - 7);
    f.hitT = .42;
  }
  if (f.hpA <= 0 || f.hpB <= 0) {
    f.round += 1;
    f.hpA = 100;
    f.hpB = 100;
  }
}

function updatePong(game, dt) {
  const p = game.pong;
  p.leftY = clamp(p.leftY + Math.sin(game.time * 2.8) * dt * 55, 20, 112);
  p.rightY = clamp(p.ballY + Math.sin(game.time * 1.3) * 10, 20, 112);
  game.inputY = Math.sin(game.time * 2.8);
  game.inputX = 0;
  game.buttons[0] = Math.abs(game.inputY) > .7;
  p.ballX += p.vx * dt;
  p.ballY += p.vy * dt;
  if (p.ballY < 10 || p.ballY > 124) { p.vy *= -1; p.ballY = clamp(p.ballY, 10, 124); }
  if (p.ballX < 18 && Math.abs(p.ballY - p.leftY) < 26) { p.vx = Math.abs(p.vx) * 1.035; p.ballX = 18; }
  if (p.ballX > 202 && Math.abs(p.ballY - p.rightY) < 26) { p.vx = -Math.abs(p.vx) * 1.035; p.ballX = 202; }
  if (p.ballX < -8 || p.ballX > 228) {
    if (p.ballX < 0) p.scoreB += 1; else p.scoreA += 1;
    p.ballX = 110; p.ballY = 66; p.vx = Math.random() < .5 ? -92 : 92; p.vy = 58 * (Math.random() < .5 ? -1 : 1);
    if (p.scoreA >= 5 || p.scoreB >= 5) { p.scoreA = 0; p.scoreB = 0; }
  }
}

function updateRacer(game, dt) {
  const r = game.racer;
  r.steer = Math.sin(game.time * 1.8);
  game.inputX = r.steer;
  game.inputY = -1;
  game.buttons[0] = true;
  r.speedA = clamp(.17 + Math.sin(game.time * .7) * .025, .12, .23);
  r.speedB = clamp(.165 + Math.cos(game.time * .63) * .022, .12, .225);
  r.progressA += r.speedA * dt;
  r.progressB += r.speedB * dt;
  if (r.progressA >= 1) { r.progressA -= 1; r.lapA += 1; }
  if (r.progressB >= 1) { r.progressB -= 1; r.lapB += 1; }
  if (r.lapA >= 3 || r.lapB >= 3) { r.lapA = 0; r.lapB = 0; r.progressA = 0; r.progressB = .08; }
}

function drawFighter(ctx, game, s) {
  const f = game.fighter;
  ctx.fillStyle = '#33203c'; ctx.fillRect(s.x, s.y, s.w, s.h);
  ctx.fillStyle = '#632f51'; ctx.fillRect(s.x, s.y + 88, s.w, 54);
  meter(ctx, s.x + 10, s.y + 10, 80, f.hpA / 100, '#74e6ff');
  meter(ctx, s.x + 130, s.y + 10, 80, f.hpB / 100, '#ff75df');
  fighter(ctx, s.x + f.xA, s.y + 95, '#74e6ff', 1, game.buttons[0]);
  fighter(ctx, s.x + f.xB, s.y + 95, '#ff75df', -1, game.buttons[1]);
  ctx.fillStyle = '#f8fbff'; ctx.font = '900 10px system-ui'; ctx.fillText(`ROUND ${f.round}`, s.x + 85, s.y + 26);
}

function fighter(ctx, x, y, color, dir, attack) {
  circle(ctx, x, y - 30, 9, '#3a241f');
  round(ctx, x - 10, y - 21, 20, 28, 5, color);
  line(ctx, x - 6, y + 5, x - 12, y + 25, '#101820', 4);
  line(ctx, x + 6, y + 5, x + 12, y + 25, '#101820', 4);
  line(ctx, x + dir * 8, y - 13, x + dir * (attack ? 31 : 18), y - (attack ? 18 : 5), '#3a241f', 4);
}

function drawPong(ctx, game, s) {
  const p = game.pong;
  ctx.fillStyle = '#071018'; ctx.fillRect(s.x, s.y, s.w, s.h);
  ctx.setLineDash([5,5]); line(ctx, s.x + 110, s.y + 4, s.x + 110, s.y + 138, 'rgba(255,255,255,.25)', 1); ctx.setLineDash([]);
  ctx.fillStyle = '#74e6ff'; ctx.fillRect(s.x + 8, s.y + p.leftY - 20, 7, 40);
  ctx.fillStyle = '#ff75df'; ctx.fillRect(s.x + 205, s.y + p.rightY - 20, 7, 40);
  circle(ctx, s.x + p.ballX, s.y + p.ballY, 5, '#f1c66a');
  ctx.fillStyle = '#f8fbff'; ctx.font = '900 14px system-ui'; ctx.fillText(`${p.scoreA}   ${p.scoreB}`, s.x + 91, s.y + 18);
}

function drawRacer(ctx, game, s) {
  const r = game.racer;
  ctx.fillStyle = '#1c3125'; ctx.fillRect(s.x, s.y, s.w, s.h);
  ctx.strokeStyle = '#777d80'; ctx.lineWidth = 24; ctx.beginPath(); ctx.ellipse(s.x + 110, s.y + 70, 78, 48, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 2; ctx.setLineDash([8,8]); ctx.beginPath(); ctx.ellipse(s.x + 110, s.y + 70, 78, 48, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  raceCar(ctx, trackPoint(s, r.progressA, 78, 48), '#74e6ff');
  raceCar(ctx, trackPoint(s, r.progressB, 62, 35), '#ff75df');
  ctx.fillStyle = '#f8fbff'; ctx.font = '900 10px system-ui'; ctx.fillText(`LAPS ${r.lapA}/3  ${r.lapB}/3`, s.x + 62, s.y + 16);
}

function trackPoint(s, progress, rx, ry) {
  const a = progress * Math.PI * 2 - Math.PI / 2;
  return { x: s.x + 110 + Math.cos(a) * rx, y: s.y + 70 + Math.sin(a) * ry, a: a + Math.PI / 2 };
}

function raceCar(ctx, p, color) {
  ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); round(ctx, -6, -11, 12, 22, 4, color); ctx.restore();
}

function drawArcadeHands(ctx, state, game, machine) {
  const actors = game.actorIds.map(id => state.entities.find(e => e.id === id)).filter(Boolean);
  actors.forEach((actor, index) => {
    const control = { x: machine.x + machine.w / 2 + (index ? 9 : -9), y: machine.y + machine.h - 8 };
    const shoulderY = actor.y - 4;
    const sway = game.inputX * 4;
    line(ctx, actor.x - 9, shoulderY, control.x - 6 + sway, control.y, '#3a241f', 4);
    line(ctx, actor.x + 9, shoulderY, control.x + 8, control.y + (game.buttons[0] ? -3 : 1), '#3a241f', 4);
    circle(ctx, control.x - 6 + sway, control.y, 4, '#5a372f');
    circle(ctx, control.x + 8, control.y + (game.buttons[0] ? -3 : 1), 4, '#5a372f');
  });
  line(ctx, machine.x + machine.w / 2 - 8, machine.y + machine.h - 12, machine.x + machine.w / 2 - 8 + game.inputX * 5, machine.y + machine.h - 22, '#101820', 3);
  circle(ctx, machine.x + machine.w / 2 + 11, machine.y + machine.h - 13, 4, game.buttons[0] ? '#f1c66a' : '#d95c5c');
}

function modeLabel(mode) { return mode === 'fighter' ? 'NEON FIGHTER' : mode === 'pong' ? 'ORBIT PONG' : 'NIGHT RACER'; }
function meter(ctx, x, y, w, pct, color) { ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x, y, w, 7); ctx.fillStyle = color; ctx.fillRect(x, y, w * clamp(pct, 0, 1), 7); }
function hash(text) { let h = 0; for (let i = 0; i < String(text).length; i++) h = ((h << 5) - h + text.charCodeAt(i)) | 0; return h; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function round(ctx, x, y, w, h, r, fill) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); ctx.fillStyle = fill; ctx.fill(); }
function circle(ctx, x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
function line(ctx, x1, y1, x2, y2, color, width) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
