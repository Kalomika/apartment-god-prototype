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
    else if (vehicle.kind === 'bike') drawTopDownBike(ctx, vehicle);
    else if (vehicle.kind === 'motorbike') drawTopDownMotorbike(ctx, vehicle);
    else if (vehicle.kind === 'atv') drawTopDownAtv(ctx, vehicle);
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
  drawTopDownCarBase(ctx, o, '#e3e0d6', '#d3d0c6', '#7faeba', '#9fb9bf', flash, true);
}

function drawSportsConvertible(ctx, o, state) {
  const flash = vehicleFlash(state, o);
  drawTopDownCarBase(ctx, o, '#9b3e35', '#7d2f2a', '#f6d7d0', '#141820', flash, false);
  roundRect(ctx, o.x + 22, o.y + o.h * .38, o.w - 44, 50, 14, '#171b23');
  roundRect(ctx, o.x + 31, o.y + o.h * .43, o.w - 62, 26, 9, '#303a44');
}

function drawTopDownCarBase(ctx, o, body, panel, glassA, glassB, flash, roofed) {
  roundRect(ctx, o.x + 4, o.y + 2, o.w - 8, o.h - 4, 21, '#20262f');
  roundRect(ctx, o.x + 8, o.y + 6, o.w - 16, o.h - 12, 18, body);
  roundRect(ctx, o.x + 15, o.y + 18, o.w - 30, 42, 13, panel);
  roundRect(ctx, o.x + 16, o.y + o.h - 66, o.w - 32, 46, 13, panel);
  if (roofed) {
    roundRect(ctx, o.x + 20, o.y + 68, o.w - 40, 48, 12, glassA);
    roundRect(ctx, o.x + 22, o.y + 126, o.w - 44, 58, 12, glassB);
    roundRect(ctx, o.x + 30, o.y + 104, o.w - 60, 42, 10, '#d8dad3');
  } else {
    line(ctx, o.x + 22, o.y + 62, o.x + o.w - 22, o.y + 62, glassA, 4);
    roundRect(ctx, o.x + 23, o.y + 28, o.w - 46, 34, 10, panel);
    roundRect(ctx, o.x + 19, o.y + o.h - 64, o.w - 38, 42, 12, panel);
  }
  drawSubtleTireHints(ctx, o);
  drawTinyMirrors(ctx, o);
  drawVehicleLights(ctx, o, flash, true);
}

function drawSubtleTireHints(ctx, o) {
  ctx.save();
  ctx.globalAlpha = .55;
  const yTop = o.y + 44;
  const yBot = o.y + o.h - 62;
  roundRect(ctx, o.x + 5, yTop, 8, 34, 4, '#10141b');
  roundRect(ctx, o.x + o.w - 13, yTop, 8, 34, 4, '#10141b');
  roundRect(ctx, o.x + 5, yBot, 8, 34, 4, '#10141b');
  roundRect(ctx, o.x + o.w - 13, yBot, 8, 34, 4, '#10141b');
  ctx.restore();
}

function drawTinyMirrors(ctx, o) {
  roundRect(ctx, o.x - 5, o.y + o.h * .42, 9, 14, 4, '#20262f');
  roundRect(ctx, o.x + o.w - 4, o.y + o.h * .42, 9, 14, 4, '#20262f');
}

function drawTopDownBike(ctx, o) {
  const cx = o.x + o.w / 2;
  drawTopDownTire(ctx, cx, o.y + 13, 4.2, 14, '#111820');
  drawTopDownTire(ctx, cx, o.y + o.h - 13, 4.2, 14, '#111820');
  line(ctx, cx, o.y + 22, o.x + 8, o.y + o.h * .50, '#1e3540', 2.4);
  line(ctx, o.x + 8, o.y + o.h * .50, cx, o.y + o.h - 22, '#1e3540', 2.4);
  line(ctx, cx, o.y + 22, o.x + o.w - 8, o.y + o.h * .50, '#74e6ff', 2.4);
  line(ctx, o.x + o.w - 8, o.y + o.h * .50, cx, o.y + o.h - 22, '#74e6ff', 2.4);
  line(ctx, o.x + 7, o.y + 16, o.x + o.w - 7, o.y + 16, '#d8c4a4', 2);
  roundRect(ctx, cx - 5, o.y + o.h * .49, 10, 13, 4, '#111820');
}

function drawTopDownMotorbike(ctx, o) {
  const cx = o.x + o.w / 2;
  drawTopDownTire(ctx, cx, o.y + 13, 5, 15, '#10141b');
  drawTopDownTire(ctx, cx, o.y + o.h - 15, 6, 17, '#10141b');
  roundRect(ctx, cx - 11, o.y + 31, 22, 38, 12, '#2c3138');
  roundRect(ctx, cx - 13, o.y + 49, 26, 28, 10, '#9ecbd1');
  roundRect(ctx, cx - 10, o.y + 78, 20, 26, 9, '#111820');
  line(ctx, o.x + 6, o.y + 24, o.x + o.w - 6, o.y + 24, '#d8c4a4', 2.2);
  circle(ctx, cx, o.y + 8, 4, '#f1c66a');
}

function drawTopDownAtv(ctx, o) {
  const cx = o.x + o.w / 2;
  roundRect(ctx, o.x + 17, o.y + 14, o.w - 34, o.h - 28, 18, '#485c3f');
  roundRect(ctx, o.x + 25, o.y + 34, o.w - 50, 42, 12, '#789477');
  roundRect(ctx, o.x + 31, o.y + 53, o.w - 62, 24, 8, '#2f372c');
  drawAttachedAtvTire(ctx, o.x + 8, o.y + 28, 15, 25);
  drawAttachedAtvTire(ctx, o.x + o.w - 8, o.y + 28, 15, 25);
  drawAttachedAtvTire(ctx, o.x + 8, o.y + o.h - 30, 15, 25);
  drawAttachedAtvTire(ctx, o.x + o.w - 8, o.y + o.h - 30, 15, 25);
  line(ctx, o.x + 22, o.y + 16, o.x + o.w - 22, o.y + 16, '#111820', 3);
  line(ctx, cx - 18, o.y + o.h - 17, cx + 18, o.y + o.h - 17, '#111820', 3);
}

function drawAttachedAtvTire(ctx, x, y, rx, ry) {
  ctx.save();
  ctx.fillStyle = '#10141b';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#444f57';
  ctx.beginPath();
  ctx.ellipse(x, y, rx * .42, ry * .62, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTopDownTire(ctx, x, y, rx, ry, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
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
