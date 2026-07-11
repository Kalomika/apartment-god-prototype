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
  if (text.includes('cue')) { ctx.save(); ctx.rotate(-0.72); ctx.strokeStyle = '#d6b27a'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.stroke(); ctx.strokeStyle = '#3b2a1d'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(18, 0); ctx.stroke(); ctx.restore(); return; }
  if (text.includes('ball')) { ctx.fillStyle = '#f1c66a'; ctx.strokeStyle = '#11151c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); return; }
  if (text.includes('towel')) { roundRect(ctx, -13, -10, 26, 20, 5, '#a8e9ff'); ctx.strokeStyle = '#071018'; ctx.lineWidth = 1.5; ctx.strokeRect(-10, -7, 20, 14); ctx.fillStyle = '#071018'; ctx.font = '900 6px system-ui'; ctx.textAlign = 'center'; ctx.fillText('TOWEL', 0, 2); ctx.textAlign = 'left'; return; }
  if (text.includes('luggage')) { drawLuggage(ctx, 0, 0, text.includes('large')); return; }
  if (text.includes('bag') || text.includes('trash')) { roundRect(ctx, -10, -8, 20, 18, 5, text.includes('trash') ? '#20252f' : '#f1c66a'); ctx.fillStyle = '#10141b'; ctx.font = '900 7px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text.includes('trash') ? 'TR' : 'BAG', 0, 3); ctx.textAlign = 'left'; return; }
  if (text.includes('dish')) { roundRect(ctx, -11, -5, 22, 10, 5, '#d7e1f0'); return; }
  roundRect(ctx, -9, -7, 18, 14, 4, '#f1c66a');
}

function drawLuggage(ctx, x, y, large = false) {
  const w = large ? 26 : 20;
  const h = large ? 28 : 22;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#2e2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w * .25, -h * .58);
  ctx.quadraticCurveTo(0, -h * .85, w * .25, -h * .58);
  ctx.stroke();
  roundRect(ctx, -w / 2, -h / 2, w, h, 5, large ? '#b78556' : '#f1c66a');
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  ctx.fillRect(-2, -h / 2 + 3, 4, h - 6);
  ctx.fillStyle = '#2e2118';
  ctx.fillRect(-w / 2 + 4, h / 2 - 3, 4, 3);
  ctx.fillRect(w / 2 - 8, h / 2 - 3, 4, 3);
  ctx.restore();
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
  ctx.fillRect(186, 636, 548, 30);
  ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 3; ctx.strokeRect(186, 636, 548, 30);
}

function drawAnimatedVehicle(ctx, v, label) {
  const kind = v.vehicleKind || (String(v.vehicleId).includes('bike') ? 'bike' : 'car');
  if (kind === 'bike') return drawAnimatedBike(ctx, v, label);
  if (kind === 'motorbike') return drawAnimatedMotorbike(ctx, v, label);
  if (kind === 'atv') return drawAnimatedAtv(ctx, v, label);
  return drawAnimatedCar(ctx, v, label);
}

function drawAnimatedCar(ctx, v, label) {
  const x = v.x;
  const y = v.y;
  const w = v.w || 116;
  const h = v.h || 230;
  const flash = v.remoteFlashT > 0 && Math.floor(v.remoteFlashT * 12) % 2 === 0;
  const convertible = v.vehicleId === 'car_2';
  if (convertible) drawConvertibleBody(ctx, x, y, w, h, flash);
  else drawSuvBody(ctx, x, y, w, h, flash);
  if (v.open) drawSubtleDoorSeams(ctx, x, y, w, h);
  if (v.trunkOpen) drawTrunk(ctx, x, y, w, h);
  if (flash) { ctx.strokeStyle = 'rgba(255,244,164,.65)'; ctx.lineWidth = 3; ctx.strokeRect(x - 8, y - 8, w + 16, h + 16); }
  drawStoredLuggage(ctx, v, x, y, w, h);
  ctx.fillStyle = convertible ? '#f8fbff' : '#10141b'; ctx.font = '900 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, x + w / 2, y + h / 2); ctx.textAlign = 'left';
  if (v.remoteFlashT > 0) drawVehicleBubble(ctx, x + w / 2, y - 18, v.remoteLabel || 'REMOTE');
}

function drawSuvBody(ctx, x, y, w, h, flash) {
  roundRect(ctx, x - 2, y - 2, w + 4, h + 4, 22, '#2a2f38');
  roundRect(ctx, x + 5, y + 4, w - 10, h - 8, 18, '#e3e0d6');
  roundRect(ctx, x + 17, y + 32, w - 34, 74, 12, '#7faeba');
  roundRect(ctx, x + 17, y + 118, w - 34, 72, 10, '#9fb9bf');
  line(ctx, x + 19, y + 112, x + w - 19, y + 112, '#4c5a63', 3);
  drawVehicleLights(ctx, x, y, w, h, flash);
  drawVehicleWheels(ctx, x, y, w, h, 13);
}

function drawConvertibleBody(ctx, x, y, w, h, flash) {
  ctx.fillStyle = '#9b3e35';
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 14);
  ctx.lineTo(x + w - 14, y + 14);
  ctx.quadraticCurveTo(x + w + 8, y + h * .45, x + w - 10, y + h - 18);
  ctx.lineTo(x + 10, y + h - 18);
  ctx.quadraticCurveTo(x - 8, y + h * .45, x + 14, y + 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4a1717'; ctx.lineWidth = 3; ctx.stroke();
  roundRect(ctx, x + 19, y + 70, w - 38, 54, 16, '#141820');
  roundRect(ctx, x + 28, y + 82, w - 56, 30, 10, '#303a44');
  line(ctx, x + 23, y + 52, x + w - 23, y + 52, '#f6d7d0', 4);
  drawVehicleLights(ctx, x, y, w, h, flash);
  drawVehicleWheels(ctx, x, y, w, h, 11);
}

function drawVehicleLights(ctx, x, y, w, h, flash) {
  ctx.fillStyle = flash ? '#fff3a6' : '#f7f2e9';
  ctx.fillRect(x + w * .20, y + h - 23, 18, 10);
  ctx.fillRect(x + w * .66, y + h - 23, 18, 10);
  ctx.fillStyle = flash ? '#ff615c' : '#b66d55';
  ctx.fillRect(x + w * .20, y + 12, 18, 8);
  ctx.fillRect(x + w * .66, y + 12, 18, 8);
}

function drawVehicleWheels(ctx, x, y, w, h, r) {
  for (const [px, py] of [[-4, 40], [w + 4, 40], [-4, h - 48], [w + 4, h - 48]]) circle(ctx, x + px, y + py, r, '#111820');
}

function drawSubtleDoorSeams(ctx, x, y, w, h) {
  ctx.save();
  ctx.globalAlpha = .85;
  ctx.strokeStyle = 'rgba(7,16,24,.65)';
  ctx.lineWidth = 2;
  line(ctx, x + 8, y + h * .38, x + 8, y + h * .62, 'rgba(7,16,24,.65)', 2);
  line(ctx, x + w - 8, y + h * .38, x + w - 8, y + h * .62, 'rgba(7,16,24,.65)', 2);
  ctx.restore();
}

function drawAnimatedBike(ctx, v, label) {
  const x = v.x, y = v.y, w = v.w || 34, h = v.h || 96, cx = x + w / 2;
  circle(ctx, cx, y + 17, 15, '#20252f', false);
  circle(ctx, cx, y + h - 17, 15, '#20252f', false);
  line(ctx, cx, y + 17, x + 7, y + h * .50, '#1e3540', 3);
  line(ctx, x + 7, y + h * .50, cx, y + h - 17, '#1e3540', 3);
  line(ctx, cx, y + 17, x + w - 7, y + h * .50, '#74e6ff', 3);
  line(ctx, x + w - 7, y + h * .50, cx, y + h - 17, '#74e6ff', 3);
  line(ctx, x + 6, y + 14, x + w - 6, y + 14, '#d8c4a4', 2);
  roundRect(ctx, x + 8, y + h * .48, w - 16, 8, 3, '#111820');
  ctx.fillStyle = '#f8fbff'; ctx.font = '900 8px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, cx, y + h + 14); ctx.textAlign = 'left';
  if (v.remoteFlashT > 0) drawVehicleBubble(ctx, cx, y - 18, v.remoteLabel || 'READY');
}

function drawAnimatedMotorbike(ctx, v, label) {
  const x = v.x, y = v.y, w = v.w || 48, h = v.h || 122, cx = x + w / 2;
  circle(ctx, cx, y + 18, 15, '#15191f', false);
  circle(ctx, cx, y + h - 18, 15, '#15191f', false);
  roundRect(ctx, x + 9, y + 30, w - 18, 62, 18, '#2c3138');
  roundRect(ctx, x + 13, y + 44, w - 26, 26, 9, '#9ecbd1');
  roundRect(ctx, x + 16, y + 73, w - 32, 22, 9, '#111820');
  line(ctx, x + 4, y + 26, x + w - 4, y + 26, '#d8c4a4', 2);
  circle(ctx, cx, y + 9, 4, '#f1c66a');
  ctx.fillStyle = '#f8fbff'; ctx.font = '900 8px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, cx, y + h + 14); ctx.textAlign = 'left';
  if (v.remoteFlashT > 0) drawVehicleBubble(ctx, cx, y - 18, v.remoteLabel || 'READY');
}

function drawAnimatedAtv(ctx, v, label) {
  const x = v.x, y = v.y, w = v.w || 82, h = v.h || 116;
  roundRect(ctx, x + 10, y + 8, w - 20, h - 16, 18, '#485c3f');
  roundRect(ctx, x + 20, y + 32, w - 40, 48, 12, '#789477');
  roundRect(ctx, x + 26, y + 51, w - 52, 24, 8, '#2f372c');
  for (const [px, py] of [[10, 22], [w - 10, 22], [10, h - 22], [w - 10, h - 22]]) { circle(ctx, x + px, y + py, 13, '#111820'); circle(ctx, x + px, y + py, 7, '#55606a'); }
  line(ctx, x + 14, y + 12, x + w - 14, y + 12, '#111820', 4);
  line(ctx, x + 14, y + h - 12, x + w - 14, y + h - 12, '#111820', 4);
  ctx.fillStyle = '#f1c66a'; ctx.font = '900 8px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, x + w / 2, y + h / 2 + 4); ctx.textAlign = 'left';
  if (v.remoteFlashT > 0) drawVehicleBubble(ctx, x + w / 2, y - 18, v.remoteLabel || 'READY');
}

function drawTrunk(ctx, x, y, w, h) { ctx.fillStyle = '#202838'; ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 8, y - 2); ctx.lineTo(x + w - 8, y - 2); ctx.lineTo(x + w - 18, y - 36); ctx.lineTo(x + 18, y - 36); ctx.closePath(); ctx.fill(); ctx.stroke(); }
function drawStoredLuggage(ctx, v, x, y, w, h) { if (!v.vacation || !v.luggage?.length || (!v.trunkOpen && !v.luggageLoaded)) return; const loaded = v.luggage.filter(item => item.loaded || v.phase === 'loading_luggage' || v.phase === 'unloading_luggage'); loaded.slice(0, 4).forEach((item, index) => drawLuggage(ctx, x + w * .28 + index * 15, y + (v.trunkOpen ? -20 : 30), item.count > 1)); }
function drawVehicleBubble(ctx, x, y, text) { ctx.fillStyle = 'rgba(8,10,15,.82)'; roundRect(ctx, x - 40, y - 12, 80, 24, 10, 'rgba(8,10,15,.82)'); ctx.fillStyle = '#f1c66a'; ctx.font = '900 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text, x, y + 4); ctx.textAlign = 'left'; }
function drawVehicleDeparture(ctx, state) { const v = state.vehicleDeparture; if (!v || state.floor !== 3) return; ctx.save(); drawGarageDoor(ctx, state); drawAnimatedVehicle(ctx, v, v.phase?.replaceAll('_', ' ').toUpperCase() || 'LEAVING'); ctx.restore(); }
function drawVehicleReturn(ctx, state) { const v = state.vehicleReturn; if (!v || state.floor !== 3) return; ctx.save(); drawGarageDoor(ctx, state); drawAnimatedVehicle(ctx, v, v.phase?.replaceAll('_', ' ').toUpperCase() || 'RETURN'); ctx.restore(); }
function drawBuildPrompt(ctx, state) { if (!state.buildPick) return; ctx.save(); ctx.fillStyle = 'rgba(10,12,18,.78)'; ctx.fillRect(282, 10, 380, 34); ctx.fillStyle = '#f8fbff'; ctx.font = '900 15px system-ui'; ctx.fillText(`Tap placement spot for ${state.buildPick.label}`, 294, 32); ctx.restore(); }
function circle(ctx, x, y, r, color, fill = true) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = color; ctx.fill(); } else { ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); } }
function line(ctx, x1, y1, x2, y2, color, width = 1) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
