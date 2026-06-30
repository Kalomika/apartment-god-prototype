import { ARENA_H, ARENA_W, TAU } from './config.js';
import { stageFor } from './state.js';

export function draw(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#071018'; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  arena(ctx, state); pickups(ctx, state); projectiles(ctx, state); fighters(ctx, state); effects(ctx, state); sideHud(ctx, state); result(ctx, state);
}

function arena(ctx, state) {
  ctx.fillStyle = '#111925'; ctx.fillRect(0, 0, ARENA_W, ARENA_H);
  ctx.fillStyle = '#1b2839'; ctx.fillRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  ctx.strokeStyle = '#52647d'; ctx.lineWidth = 3; ctx.strokeRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  ctx.strokeStyle = '#2b3a50'; ctx.lineWidth = 1;
  for (let x = 92; x < ARENA_W - 70; x += 80) line(ctx, x, 52, x, ARENA_H - 52);
  for (let y = 92; y < ARENA_H - 70; y += 80) line(ctx, 52, y, ARENA_W - 52, y);
  for (const s of state.arena.shadows || []) { ctx.fillStyle = '#030710a8'; ctx.fillRect(s.x, s.y, s.w, s.h); ctx.strokeStyle = '#101a27'; ctx.strokeRect(s.x, s.y, s.w, s.h); }
  for (const w of state.arena.walls) box(ctx, w, w.cover ? '#344761' : '#28364a', '#70809a');
  for (const b of state.arena.breakables) if (!b.broken) box(ctx, b, '#4d657aaa', '#a8d0eb');
  ctx.fillStyle = '#bcd0ec24'; ctx.font = '900 26px system-ui'; ctx.fillText('LOBBY ONE', 394, 86);
}
function box(ctx, r, fill, stroke) { ctx.fillStyle = fill; ctx.fillRect(r.x, r.y, r.w, r.h); ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.strokeRect(r.x, r.y, r.w, r.h); }
function line(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }

function pickups(ctx, state) { for (const p of state.pickups.filter(p => !p.used)) { ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill(); ctx.strokeStyle = '#071018'; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = '#061018'; ctx.font = '900 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(p.type[0].toUpperCase(), 0, 4); ctx.restore(); } }
function projectiles(ctx, state) { for (const p of state.projectiles) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1)); if (p.type === 'grenade') { ctx.fillStyle = '#586574'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill(); ctx.strokeStyle = '#f0d36a'; ctx.lineWidth = 2; ctx.stroke(); } else if (p.type === 'shuriken') { ctx.strokeStyle = '#dbe5f2'; ctx.lineWidth = 3; line(ctx, -8, 0, 8, 0); line(ctx, 0, -8, 0, 8); } else { ctx.fillStyle = p.type === 'arrow' ? '#dfe9f5' : '#c1a06e'; ctx.fillRect(-10, -2, 20, 4); ctx.fillRect(4, -5, 8, 10); } ctx.restore(); } }
function fighters(ctx, state) { for (const f of state.fighters) fighter(ctx, f); }

