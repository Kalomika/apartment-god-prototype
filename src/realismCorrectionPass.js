import { floors, objects } from './world.js';

const INK = '#071018';
const GOLD = '#f1c66a';
const CYAN = '#74e6ff';
const WOOD = '#8b5f3b';
const FLOOR_MAIN = '#d8c4a4';
const FLOOR_UP = '#d4c2a4';
const GRASS = '#536f52';

export function applyRealismRuntimeCorrections(state) {
  if (state.realismCorrectionPassVersion === 2) return;
  state.realismCorrectionPassVersion = 2;
  setObject('couch', { x: 96, y: 184, w: 238, h: 124, facing: 'up', enterable: true });
  setObject('dining_table', { x: 494, y: 286, w: 196, h: 62 });
  setObject('coffee_maker', { x: 720, y: 72, w: 44, h: 32 });
  setObject('bookshelf', { x: 42, y: 72, w: 58, h: 150, room: 'living' });
  setObject('car_1', { w: 136, h: 252 });
  setObject('car_2', { x: 512, w: 110, h: 228 });
  setObject('arcade_machine', { x: 420, y: 72, w: 58, h: 82 });
}

function setObject(id, patch) {
  const obj = objects.find(o => o.id === id);
  if (obj) Object.assign(obj, patch);
}

function object(id) {
  return objects.find(o => o.id === id);
}

export function drawRealismCorrections(ctx, state) {
  if (state.floor === 0) drawMainRealism(ctx, state);
  if (state.floor === 1) drawUpstairsRealism(ctx, state);
  if (state.floor === 2) drawBasementRealism(ctx, state);
}

export function drawRealismAfterEntityCorrections(ctx, state) {
  if (state.floor === 0) {
    drawReadableBookInHands(ctx, state);
    drawMainShowerAfter(ctx, state);
  }
  if (state.floor === 1) {
    drawBedBlanketsOverActors(ctx, state);
    drawUpstairsShowerAfter(ctx, state);
  }
  if (state.floor === 2) drawArcadeAfterEntity(ctx, state);
}

function drawMainRealism(ctx, state) {
  drawPorchLandAndReadableChairs(ctx);
  drawLivingSectional(ctx, object('couch'));
  drawCleanFridgeSingleOpen(ctx, object('fridge'), state);
  drawWallCoffeeMaker(ctx, object('coffee_maker'), state);
  drawDiningTableAndChairs(ctx, object('dining_table'), state);
  drawSinkWithUseCue(ctx, object('sink'), state);
  drawSinkWithUseCue(ctx, object('bath_sink'), state);
  drawGlassShowerAndSteam(ctx, object('shower'), state);
  drawArchitecturalStairWell(ctx, object('basement_door'), 'down');
  drawArchitecturalStairWell(ctx, object('stairs_down'), 'up');
}

function drawUpstairsRealism(ctx, state) {
  drawWalkInClosetRows(ctx);
  drawPrimaryBedScale(ctx, state);
  drawSinkWithUseCue(ctx, object('bath2_sink'), state);
  drawSinkWithUseCue(ctx, object('master_bath_sink'), state);
  drawGlassShowerAndSteam(ctx, object('shower2'), state);
  drawGlassShowerAndSteam(ctx, object('master_shower'), state);
  drawArchitecturalStairWell(ctx, object('stairs_up'), 'down');
}

function drawBasementRealism(ctx, state) {
  drawArchitecturalStairWell(ctx, object('basement_stairs_up'), 'up');
  drawArcadeStationRealism(ctx, state);
}

function drawPorchLandAndReadableChairs(ctx) {
  ctx.save();
  round(ctx, 86, 558, 62, 142, 10, GRASS);
  round(ctx, 492, 558, 92, 142, 10, GRASS);
  round(ctx, 138, 628, 64, 50, 13, 'rgba(35,42,48,.35)');
  round(ctx, 414, 628, 64, 50, 13, 'rgba(35,42,48,.35)');
  drawOutdoorChairFacingAway(ctx, 170, 650);
  drawOutdoorChairFacingAway(ctx, 446, 650);
  drawSideTable(ctx, 252, 608);
  drawSideTable(ctx, 342, 608);
  ctx.restore();
}

