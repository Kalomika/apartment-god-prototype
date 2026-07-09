import { objects } from './world.js';
import { drawStyledObject } from './renderHouseStyle.js';

export function drawObjects(ctx, state) {
  for (const obj of objects.filter(o => o.floor === state.floor)) {
    if (obj.kind === 'car' && state.objectState.vehicleInUse === obj.id) continue;
    if (obj.kind === 'soccer_field') continue;
    const active = isObjectActive(state, obj);
    ctx.save();
    ctx.shadowColor = active ? 'rgba(232,198,97,.55)' : 'transparent';
    ctx.shadowBlur = active ? 16 : 0;
    if (!drawStyledObject(ctx, obj, state)) drawFallbackObject(ctx, obj);
    if (obj.kind === 'stairs' && obj.toFloor !== undefined) drawPortalMarker(ctx, obj);
    drawLivedInObjectDetails(ctx, obj, state, active);
    if (obj.id?.startsWith('pet_flap')) drawPetFlap(ctx, obj);
    if (obj.kind === 'stove') drawStoveBackPanel(ctx, obj, state);
    if (obj.kind === 'swim_pool') drawPoolDepthDetail(ctx, obj, state);
    ctx.restore();
  }
}

function isObjectActive(state, obj) {
  const label = String(obj.label || '').toLowerCase();
  const kind = String(obj.kind || '').toLowerCase();
  return state.entities.some(e => {
    if (e.hidden || e.floor !== obj.floor) return false;
    const action = String(e.action || '').toLowerCase();
    return e.target?.objectId === obj.id || e.pending?.objectId === obj.id || action.includes(kind) || (label && action.includes(label));
  });
}

function hasAction(state, terms, floor = null) {
  const list = Array.isArray(terms) ? terms : [terms];
  return state.entities.some(e => {
    if (e.hidden) return false;
    if (floor !== null && e.floor !== floor) return false;
    const action = String(e.action || '').toLowerCase();
    return list.some(term => action.includes(term));
  });
}

function drawLivedInObjectDetails(ctx, obj, state, active) {
  if (obj.kind === 'pool_table') drawPlayablePoolOverlay(ctx, obj, state, active);
  if (obj.kind === 'weight_bench') drawWeightBenchOverlay(ctx, obj, state, active);
  if (obj.kind === 'heavy_bag') drawHeavyBagOverlay(ctx, obj, state, active);
  if (obj.kind === 'dining_table') drawDiningTable(ctx, obj, state, active);
  if (obj.kind === 'coffee_maker') drawCoffeeMaker(ctx, obj, state, active);
  if (obj.kind === 'tv') drawTvGlow(ctx, obj, state);
  if (obj.kind === 'game_console') drawConsoleGlow(ctx, obj, state, active);
}

function drawPlayablePoolOverlay(ctx, o, state, active) {
  const felt = { x: o.x + 14, y: o.y + 14, w: o.w - 28, h: o.h - 28 };
  const game = state.poolGame?.tableId === o.id ? state.poolGame : null;
  ctx.save();
  ctx.shadowColor = 'transparent';
  rounded(ctx, felt.x, felt.y, felt.w, felt.h, 12, true, false, '#557d67');
  for (const [px, py] of [[16,16],[o.w/2,12],[o.w-16,16],[16,o.h-16],[o.w/2,o.h-12],[o.w-16,o.h-16]]) circle(ctx, o.x + px, o.y + py, 7, '#2c2622');

  if (game) drawPoolGameState(ctx, o, game);
  else drawRackedPoolTable(ctx, o);

  const pulse = active ? Math.sin((state.time || 0) * .18) * 5 : 0;
  line(ctx, o.x + 18, o.y + o.h + 14 + pulse * .12, o.x + o.w - 18, o.y + o.h + 2, '#d6b27a', 3);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 8px system-ui';
  const label = game ? String(game.message || 'GAME IN PROGRESS').toUpperCase().slice(0, 22) : 'RACKED';
  ctx.fillText(label, o.x + 10, o.y + o.h - 14);
  ctx.restore();
}

