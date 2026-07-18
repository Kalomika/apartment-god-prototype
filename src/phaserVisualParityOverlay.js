import { getObject, objects } from './world.js';

const FLOOR = '#d8c4a4';
const FLOOR_LINE = 'rgba(124,103,75,.15)';

export function installPhaserVisualParityOverlay(game) {
  if (!game) return;
  const timer = window.setInterval(() => {
    const scene = game.scene?.getScene?.('ApartmentGodParityScene');
    if (!scene?.state || !scene.environmentContext || !scene.environmentTexture) return;
    window.clearInterval(timer);
    attachOverlay(scene);
  }, 40);
  window.setTimeout(() => window.clearInterval(timer), 12000);
}

function attachOverlay(scene) {
  if (scene.__apartmentGodVisualParityOverlayInstalled) return;
  scene.__apartmentGodVisualParityOverlayInstalled = true;
  scene.events.on('postupdate', () => {
    restoreAuthoritativeObjectAnchors();
    drawEnvironmentCorrections(scene.environmentContext, scene.state);
    scene.environmentTexture.refresh();
  });
}

function restoreAuthoritativeObjectAnchors() {
  patchObject('sink', { x: 665, y: 88, w: 62, h: 52, solid: true, enterable: false, facing: 'diagonal_in' });
}

function drawEnvironmentCorrections(ctx, state) {
  if (state.floor === 0) {
    redrawDiningWithoutResidue(ctx, state);
    redrawCornerSink(ctx, state);
  }
  redrawScreenEquipment(ctx, state);
  if (state.floor === 2) redrawPoolRack(ctx, state);
}

function redrawDiningWithoutResidue(ctx, state) {
  const table = getObject('dining_table');
  if (!table) return;
  clearFloor(ctx, 440, 184, 278, 178);
  drawChair(ctx, table.x + 40, table.y - 28, 0);
  drawChair(ctx, table.x + table.w - 40, table.y - 28, 0);
  drawChair(ctx, table.x + 40, table.y + table.h + 28, Math.PI);
  drawChair(ctx, table.x + table.w - 40, table.y + table.h + 28, Math.PI);
  drawChair(ctx, table.x - 30, table.y + table.h / 2, -Math.PI / 2);
  drawChair(ctx, table.x + table.w + 30, table.y + table.h / 2, Math.PI / 2);
  round(ctx, table.x - 5, table.y - 5, table.w + 10, table.h + 10, 13, '#4d3326');
  round(ctx, table.x + 6, table.y + 6, table.w - 12, table.h - 12, 10, '#8b5f3b');
  line(ctx, table.x + 18, table.y + 18, table.x + table.w - 18, table.y + 14, 'rgba(255,255,255,.13)', 1.4);
  for (const [x, y] of [
    [table.x + 38, table.y + table.h / 2],
    [table.x + table.w - 38, table.y + table.h / 2],
    [table.x + table.w / 2, table.y + 18],
    [table.x + table.w / 2, table.y + table.h - 18]
  ]) {
    circle(ctx, x, y, 8, '#efe7dc');
    line(ctx, x - 13, y + 10, x + 13, y + 10, 'rgba(7,16,24,.23)', 1);
  }
  circle(ctx, table.x + table.w / 2, table.y + table.h / 2, 7, '#5f7c55');
  const plates = (state.meals?.tablePlates || []).filter(plate => plate.floor === table.floor && plate.tableId === table.id);
  for (const plate of plates) {
    circle(ctx, plate.x, plate.y, 12, '#efe7dc');
    circle(ctx, plate.x + 2, plate.y, 5, plate.food === 'snack' ? '#d59b5a' : '#b66d55');
  }
}

function redrawCornerSink(ctx, state) {
  const sink = getObject('sink');
  if (!sink || sink.floor !== state.floor) return;
  ctx.save();
  const cx = sink.x + sink.w / 2;
  const cy = sink.y + sink.h / 2;
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  round(ctx, -32, -25, 64, 50, 10, '#70523c');
  round(ctx, -27, -20, 54, 40, 9, '#d8c7ad');
  round(ctx, -20, -14, 40, 28, 10, '#eef4f2');
  round(ctx, -14, -9, 28, 18, 8, '#a8d3db');
  circle(ctx, 0, -11, 3, '#4e5964');
  line(ctx, 14, -15, 25, -23, '#cfd9dc', 2.2);
  ctx.restore();
}

