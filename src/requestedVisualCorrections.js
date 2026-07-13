import { floors, objects } from './world.js';

const INK = '#071018';
const CYAN = '#74e6ff';
const GOLD = '#f1c66a';
const WOOD = '#8b5f3b';
const FLOOR = '#d8c4a4';

export function drawRequestedVisualCorrections(ctx, state) {
  if (state.floor === 0) drawMainFloorCorrections(ctx, state);
  if (state.floor === 1) drawUpstairsCorrections(ctx, state);
  if (state.floor === 2) drawBasementCorrections(ctx, state);
}

export function drawRequestedAfterEntityVisualCorrections(ctx, state) {
  if (state.floor === 0) drawMainAfterEntityCues(ctx, state);
  if (state.floor === 1) drawUpstairsAfterEntityCues(ctx, state);
  if (state.floor === 2) drawBasementAfterEntityCues(ctx, state);
}

function drawMainFloorCorrections(ctx, state) {
  drawPorchLandAndChairs(ctx);
  drawLSectional(ctx, object('couch'));
  drawCleanFridge(ctx, state, object('fridge'));
  drawDiningSet(ctx, object('dining_table'), state);
  drawWallCoffeeMaker(ctx, object('coffee_maker'), state);
  drawBathroomSinkCue(ctx, object('bath_sink'), state);
  drawActiveShowerSteam(ctx, object('shower'), state);
  drawArchitecturalStairs(ctx, object('basement_door'), 'down');
  drawArchitecturalStairs(ctx, object('stairs_down'), 'up');
}

function drawUpstairsCorrections(ctx, state) {
  drawWalkInClosetAisles(ctx);
  drawBathroomSinkCue(ctx, object('bath2_sink'), state);
  drawActiveShowerSteam(ctx, object('shower2'), state);
  drawArchitecturalStairs(ctx, object('stairs_up'), 'down');
}

function drawBasementCorrections(ctx, state) {
  drawArchitecturalStairs(ctx, object('basement_stairs_up'), 'up');
  drawArcadeActivityLight(ctx, state);
}

function drawMainAfterEntityCues(ctx, state) {
  drawReadableBookInHands(ctx, state);
  drawActiveShowerSteam(ctx, object('shower'), state, true);
}

function drawUpstairsAfterEntityCues(ctx, state) {
  drawBedCoversOverSleepers(ctx, state);
  drawActiveShowerSteam(ctx, object('shower2'), state, true);
}

function drawBasementAfterEntityCues(ctx, state) {
  drawArcadeHandsCue(ctx, state);
}

function object(id) {
  return objects.find(o => o.id === id);
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

function drawPorchLandAndChairs(ctx) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, 96, 568, 52, 124, 10, '#567155');
  round(ctx, 496, 568, 72, 124, 10, '#567155');
  for (const [x, y] of [[122, 646], [532, 648], [116, 592], [542, 592]]) {
    circle(ctx, x, y, 3.5, '#e8d690');
    circle(ctx, x, y, 9, 'rgba(241,198,106,.18)');
  }
  drawPorchChair(ctx, 166, 612);
  drawPorchChair(ctx, 428, 612);
  round(ctx, 252, 579, 70, 22, 5, '#6b5540');
  round(ctx, 258, 584, 58, 11, 4, '#9b876f');
  ctx.restore();
}

function drawPorchChair(ctx, x, y) {
  ctx.save();
  round(ctx, x - 28, y - 21, 56, 52, 13, '#2a3540');
  round(ctx, x - 21, y - 14, 42, 34, 11, '#5f7482');
  round(ctx, x - 22, y - 26, 44, 13, 7, '#6f8290');
  line(ctx, x - 23, y + 22, x - 34, y + 34, '#59442f', 4);
  line(ctx, x + 23, y + 22, x + 34, y + 34, '#59442f', 4);
  ctx.restore();
}