function drawOutdoorChairFacingAway(ctx, x, y) {
  ctx.save();
  round(ctx, x - 27, y - 23, 54, 46, 14, '#24313b');
  round(ctx, x - 20, y - 16, 40, 28, 10, '#5f7884');
  round(ctx, x - 25, y + 13, 50, 12, 6, '#16252d');
  line(ctx, x - 21, y + 19, x - 30, y + 34, '#5f4a36', 3);
  line(ctx, x + 21, y + 19, x + 30, y + 34, '#5f4a36', 3);
  ctx.restore();
}

function drawSideTable(ctx, x, y) {
  round(ctx, x - 18, y - 12, 36, 24, 8, '#6f513a');
  round(ctx, x - 13, y - 8, 26, 14, 6, '#a48665');
}

function drawLivingSectional(ctx, couch) {
  if (!couch) return;
  const x = couch.x;
  const y = couch.y;
  ctx.save();
  clearPad(ctx, x - 26, y - 20, couch.w + 52, couch.h + 46, FLOOR_MAIN);
  round(ctx, x - 5, y + 5, couch.w + 10, couch.h + 14, 27, 'rgba(0,0,0,.20)');
  round(ctx, x, y, couch.w, 78, 25, '#263f48');
  round(ctx, x + couch.w - 84, y + 58, 84, 68, 25, '#263f48');
  round(ctx, x + 14, y + 12, 62, 48, 16, '#5f828c');
  round(ctx, x + 82, y + 12, 62, 48, 16, '#6a8d96');
  round(ctx, x + 150, y + 12, 58, 48, 16, '#587b86');
  round(ctx, x + couch.w - 72, y + 66, 52, 44, 18, '#628793');
  round(ctx, x + 5, y + 58, couch.w - 10, 26, 13, '#172934');
  round(ctx, x + couch.w - 86, y + 58, 26, 64, 13, '#172934');
  line(ctx, x + 78, y + 17, x + 78, y + 57, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + 146, y + 17, x + 146, y + 57, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + couch.w - 72, y + 84, x + couch.w - 22, y + 84, 'rgba(255,255,255,.18)', 1.5);
  round(ctx, x + 18, y + 62, couch.w - 40, 10, 6, 'rgba(7,16,24,.35)');
  ctx.restore();
}

function drawDiningTableAndChairs(ctx, table, state) {
  if (!table) return;
  ctx.save();
  clearPad(ctx, table.x - 48, table.y - 34, table.w + 96, table.h + 70, FLOOR_MAIN);
  const seats = [
    [table.x + 34, table.y - 24, 0], [table.x + table.w - 34, table.y - 24, 0],
    [table.x + 34, table.y + table.h + 24, Math.PI], [table.x + table.w - 34, table.y + table.h + 24, Math.PI],
    [table.x - 28, table.y + table.h / 2, -Math.PI / 2], [table.x + table.w + 28, table.y + table.h / 2, Math.PI / 2]
  ];
  for (const seat of seats) drawDiningChair(ctx, ...seat);
  round(ctx, table.x - 5, table.y - 4, table.w + 10, table.h + 8, 13, '#4d3326');
  round(ctx, table.x + 6, table.y + 6, table.w - 12, table.h - 12, 10, WOOD);
  line(ctx, table.x + 16, table.y + 18, table.x + table.w - 16, table.y + 14, 'rgba(255,255,255,.15)', 1.4);
  drawPlaceSetting(ctx, table.x + 36, table.y + table.h / 2);
  drawPlaceSetting(ctx, table.x + table.w - 36, table.y + table.h / 2);
  drawPlaceSetting(ctx, table.x + table.w / 2, table.y + 18);
  drawPlaceSetting(ctx, table.x + table.w / 2, table.y + table.h - 18);
  if (hasAction(state, ['eat', 'meal', 'table'], table.floor)) {
    circle(ctx, table.x + table.w / 2, table.y + table.h / 2, 14, '#efe7dc');
    circle(ctx, table.x + table.w / 2 + 2, table.y + table.h / 2, 6, '#b66d55');
  }
  ctx.restore();
}