function drawRackedPoolTable(ctx, o) {
  const horizontal = o.w >= o.h;
  const gap = 11;
  const colors = ['#f1c66a', '#ff75df', '#74e6ff', '#90d68c', '#f08b57', '#a98bff', '#f8fbff', '#e06767', '#74c0a8', '#d2b064'];
  if (horizontal) {
    const cueX = o.x + o.w * .26;
    const cy = o.y + o.h * .50;
    const rackX = o.x + o.w * .62;
    circle(ctx, cueX, cy, 6, '#f8fbff');
    ctx.strokeStyle = '#d6b27a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rackX - 10, cy - 31);
    ctx.lineTo(rackX - 10, cy + 31);
    ctx.lineTo(rackX + 50, cy);
    ctx.closePath();
    ctx.stroke();
    let index = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col <= row; col++) circle(ctx, rackX + row * gap, cy + (col - row / 2) * gap, 5.4, colors[index++ % colors.length]);
    }
    return;
  }
  const cy = o.y + o.h * .62;
  const rackX = o.x + o.w * .50;
  circle(ctx, o.x + o.w * .50, o.y + o.h * .22, 6, '#f8fbff');
  ctx.strokeStyle = '#d6b27a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rackX - 31, cy - 10);
  ctx.lineTo(rackX + 31, cy - 10);
  ctx.lineTo(rackX, cy + 50);
  ctx.closePath();
  ctx.stroke();
  let index = 0;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col <= row; col++) circle(ctx, rackX + (col - row / 2) * gap, cy + row * gap, 5.4, colors[index++ % colors.length]);
  }
}

function drawPoolGameState(ctx, o, game) {
  if (game.cueLine?.t > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, game.cueLine.t);
    line(ctx, game.cueLine.x1, game.cueLine.y1, game.cueLine.x2, game.cueLine.y2, 'rgba(241,198,106,.86)', 2);
    ctx.restore();
  }
  if (game.cueThrust?.t > 0) {
    const pct = Math.max(0, Math.min(1, game.cueThrust.t / .45));
    const bx = game.cueThrust.x1 + (game.cueThrust.x2 - game.cueThrust.x1) * (1 - pct * .22);
    const by = game.cueThrust.y1 + (game.cueThrust.y2 - game.cueThrust.y1) * (1 - pct * .22);
    line(ctx, bx, by, game.cueThrust.x2, game.cueThrust.y2, '#d6b27a', 4);
  }
  for (const b of game.balls || []) {
    if (b.pocketed) continue;
    circle(ctx, b.x, b.y, b.id === 'cue' ? 6 : 6.5, b.fill || '#f8fbff');
    if (b.id !== 'cue') circle(ctx, b.x - 1.2, b.y - 1.2, 2.1, 'rgba(255,255,255,.65)');
  }
  const live = (game.balls || []).filter(b => !b.pocketed && b.id !== 'cue').length;
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 8px system-ui';
  ctx.fillText(`${live} BALLS`, o.x + 10, o.y + 11);
  if (game.mode === 'match') {
    const score = Object.values(game.score || {}).join(' / ');
    ctx.fillText(`SCORE ${score}`, o.x + 10, o.y + o.h - 4);
  }
}

function drawWeightBenchOverlay(ctx, o, state, active) {
  const lift = active || hasAction(state, 'lift weights', o.floor);
  const rep = lift ? Math.sin((state.time || 0) * .28) : 0;
  const barY = o.y + 2 - Math.max(0, rep) * 18;
  ctx.save();
  ctx.shadowColor = 'transparent';
  rounded(ctx, o.x + 18, o.y + 17, o.w - 36, 20, 8, true, false, '#20252f');
  rounded(ctx, o.x + 28, o.y + 20, o.w - 56, 14, 7, true, false, '#4f5d6b');
  line(ctx, o.x + 20, o.y + 40, o.x + 8, o.y + 52, '#9aa2aa', 3);
  line(ctx, o.x + o.w - 20, o.y + 40, o.x + o.w - 8, o.y + 52, '#9aa2aa', 3);
  line(ctx, o.x + 7, barY, o.x + o.w - 7, barY, '#f1e9de', 4);
  drawPlateStack(ctx, o.x + 3, barY, -1);
  drawPlateStack(ctx, o.x + o.w - 3, barY, 1);
  if (lift) { ctx.fillStyle = '#f1c66a'; ctx.font = '900 8px system-ui'; ctx.fillText('REP', o.x + o.w / 2 - 10, o.y - 8); }
  ctx.restore();
}

