import { objects } from './world.js';

const FLOOR = '#d8c4a4';
const FLOOR_LINE = 'rgba(124,103,75,.15)';
const PORCH_WOOD = '#8b6a48';
const PORCH_LINE = 'rgba(36,28,20,.24)';
const WALL = '#6f6556';
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
  patchObject('dog_bed', { x: 540, y: 594, w: 58, h: 38, room: 'entry', solid: false, enterable: true });
  patchObject('dog_bowl', { x: 610, y: 604, w: 34, h: 24, room: 'entry', solid: false });
  patchObject('robot_vacuum', { x: 660, y: 602, w: 30, h: 30, room: 'entry', solid: false });
}

export function drawMainFloorLayoutPolish(ctx, state) {
  if (state.floor !== 0) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  drawTvStateAndLivingClear(ctx, state);
  drawCleanPorch(ctx);
  drawPetRobotNook(ctx, state);
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
  const tv = object('tv');
  if (!tv) return false;
  return (state.entities || []).some(entity => {
    if (entity.hidden || entity.floor !== tv.floor || entity.type !== 'person') return false;
    const action = String(entity.action || '').toLowerCase();
    const pose = String(entity.pose || '').toLowerCase();
    if (action.includes('sleep') || action.includes('nap') || action.includes('waking')) return false;
    const watching = action.includes('tv') || action.includes('watch') || action.includes('movie') || action.includes('sports') || pose.includes('watch');
    if (!watching) return false;
    const tvCenter = { x: tv.x + tv.w / 2, y: tv.y + tv.h / 2 };
    return entity.y > tv.y + tv.h && Math.hypot(entity.x - tvCenter.x, entity.y - tvCenter.y) <= 245;
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

function drawPetRobotNook(ctx, state) {
  clearFloor(ctx, 496, 552, 226, 132, FLOOR);
  round(ctx, 508, 566, 194, 100, 6, '#cbb996');
  round(ctx, 508, 566, 194, 8, 2, WALL);
  round(ctx, 508, 658, 194, 8, 2, WALL);
  round(ctx, 508, 566, 8, 100, 2, WALL);
  round(ctx, 694, 566, 8, 100, 2, WALL);
  ctx.fillStyle = 'rgba(7,16,24,.56)';
  ctx.font = '900 9px system-ui';
  ctx.fillText('PET + ROBOT NOOK', 526, 584);
  drawDogBedSprite(ctx, object('dog_bed'));
  drawDogBowlSprite(ctx, object('dog_bowl'));
  drawRobotVacuumSprite(ctx, object('robot_vacuum'), state);
  drawStairWell(ctx, 780, 554, 118, 84);
}

function drawDogBedSprite(ctx, bed) {
  if (!bed) return;
  round(ctx, bed.x, bed.y, bed.w, bed.h, 16, '#8f765f');
  round(ctx, bed.x + 7, bed.y + 6, bed.w - 14, bed.h - 12, 13, '#c8b7a1');
  round(ctx, bed.x + 16, bed.y + 12, bed.w - 32, bed.h - 22, 10, '#e1d1bd');
}

function drawDogBowlSprite(ctx, bowl) {
  if (!bowl) return;
  round(ctx, bowl.x - 2, bowl.y - 2, bowl.w + 4, bowl.h + 4, 10, '#4e5964');
  round(ctx, bowl.x + 4, bowl.y + 4, bowl.w - 8, bowl.h - 8, 8, '#a9c6ce');
  circle(ctx, bowl.x + bowl.w / 2, bowl.y + bowl.h / 2, 6, '#5f7c55');
}

function drawRobotVacuumSprite(ctx, robot, state) {
  if (!robot) return;
  const active = state.cleaning?.robotVacuum?.active;
  circle(ctx, robot.x + robot.w / 2, robot.y + robot.h / 2, 15, active ? CYAN : '#79838f');
  circle(ctx, robot.x + robot.w / 2, robot.y + robot.h / 2, 7, '#202833');
  if (active) {
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(robot.x + robot.w / 2, robot.y + robot.h / 2, 18, 0, Math.PI * 2);
    ctx.stroke();
  }
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
  clearFloor(ctx, table.x - 90, table.y - 70, table.w + 180, table.h + 140, FLOOR);
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
  drawServedTablePlates(ctx, state, table);
}

function drawServedTablePlates(ctx, state, table) {
  const plates = (state.meals?.tablePlates || []).filter(p => p.floor === table.floor && p.tableId === table.id);
  for (const plate of plates) {
    circle(ctx, plate.x, plate.y, 12, '#efe7dc');
    circle(ctx, plate.x + 2, plate.y, 5, plate.food === 'snack' ? '#d59b5a' : '#b66d55');
    line(ctx, plate.x - 10, plate.y + 12, plate.x + 10, plate.y + 12, 'rgba(7,16,24,.24)', 1);
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

function drawStairWell(ctx, x, y, w, h) {
  round(ctx, x - 10, y - 10, w + 20, h + 20, 12, '#5b5145');
  round(ctx, x + 1, y + 1, w - 2, h - 2, 8, '#b7a384');
  const steps = 7;
  for (let i = 0; i < steps; i += 1) {
    const p = i / Math.max(1, steps - 1);
    const sy = y + 11 + i * ((h - 22) / steps);
    round(ctx, x + 14, sy, w - 28, 7, 3, `rgba(12,15,18,${0.2 + p * 0.58})`);
    line(ctx, x + 18, sy + 2, x + w - 18, sy + 2, 'rgba(255,255,255,.20)', 1);
  }
  round(ctx, x + 22, y + h - 20, w - 44, 14, 5, 'rgba(4,7,10,.80)');
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
