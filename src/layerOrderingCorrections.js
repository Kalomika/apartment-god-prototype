const FLOOR = '#d8c4a4';
const FLOOR_LINE = 'rgba(124,103,75,.15)';
const TABLE_DARK = '#4d3326';
const TABLE_WOOD = '#8b5f3b';
const CABINET = '#70523c';
const COUNTER_TOP = '#d8c7ad';
const CYAN = '#74e6ff';
const GOLD = '#f1c66a';

export function drawLayerOrderingCorrections(ctx, state) {
  if (state.floor !== 0) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  drawCorrectedKitchenStack(ctx, state);
  drawLivingCoffeeTableTop(ctx);
  ctx.restore();
}

function drawCorrectedKitchenStack(ctx, state) {
  clearFloor(ctx, 472, 58, 308, 238, FLOOR, FLOOR_LINE);
  drawCounterRun(ctx);
  drawFridge(ctx, state);
  drawStove(ctx, state);
  drawStraightSink(ctx, state);
  drawCoffeeMaker(ctx, state);
  drawTrash(ctx, state);
}

function drawCounterRun(ctx) {
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

function drawFridge(ctx, state) {
  const x = 486, y = 70, w = 70, h = 88;
  round(ctx, x - 3, y - 3, w + 6, h + 6, 10, '#f5efe6');
  round(ctx, x + 6, y + 7, w - 12, h - 14, 7, '#eee7dd');
  line(ctx, x + 8, y + h * .46, x + w - 8, y + h * .46, '#c9bdb2', 1.5);
  round(ctx, x + 10, y + 18, 7, 48, 4, '#9fcbd3');
  if (state.objectState?.fridgeOpen) {
    round(ctx, x + 22, y + 18, w - 31, h - 32, 6, '#fffdf6');
    line(ctx, x + 28, y + 34, x + w - 14, y + 34, '#d7cabe', 1.5);
    line(ctx, x + 28, y + 54, x + w - 14, y + 54, '#d7cabe', 1.5);
  }
}

function drawStove(ctx, state) {
  const x = 598, y = 70, w = 72, h = 64;
  round(ctx, x, y, w, h, 8, '#b9b4aa');
  round(ctx, x + 5, y + 5, w - 10, 12, 5, '#8f897f');
  for (let i = 0; i < 4; i += 1) circle(ctx, x + 19 + (i % 2) * 34, y + 28 + Math.floor(i / 2) * 22, 8, '#655f59');
  if (state.objectState?.stovePan) {
    circle(ctx, x + 38, y + 39, 15, '#3c3835');
    line(ctx, x + 51, y + 38, x + 72, y + 32, '#3c3835', 3);
  }
}

function drawStraightSink(ctx, state) {
  const x = 650, y = 94, w = 64, h = 40;
  round(ctx, x - 3, y - 3, w + 6, h + 6, 10, '#73706c');
  round(ctx, x + 6, y + 6, w - 12, h - 12, 9, '#eef4f2');
  round(ctx, x + 16, y + 12, w - 32, h - 22, 8, '#a8d3db');
  circle(ctx, x + w / 2, y + 11, 3, '#4e5964');
  line(ctx, x + w / 2 + 12, y + 8, x + w / 2 + 22, y - 2, '#cfd9dc', 2);
  if (hasAction(state, ['brush', 'groom', 'wash hands', 'sink'], 0)) drawSteamLines(ctx, x + w / 2, y - 4, 3);
}

function drawCoffeeMaker(ctx, state) {
  const x = 724, y = 172, w = 38, h = 34;
  const brewing = hasAction(state, 'coffee', 0);
  round(ctx, x - 7, y - 6, w + 14, h + 16, 8, '#5d4a3a');
  round(ctx, x, y, w, h + 5, 7, '#1f2730');
  round(ctx, x + 7, y + 7, w - 14, 12, 4, '#84b7bf');
  circle(ctx, x + w - 7, y + 9, 3.5, brewing ? GOLD : '#9aa2aa');
  round(ctx, x + 11, y + h - 1, 17, 14, 5, '#6f4e37');
  if (brewing) drawSteamLines(ctx, x + w / 2, y - 4, 3);
}

function drawTrash(ctx, state) {
  const x = 728, y = 238, w = 34, h = 42;
  const level = state.garbage?.kitchen || 0;
  round(ctx, x, y, w, h, 7, level > 80 ? '#a26b5c' : '#8e968d');
  round(ctx, x + 5, y + 4, w - 10, 8, 4, '#6f756e');
}

function drawLivingCoffeeTableTop(ctx) {
  const x = 190, y = 150, w = 128, h = 48;
  clearFloor(ctx, x - 10, y - 10, w + 20, h + 20, FLOOR, FLOOR_LINE);
  round(ctx, x - 5, y - 5, w + 10, h + 10, 14, 'rgba(74,53,35,.18)');
  round(ctx, x, y, w, h, 12, '#5b3b29');
  round(ctx, x + 10, y + 8, w - 20, h - 16, 9, '#9a7048');
  line(ctx, x + 18, y + 17, x + w - 18, y + 13, 'rgba(255,255,255,.14)', 1.4);
  circle(ctx, x + 30, y + h / 2, 6, '#efe7dc');
  round(ctx, x + w - 42, y + h / 2 - 7, 28, 14, 5, '#1f2730');
  round(ctx, x + w - 38, y + h / 2 - 4, 20, 8, 3, '#74a9b4');
}

function hasAction(state, terms, floor = null) {
  const list = Array.isArray(terms) ? terms : [terms];
  return (state.entities || []).some(e => {
    if (e.hidden) return false;
    if (floor !== null && e.floor !== floor) return false;
    const action = String(e.action || '').toLowerCase();
    return list.some(term => action.includes(term));
  });
}

function clearFloor(ctx, x, y, w, h, fill = FLOOR, lineColor = FLOOR_LINE) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  for (let yy = y + 10; yy < y + h; yy += 12) line(ctx, x, yy, x + w, yy, lineColor, .7);
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

function round(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fill();
}

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}