function drawDiningChair(ctx, x, y, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  round(ctx, -18, -14, 36, 28, 9, '#26313b');
  round(ctx, -13, -10, 26, 19, 7, '#78848e');
  round(ctx, -16, -20, 32, 9, 4, '#46545f');
  ctx.restore();
}

function drawPlaceSetting(ctx, x, y) {
  circle(ctx, x, y, 8, '#efe7dc');
  line(ctx, x - 13, y + 10, x + 13, y + 10, 'rgba(7,16,24,.23)', 1);
}

function drawWallCoffeeMaker(ctx, coffee, state) {
  if (!coffee) return;
  ctx.save();
  clearPad(ctx, coffee.x - 18, coffee.y - 18, coffee.w + 36, coffee.h + 44, FLOOR_MAIN);
  round(ctx, coffee.x - 10, coffee.y - 9, coffee.w + 20, coffee.h + 26, 8, '#5d4a3a');
  round(ctx, coffee.x - 2, coffee.y - 1, coffee.w + 4, coffee.h + 8, 7, '#1f2730');
  round(ctx, coffee.x + 7, coffee.y + 7, coffee.w - 14, 12, 4, '#84b7bf');
  circle(ctx, coffee.x + coffee.w - 8, coffee.y + 9, 3.5, hasAction(state, 'coffee', coffee.floor) ? GOLD : '#9aa2aa');
  round(ctx, coffee.x + 14, coffee.y + coffee.h - 1, 18, 14, 5, '#6f4e37');
  if (hasAction(state, 'coffee', coffee.floor)) drawSteamLines(ctx, coffee.x + coffee.w / 2, coffee.y - 4, 3);
  ctx.restore();
}

function drawCleanFridgeSingleOpen(ctx, fridge, state) {
  if (!fridge) return;
  ctx.save();
  clearPad(ctx, fridge.x - 8, fridge.y - 8, fridge.w + 16, fridge.h + 48, FLOOR_MAIN);
  round(ctx, fridge.x - 3, fridge.y - 3, fridge.w + 6, fridge.h + 6, 10, '#f5efe6');
  round(ctx, fridge.x + 6, fridge.y + 7, fridge.w - 12, fridge.h - 14, 7, '#eee7dd');
  line(ctx, fridge.x + 8, fridge.y + fridge.h * .46, fridge.x + fridge.w - 8, fridge.y + fridge.h * .46, '#c9bdb2', 1.5);
  round(ctx, fridge.x + 10, fridge.y + 18, 7, 48, 4, '#9fcbd3');
  if (state.objectState?.fridgeOpen) {
    round(ctx, fridge.x + 22, fridge.y + 18, fridge.w - 31, fridge.h - 32, 6, '#fffdf6');
    line(ctx, fridge.x + 28, fridge.y + 34, fridge.x + fridge.w - 14, fridge.y + 34, '#d7cabe', 1.5);
    line(ctx, fridge.x + 28, fridge.y + 54, fridge.x + fridge.w - 14, fridge.y + 54, '#d7cabe', 1.5);
  }
  ctx.restore();
}