function drawLSectional(ctx, couch) {
  if (!couch) return;
  const x = couch.x - 10;
  const y = couch.y - 18;
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, x - 3, y - 3, 252, 126, 23, 'rgba(35,40,47,.22)');
  round(ctx, x, y, 242, 84, 22, '#223846');
  round(ctx, x, y + 74, 104, 50, 22, '#223846');
  round(ctx, x + 10, y + 10, 70, 54, 16, '#4f7180');
  round(ctx, x + 86, y + 10, 70, 54, 16, '#537784');
  round(ctx, x + 162, y + 10, 62, 54, 16, '#496a78');
  round(ctx, x + 12, y + 82, 74, 30, 16, '#567987');
  round(ctx, x + 4, y + 58, 232, 20, 11, '#172832');
  round(ctx, x + 4, y + 8, 18, 102, 12, '#172832');
  round(ctx, x + 213, y + 8, 22, 66, 12, '#172832');
  line(ctx, x + 82, y + 13, x + 82, y + 63, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + 158, y + 13, x + 158, y + 63, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + 24, y + 76, x + 92, y + 76, 'rgba(255,255,255,.16)', 1.4);
  round(ctx, x + 186, y + 47, 34, 18, 9, '#8395a1');
  round(ctx, x + 38, y + 91, 28, 16, 8, '#798f9d');
  ctx.restore();
}

function drawDiningSet(ctx, table, state) {
  if (!table) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  const seats = [
    [table.x + 24, table.y - 20, 0], [table.x + table.w - 24, table.y - 20, 0],
    [table.x + 24, table.y + table.h + 20, Math.PI], [table.x + table.w - 24, table.y + table.h + 20, Math.PI],
    [table.x - 22, table.y + table.h / 2, -Math.PI / 2], [table.x + table.w + 22, table.y + table.h / 2, Math.PI / 2]
  ];
  for (const [x, y, r] of seats) drawDiningChair(ctx, x, y, r);
  round(ctx, table.x - 4, table.y - 3, table.w + 8, table.h + 6, 12, '#5a3826');
  round(ctx, table.x + 5, table.y + 5, table.w - 10, table.h - 10, 10, WOOD);
  line(ctx, table.x + 14, table.y + 17, table.x + table.w - 14, table.y + 13, 'rgba(255,255,255,.13)', 1.3);
  drawTableSetting(ctx, table.x + 28, table.y + table.h / 2);
  drawTableSetting(ctx, table.x + table.w - 28, table.y + table.h / 2);
  if (hasAction(state, ['eat', 'meal', 'table'], table.floor)) {
    circle(ctx, table.x + table.w / 2, table.y + table.h / 2, 14, '#efe7dc');
    circle(ctx, table.x + table.w / 2 + 2, table.y + table.h / 2, 6, '#b66d55');
  } else {
    circle(ctx, table.x + table.w / 2, table.y + table.h / 2, 10, '#647a54');
  }
  ctx.restore();
}

function drawDiningChair(ctx, x, y, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  round(ctx, -17, -13, 34, 26, 9, '#2c3540');
  round(ctx, -13, -9, 26, 18, 7, '#73808c');
  round(ctx, -15, -19, 30, 8, 4, '#45535f');
  ctx.restore();
}

function drawTableSetting(ctx, x, y) {
  circle(ctx, x, y, 9, '#efe7dc');
  line(ctx, x - 14, y + 10, x + 14, y + 10, 'rgba(7,16,24,.25)', 1);
}

function drawWallCoffeeMaker(ctx, coffee, state) {
  if (!coffee) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, coffee.x - 8, coffee.y - 10, coffee.w + 16, coffee.h + 24, 8, '#665241');
  round(ctx, coffee.x - 2, coffee.y - 2, coffee.w + 4, coffee.h + 6, 7, '#202833');
  round(ctx, coffee.x + 7, coffee.y + 8, coffee.w - 14, 13, 4, '#74a3ad');
  circle(ctx, coffee.x + coffee.w - 8, coffee.y + 9, 3.5, hasAction(state, 'coffee', coffee.floor) ? GOLD : '#9aa2aa');
  round(ctx, coffee.x + 13, coffee.y + coffee.h - 2, 17, 13, 5, '#6f4e37');
  if (hasAction(state, 'coffee', coffee.floor)) drawSteamLines(ctx, coffee.x + coffee.w / 2, coffee.y - 5, 3);
  ctx.restore();
}

function drawCleanFridge(ctx, state, fridge) {
  if (!fridge) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, fridge.x - 2, fridge.y - 2, fridge.w + 4, fridge.h + 4, 9, '#f5efe6');
  line(ctx, fridge.x + 8, fridge.y + fridge.h * .42, fridge.x + fridge.w - 8, fridge.y + fridge.h * .42, '#c9bdb2', 1.5);
  round(ctx, fridge.x + 9, fridge.y + 18, 8, 46, 4, '#9fcbd3');
  if (state.objectState?.fridgeOpen) {
    round(ctx, fridge.x + 8, fridge.y + fridge.h - 3, fridge.w - 16, 34, 6, '#fffdf6');
    line(ctx, fridge.x + 16, fridge.y + fridge.h + 8, fridge.x + fridge.w - 16, fridge.y + fridge.h + 8, '#d7cabe', 2);
  }
  ctx.restore();
}

