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
const COUNTER = '#9b805e';
const COUNTER_TOP = '#d8c7ad';
const CABINET = '#70523c';

export function applyMainFloorLayoutPolish() {
  patchObject('couch', { x: 72, y: 222, w: 260, h: 86, facing: 'up', enterable: true, solid: true });
  patchObject('dining_table', { x: 498, y: 286, w: 174, h: 58, solid: true });
  patchObject('sink', { x: 690, y: 84, w: 58, h: 46, solid: true, facing: 'down' });
  patchObject('coffee_maker', { x: 724, y: 174, w: 38, h: 34, solid: false });
  patchObject('trash_kitchen', { x: 728, y: 246, w: 34, h: 42, solid: false });
  patchObject('dog_bed', { x: 540, y: 594, w: 58, h: 38, room: 'entry', solid: false, enterable: true });
  patchObject('dog_bowl', { x: 610, y: 604, w: 34, h: 24, room: 'entry', solid: false });
  patchObject('robot_vacuum', { x: 660, y: 602, w: 30, h: 30, room: 'entry', solid: false });
}

export function drawMainFloorLayoutPolish(ctx, state) {
  if (state.floor !== 0) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  drawTvStateAndLivingClear(ctx, state);
  drawKitchenLCounterAndAppliances(ctx, state);
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

function drawKitchenLCounterAndAppliances(ctx, state) {
  const fridge = object('fridge');
  const stove = object('stove');
  const sink = object('sink');
  const coffee = object('coffee_maker');
  const trash = object('trash_kitchen');

  clearFloor(ctx, 472, 58, 308, 238, FLOOR);
  drawLCounterRun(ctx);
  drawFridgeSprite(ctx, fridge, state);
  drawStoveSprite(ctx, stove, state);
  drawSinkSprite(ctx, sink, state);
  drawCoffeeMakerSprite(ctx, coffee, state);
  drawKitchenTrashSprite(ctx, trash, state);
}

function drawLCounterRun(ctx) {
  round(ctx, 480, 62, 288, 84, 10, 'rgba(86,66,45,.20)');
  round(ctx, 704, 62, 64, 214, 10, 'rgba(86,66,45,.20)');
  round(ctx, 482, 64, 284, 76, 8, CABINET);
  round(ctx, 710, 64, 56, 206, 8, CABINET);
  round(ctx, 488, 70, 272, 18, 6, COUNTER_TOP);
  round(ctx, 716, 70, 44, 194, 6, COUNTER_TOP);
  for (let x = 512; x < 752; x += 44) line(ctx, x, 92, x, 136, 'rgba(38,30,24,.24)', 1.2);
  for (let y = 112; y < 252; y += 38) line(ctx, 717, y, 758, y, 'rgba(38,30,24,.24)', 1.2);
  line(ctx, 488, 88, 760, 88, 'rgba(255,255,255,.18)', 1.4);
  line(ctx, 716, 88, 716, 264, 'rgba(255,255,255,.15)', 1.4);
}

function drawFridgeSprite(ctx, fridge, state) {
  if (!fridge) return;
  round(ctx, fridge.x - 3, fridge.y - 3, fridge.w + 6, fridge.h + 6, 10, '#f5efe6');
  round(ctx, fridge.x + 6, fridge.y + 7, fridge.w - 12, fridge.h - 14, 7, '#eee7dd');
  line(ctx, fridge.x + 8, fridge.y + fridge.h * .46, fridge.x + fridge.w - 8, fridge.y + fridge.h * .46, '#c9bdb2', 1.5);
  round(ctx, fridge.x + 10, fridge.y + 18, 7, 48, 4, '#9fcbd3');
  if (state.objectState?.fridgeOpen) {
    round(ctx, fridge.x + 22, fridge.y + 18, fridge.w - 31, fridge.h - 32, 6, '#fffdf6');
    line(ctx, fridge.x + 28, fridge.y + 34, fridge.x + fridge.w - 14, fridge.y + 34, '#d7cabe', 1.5);
    line(ctx, fridge.x + 28, fridge.y + 54, fridge.x + fridge.w - 14, fridge.y + 54, '#d7cabe', 1.5);
  }
}

function drawStoveSprite(ctx, stove, state) {
  if (!stove) return;
  round(ctx, stove.x, stove.y, stove.w, stove.h, 8, '#b9b4aa');
  round(ctx, stove.x + 5, stove.y + 5, stove.w - 10, 12, 5, '#8f897f');
  for (let i = 0; i < 4; i += 1) circle(ctx, stove.x + 19 + (i % 2) * 34, stove.y + 28 + Math.floor(i / 2) * 22, 8, '#655f59');
  if (state.objectState?.stovePan) {
    circle(ctx, stove.x + 38, stove.y + 39, 15, '#3c3835');
    line(ctx, stove.x + 51, stove.y + 38, stove.x + 72, stove.y + 32, '#3c3835', 3);
  }
}

function drawSinkSprite(ctx, sink, state) {
  if (!sink) return;
  round(ctx, sink.x - 2, sink.y - 2, sink.w + 4, sink.h + 4, 9, '#73706c');
  round(ctx, sink.x + 5, sink.y + 5, sink.w - 10, sink.h - 10, 10, '#eef4f2');
  round(ctx, sink.x + 12, sink.y + 12, sink.w - 24, sink.h - 20, 9, '#a8d3db');
  circle(ctx, sink.x + sink.w / 2, sink.y + 13, 3, '#4e5964');
  line(ctx, sink.x + sink.w - 10, sink.y + 7, sink.x + sink.w - 2, sink.y + 1, '#cfd9dc', 2);
  if (hasAction(state, ['brush', 'groom', 'wash hands', 'sink'], sink.floor)) drawSteamLines(ctx, sink.x + sink.w / 2, sink.y - 2, 3);
}

function drawCoffeeMakerSprite(ctx, coffee, state) {
  if (!coffee) return;
  const brewing = hasAction(state, 'coffee', coffee.floor);
  round(ctx, coffee.x - 7, coffee.y - 6, coffee.w + 14, coffee.h + 16, 8, '#5d4a3a');
  round(ctx, coffee.x, coffee.y, coffee.w, coffee.h + 5, 7, '#1f2730');
  round(ctx, coffee.x + 7, coffee.y + 7, coffee.w - 14, 12, 4, '#84b7bf');
  circle(ctx, coffee.x + coffee.w - 7, coffee.y + 9, 3.5, brewing ? GOLD : '#9aa2aa');
  round(ctx, coffee.x + 11, coffee.y + coffee.h - 1, 17, 14, 5, '#6f4e37');
  if (brewing) drawSteamLines(ctx, coffee.x + coffee.w / 2, coffee.y - 4, 3);
}

function drawKitchenTrashSprite(ctx, trash, state) {
  if (!trash) return;
  const level = state.garbage?.kitchen || 0;
  round(ctx, trash.x, trash.y, trash.w, trash.h, 7, level > 80 ? '#a26b5c' : '#8e968d');
  round(ctx, trash.x + 5, trash.y + 4, trash.w - 10, 8, 4, '#6f756e');
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
  ctx.translate(x, y);
  round(ctx, -24, -20, 48, 42, 12, CHAIR_DARK);
  round(ctx, -18, -14, 36, 28, 9, CHAIR_SEAT);
  round(ctx, -22, 15, 44, 10, 5, '#15232b');
  line(ctx, -18, 22, -28, 35, '#1c252b', 3);
  line(ctx, 18, 22, 28, 35, '#1c252b', 3);
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
  clearFloor(ctx, table.x - 62, table.y - 54, table.w + 124, table.h + 120, FLOOR);
  drawDiningChairPiece(ctx, table.x + 40, table.y - 34, 0, 'north west');
  drawDiningChairPiece(ctx, table.x + table.w - 40, table.y - 34, 0, 'north east');
  drawDiningChairPiece(ctx, table.x + 40, table.y + table.h + 34, Math.PI, 'south west');
  drawDiningChairPiece(ctx, table.x + table.w - 40, table.y + table.h + 34, Math.PI, 'south east');
  drawDiningChairPiece(ctx, table.x - 36, table.y + table.h / 2, -Math.PI / 2, 'west side');
  drawDiningChairPiece(ctx, table.x + table.w + 36, table.y + table.h / 2, Math.PI / 2, 'east side');
  drawDiningTablePiece(ctx, table);
  drawPlaceSetting(ctx, table.x + 38, table.y + table.h / 2);
  drawPlaceSetting(ctx, table.x + table.w - 38, table.y + table.h / 2);
  drawPlaceSetting(ctx, table.x + table.w / 2, table.y + 18);
  drawPlaceSetting(ctx, table.x + table.w / 2, table.y + table.h - 18);
  circle(ctx, table.x + table.w / 2, table.y + table.h / 2, 7, '#5f7c55');
  drawServedTablePlates(ctx, state, table);
}

function drawDiningTablePiece(ctx, table) {
  round(ctx, table.x - 5, table.y - 5, table.w + 10, table.h + 10, 13, TABLE_DARK);
  round(ctx, table.x + 6, table.y + 6, table.w - 12, table.h - 12, 10, TABLE_WOOD);
  line(ctx, table.x + 18, table.y + 18, table.x + table.w - 18, table.y + 14, 'rgba(255,255,255,.13)', 1.4);
  round(ctx, table.x + 12, table.y + table.h - 9, 18, 7, 3, 'rgba(40,28,18,.25)');
  round(ctx, table.x + table.w - 30, table.y + table.h - 9, 18, 7, 3, 'rgba(40,28,18,.25)');
}

function drawServedTablePlates(ctx, state, table) {
  const plates = (state.meals?.tablePlates || []).filter(p => p.floor === table.floor && p.tableId === table.id);
  for (const plate of plates) {
    circle(ctx, plate.x, plate.y, 12, '#efe7dc');
    circle(ctx, plate.x + 2, plate.y, 5, plate.food === 'snack' ? '#d59b5a' : '#b66d55');
    line(ctx, plate.x - 10, plate.y + 12, plate.x + 10, plate.y + 12, 'rgba(7,16,24,.24)', 1);
  }
}

function drawDiningChairPiece(ctx, x, y, rotation, _name) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  round(ctx, -18, -14, 36, 28, 9, CHAIR_DARK);
  round(ctx, -13, -10, 26, 19, 7, CHAIR_SEAT);
  round(ctx, -16, -20, 32, 9, 4, '#46545f');
  line(ctx, -13, 13, -19, 22, 'rgba(17,24,31,.45)', 2);
  line(ctx, 13, 13, 19, 22, 'rgba(17,24,31,.45)', 2);
  ctx.restore();
}

function drawPlaceSetting(ctx, x, y) {
  circle(ctx, x, y, 8, '#efe7dc');
  line(ctx, x - 13, y + 10, x + 13, y + 10, 'rgba(7,16,24,.23)', 1);
}

function drawSteamLines(ctx, x, y, count) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,.65)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < count; i += 1) {
    ctx.beginPath();
    ctx.moveTo(x - 9 + i * 9, y);
    ctx.quadraticCurveTo(x - 13 + i * 9, y - 10, x - 6 + i * 9, y - 20);
    ctx.stroke();
  }
  ctx.restore();
}

function hasAction(state, terms, floor = null) {
  const list = Array.isArray(terms) ? terms : [terms];
  return (state.entities || []).some(e => {
    if (e.hidden) return false;
    if (floor !== null && e.floor !== floor) return false;
    const action = String(e.action || '').toLowerCase();
    const pose = String(e.pose || '').toLowerCase();
    const current = String(e.currentActionId || '').toLowerCase();
    return list.some(term => action.includes(term) || pose.includes(term) || current.includes(term));
  });
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