function fighter(ctx, f) {
  ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.facing);
  const stage = stageFor(f), final = f.incapacitated || f.defeated;
  const body = condition(f.color, stage, final), suit = condition(f.accent, stage, final);
  const down = f.incapacitated || f.pose === 'down'; const roll = ['roll', 'combat_roll', 'flat_dive', 'dive_roll', 'somersault_dive'].includes(f.pose);
  if (down || roll) ctx.rotate(Math.PI / 2); if (f.defeated) ctx.rotate(0.35); if (f.wallLean) ctx.rotate(0.18);
  const walk = Math.sin(f.anim) * (roll ? 0.1 : 0.42);
  ctx.globalAlpha = f.extracted ? 0.15 : f.shadowHidden ? 0.42 : 1;
  ctx.fillStyle = '#0008'; ctx.beginPath(); ctx.ellipse(-2, 17, 25, 11, 0, 0, TAU); ctx.fill();
  seg(ctx, -9, 8, -25, 13 + walk * 5, -36, 20 + walk * 8, body, 8, f.limbs.leftLeg.t > 0);
  seg(ctx, -9, -8, -25, -13 - walk * 5, -36, -20 - walk * 8, body, 8, f.limbs.rightLeg.t > 0);
  seg(ctx, 5, 13, -10, 23 + walk * 4, -23, 27 + walk * 8, body, 6, f.limbs.leftArm.t > 0);
  seg(ctx, 5, -13, -10, -23 - walk * 4, -23, -27 - walk * 8, body, 6, f.limbs.rightArm.t > 0);
  ctx.fillStyle = '#091018'; ctx.beginPath(); ctx.ellipse(0, 0, 19, 23, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = suit; ctx.beginPath(); ctx.ellipse(1, 0, 16, 22, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = body; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(23, 0, 10, 11, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#071018'; ctx.lineWidth = 3; ctx.stroke();
  ctx.strokeStyle = final ? '#aeb5be' : '#eaf1ff'; ctx.lineWidth = 2; line(ctx, 27, -5, 31, 0); line(ctx, 31, 0, 27, 5);
  if (f.currentMove?.ttl > 0) swing(ctx, f.currentMove);
  if (f.crouch) ring(ctx, '#f1d36d', 30); if (f.wallLean) ring(ctx, '#7bd0ff', 34); if (stage.id === 'purple') ring(ctx, '#9b75ff', 38, true);
  ctx.rotate(-f.facing); ctx.globalAlpha = 1; ctx.textAlign = 'center'; ctx.font = '800 12px system-ui'; ctx.fillStyle = stage.color; ctx.fillText(stage.label, 0, -44); meter(ctx, -30, -37, 60, 5, f.hp, stage.color);
  if (f.bleed?.rate > 0) { ctx.fillStyle = '#d84646'; ctx.beginPath(); ctx.arc(-34, -35, 4, 0, TAU); ctx.fill(); meter(ctx, -30, -29, 60, 4, f.bleed.pool || 0, '#b22d35'); }
  if (f.bleed?.bandaging) meter(ctx, -28, 39, 56, 4, (f.bleed.progress || 0) * 100, '#f2f5fb');
  if (f.spottedT > 0) { ctx.fillStyle = '#f7e36f'; ctx.font = '900 26px system-ui'; ctx.fillText('!', 0, -64); }
  ctx.restore();
}
function seg(ctx, sx, sy, ex, ey, hx, hy, color, width, guard) { ctx.strokeStyle = guard ? '#f2dc74' : color; ctx.lineWidth = guard ? width + 2 : width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke(); }
function ring(ctx, color, r, dash = false) { ctx.strokeStyle = color; ctx.lineWidth = 2; if (dash) ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
function swing(ctx, m) { ctx.strokeStyle = m.kind === 'sword' ? '#d7e2ef' : '#f3d06f'; ctx.lineWidth = m.kind === 'sword' ? 5 : 7; ctx.globalAlpha = 0.72; ctx.beginPath(); ctx.arc(23, 0, m.reach, -0.45, 0.45); ctx.stroke(); ctx.globalAlpha = 1; }

function effects(ctx, state) { for (const e of state.effects) { ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, e.ttl * 6)); if (e.type === 'tracer') { ctx.strokeStyle = '#eff7ff'; ctx.lineWidth = 5; ctx.shadowColor = '#85d8ff'; ctx.shadowBlur = 14; line(ctx, e.x, e.y, e.x2, e.y2); ctx.shadowBlur = 0; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; line(ctx, e.x, e.y, e.x2, e.y2); dot(ctx, e.x, e.y, 9, '#f9e28a'); dot(ctx, e.x2, e.y2, 6, '#dff4ff'); } else if (e.type === 'smoke') { ctx.fillStyle = '#cfd8e655'; ctx.beginPath(); ctx.arc(e.x, e.y, 55 * (1 - e.ttl / 0.9), 0, TAU); ctx.fill(); } else if (e.type === 'explosion') { dot(ctx, e.x, e.y, (e.radius || 80) * (1 - e.ttl / 0.7), '#f3b24d55'); } else if (e.type === 'alert') { ctx.fillStyle = '#f7e36f'; ctx.font = '900 28px system-ui'; ctx.textAlign = 'center'; ctx.fillText('!', e.x, e.y); } else { ctx.fillStyle = e.type === 'block' ? '#f4db73' : e.type === 'dodge' || e.type === 'dive' ? '#7bd0ff' : '#f15d56'; dot(ctx, e.x, e.y, 16, ctx.fillStyle); } ctx.restore(); } }
function dot(ctx, x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function meter(ctx, x, y, w, h, value, color) { ctx.fillStyle = '#091018'; ctx.fillRect(x, y, w, h); ctx.fillStyle = color; ctx.fillRect(x, y, w * Math.max(0, Math.min(100, value)) / 100, h); }
function condition(hex, stage, final = false) { const target = final ? '#8f969e' : '#9aa1ab'; const t = final ? 0.88 : 1 - (stage.saturation ?? 1); return mix(hex, target, Math.max(0, Math.min(0.86, t))); }
function mix(a, b, t) { const ca = parse(a), cb = parse(b); return `rgb(${Math.round(ca.r + (cb.r - ca.r) * t)}, ${Math.round(ca.g + (cb.g - ca.g) * t)}, ${Math.round(ca.b + (cb.b - ca.b) * t)})`; }
function parse(hex) { const v = Number.parseInt(hex.replace('#', '').slice(0, 6), 16); return { r: v >> 16 & 255, g: v >> 8 & 255, b: v & 255 }; }
function sideHud(ctx, state) { ctx.fillStyle = '#0c121bcc'; ctx.fillRect(980, 0, 300, 720); ctx.fillStyle = '#edf4ff'; ctx.font = '900 26px system-ui'; ctx.fillText('TOP SHOT', 1000, 38); ctx.fillStyle = '#aebbd0'; ctx.font = '700 13px system-ui'; ctx.fillText('No direct control. Coach commands only.', 1000, 60); state.fighters.forEach((f, i) => card(ctx, f, 1000, 92 + i * 170)); ctx.fillStyle = '#d6e2f2'; ctx.font = '800 13px system-ui'; ctx.fillText(`State: ${state.matchState}`, 1000, 455); ctx.fillText(`Trust: ${Math.round(state.trust)}`, 1000, 476); ctx.fillText(`Clock: ${state.clock.toFixed(1)}s`, 1000, 497); if (state.result) { ctx.fillStyle = '#f0d36a'; ctx.fillText(state.result.slice(0, 34), 1000, 518); } let y = 542; ctx.fillStyle = '#9fb0c6'; ctx.font = '700 12px system-ui'; for (const l of state.log.slice(0, 7)) { ctx.fillText(l, 1000, y); y += 22; } }
function card(ctx, f, x, y) { const s = stageFor(f); ctx.fillStyle = '#121b28'; ctx.fillRect(x, y, 250, 148); ctx.strokeStyle = condition(f.color, s, f.incapacitated || f.defeated); ctx.strokeRect(x, y, 250, 148); ctx.fillStyle = '#eff5ff'; ctx.font = '900 16px system-ui'; ctx.fillText(f.name, x + 12, y + 25); ctx.fillStyle = s.color; ctx.font = '800 12px system-ui'; ctx.fillText(s.label, x + 185, y + 25); labelMeter(ctx, 'VIT', f.hp, x + 12, y + 45, s.color); labelMeter(ctx, 'BLEED', f.bleed?.pool || 0, x + 12, y + 70, '#b22d35'); labelMeter(ctx, 'DODGE', f.dodge, x + 12, y + 95, '#b894ff'); labelMeter(ctx, 'BLOCK', f.block, x + 12, y + 120, '#f0d36a'); }
function labelMeter(ctx, label, value, x, y, color) { ctx.fillStyle = '#aebbd0'; ctx.font = '800 10px system-ui'; ctx.fillText(label, x, y + 8); meter(ctx, x + 48, y, 170, 8, value, color); }
function result(ctx, state) { if (state.matchState !== 'finished') return; ctx.save(); ctx.fillStyle = '#05080dcc'; ctx.fillRect(120, 250, 720, 150); ctx.strokeStyle = '#f0d36a'; ctx.lineWidth = 3; ctx.strokeRect(120, 250, 720, 150); ctx.textAlign = 'center'; ctx.fillStyle = '#f5f0d0'; ctx.font = '900 34px system-ui'; ctx.fillText('MATCH COMPLETE', 480, 305); ctx.fillStyle = '#edf4ff'; ctx.font = '800 20px system-ui'; ctx.fillText(state.result || 'Match finished.', 480, 340); ctx.fillStyle = '#aebbd0'; ctx.font = '700 15px system-ui'; ctx.fillText('Press Rematch / Start Match to run it back.', 480, 372); ctx.restore(); }