function drawBathroomSinkCue(ctx, sink, state) {
  if (!sink) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, sink.x - 2, sink.y - 2, sink.w + 4, sink.h + 4, 9, '#73706c');
  round(ctx, sink.x + 5, sink.y + 5, sink.w - 10, sink.h - 10, 10, '#eef4f2');
  round(ctx, sink.x + 11, sink.y + 11, sink.w - 22, sink.h - 19, 9, '#a8d3db');
  circle(ctx, sink.x + sink.w / 2, sink.y + 13, 3, '#4e5964');
  line(ctx, sink.x + sink.w - 10, sink.y + 7, sink.x + sink.w - 2, sink.y + 1, '#cfd9dc', 2);
  if (hasAction(state, ['brush teeth', 'groom', 'sink'], sink.floor)) {
    drawSteamLines(ctx, sink.x + sink.w / 2, sink.y - 2, 2);
    line(ctx, sink.x + sink.w + 4, sink.y + sink.h + 4, sink.x + sink.w + 16, sink.y + sink.h - 6, GOLD, 2);
  }
  ctx.restore();
}

function drawActiveShowerSteam(ctx, shower, state, after = false) {
  if (!shower || !hasAction(state, ['shower'], shower.floor)) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  ctx.globalAlpha = after ? .55 : .32;
  for (let i = 0; i < 7; i++) {
    const t = performance.now() / 700 + i * .7;
    const x = shower.x + 14 + (i % 3) * 17 + Math.sin(t) * 5;
    const y = shower.y + 16 + i * 8 - (Math.sin(t * .7) + 1) * 6;
    smoke(ctx, x, y, 10 + (i % 3) * 4);
  }
  ctx.globalAlpha = 1;
  round(ctx, shower.x + 9, shower.y + 8, shower.w - 18, 8, 4, 'rgba(235,250,255,.45)');
  ctx.restore();
}

function drawArchitecturalStairs(ctx, stairs, direction = 'down') {
  if (!stairs) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, stairs.x - 7, stairs.y - 7, stairs.w + 14, stairs.h + 14, 12, '#5a5044');
  round(ctx, stairs.x + 3, stairs.y + 3, stairs.w - 6, stairs.h - 6, 8, '#b7a384');
  const steps = Math.max(5, Math.floor(stairs.h / 14));
  for (let i = 0; i < steps; i++) {
    const p = i / Math.max(1, steps - 1);
    const y = stairs.y + 10 + i * ((stairs.h - 20) / steps);
    const alpha = direction === 'down' ? .18 + p * .56 : .58 - p * .34;
    round(ctx, stairs.x + 13, y, stairs.w - 26, Math.max(6, (stairs.h - 20) / steps - 1), 3, `rgba(15,18,21,${alpha})`);
    line(ctx, stairs.x + 16, y + 2, stairs.x + stairs.w - 16, y + 2, 'rgba(255,255,255,.20)', 1);
  }
  const darkY = direction === 'down' ? stairs.y + stairs.h - 20 : stairs.y + 8;
  round(ctx, stairs.x + 20, darkY, stairs.w - 40, 15, 6, 'rgba(4,7,10,.76)');
  line(ctx, stairs.x + 8, stairs.y + 8, stairs.x + 8, stairs.y + stairs.h - 8, '#e1d2b7', 3);
  line(ctx, stairs.x + stairs.w - 8, stairs.y + 8, stairs.x + stairs.w - 8, stairs.y + stairs.h - 8, '#463a2f', 3);
  ctx.restore();
}

function drawWalkInClosetAisles(ctx) {
  const closet = floors[1]?.rooms.find(r => r.id === 'walkin_closet');
  if (!closet) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, closet.x + 8, closet.y + 10, closet.w - 16, closet.h - 18, 8, 'rgba(55,47,41,.45)');
  drawClosetRack(ctx, closet.x + 14, closet.y + 20, 34, closet.h - 36, true);
  drawClosetRack(ctx, closet.x + closet.w - 48, closet.y + 20, 34, closet.h - 36, false);
  round(ctx, closet.x + 58, closet.y + 48, 40, 46, 8, '#8b7358');
  circle(ctx, closet.x + 78, closet.y + 70, 8, '#647a54');
  ctx.restore();
}

