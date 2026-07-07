import { objects } from './world.js';
import { roundRect } from './renderHelpers.js';

export function drawDynamicProps(ctx, state) {
  drawPulledBook(ctx, state);
  drawCourier(ctx, state);
  drawVehicleDeparture(ctx, state);
  drawVehicleReturn(ctx, state);
  drawBuildPrompt(ctx, state);
}

export function drawCarriedItems(ctx, state) {
  for (const e of state.entities || []) {
    if (e.hidden || e.floor !== state.floor || !e.carrying) continue;
    ctx.save(); ctx.translate(e.x + 20, e.y - 22); drawCarryIcon(ctx, e.carrying); ctx.restore();
  }
}

function drawCarryIcon(ctx, item) {
  const text = String(item).toLowerCase();
  if (text.includes('ball')) { ctx.fillStyle = '#f1c66a'; ctx.strokeStyle = '#11151c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); return; }
  if (text.includes('bag') || text.includes('trash')) { roundRect(ctx, -10, -8, 20, 18, 5, text.includes('trash') ? '#20252f' : '#f1c66a'); ctx.fillStyle = '#10141b'; ctx.font = '900 7px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text.includes('trash') ? 'TR' : 'FOOD', 0, 3); ctx.textAlign = 'left'; return; }
  if (text.includes('dish')) { roundRect(ctx, -11, -5, 22, 10, 5, '#d7e1f0'); return; }
  roundRect(ctx, -9, -7, 18, 14, 4, '#f1c66a');
}

function drawPulledBook(ctx, state) {
  const bookOut = state.objectState.bookOut;
  if (!bookOut) return;
  const shelf = objects.find(o => o.floor === state.floor && o.kind === 'bookshelf' && (bookOut === true || bookOut === o.id));
  if (!shelf) return;
  ctx.save(); ctx.fillStyle = '#f1c66a'; ctx.strokeStyle = '#11151c'; ctx.lineWidth = 2; ctx.translate(shelf.x + shelf.w + 12, shelf.y + 38); ctx.rotate(-0.12); ctx.fillRect(0, 0, 24, 18); ctx.strokeRect(0, 0, 24, 18); ctx.fillStyle = '#11151c'; ctx.font = '900 10px system-ui'; ctx.fillText('BOOK', -1, 13); ctx.restore();
}

function drawCourier(ctx, state) {
  const d = state.delivery;
  if (!d || d.floor !== state.floor) return;
  ctx.save(); ctx.translate(d.x, d.y); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 18, 22, 12, 0, 0, Math.PI * 2); ctx.fill(); roundRect(ctx, -15, -10, 30, 38, 8, '#1e2937'); ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 2; ctx.strokeRect(-12, -6, 24, 18); ctx.fillStyle = '#f1c66a'; ctx.fillRect(-24, 3, 16, 14); ctx.fillStyle = '#11151c'; ctx.font = '900 8px system-ui'; ctx.fillText('BAG', -23, 13); ctx.fillStyle = '#f8fbff'; ctx.beginPath(); ctx.arc(0, -20, 11, 0, Math.PI * 2); ctx.fill(); const text = d.phase === 'arriving' ? '...' : d.bubble || 'ORDER'; const w = Math.max(76, text.length * 10 + 22); roundRect(ctx, -w / 2, -66, w, 26, 10, '#f8fbff'); ctx.fillStyle = '#10141b'; ctx.font = '900 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text, 0, -49); ctx.textAlign = 'left'; ctx.restore();
}

function drawGarageDoor(ctx, state) {
  ctx.fillStyle = state.objectState.garageDoorOpen ? 'rgba(116,230,255,.35)' : '#2a3140';
  ctx.fillRect(118, 38, 548, 30);
  ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 3; ctx.strokeRect(118, 38, 548, 30);
  if (state.objectState.garageDoorOpen) {
    ctx.fillStyle = '#dffaff'; ctx.font = '900 10px system-ui'; ctx.fillText('GARAGE DOOR OPEN', 318, 58);
  }
}

function drawAnimatedVehicle(ctx, v, label) {
  if (v.vehicleKind === 'bike') return drawBike(ctx, v, label);
  if (v.vehicleKind === 'motorbike') return drawMotorbike(ctx, v, label);
  if (v.vehicleKind === 'atv') return drawAtv(ctx, v, label);
  return drawCar(ctx, v, label);
}

function drawCar(ctx, v, label) {
  const x = v.x, y = v.y, w = v.w || 116, h = v.h || 230;
  const sports = v.vehicleId === 'car_2';
  const body = sports ? '#954334' : '#d9d7ce';
  const edge = sports ? '#5d2a25' : '#756d63';
  const glass = '#263a3d';
  const cx = x + w / 2;
  ctx.save();
  ctx.strokeStyle = '#181a20'; ctx.lineWidth = 2.4; ctx.fillStyle = body;
  ctx.beginPath();
  if (sports) {
    ctx.moveTo(cx, y + 3);
    ctx.bezierCurveTo(x + w - 12, y + 18, x + w - 4, y + 58, x + w - 8, y + h - 28);
    ctx.quadraticCurveTo(cx, y + h + 1, x + 8, y + h - 28);
    ctx.bezierCurveTo(x + 4, y + 58, x + 12, y + 18, cx, y + 3);
  } else {
    ctx.moveTo(cx, y + 4);
    ctx.bezierCurveTo(x + w - 8, y + 18, x + w - 4, y + 64, x + w - 13, y + h - 18);
    ctx.quadraticCurveTo(cx, y + h + 4, x + 13, y + h - 18);
    ctx.bezierCurveTo(x + 4, y + 64, x + 8, y + 18, cx, y + 4);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  styledRect(ctx, x + w * .22, y + h * .15, w * .56, h * .16, 8, glass, edge, 1.5);
  styledRect(ctx, x + w * .20, y + h * .60, w * .60, h * .18, 8, glass, edge, 1.5);
  styledRect(ctx, x + w * .18, y + h * .34, w * .12, h * .30, 7, '#ecdfce', edge, 1);
  styledRect(ctx, x + w * .70, y + h * .34, w * .12, h * .30, 7, '#ecdfce', edge, 1);
  strokeLine(ctx, x + 14, y + h * .39, x + w - 14, y + h * .39, 'rgba(24,26,32,.35)', 1.3);
  strokeLine(ctx, x + 16, y + h * .69, x + w - 16, y + h * .69, 'rgba(24,26,32,.35)', 1.3);
  ellipse(ctx, x + 24, y + 14, 9, 6, '#fff8dc'); ellipse(ctx, x + w - 24, y + 14, 9, 6, '#fff8dc');
  ellipse(ctx, x + 24, y + h - 13, 8, 5, '#b66d55'); ellipse(ctx, x + w - 24, y + h - 13, 8, 5, '#b66d55');
  strokeLine(ctx, x - 6, y + h * .38, x + 4, y + h * .42, '#181a20', 2);
  strokeLine(ctx, x + w + 6, y + h * .38, x + w - 4, y + h * .42, '#181a20', 2);
  if (sports) {
    for (const side of [-1, 1]) {
      strokeLine(ctx, cx + side * 24, y + 45, cx + side * 12, y + 82, '#52251f', 3);
      strokeLine(ctx, cx + side * 32, y + 58, cx + side * 19, y + 94, '#52251f', 2);
    }
  }
  if (v.open) drawDoorOpen(ctx, x, y, w, h);
  ctx.fillStyle = '#f1c66a'; ctx.font = '900 11px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, x + w / 2, y + h / 2 + 4); ctx.textAlign = 'left';
  ctx.restore();
}

function drawDoorOpen(ctx, x, y, w, h) {
  ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + w + 2, y + h * .46);
  ctx.lineTo(x + w + 34, y + h * .38);
  ctx.stroke();
  ctx.fillStyle = '#f1c66a'; ctx.font = '900 10px system-ui'; ctx.fillText('DOOR', x + w + 12, y + h * .36);
}

function drawBike(ctx, v, label) {
  const x = v.x, y = v.y, w = v.w || 34, h = v.h || 96;
  const cx = x + w / 2;
  ctx.save();
  circle(ctx, cx, y + 14, Math.min(13, w * .42), false, '#181a20');
  circle(ctx, cx, y + h - 14, Math.min(13, w * .42), false, '#181a20');
  strokeLine(ctx, cx, y + 14, x + 6, y + h * .50, '#3f5f67', 3);
  strokeLine(ctx, x + 6, y + h * .50, cx, y + h - 14, '#3f5f67', 3);
  strokeLine(ctx, cx, y + 14, x + w - 6, y + h * .50, '#3f5f67', 3);
  strokeLine(ctx, x + w - 6, y + h * .50, cx, y + h - 14, '#3f5f67', 3);
  strokeLine(ctx, x + 4, y + 8, x + w - 4, y + 8, '#181a20', 2);
  styledRect(ctx, cx - 7, y + h * .47, 14, 9, 4, '#5a4a3e');
  strokeLine(ctx, cx, y + h * .52, cx + 12, y + h * .60, '#181a20', 2);
  strokeLine(ctx, cx, y + h * .52, cx - 12, y + h * .60, '#181a20', 2);
  if (v.open) { ctx.fillStyle = '#f1c66a'; ctx.font = '900 9px system-ui'; ctx.fillText('MOUNT', x + w + 8, y + h * .5); }
  ctx.fillStyle = '#f8fbff'; ctx.font = '900 10px system-ui'; ctx.fillText(label, x - 8, y + h + 18);
  ctx.restore();
}

function drawMotorbike(ctx, v, label) {
  const x = v.x, y = v.y, w = v.w || 48, h = v.h || 122;
  const cx = x + w / 2;
  ctx.save();
  circle(ctx, cx, y + 14, 12, false, '#181a20');
  circle(ctx, cx, y + h - 14, 13, false, '#181a20');
  styledRect(ctx, cx - 13, y + 28, 26, h - 56, 13, '#504b47', '#181a20', 2);
  styledRect(ctx, cx - 10, y + 39, 20, 24, 8, '#cfd8d6');
  styledRect(ctx, cx - 12, y + 72, 24, 28, 11, '#2c2a28');
  strokeLine(ctx, x + 4, y + 17, x + w - 4, y + 17, '#181a20', 2.5);
  strokeLine(ctx, x + 9, y + h - 36, x - 2, y + h - 21, '#5a524a', 2);
  strokeLine(ctx, x + w - 9, y + h - 36, x + w + 2, y + h - 21, '#5a524a', 2);
  if (v.open) { ctx.fillStyle = '#f1c66a'; ctx.font = '900 9px system-ui'; ctx.fillText('MOUNT', x + w + 8, y + h * .5); }
  ctx.fillStyle = '#f8fbff'; ctx.font = '900 10px system-ui'; ctx.fillText(label, x - 14, y + h + 18);
  ctx.restore();
}

function drawAtv(ctx, v, label) {
  const x = v.x, y = v.y, w = v.w || 82, h = v.h || 116;
  const cx = x + w / 2;
  ctx.save();
  for (const [dx, dy] of [[7, 10], [w - 7, 10], [7, h - 14], [w - 7, h - 14]]) {
    styledRect(ctx, x + dx - 9, y + dy - 14, 18, 28, 8, '#2c2a25', '#181a20', 1.5);
  }
  styledRect(ctx, x + 13, y + 15, w - 26, h - 34, 12, '#66764c', '#181a20', 2);
  styledRect(ctx, cx - 13, y + 34, 26, 34, 11, '#8ca064');
  styledRect(ctx, cx - 13, y + h - 52, 26, 36, 11, '#3d3a33');
  strokeLine(ctx, x + 10, y + 20, x + w - 10, y + 20, '#181a20', 2.5);
  if (v.open) { ctx.fillStyle = '#f1c66a'; ctx.font = '900 9px system-ui'; ctx.fillText('MOUNT', x + w + 8, y + h * .5); }
  ctx.fillStyle = '#f8fbff'; ctx.font = '900 10px system-ui'; ctx.fillText(label, x - 10, y + h + 18);
  ctx.restore();
}

function drawVehicleDeparture(ctx, state) {
  const v = state.vehicleDeparture;
  if (!v || state.floor !== 3) return;
  ctx.save();
  drawGarageDoor(ctx, state);
  const label = v.phase === 'walking_to_vehicle' ? 'BOARDING' : v.phase === 'leaving' ? 'LEAVING' : 'DOOR';
  drawAnimatedVehicle(ctx, v, label);
  ctx.restore();
}

function drawVehicleReturn(ctx, state) {
  const v = state.vehicleReturn;
  if (!v || state.floor !== 3) return;
  ctx.save();
  drawGarageDoor(ctx, state);
  const label = v.phase === 'arriving' ? 'RETURN' : v.phase === 'walking_in' ? 'EXIT' : 'PARKED';
  drawAnimatedVehicle(ctx, v, label);
  ctx.restore();
}

function drawBuildPrompt(ctx, state) {
  if (!state.buildPick) return;
  ctx.save(); ctx.fillStyle = 'rgba(10,12,18,.78)'; ctx.fillRect(282, 10, 380, 34); ctx.fillStyle = '#f8fbff'; ctx.font = '900 15px system-ui'; ctx.fillText(`Tap placement spot for ${state.buildPick.label}`, 294, 32); ctx.restore();
}

function styledRect(ctx, x, y, w, h, r, fill, stroke = null, lineWidth = 1) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else { ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); }
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}
function circle(ctx, x, y, r, fill = true, color = '#000') { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = color; ctx.fill(); } else { ctx.strokeStyle = color; ctx.stroke(); } }
function ellipse(ctx, x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function strokeLine(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