function redrawScreenEquipment(ctx, state) {
  for (const tv of objects.filter(object => object.kind === 'tv' && object.floor === state.floor)) drawTopDownTv(ctx, tv, state);
  for (const desk of objects.filter(object => object.kind === 'desk' && object.floor === state.floor)) drawTopDownLaptop(ctx, desk, state);
}

function drawTopDownTv(ctx, tv, state) {
  const vertical = tv.h > tv.w;
  const cx = tv.x + tv.w / 2;
  const cy = tv.y + tv.h / 2;
  const width = vertical ? tv.h : tv.w;
  const height = vertical ? tv.w : tv.h;
  ctx.save();
  ctx.translate(cx, cy);
  if (vertical) ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#17191c';
  ctx.beginPath();
  ctx.moveTo(-width * .42, -height * .48);
  ctx.lineTo(width * .42, -height * .48);
  ctx.lineTo(width * .50, height * .48);
  ctx.lineTo(-width * .50, height * .48);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#080b0f';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-width * .35, -height * .33);
  ctx.lineTo(width * .35, -height * .33);
  ctx.lineTo(width * .41, height * .31);
  ctx.lineTo(-width * .41, height * .31);
  ctx.closePath();
  ctx.clip();
  if (state.tv?.on) drawTvImage(ctx, width, height, state);
  else {
    ctx.fillStyle = '#20262b';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = 'rgba(120,175,190,.15)';
    ctx.beginPath();
    ctx.moveTo(-width * .38, -height * .28);
    ctx.lineTo(width * .12, -height * .28);
    ctx.lineTo(width * .38, height * .28);
    ctx.lineTo(-width * .12, height * .28);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.fillStyle = '#4b4b48';
  ctx.fillRect(-width * .34, height * .48, width * .68, 4);
  ctx.restore();
}

function drawTvImage(ctx, width, height, state) {
  const phase = Math.floor((state.time || 0) / 15) % 3;
  if (phase === 0) {
    ctx.fillStyle = '#24394c';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = '#d88b62';
    ctx.fillRect(-width / 2, 0, width, height / 2);
    ctx.fillStyle = '#f1c66a';
    circle(ctx, width * .18, -height * .05, Math.max(3, height * .13), '#f1c66a');
    ctx.fillStyle = '#141b25';
    for (let x = -width * .42; x < width * .42; x += Math.max(8, width * .12)) ctx.fillRect(x, height * .08, width * .07, height * .32);
  } else if (phase === 1) {
    ctx.fillStyle = '#162c33';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = '#74e6ff';
    ctx.fillRect(-width * .36, -height * .28, width * .20, height * .56);
    ctx.fillStyle = '#ff75df';
    ctx.fillRect(width * .04, -height * .20, width * .30, height * .42);
  } else {
    ctx.fillStyle = '#33203c';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.strokeStyle = '#74e6ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-width * .42, height * .22);
    ctx.lineTo(-width * .12, -height * .12);
    ctx.lineTo(width * .10, height * .10);
    ctx.lineTo(width * .40, -height * .26);
    ctx.stroke();
  }
}

function drawTopDownLaptop(ctx, desk, state) {
  const cx = desk.x + desk.w * .58;
  const top = desk.y + 9;
  const screenW = Math.min(64, desk.w * .48);
  const screenH = Math.min(32, desk.h * .42);
  ctx.save();
  ctx.fillStyle = '#2e3237';
  ctx.beginPath();
  ctx.moveTo(cx - screenW * .42, top);
  ctx.lineTo(cx + screenW * .42, top);
  ctx.lineTo(cx + screenW * .50, top + screenH);
  ctx.lineTo(cx - screenW * .50, top + screenH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#11151a';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - screenW * .34, top + 4);
  ctx.lineTo(cx + screenW * .34, top + 4);
  ctx.lineTo(cx + screenW * .40, top + screenH - 4);
  ctx.lineTo(cx - screenW * .40, top + screenH - 4);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = '#8fc3cc';
  ctx.fillRect(cx - screenW / 2, top, screenW, screenH);
  ctx.fillStyle = '#19313d';
  ctx.fillRect(cx - screenW * .30, top + screenH * .22, screenW * .60, 3);
  ctx.fillStyle = '#f1c66a';
  ctx.fillRect(cx - screenW * .24, top + screenH * .46, screenW * .20, screenH * .22);
  ctx.fillStyle = '#ff75df';
  ctx.fillRect(cx + screenW * .04, top + screenH * .46, screenW * .20, screenH * .22);
  ctx.restore();
  ctx.fillStyle = '#43474c';
  ctx.beginPath();
  ctx.moveTo(cx - screenW * .54, top + screenH + 2);
  ctx.lineTo(cx + screenW * .54, top + screenH + 2);
  ctx.lineTo(cx + screenW * .43, top + screenH + 17);
  ctx.lineTo(cx - screenW * .43, top + screenH + 17);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#15191d';
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  for (let row = 0; row < 3; row += 1) for (let col = 0; col < 6; col += 1) ctx.fillRect(cx - 20 + col * 7, top + screenH + 5 + row * 3, 4, 1.3);
  ctx.restore();
}

function redrawPoolRack(ctx, state) {
  const table = getObject('pool_table');
  if (!table || table.floor !== state.floor || state.poolGame?.tableId === table.id) return;
  const feltX = table.x + 16;
  const feltY = table.y + 16;
  const feltW = table.w - 32;
  const feltH = table.h - 32;
  const cy = table.y + table.h / 2;
  const apexX = table.x + table.w * .58;
  ctx.save();
  ctx.fillStyle = '#557d67';
  ctx.fillRect(apexX - 18, feltY + 4, feltW * .34, feltH - 8);
  ctx.strokeStyle = '#d6b27a';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(apexX - 8, cy);
  ctx.lineTo(apexX + 48, cy - 32);
  ctx.lineTo(apexX + 48, cy + 32);
  ctx.closePath();
  ctx.stroke();
  const colors = ['#f1c66a','#ff75df','#74e6ff','#90d68c','#f08b57','#a98bff','#f8fbff','#e06767','#74c0a8','#d2b064'];
  let index = 0;
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column <= row; column += 1) {
      circle(ctx, apexX + row * 12, cy + (column - row / 2) * 12, 5.2, colors[index++ % colors.length]);
    }
  }
  circle(ctx, table.x + table.w * .27, cy, 6, '#f8fbff');
  ctx.restore();
}

function drawChair(ctx, x, y, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  round(ctx, -18, -14, 36, 28, 9, '#26313b');
  round(ctx, -13, -10, 26, 19, 7, '#78848e');
  round(ctx, -16, -20, 32, 9, 4, '#46545f');
  line(ctx, -13, 13, -19, 22, 'rgba(17,24,31,.45)', 2);
  line(ctx, 13, 13, 19, 22, 'rgba(17,24,31,.45)', 2);
  ctx.restore();
}

function clearFloor(ctx, x, y, width, height) {
  ctx.save();
  ctx.fillStyle = FLOOR;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = FLOOR_LINE;
  ctx.lineWidth = 1;
  for (let lineY = Math.ceil(y / 14) * 14; lineY < y + height; lineY += 14) line(ctx, x + 8, lineY, x + width - 8, lineY, FLOOR_LINE, 1);
  ctx.restore();
}

function patchObject(id, patch) {
  const object = objects.find(item => item.id === id);
  if (object) Object.assign(object, patch);
}

function round(ctx, x, y, width, height, radius, fill) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, width), Math.max(1, height), Math.max(0, radius));
  else ctx.rect(x, y, Math.max(1, width), Math.max(1, height));
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

function circle(ctx, x, y, radius, fill) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}