function drawSinkWithUseCue(ctx, sink, state) {
  if (!sink) return;
  ctx.save();
  round(ctx, sink.x - 2, sink.y - 2, sink.w + 4, sink.h + 4, 9, '#73706c');
  round(ctx, sink.x + 5, sink.y + 5, sink.w - 10, sink.h - 10, 10, '#eef4f2');
  round(ctx, sink.x + 11, sink.y + 11, sink.w - 22, sink.h - 19, 9, '#a8d3db');
  circle(ctx, sink.x + sink.w / 2, sink.y + 13, 3, '#4e5964');
  line(ctx, sink.x + sink.w - 10, sink.y + 7, sink.x + sink.w - 2, sink.y + 1, '#cfd9dc', 2);
  if (hasAction(state, ['brush', 'groom', 'wash hands', 'sink'], sink.floor)) {
    drawSteamLines(ctx, sink.x + sink.w / 2, sink.y - 2, 3);
    line(ctx, sink.x + sink.w + 4, sink.y + sink.h + 4, sink.x + sink.w + 16, sink.y + sink.h - 6, GOLD, 2);
  }
  ctx.restore();
}

function drawGlassShowerAndSteam(ctx, shower, state) {
  if (!shower) return;
  const active = hasAction(state, ['shower'], shower.floor);
  ctx.save();
  round(ctx, shower.x - 3, shower.y - 3, shower.w + 6, shower.h + 6, 11, 'rgba(16,22,31,.88)');
  round(ctx, shower.x + 6, shower.y + 8, shower.w - 12, shower.h - 16, 8, 'rgba(128,185,194,.45)');
  const slide = active ? 12 + Math.sin(performance.now() / 120) * 4 : 0;
  round(ctx, shower.x + shower.w - 27 - slide, shower.y + 8, 22, shower.h - 16, 6, 'rgba(231,244,247,.80)');
  if (active) drawSteamCloud(ctx, shower.x + shower.w / 2, shower.y + shower.h / 2, 8);
  ctx.restore();
}

function drawMainShowerAfter(ctx, state) {
  const shower = object('shower');
  if (shower && hasAction(state, ['shower'], shower.floor)) drawFoldedClothesAndTowel(ctx, shower.x + shower.w + 23, shower.y + shower.h - 8, false);
}

function drawUpstairsShowerAfter(ctx, state) {
  for (const id of ['shower2', 'master_shower']) {
    const shower = object(id);
    if (shower && hasAction(state, ['shower'], shower.floor)) drawFoldedClothesAndTowel(ctx, shower.x + shower.w + 20, shower.y + shower.h - 4, true);
  }
}

function drawFoldedClothesAndTowel(ctx, x, y, female) {
  ctx.save();
  round(ctx, x - 12, y - 7, 26, 12, 5, female ? '#4c2b4c' : '#1b2630');
  line(ctx, x - 7, y - 2, x + 8, y - 2, 'rgba(255,255,255,.20)', 1);
  round(ctx, x + 7, y + 5, 24, 10, 5, female ? '#f4b5dd' : '#a8e9ff');
  line(ctx, x + 12, y + 9, x + 26, y + 9, 'rgba(7,16,24,.35)', 1);
  round(ctx, x - 17, y + 6, 15, 8, 4, '#05070a');
  ctx.restore();
}

function drawArchitecturalStairWell(ctx, stairs, direction) {
  if (!stairs) return;
  ctx.save();
  round(ctx, stairs.x - 10, stairs.y - 10, stairs.w + 20, stairs.h + 20, 12, '#5b5145');
  round(ctx, stairs.x + 1, stairs.y + 1, stairs.w - 2, stairs.h - 2, 8, '#b7a384');
  const steps = Math.max(6, Math.floor(stairs.h / 13));
  for (let i = 0; i < steps; i++) {
    const p = i / Math.max(1, steps - 1);
    const y = stairs.y + 9 + i * ((stairs.h - 18) / steps);
    const alpha = direction === 'down' ? .18 + p * .62 : .60 - p * .38;
    round(ctx, stairs.x + 12, y, stairs.w - 24, Math.max(5, (stairs.h - 18) / steps - 1), 3, `rgba(12,15,18,${alpha})`);
    line(ctx, stairs.x + 16, y + 2, stairs.x + stairs.w - 16, y + 2, 'rgba(255,255,255,.22)', 1);
  }
  const darkY = direction === 'down' ? stairs.y + stairs.h - 22 : stairs.y + 8;
  round(ctx, stairs.x + 20, darkY, stairs.w - 40, 17, 6, 'rgba(4,7,10,.80)');
  ctx.restore();
}

