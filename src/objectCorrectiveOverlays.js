import { objects } from './world.js';

export function drawObjectCorrectiveOverlays(ctx, state) {
  if (state.floor === 1) drawBedroomCorrections(ctx, state);
  if (state.floor === 3) drawGarageVehicleCorrections(ctx, state);
}

function drawBedroomCorrections(ctx, state) {
  const bed = objects.find(o => o.id === 'bed');
  const tv = objects.find(o => o.id === 'bedroom_tv');
  const closet = objects.find(o => o.id === 'closet');
  if (bed) drawWestHeadboardBed(ctx, state, bed);
  if (tv) drawBedroomWallTv(ctx, state, tv);
  if (closet) drawCloset(ctx, closet, state);
}

function drawGarageVehicleCorrections(ctx, state) {
  for (const vehicle of objects.filter(o => o.floor === 3 && ['car', 'bike', 'motorbike', 'atv'].includes(o.kind))) {
    if (state.objectState?.vehicleInUse === vehicle.id) continue;
    ctx.save();
    ctx.shadowColor = 'transparent';
    if (vehicle.id === 'car_1') drawFamilySuv(ctx, vehicle, state);
    else if (vehicle.id === 'car_2') drawSportsConvertible(ctx, vehicle, state);
    else if (vehicle.kind === 'bike') drawBetterBike(ctx, vehicle);
    else if (vehicle.kind === 'motorbike') drawBetterMotorbike(ctx, vehicle);
    else if (vehicle.kind === 'atv') drawBetterAtv(ctx, vehicle);
    ctx.restore();
  }
}

function drawWestHeadboardBed(ctx, state, bed) {
  const making = hasAction(state, ['make bed'], bed.floor);
  ctx.save();
  ctx.shadowColor = 'transparent';
  roundRect(ctx, bed.x - 4, bed.y - 4, bed.w + 8, bed.h + 8, 18, '#6f5947');
  roundRect(ctx, bed.x + 2, bed.y + 8, 34, bed.h - 16, 12, '#7f654f');
  roundRect(ctx, bed.x + 28, bed.y + 12, bed.w - 40, bed.h - 24, 16, '#c8b7a1');
  roundRect(ctx, bed.x + 40, bed.y + 20, 58, 44, 13, '#fffaf2');
  roundRect(ctx, bed.x + 40, bed.y + bed.h - 64, 58, 44, 13, '#fffaf2');
  roundRect(ctx, bed.x + 108, bed.y + 18, bed.w - 126, bed.h / 2 - 28, 14, '#60718f');
  roundRect(ctx, bed.x + 108, bed.y + bed.h / 2 + 10, bed.w - 126, bed.h / 2 - 28, 14, '#9f6b8e');
  line(ctx, bed.x + 104, bed.y + bed.h / 2, bed.x + bed.w - 16, bed.y + bed.h / 2, 'rgba(92,75,61,.25)', 2);
  line(ctx, bed.x + 108, bed.y + 28, bed.x + bed.w - 22, bed.y + 44, 'rgba(255,255,255,.18)', 2);
  line(ctx, bed.x + 108, bed.y + bed.h - 42, bed.x + bed.w - 26, bed.y + bed.h - 56, 'rgba(255,255,255,.18)', 2);
  if (state.objectState?.bedMade === false) drawWestMessyCovers(ctx, bed);
  if (making) drawMakeBedGesture(ctx, bed);
  ctx.restore();
}

function drawWestMessyCovers(ctx, bed) {
  ctx.fillStyle = 'rgba(96,113,143,.90)';
  ctx.beginPath();
  ctx.moveTo(bed.x + 98, bed.y + 20);
  ctx.quadraticCurveTo(bed.x + 178, bed.y + 6, bed.x + 234, bed.y + 36);
  ctx.quadraticCurveTo(bed.x + 220, bed.y + 72, bed.x + 112, bed.y + 62);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(159,107,142,.90)';
  ctx.beginPath();
  ctx.moveTo(bed.x + 100, bed.y + bed.h - 24);
  ctx.quadraticCurveTo(bed.x + 184, bed.y + bed.h - 2, bed.x + 260, bed.y + bed.h - 38);
  ctx.quadraticCurveTo(bed.x + 206, bed.y + bed.h - 76, bed.x + 116, bed.y + bed.h - 62);
  ctx.closePath();
  ctx.fill();
  line(ctx, bed.x + 130, bed.y + 44, bed.x + 226, bed.y + 36, 'rgba(255,255,255,.22)', 2);
  line(ctx, bed.x + 130, bed.y + bed.h - 46, bed.x + 236, bed.y + bed.h - 52, 'rgba(255,255,255,.22)', 2);
}