function drawClosetRack(ctx, x, y, w, h, left) {
  round(ctx, x, y, w, h, 7, '#2b2f34');
  for (let i = 0; i < 6; i++) {
    const py = y + 10 + i * ((h - 20) / 6);
    const color = ['#24324a', '#3a2438', '#5d4b36', '#1b2630', '#6f5947', '#2f4858'][i % 6];
    round(ctx, x + 7, py, w - 14, 8, 3, color);
  }
  line(ctx, left ? x + w + 4 : x - 4, y + 4, left ? x + w + 4 : x - 4, y + h - 4, '#d8c4a4', 1.5);
}

function drawArcadeActivityLight(ctx, state) {
  const arcade = object('arcade_machine');
  if (!arcade || !hasAction(state, ['arcade'], arcade.floor)) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  const pulse = .18 + Math.abs(Math.sin(performance.now() / 220)) * .22;
  ctx.globalAlpha = pulse;
  ctx.fillStyle = CYAN;
  ctx.beginPath();
  ctx.moveTo(arcade.x - 16, arcade.y + arcade.h + 4);
  ctx.lineTo(arcade.x + arcade.w + 16, arcade.y + arcade.h + 4);
  ctx.lineTo(arcade.x + arcade.w + 54, arcade.y + arcade.h + 116);
  ctx.lineTo(arcade.x - 54, arcade.y + arcade.h + 116);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawReadableBookInHands(ctx, state) {
  for (const e of activeActors(state, ['reading book', 'read_carried_book'])) {
    ctx.save();
    ctx.shadowColor = 'transparent';
    ctx.translate(e.x, e.y + 18);
    round(ctx, -18, -7, 36, 15, 3, '#efe7dc');
    line(ctx, 0, -6, 0, 7, '#8b6f53', 1);
    line(ctx, -13, -1, -4, -1, 'rgba(7,16,24,.35)', 1);
    line(ctx, 5, -1, 14, -1, 'rgba(7,16,24,.35)', 1);
    ctx.restore();
  }
}

function drawBedCoversOverSleepers(ctx, state) {
  const bed = object('bed');
  if (!bed || !hasAction(state, ['sleep', 'nap', 'bed together', 'waking'], bed.floor)) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, bed.x + 104, bed.y + 24, bed.w - 126, bed.h / 2 - 24, 14, 'rgba(96,113,143,.94)');
  round(ctx, bed.x + 104, bed.y + bed.h / 2 + 10, bed.w - 126, bed.h / 2 - 26, 14, 'rgba(159,107,142,.94)');
  line(ctx, bed.x + 116, bed.y + 42, bed.x + bed.w - 32, bed.y + 36, 'rgba(255,255,255,.18)', 2);
  line(ctx, bed.x + 116, bed.y + bed.h - 44, bed.x + bed.w - 36, bed.y + bed.h - 52, 'rgba(255,255,255,.18)', 2);
  ctx.restore();
}

function drawArcadeHandsCue(ctx, state) {
  const actors = activeActors(state, ['arcade']);
  if (!actors.length) return;
  for (const e of actors) {
    ctx.save();
    ctx.shadowColor = 'transparent';
    ctx.translate(e.x, e.y - 18);
    const tap = Math.sin(performance.now() / 95) * 3;
    line(ctx, -11, 0, -23, -18 + tap, '#111820', 5);
    line(ctx, 11, 0, 23, -18 - tap, '#111820', 5);
    circle(ctx, -24, -19 + tap, 4, CYAN);
    circle(ctx, 24, -19 - tap, 4, GOLD);
    ctx.restore();
  }
}

function drawSteamLines(ctx, x, y, count) {
  ctx.save();
  ctx.strokeStyle = 'rgba(245,250,255,.72)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < count; i++) {
    const sx = x - 9 + i * 9;
    ctx.beginPath();
    ctx.moveTo(sx, y + 12);
    ctx.quadraticCurveTo(sx - 7, y + 3, sx + 2, y - 8);
    ctx.quadraticCurveTo(sx + 10, y - 17, sx + 1, y - 25);
    ctx.stroke();
  }
  ctx.restore();
}

function smoke(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239,248,255,.50)';
  ctx.fill();
}

function round(ctx, x, y, w, h, r, color) {
  if (color) ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fill();
}

function circle(ctx, x, y, r, color) {
  if (color) ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
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
