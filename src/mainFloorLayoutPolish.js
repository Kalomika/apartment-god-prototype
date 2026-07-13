import { objects } from './world.js';

const FLOOR = '#d8c4a4';
const FLOOR_LINE = 'rgba(124,103,75,.15)';
const PORCH_WOOD = '#8b6a48';
const PORCH_LINE = 'rgba(36,28,20,.24)';
const COUCH_DARK = '#172834';
const COUCH_MID = '#263f48';
const COUCH_LIGHT = '#5f828c';
const TABLE_DARK = '#4d3326';
const TABLE_WOOD = '#8b5f3b';
const CHAIR_DARK = '#26313b';
const CHAIR_SEAT = '#78848e';
const CYAN = '#74e6ff';
const GOLD = '#f1c66a';

export function applyMainFloorLayoutPolish() {
  patchObject('couch', { x: 72, y: 222, w: 260, h: 86, facing: 'up', enterable: true, solid: true });
  patchObject('dining_table', { x: 494, y: 274, w: 190, h: 64, solid: true });
  patchObject('coffee_maker', { x: 720, y: 74, w: 44, h: 32, solid: false });
}

export function drawMainFloorLayoutPolish(ctx, state) {
  if (state.floor !== 0) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  drawTvStateAndLivingClear(ctx, state);
  drawCleanPorch(ctx);
  drawCleanLivingCouch(ctx);
  drawCleanDiningSet(ctx, state);
  ctx.restore();
}