function drawWalkInClosetRows(ctx) {
  const closet = floors[1]?.rooms.find(r => r.id === 'walkin_closet');
  if (!closet) return;
  ctx.save();
  round(ctx, closet.x + 8, closet.y + 10, closet.w - 16, closet.h - 18, 8, 'rgba(55,47,41,.55)');
  drawClosetRack(ctx, closet.x + 14, closet.y + 20, 38, closet.h - 36, true);
  drawClosetRack(ctx, closet.x + closet.w - 52, closet.y + 20, 38, closet.h - 36, false);
  round(ctx, closet.x + 66, closet.y + 42, 42, 58, 8, '#8b7358');
  circle(ctx, closet.x + 86, closet.y + 70, 8, '#647a54');
  ctx.restore();
}

function drawClosetRack(ctx, x, y, w, h, left) {
  round(ctx, x, y, w, h, 7, '#20262c');
  for (let i = 0; i < 8; i++) {
    const py = y + 9 + i * ((h - 18) / 8);
    const color = ['#24324a', '#3a2438', '#5d4b36', '#1b2630', '#6f5947', '#2f4858', '#7d6f63', '#26526f'][i % 8];
    round(ctx, x + 7, py, w - 14, 7, 3, color);
  }
  line(ctx, left ? x + w + 4 : x - 4, y + 4, left ? x + w + 4 : x - 4, y + h - 4, '#d8c4a4', 1.5);
}

function drawPrimaryBedScale(ctx, state) {
  const bed = object('bed');
  if (!bed) return;
  ctx.save();
  round(ctx, bed.x - 4, bed.y - 4, bed.w + 8, bed.h + 8, 17, '#6f5947');
  round(ctx, bed.x + 6, bed.y + 10, 34, bed.h - 20, 12, '#7f654f');
  round(ctx, bed.x + 32, bed.y + 12, bed.w - 42, bed.h - 24, 15, '#c8b7a1');
  round(ctx, bed.x + 46, bed.y + 20, 48, 38, 12, '#fffaf2');
  round(ctx, bed.x + 46, bed.y + bed.h - 58, 48, 38, 12, '#fffaf2');
  if (!hasAction(state, ['sleep', 'nap', 'waking', 'bed together'], bed.floor)) {
    round(ctx, bed.x + 104, bed.y + 18, bed.w - 122, bed.h / 2 - 25, 13, '#60718f');
    round(ctx, bed.x + 104, bed.y + bed.h / 2 + 8, bed.w - 122, bed.h / 2 - 25, 13, '#9f6b8e');
  }
  ctx.restore();
}

function drawBedBlanketsOverActors(ctx, state) {
  const bed = object('bed');
  if (!bed || !hasAction(state, ['sleep', 'nap', 'bed together', 'waking'], bed.floor)) return;
  ctx.save();
  round(ctx, bed.x + 96, bed.y + 20, bed.w - 110, bed.h / 2 - 22, 14, 'rgba(96,113,143,.98)');
  round(ctx, bed.x + 96, bed.y + bed.h / 2 + 7, bed.w - 110, bed.h / 2 - 22, 14, 'rgba(159,107,142,.98)');
  line(ctx, bed.x + 110, bed.y + 37, bed.x + bed.w - 28, bed.y + 32, 'rgba(255,255,255,.20)', 2);
  line(ctx, bed.x + 110, bed.y + bed.h - 39, bed.x + bed.w - 32, bed.y + bed.h - 47, 'rgba(255,255,255,.20)', 2);
  ctx.restore();
}