function drawPlateStack(ctx, x, y, dir) { for (let i = 0; i < 3; i++) rounded(ctx, x + dir * i * 5 - 4, y - 13, 8, 26, 3, true, false, i % 2 ? '#343b46' : '#596575'); }
function drawHeavyBagOverlay(ctx, o, state, active) { const punching = active || hasAction(state, 'heavy bag', o.floor); const sway = punching ? Math.sin((state.time || 0) * .42) * 5 : 0; ctx.save(); ctx.shadowColor = 'transparent'; ctx.clearRect(o.x + 2, o.y + 10, o.w - 4, o.h - 10); line(ctx, o.x + o.w / 2, o.y, o.x + o.w / 2 + sway * .35, o.y + 17, '#b99d70', 2); rounded(ctx, o.x + 6 + sway, o.y + 16, o.w - 12, o.h - 20, 16, true, false, '#7b4e46'); rounded(ctx, o.x + 10 + sway, o.y + 22, o.w - 20, 18, 9, true, false, 'rgba(255,255,255,.12)'); if (punching) { ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(o.x + o.w / 2 + sway + 22, o.y + 42, 10, -0.9, 0.9); ctx.stroke(); } ctx.restore(); }
function drawDiningTable(ctx, o, state, active) { ctx.save(); ctx.shadowColor = 'transparent'; rounded(ctx, o.x, o.y, o.w, o.h, 18, true, false, '#8f6844'); rounded(ctx, o.x + 10, o.y + 10, o.w - 20, o.h - 20, 14, true, false, '#b78556'); for (const [x, y] of [[18,18], [o.w - 18,18], [18,o.h - 18], [o.w - 18,o.h - 18]]) circle(ctx, o.x + x, o.y + y, 10, '#e8decf'); for (const [x, y] of [[o.w / 2 - 28, 18], [o.w / 2 + 28, o.h - 18]]) { rounded(ctx, o.x + x - 14, o.y + y - 7, 28, 14, 7, true, false, '#d9c1a1'); circle(ctx, o.x + x + 20, o.y + y, 4, '#74e6ff'); } if (active || hasAction(state, ['eat', 'meal'], o.floor)) { ctx.fillStyle = '#f1c66a'; ctx.font = '900 9px system-ui'; ctx.fillText('EATING', o.x + o.w / 2 - 19, o.y + o.h / 2 + 4); } ctx.restore(); }
function drawCoffeeMaker(ctx, o, state, active) { const brewing = active || hasAction(state, 'coffee', o.floor); const steam = Math.sin((state.time || 0) * .35); ctx.save(); ctx.shadowColor = 'transparent'; rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false, '#343b46'); rounded(ctx, o.x + 8, o.y + 8, o.w - 16, o.h - 12, 4, true, false, '#141a22'); ctx.fillStyle = brewing ? '#f1c66a' : '#7ea4a0'; ctx.fillRect(o.x + o.w - 12, o.y + 8, 5, 5); rounded(ctx, o.x + 12, o.y + o.h - 2, 18, 12, 5, true, false, '#6f4e37'); if (brewing) { ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.lineWidth = 1.5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(o.x + 14 + i * 7, o.y - 2); ctx.quadraticCurveTo(o.x + 10 + i * 7 + steam * 2, o.y - 13, o.x + 16 + i * 7, o.y - 22); ctx.stroke(); } } ctx.restore(); }
function drawTvGlow(ctx, o, state) { if (!state.tv?.on) return; ctx.save(); ctx.shadowColor = 'transparent'; const pulse = .22 + Math.abs(Math.sin((state.time || 0) * .22)) * .18; ctx.globalAlpha = pulse; ctx.fillStyle = '#74e6ff'; ctx.beginPath(); ctx.moveTo(o.x - 18, o.y + o.h + 4); ctx.lineTo(o.x + o.w + 18, o.y + o.h + 4); ctx.lineTo(o.x + o.w + 74, o.y + 156); ctx.lineTo(o.x - 74, o.y + 156); ctx.closePath(); ctx.fill(); ctx.restore(); }
function drawConsoleGlow(ctx, o, state, active) { if (!active && !hasAction(state, ['console', 'game'], o.floor)) return; ctx.save(); ctx.shadowColor = 'transparent'; const pulse = Math.abs(Math.sin((state.time || 0) * .24)); ctx.strokeStyle = `rgba(116,230,255,${.32 + pulse * .42})`; ctx.lineWidth = 3; rounded(ctx, o.x + 14, o.y + 8, o.w - 28, o.h - 16, 8, false, true); ctx.restore(); }
function drawPortalMarker(ctx, o) { if (!o.styleAs && o.id !== 'garage_door') return; ctx.save(); ctx.shadowColor = 'transparent'; const doorColor = o.id.includes('garage') ? '#8ea3b7' : '#8b654c'; rounded(ctx, o.x, o.y, o.w, o.h, 5, true, false, doorColor); rounded(ctx, o.x + 4, o.y + 4, Math.max(8, o.w - 8), Math.max(8, o.h - 8), 4, true, false, 'rgba(20,25,31,.45)'); ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 2; rounded(ctx, o.x, o.y, o.w, o.h, 5, false, true); ctx.fillStyle = '#f8fbff'; ctx.font = '900 8px system-ui'; ctx.textAlign = 'center'; const label = o.id.includes('garage') ? 'GARAGE' : o.id.includes('back') || o.id.includes('yard') ? 'YARD' : 'DOOR'; ctx.fillText(label, o.x + o.w / 2, o.y - 4); ctx.textAlign = 'left'; ctx.restore(); }
function drawPetFlap(ctx, o) { ctx.save(); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#5a4032'; rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false); ctx.fillStyle = '#1f2933'; rounded(ctx, o.x + 5, o.y + 5, o.w - 10, o.h - 7, 6, true, false); ctx.strokeStyle = '#d8c4a4'; ctx.lineWidth = 2; rounded(ctx, o.x + 4, o.y + 4, o.w - 8, o.h - 6, 6, false, true); ctx.fillStyle = '#f1c66a'; ctx.font = '900 9px system-ui'; ctx.textAlign = 'center'; ctx.fillText('DOG', o.x + o.w / 2, o.y - 3); ctx.textAlign = 'left'; ctx.restore(); }
function drawPoolDepthDetail(ctx, o, state) { ctx.save(); ctx.shadowColor = 'transparent'; const inner = { x: o.x + 19, y: o.y + 19, w: o.w - 38, h: o.h - 38 }; rounded(ctx, inner.x, inner.y, inner.w, inner.h, 22, true, false, '#70c7d4'); const bands = [{ inset: 13, color: 'rgba(52,151,179,.30)' }, { inset: 33, color: 'rgba(32,117,158,.36)' }, { inset: 56, color: 'rgba(14,73,132,.45)' }]; for (const band of bands) rounded(ctx, inner.x + band.inset, inner.y + band.inset, inner.w - band.inset * 2, inner.h - band.inset * 2, 18, true, false, band.color); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2; const swimming = hasAction(state, 'swim', o.floor); const offset = swimming ? Math.sin((state.time || 0) * .32) * 9 : 0; for (let y = inner.y + 24; y < inner.y + inner.h - 12; y += 26) { ctx.beginPath(); ctx.moveTo(inner.x + 14, y); ctx.quadraticCurveTo(inner.x + inner.w / 2, y - 13 + offset, inner.x + inner.w - 14, y); ctx.stroke(); } ctx.strokeStyle = 'rgba(9,36,65,.40)'; ctx.lineWidth = 3; rounded(ctx, inner.x, inner.y, inner.w, inner.h, 22, false, true); drawPoolSteps(ctx, inner.x + 16, inner.y + inner.h - 48); if (swimming) { ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(inner.x + inner.w * .55, inner.y + inner.h * .52, 24 + Math.abs(offset), 0, Math.PI * 2); ctx.stroke(); } ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.font = '900 9px system-ui'; ctx.fillText('SHALLOW', inner.x + 18, inner.y + 21); ctx.fillText('DEEP', inner.x + inner.w - 48, inner.y + inner.h - 20); ctx.restore(); }
function drawPoolSteps(ctx, x, y) { ctx.strokeStyle = 'rgba(255,255,255,.62)'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) rounded(ctx, x + i * 6, y + i * 8, 48 - i * 10, 6, 3, false, true); }
function drawStoveBackPanel(ctx, o, state) { ctx.save(); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#8f897f'; rounded(ctx, o.x + 3, o.y - 13, o.w - 6, 20, 6, true, false); ctx.strokeStyle = '#514b46'; ctx.lineWidth = 2; rounded(ctx, o.x + 3, o.y - 13, o.w - 6, 20, 6, false, true); ctx.fillStyle = '#393632'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(o.x + 15 + i * 14, o.y - 3, 3, 0, Math.PI * 2); ctx.fill(); } if (state.objectState.stovePan) { ctx.fillStyle = '#f1c66a'; ctx.font = '900 8px system-ui'; ctx.fillText('HEAT', o.x + o.w - 28, o.y - 1); } ctx.restore(); }
function drawFallbackObject(ctx, o) { ctx.fillStyle = '#9b8d7c'; rounded(ctx, o.x, o.y, o.w, o.h, 8); ctx.strokeStyle = '#4a4138'; ctx.lineWidth = 2; rounded(ctx, o.x, o.y, o.w, o.h, 8, false, true); }
function rounded(ctx, x, y, w, h, r, fill = true, stroke = false, color = '') { if (color) ctx.fillStyle = color; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r)); else ctx.rect(x, y, Math.max(1, w), Math.max(1, h)); if (fill) ctx.fill(); if (stroke) ctx.stroke(); }
function circle(ctx, x, y, r, color = '', fill = true) { if (color) fill ? ctx.fillStyle = color : ctx.strokeStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) ctx.fill(); else ctx.stroke(); }
function line(ctx, x1, y1, x2, y2, color, width = 1) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
