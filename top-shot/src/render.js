import { ARENA_H, ARENA_W, TAU } from './config.js';
import { stageFor } from './state.js';

export function draw(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#071018'; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawArena(ctx, state);
  drawPickups(ctx, state);
  drawProjectiles(ctx, state);
  drawFighters(ctx, state);
  drawEffects(ctx, state);
  drawSideHud(ctx, state);
}

function drawArena(ctx, state) {
  ctx.fillStyle = '#151f2d'; ctx.fillRect(0, 0, ARENA_W, ARENA_H);
  ctx.fillStyle = '#1e2b3c'; ctx.fillRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  ctx.strokeStyle = '#41516a'; ctx.lineWidth = 3; ctx.strokeRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  for (const wall of state.arena.walls) box(ctx, wall, wall.cover ? '#334156' : '#263244', '#56657b');
  for (const b of state.arena.breakables) if (!b.broken) box(ctx, b, '#475c70aa', '#9fc7e2');
  for (const d of state.arena.debris) { ctx.fillStyle = '#b8c2cc'; ctx.fillRect(d.x - 3, d.y - 3, 6, 6); }
  ctx.fillStyle = '#89a0bd22'; ctx.font = '900 26px system-ui'; ctx.fillText('LOBBY ONE', 394, 86);
}
function box(ctx, r, fill, stroke) { ctx.fillStyle = fill; ctx.fillRect(r.x, r.y, r.w, r.h); ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.strokeRect(r.x, r.y, r.w, r.h); }
function drawPickups(ctx, state) {
  for (const p of state.pickups.filter(p => !p.used)) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fill(); ctx.strokeStyle = '#10151f'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = '#061018'; ctx.font = '900 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(p.type.toUpperCase()[0], 0, 4); ctx.restore();
  }
}
function drawProjectiles(ctx, state) {
  for (const p of state.projectiles) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1));
    if (p.type === 'grenade') { ctx.fillStyle = '#55616e'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill(); ctx.strokeStyle = '#f0d36a'; ctx.stroke(); }
    else { ctx.fillStyle = p.type === 'arrow' ? '#d8e4ef' : p.type === 'shuriken' ? '#bac3d2' : '#b4956b'; ctx.fillRect(-8, -2, 16, 4); }
    ctx.restore();
  }
}
function drawFighters(ctx, state) { for (const f of state.fighters) drawFighter(ctx, f); }
function drawFighter(ctx, f) {
  ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.facing);
  const stage = stageFor(f);
  const bodyColor = conditionColor(f.color, stage, f.incapacitated || f.defeated);
  const accentColor = conditionColor(f.accent, stage, f.incapacitated || f.defeated);
  const dive = f.diveT > 0 || ['flat_dive', 'dive_roll', 'somersault_dive', 'recover_dive'].includes(f.pose);
  const walk = Math.sin(f.anim) * (dive ? 0.15 : 0.45);
  const down = f.incapacitated || f.pose === 'down' || f.pose === 'slept_out' || f.pose === 'hard_finished';
  const defeated = f.defeated || f.pose === 'defeated_kneel';
  ctx.globalAlpha = f.extracted ? 0.15 : 1;
  if (down || dive) ctx.rotate(Math.PI / 2);
  if (defeated && !down) ctx.rotate(0.35);
  ctx.fillStyle = '#0008'; ctx.beginPath(); ctx.ellipse(0, 15, 23, 10, 0, 0, TAU); ctx.fill();
  limb(ctx, -8, 4, -22, 8 + walk * 4, -33, 10 + walk * 8, bodyColor, f.limbs.leftArm.t > 0);
  limb(ctx, -8, 12, -19, 28 - walk * 7, -23, 48 - walk * 8, bodyColor, f.limbs.leftLeg.t > 0);
  limb(ctx, -8, -4, -22, -8 - walk * 4, -33, -10 - walk * 8, bodyColor, f.limbs.rightArm.t > 0);
  limb(ctx, -8, -12, -19, -28 + walk * 7, -23, -48 + walk * 8, bodyColor, f.limbs.rightLeg.t > 0);
  if (f.currentMove?.ttl > 0) attackGhost(ctx, f.currentMove);
  ctx.fillStyle = accentColor; ctx.beginPath(); ctx.ellipse(0, defeated ? 8 : 0, dive ? 15 : defeated ? 15 : 18, dive ? 31 : defeated ? 22 : 26, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = bodyColor; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = bodyColor; ctx.beginPath(); ctx.arc(23, defeated ? 8 : 0, 12, 0, TAU); ctx.fill(); ctx.strokeStyle = '#0b1018'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = f.incapacitated ? '#aab1ba' : '#eaf1ff'; ctx.beginPath(); ctx.arc(29, defeated ? 4 : -4, 2, 0, TAU); ctx.arc(29, defeated ? 12 : 4, 2, 0, TAU); ctx.fill();
  if (f.prone) { ctx.strokeStyle = '#c9d2df'; ctx.lineWidth = 2; ctx.strokeRect(-22, -18, 58, 36); }
  if (f.crouch) { ctx.strokeStyle = '#f1d36d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.stroke(); }
  if (stage.id === 'purple') { ctx.strokeStyle = '#9b75ff'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
  ctx.rotate(-f.facing); ctx.fillStyle = stage.color; ctx.font = '800 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText(stage.label, 0, -42); meter(ctx, -30, -35, 60, 5, f.hp, stage.color);
  if (f.helpT > 0) helpBubble(ctx, f.helpIcon || '?');
  ctx.restore();
}
function limb(ctx, sx, sy, ex, ey, hx, hy, color, guard) { ctx.strokeStyle = guard ? '#f2dc74' : color; ctx.lineWidth = guard ? 8 : 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke(); }
function attackGhost(ctx, move) { ctx.strokeStyle = move.kind === 'sword' ? '#d7e2ef' : '#f3d06f'; ctx.lineWidth = move.kind === 'sword' ? 5 : 7; ctx.globalAlpha = 0.65; ctx.beginPath(); ctx.arc(22, 0, move.reach, -0.45, 0.45); ctx.stroke(); ctx.globalAlpha = 1; }
function helpBubble(ctx, label) { ctx.fillStyle = '#f2f5fb'; ctx.strokeStyle = '#101722'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-16, -74, 34, 28, 9); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#101722'; ctx.font = '900 14px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label === 'grenade' ? 'G' : '?', 1, -55); }
function meter(ctx, x, y, w, h, value, color) { ctx.fillStyle = '#091018'; ctx.fillRect(x, y, w, h); ctx.fillStyle = color; ctx.fillRect(x, y, w * Math.max(0, Math.min(100, value)) / 100, h); }
function conditionColor(hex, stage, final = false) { const target = final ? '#8f969e' : '#9aa1ab'; const t = final ? 0.88 : 1 - (stage.saturation ?? 1); return mixHex(hex, target, Math.max(0, Math.min(0.86, t))); }
function mixHex(a, b, t) { const ca = parseHex(a); const cb = parseHex(b); return `rgb(${Math.round(ca.r + (cb.r - ca.r) * t)}, ${Math.round(ca.g + (cb.g - ca.g) * t)}, ${Math.round(ca.b + (cb.b - ca.b) * t)})`; }
function parseHex(hex) { const clean = hex.replace('#', '').slice(0, 6); const value = Number.parseInt(clean, 16); return { r: value >> 16 & 255, g: value >> 8 & 255, b: value & 255 }; }
function drawEffects(ctx, state) {
  for (const e of state.effects) {
    ctx.save(); ctx.globalAlpha = Math.max(0, e.ttl * 3);
    if (e.type === 'tracer') { ctx.strokeStyle = '#eff7ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x2, e.y2); ctx.stroke(); }
    else if (e.type === 'smoke') { ctx.fillStyle = '#cfd8e655'; ctx.beginPath(); ctx.arc(e.x, e.y, 55 * (1 - e.ttl / 0.9), 0, TAU); ctx.fill(); }
    else if (e.type === 'extraction') { ctx.strokeStyle = '#d7dff0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(e.x, 0); ctx.lineTo(e.x, e.y); ctx.stroke(); }
    else if (e.type === 'explosion') { ctx.fillStyle = '#f3b24d55'; ctx.beginPath(); ctx.arc(e.x, e.y, (e.radius || 80) * (1 - e.ttl / 0.7), 0, TAU); ctx.fill(); }
    else if (e.type === 'command') { ctx.strokeStyle = '#f0d36a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(e.x, e.y, 18, 0, TAU); ctx.stroke(); if (e.label) { ctx.fillStyle = '#f0d36a'; ctx.font = '900 14px system-ui'; ctx.textAlign = 'center'; ctx.fillText(e.label === 'grenade' ? 'G' : e.label, e.x, e.y - 25); } }
    else { ctx.fillStyle = e.type === 'block' ? '#f4db73' : e.type === 'dodge' || e.type === 'dive' ? '#7bd0ff' : '#f15d56'; ctx.beginPath(); ctx.arc(e.x, e.y, 16, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
}
function drawSideHud(ctx, state) {
  ctx.fillStyle = '#0c121bcc'; ctx.fillRect(980, 0, 300, 720);
  ctx.fillStyle = '#edf4ff'; ctx.font = '900 26px system-ui'; ctx.fillText('TOP SHOT', 1000, 38);
  ctx.font = '700 13px system-ui'; ctx.fillStyle = '#aebbd0'; ctx.fillText('No direct control. Coach commands only.', 1000, 60);
  state.fighters.forEach((f, i) => card(ctx, f, 1000, 92 + i * 170));
  ctx.fillStyle = '#d6e2f2'; ctx.font = '800 13px system-ui'; ctx.fillText(`State: ${state.matchState}`, 1000, 455); ctx.fillText(`Trust: ${Math.round(state.trust)}`, 1000, 476); ctx.fillText(`Clock: ${state.clock.toFixed(1)}s`, 1000, 497);
  let y = 525; ctx.fillStyle = '#9fb0c6'; ctx.font = '700 12px system-ui'; for (const line of state.log.slice(0, 8)) { ctx.fillText(line, 1000, y); y += 22; }
}
function card(ctx, f, x, y) { const stage = stageFor(f); ctx.fillStyle = '#121b28'; ctx.fillRect(x, y, 250, 148); ctx.strokeStyle = conditionColor(f.color, stage, f.incapacitated || f.defeated); ctx.strokeRect(x, y, 250, 148); ctx.fillStyle = '#eff5ff'; ctx.font = '900 16px system-ui'; ctx.fillText(f.name, x + 12, y + 25); ctx.fillStyle = stage.color; ctx.font = '800 12px system-ui'; ctx.fillText(stage.label, x + 185, y + 25); labelMeter(ctx, 'VIT', f.hp, x + 12, y + 45, stage.color); labelMeter(ctx, 'STA', f.stamina, x + 12, y + 70, '#72d6ff'); labelMeter(ctx, 'DODGE', f.dodge, x + 12, y + 95, '#b894ff'); labelMeter(ctx, 'BLOCK', f.block, x + 12, y + 120, '#f0d36a'); }
function labelMeter(ctx, label, value, x, y, color) { ctx.fillStyle = '#aebbd0'; ctx.font = '800 10px system-ui'; ctx.fillText(label, x, y + 8); meter(ctx, x + 48, y, 170, 8, value, color); }