function drawArcadeStationRealism(ctx, state) {
  const arcade = object('arcade_machine');
  if (!arcade) return;
  ctx.save();
  round(ctx, arcade.x - 4, arcade.y - 5, arcade.w + 8, arcade.h + 10, 10, '#22242b');
  round(ctx, arcade.x + 8, arcade.y + 8, arcade.w - 16, 20, 5, '#8fbfbd');
  round(ctx, arcade.x + 10, arcade.y + 43, arcade.w - 20, 20, 8, '#2b1014');
  if (hasAction(state, ['arcade'], arcade.floor)) drawArcadeGlow(ctx, arcade);
  ctx.restore();
}

function drawArcadeGlow(ctx, arcade) {
  ctx.save();
  ctx.globalAlpha = .20 + Math.abs(Math.sin(performance.now() / 210)) * .20;
  ctx.fillStyle = CYAN;
  ctx.beginPath();
  ctx.moveTo(arcade.x - 18, arcade.y + arcade.h + 2);
  ctx.lineTo(arcade.x + arcade.w + 18, arcade.y + arcade.h + 2);
  ctx.lineTo(arcade.x + arcade.w + 48, arcade.y + arcade.h + 108);
  ctx.lineTo(arcade.x - 48, arcade.y + arcade.h + 108);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawArcadeAfterEntity(ctx, state) {
  for (const e of activeActors(state, ['arcade'])) {
    ctx.save();
    const t = Math.sin(performance.now() / 90) * 3;
    ctx.translate(e.x, e.y - 18);
    line(ctx, -10, 0, -23, -18 + t, '#111820', 5);
    line(ctx, 10, 0, 23, -18 - t, '#111820', 5);
    circle(ctx, -24, -19 + t, 4, CYAN);
    circle(ctx, 24, -19 - t, 4, GOLD);
    ctx.restore();
  }
}

function drawReadableBookInHands(ctx, state) {
  for (const e of activeActors(state, ['reading book', 'read_carried_book', 'read book'])) {
    ctx.save();
    ctx.translate(e.x, e.y + 16);
    round(ctx, -19, -8, 38, 16, 3, '#efe7dc');
    line(ctx, 0, -7, 0, 7, '#8b6f53', 1);
    line(ctx, -14, -1, -4, -1, 'rgba(7,16,24,.38)', 1);
    line(ctx, 5, -1, 15, -1, 'rgba(7,16,24,.38)', 1);
    ctx.restore();
  }
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

function activeActors(state, terms, floor = state.floor) {
  const list = Array.isArray(terms) ? terms : [terms];
  return (state.entities || []).filter(e => {
    if (e.hidden || e.floor !== floor) return false;
    const action = String(e.action || '').toLowerCase();
    const pose = String(e.pose || '').toLowerCase();
    return list.some(term => action.includes(term) || pose.includes(term));
  });
}

function clearPad(ctx, x, y, w, h, color) {
  ctx.save();
  ctx.globalAlpha = .98;
  round(ctx, x, y, w, h, 0, color);
  ctx.restore();
}

function drawSteamCloud(ctx, x, y, count) {
  ctx.save();
  ctx.globalAlpha = .48;
  for (let i = 0; i < count; i++) {
    const t = performance.now() / 520 + i * .6;
    smoke(ctx, x - 18 + (i % 4) * 12 + Math.sin(t) * 5, y + 26 - i * 7 - Math.cos(t * .7) * 5, 9 + (i % 3) * 4);
  }
  ctx.restore();
}

function drawSteamLines(ctx, x, y, count) {
  ctx.save();
  ctx.strokeStyle = 'rgba(245,250,255,.72)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < count; i++) {
    const sx = x - 9 + i * 9;
    ctx.beginPath();
    ctx.moveTo(sx, y + 10);
    ctx.bezierCurveTo(sx - 4, y + 1, sx + 5, y - 5, sx, y - 14);
    ctx.stroke();
  }
  ctx.restore();
}

function smoke(ctx, x, y, r) {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * .62, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(235,250,255,.75)';
  ctx.fill();
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