function drawMakeBedGesture(ctx, bed) {
  const t = performance.now() / 240;
  const sweep = (Math.sin(t) + 1) / 2;
  const x = bed.x + 96 + sweep * (bed.w - 136);
  ctx.save();
  ctx.globalAlpha = .95;
  line(ctx, bed.x + 92, bed.y + 18, x, bed.y + 18, '#f1c66a', 4);
  line(ctx, bed.x + 92, bed.y + bed.h - 18, x, bed.y + bed.h - 18, '#f1c66a', 4);
  roundRect(ctx, x - 8, bed.y + 24, 18, bed.h - 48, 8, 'rgba(248,251,255,.72)');
  ctx.fillStyle = '#071018';
  ctx.font = '900 9px system-ui';
  ctx.fillText('TIDYING BED', bed.x + 116, bed.y - 8);
  ctx.restore();
}

function drawBedroomWallTv(ctx, state, tv) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  roundRect(ctx, tv.x, tv.y, tv.w, tv.h, 7, '#111820');
  roundRect(ctx, tv.x + 5, tv.y + 8, tv.w - 10, tv.h - 16, 5, '#222c38');
  if (state.tv?.on || hasAction(state, ['watch', 'tv'], tv.floor)) {
    ctx.globalAlpha = .25 + Math.abs(Math.sin((state.time || 0) * .22)) * .20;
    ctx.fillStyle = '#74e6ff';
    ctx.beginPath();
    ctx.moveTo(tv.x - 4, tv.y + 4);
    ctx.lineTo(tv.x - 4, tv.y + tv.h - 4);
    ctx.lineTo(tv.x - 200, tv.y + tv.h + 32);
    ctx.lineTo(tv.x - 200, tv.y - 32);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawCloset(ctx, closet, state) {
  const active = hasAction(state, ['change clothes', 'plan weekly outfits'], closet.floor);
  roundRect(ctx, closet.x, closet.y, closet.w, closet.h, 8, '#7f654f');
  roundRect(ctx, closet.x + 8, closet.y + 8, closet.w - 16, closet.h - 16, 5, '#4f3d34');
  line(ctx, closet.x + closet.w / 2, closet.y + 10, closet.x + closet.w / 2, closet.y + closet.h - 10, '#d8c4a4', 2);
  circle(ctx, closet.x + closet.w / 2 - 7, closet.y + closet.h / 2, 3, '#f1c66a');
  circle(ctx, closet.x + closet.w / 2 + 7, closet.y + closet.h / 2, 3, '#f1c66a');
  if (active) {
    ctx.fillStyle = '#f1c66a';
    ctx.font = '900 8px system-ui';
    ctx.fillText('OUTFITS', closet.x + 8, closet.y - 5);
  }
}

function drawFamilySuv(ctx, o, state) {
  const flash = vehicleFlash(state, o);
  roundRect(ctx, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 22, '#2a2f38');
  roundRect(ctx, o.x + 5, o.y + 4, o.w - 10, o.h - 8, 18, '#e3e0d6');
  roundRect(ctx, o.x + 17, o.y + 32, o.w - 34, 74, 12, '#7faeba');
  roundRect(ctx, o.x + 17, o.y + 118, o.w - 34, 72, 10, '#9fb9bf');
  line(ctx, o.x + 19, o.y + 112, o.x + o.w - 19, o.y + 112, '#4c5a63', 3);
  drawVehicleLights(ctx, o, flash, true);
  drawVehicleWheels(ctx, o, 13);
  ctx.fillStyle = '#111820';
  ctx.font = '900 10px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('SUV', o.x + o.w / 2, o.y + o.h / 2 + 5);
  ctx.textAlign = 'left';
}

function drawSportsConvertible(ctx, o, state) {
  const flash = vehicleFlash(state, o);
  ctx.fillStyle = '#9b3e35';
  ctx.beginPath();
  ctx.moveTo(o.x + 14, o.y + 14);
  ctx.lineTo(o.x + o.w - 14, o.y + 14);
  ctx.quadraticCurveTo(o.x + o.w + 8, o.y + o.h * .45, o.x + o.w - 10, o.y + o.h - 18);
  ctx.lineTo(o.x + 10, o.y + o.h - 18);
  ctx.quadraticCurveTo(o.x - 8, o.y + o.h * .45, o.x + 14, o.y + 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4a1717';
  ctx.lineWidth = 3;
  ctx.stroke();
  roundRect(ctx, o.x + 19, o.y + 70, o.w - 38, 54, 16, '#141820');
  roundRect(ctx, o.x + 28, o.y + 82, o.w - 56, 30, 10, '#303a44');
  line(ctx, o.x + 23, o.y + 52, o.x + o.w - 23, o.y + 52, '#f6d7d0', 4);
  drawVehicleLights(ctx, o, flash, true);
  drawVehicleWheels(ctx, o, 11);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 9px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('CONV', o.x + o.w / 2, o.y + o.h - 44);
  ctx.textAlign = 'left';
}

function drawBetterBike(ctx, o) {
  const cx = o.x + o.w / 2;
  circle(ctx, cx, o.y + 17, 15, '#20252f', false);
  circle(ctx, cx, o.y + o.h - 17, 15, '#20252f', false);
  line(ctx, cx, o.y + 17, o.x + 7, o.y + o.h * .50, '#1e3540', 3);
  line(ctx, o.x + 7, o.y + o.h * .50, cx, o.y + o.h - 17, '#1e3540', 3);
  line(ctx, cx, o.y + 17, o.x + o.w - 7, o.y + o.h * .50, '#74e6ff', 3);
  line(ctx, o.x + o.w - 7, o.y + o.h * .50, cx, o.y + o.h - 17, '#74e6ff', 3);
  line(ctx, o.x + 6, o.y + 14, o.x + o.w - 6, o.y + 14, '#d8c4a4', 2);
  roundRect(ctx, o.x + 8, o.y + o.h * .48, o.w - 16, 8, 3, '#111820');
}

function drawBetterMotorbike(ctx, o) {
  const cx = o.x + o.w / 2;
  circle(ctx, cx, o.y + 18, 15, '#15191f', false);
  circle(ctx, cx, o.y + o.h - 18, 15, '#15191f', false);
  roundRect(ctx, o.x + 9, o.y + 30, o.w - 18, 62, 18, '#2c3138');
  roundRect(ctx, o.x + 13, o.y + 44, o.w - 26, 26, 9, '#9ecbd1');
  roundRect(ctx, o.x + 16, o.y + 73, o.w - 32, 22, 9, '#111820');
  line(ctx, o.x + 4, o.y + 26, o.x + o.w - 4, o.y + 26, '#d8c4a4', 2);
  circle(ctx, cx, o.y + 9, 4, '#f1c66a');
}

function drawBetterAtv(ctx, o) {
  roundRect(ctx, o.x + 10, o.y + 8, o.w - 20, o.h - 16, 18, '#485c3f');
  roundRect(ctx, o.x + 20, o.y + 32, o.w - 40, 48, 12, '#789477');
  roundRect(ctx, o.x + 26, o.y + 51, o.w - 52, 24, 8, '#2f372c');
  for (const [x, y] of [[10, 22], [o.w - 10, 22], [10, o.h - 22], [o.w - 10, o.h - 22]]) {
    circle(ctx, o.x + x, o.y + y, 13, '#111820');
    circle(ctx, o.x + x, o.y + y, 7, '#55606a');
  }
  line(ctx, o.x + 14, o.y + 12, o.x + o.w - 14, o.y + 12, '#111820', 4);
  line(ctx, o.x + 14, o.y + o.h - 12, o.x + o.w - 14, o.y + o.h - 12, '#111820', 4);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 9px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('ATV', o.x + o.w / 2, o.y + o.h / 2 + 4);
  ctx.textAlign = 'left';
}

function drawVehicleLights(ctx, o, flash, vertical) {
  const frontY = vertical ? o.y + o.h - 23 : o.y + 12;
  const rearY = vertical ? o.y + 12 : o.y + o.h - 23;
  ctx.fillStyle = flash > 0 ? '#fff3a6' : '#f7f2e9';
  ctx.fillRect(o.x + o.w * .20, frontY, 18, 10);
  ctx.fillRect(o.x + o.w * .66, frontY, 18, 10);
  ctx.fillStyle = flash > 0 ? '#ff615c' : '#b66d55';
  ctx.fillRect(o.x + o.w * .20, rearY, 18, 8);
  ctx.fillRect(o.x + o.w * .66, rearY, 18, 8);
}

function drawVehicleWheels(ctx, o, r) {
  for (const [x, y] of [[-4, 40], [o.w + 4, 40], [-4, o.h - 48], [o.w + 4, o.h - 48]]) {
    circle(ctx, o.x + x, o.y + y, r, '#111820');
  }
}

function vehicleFlash(state, o) {
  return state.vehicleDeparture?.vehicleId === o.id ? state.vehicleDeparture.remoteFlashT : state.vehicleReturn?.vehicleId === o.id ? state.vehicleReturn.remoteFlashT : 0;
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

function roundRect(ctx, x, y, w, h, r, fill = '', stroke = false) {
  if (fill) ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(0, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function circle(ctx, x, y, r, color, fill = true) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = color; ctx.fill(); }
  else { ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); }
}