function drawTvStateAndLivingClear(ctx, state) {
  clearFloor(ctx, 92, 82, 310, 154, FLOOR);
  round(ctx, 172, 54, 120, 30, 5, '#1a2028');
  round(ctx, 180, 60, 104, 18, 3, '#52626a');
  if (!isWatchingTv(state)) return;
  ctx.save();
  ctx.globalAlpha = 0.30 + Math.abs(Math.sin((state.time || 0) * .22)) * 0.12;
  ctx.fillStyle = CYAN;
  ctx.beginPath();
  ctx.moveTo(132, 88);
  ctx.lineTo(322, 88);
  ctx.lineTo(382, 236);
  ctx.lineTo(74, 236);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function isWatchingTv(state) {
  return (state.entities || []).some(entity => {
    if (entity.hidden || entity.floor !== 0 || entity.type !== 'person') return false;
    const action = String(entity.action || '').toLowerCase();
    const pose = String(entity.pose || '').toLowerCase();
    if (action.includes('sleep') || action.includes('nap') || action.includes('waking')) return false;
    return action.includes('tv') || action.includes('watch') || action.includes('movie') || action.includes('sports') || pose.includes('watch');
  });
}

function drawCleanPorch(ctx) {
  clearFloor(ctx, 136, 570, 360, 114, PORCH_WOOD, PORCH_LINE);
  round(ctx, 136, 570, 360, 114, 0, PORCH_WOOD);
  for (let y = 582; y < 674; y += 18) line(ctx, 146, y, 486, y, PORCH_LINE, 1);
  round(ctx, 136, 570, 360, 9, 0, '#61482f');
  round(ctx, 136, 676, 360, 8, 0, '#3d3126');
  round(ctx, 136, 570, 38, 114, 5, '#3b4239');
  round(ctx, 458, 570, 38, 114, 5, '#3b4239');
  circle(ctx, 156, 626, 4, GOLD);
  circle(ctx, 476, 626, 4, GOLD);
  ctx.fillStyle = 'rgba(255,255,255,.72)';
  ctx.font = '900 10px system-ui';
  ctx.fillText('FRONT PORCH', 186, 592);
  drawPorchChairFacingOut(ctx, 196, 642);
  drawPorchChairFacingOut(ctx, 432, 642);
  round(ctx, 298, 624, 42, 30, 15, '#2d2a25');
  round(ctx, 305, 629, 28, 20, 10, '#5e4934');
  circle(ctx, 319, 638, 5, '#5f7c55');
  line(ctx, 319, 638, 321, 632, '#a5c27f', 1);
}

function drawPorchChairFacingOut(ctx, x, y) {
  ctx.save();
  round(ctx, x - 24, y - 20, 48, 42, 12, CHAIR_DARK);
  round(ctx, x - 18, y - 14, 36, 28, 9, CHAIR_SEAT);
  round(ctx, x - 22, y + 15, 44, 10, 5, '#15232b');
  line(ctx, x - 18, y + 22, x - 28, y + 35, '#1c252b', 3);
  line(ctx, x + 18, y + 22, x + 28, y + 35, '#1c252b', 3);
  ctx.restore();
}

function drawCleanLivingCouch(ctx) {
  const couch = object('couch');
  if (!couch) return;
  clearFloor(ctx, 42, 176, 330, 205, FLOOR);
  round(ctx, 78, 210, 270, 132, 20, 'rgba(88,76,60,.18)');
  round(ctx, 88, 218, 244, 114, 22, '#c0b19b');
  const x = couch.x;
  const y = couch.y;
  const w = couch.w;
  round(ctx, x - 6, y + 16, w + 12, 90, 25, 'rgba(0,0,0,.20)');
  round(ctx, x, y + 10, w, 78, 24, COUCH_MID);
  round(ctx, x, y - 54, 84, 142, 24, COUCH_MID);
  round(ctx, x + 15, y + 22, 64, 46, 15, COUCH_LIGHT);
  round(ctx, x + 86, y + 22, 64, 46, 15, '#6a8d96');
  round(ctx, x + 157, y + 22, 64, 46, 15, '#587b86');
  round(ctx, x + 12, y - 39, 56, 94, 18, '#628793');
  round(ctx, x + 6, y + 67, w - 12, 24, 12, COUCH_DARK);
  round(ctx, x + 3, y - 50, 24, 136, 12, COUCH_DARK);
  line(ctx, x + 82, y + 27, x + 82, y + 66, 'rgba(255,255,255,.20)', 1.5);
  line(ctx, x + 153, y + 27, x + 153, y + 66, 'rgba(255,255,255,.20)', 1.5);
  line(ctx, x + 23, y - 30, x + 65, y - 30, 'rgba(255,255,255,.18)', 1.5);
  round(ctx, x + 22, y + 71, w - 50, 9, 6, 'rgba(7,16,24,.35)');
}

function drawCleanDiningSet(ctx, state) {
  const table = object('dining_table');
  if (!table) return;
  clearFloor(ctx, table.x - 104, table.y - 80, table.w + 208, table.h + 160, FLOOR);
  const chairPositions = [
    [table.x + table.w / 2, table.y - 28, 0],
    [table.x + table.w / 2, table.y + table.h + 28, Math.PI],
    [table.x - 30, table.y + table.h / 2, -Math.PI / 2],
    [table.x + table.w + 30, table.y + table.h / 2, Math.PI / 2]
  ];
  chairPositions.forEach(([x, y, rotation]) => drawDiningChair(ctx, x, y, rotation));
  round(ctx, table.x - 5, table.y - 5, table.w + 10, table.h + 10, 13, TABLE_DARK);
  round(ctx, table.x + 6, table.y + 6, table.w - 12, table.h - 12, 10, TABLE_WOOD);
  line(ctx, table.x + 18, table.y + 18, table.x + table.w - 18, table.y + 14, 'rgba(255,255,255,.13)', 1.4);
  drawPlaceSetting(ctx, table.x + 42, table.y + table.h / 2);
  drawPlaceSetting(ctx, table.x + table.w - 42, table.y + table.h / 2);
  drawPlaceSetting(ctx, table.x + table.w / 2, table.y + 20);
  drawPlaceSetting(ctx, table.x + table.w / 2, table.y + table.h - 20);
  circle(ctx, table.x + table.w / 2, table.y + table.h / 2, 7, '#5f7c55');
  if (hasAction(state, ['eat', 'meal', 'table'], table.floor)) {
    circle(ctx, table.x + table.w / 2 + 28, table.y + table.h / 2, 12, '#efe7dc');
    circle(ctx, table.x + table.w / 2 + 30, table.y + table.h / 2, 5, '#b66d55');
  }
}

function drawDiningChair(ctx, x, y, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  round(ctx, -18, -14, 36, 28, 9, CHAIR_DARK);
  round(ctx, -13, -10, 26, 19, 7, CHAIR_SEAT);
  round(ctx, -16, -20, 32, 9, 4, '#46545f');
  ctx.restore();
}

function drawPlaceSetting(ctx, x, y) {
  circle(ctx, x, y, 8, '#efe7dc');
  line(ctx, x - 13, y + 10, x + 13, y + 10, 'rgba(7,16,24,.23)', 1);
}

function clearFloor(ctx, x, y, w, h, fill = FLOOR, lineColor = FLOOR_LINE) {
  ctx.save();
  ctx.globalAlpha = 0.99;
  round(ctx, x, y, w, h, 0, fill);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  for (let lineY = Math.ceil(y / 14) * 14; lineY < y + h; lineY += 14) line(ctx, x + 8, lineY, x + w - 8, lineY, lineColor, 1);
  ctx.restore();
}

function patchObject(id, patch) {
  const obj = object(id);
  if (obj) Object.assign(obj, patch);
}

function object(id) {
  return objects.find(o => o.id === id) || null;
}

function hasAction(state, terms, floor = state.floor) {
  const list = Array.isArray(terms) ? terms : [terms];
  return (state.entities || []).some(e => {
    if (e.hidden || e.floor !== floor) return false;
    const action = String(e.action || '').toLowerCase();
    const pose = String(e.pose || '').toLowerCase();
    return list.some(term => action.includes(term) || pose.includes(term));
  });
}

function round(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fillStyle = fill;
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}
