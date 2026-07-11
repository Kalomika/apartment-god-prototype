import { PLAY_W } from './config.js';
import { objects, roomAt } from './world.js';
import { formatTime } from './renderHelpers.js';

export function drawAfterEntityOverlays(ctx, state) {
  drawWardrobeOverlays(ctx, state);
  drawShowerPrivacyOverlays(ctx, state);
  drawVehicleContrastLabels(ctx, state);
  drawCalendarSkipRecap(ctx, state);
}

function drawWardrobeOverlays(ctx, state) {
  const day = Math.floor((state.time || 0) / 1440) % 7;
  for (const actor of state.entities || []) {
    if (actor.hidden || actor.floor !== state.floor || actor.type !== 'person' || actor.labOnly) continue;
    const wardrobe = actor.wardrobe;
    if (!wardrobe?.colors?.length) continue;
    const color = wardrobe.colors[wardrobe.currentDay ?? day] || wardrobe.colors[day] || '#74e6ff';
    ctx.save();
    ctx.globalAlpha = .72;
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(7,16,24,.72)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, actor.x - 14, actor.y - 8, 28, 10, 5, color, true);
    ctx.restore();
  }
}

function drawShowerPrivacyOverlays(ctx, state) {
  const showering = (state.entities || []).filter(e => !e.hidden && e.floor === state.floor && isShowering(e));
  for (const actor of showering) {
    const shower = nearestShower(actor, state.floor);
    if (!shower || !isNearObject(actor, shower, 92)) continue;
    const x = actor.x;
    const y = actor.y;
    ctx.save();
    drawVideoCensorMosaic(ctx, x, y);
    drawFloorClothesPile(ctx, shower.x + shower.w + 22, shower.y + shower.h - 18, actor.id === 'girlfriend');
    drawHangingTowel(ctx, shower.x - 18, shower.y + shower.h - 18, actor.id === 'girlfriend');
    ctx.restore();
  }
}

function isShowering(entity) {
  const action = String(entity.action || '').toLowerCase();
  const pose = String(entity.pose || '').toLowerCase();
  return pose === 'shower' || action.includes('shower');
}

function nearestShower(actor, floor) {
  const actorRoom = roomAt(actor.x, actor.y, floor);
  const showers = objects.filter(o => o.floor === floor && o.kind === 'shower' && (!actorRoom || o.room === actorRoom.id));
  if (!showers.length) return null;
  return showers.sort((a, b) => distanceToObject(actor, a) - distanceToObject(actor, b))[0];
}

function isNearObject(actor, obj, radius) {
  return distanceToObject(actor, obj) <= radius;
}

function distanceToObject(actor, obj) {
  return Math.hypot(actor.x - (obj.x + obj.w / 2), actor.y - (obj.y + obj.h / 2));
}

function drawVideoCensorMosaic(ctx, x, y) {
  ctx.save();
  ctx.globalAlpha = .96;
  const cols = 5;
  const rows = 4;
  const size = 14;
  const startX = x - cols * size / 2;
  const startY = y - rows * size / 2 - 4;
  const colors = ['#d9e6ef', '#b9cbd8', '#eef6fb', '#8aa2b4', '#f8fbff'];
  ctx.strokeStyle = 'rgba(8,14,20,.82)';
  ctx.lineWidth = 2;
  roundRect(ctx, startX - 4, startY - 4, cols * size + 8, rows * size + 8, 5, 'rgba(7,16,24,.35)');
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = colors[(row * 2 + col) % colors.length];
      ctx.fillRect(startX + col * size, startY + row * size, size, size);
    }
  }
  ctx.strokeRect(startX - 1, startY - 1, cols * size + 2, rows * size + 2);
  ctx.globalAlpha = .35;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(startX, startY, cols * size, 5);
  ctx.restore();
}

function drawFloorClothesPile(ctx, x, y, female) {
  ctx.save();
  ctx.globalAlpha = .98;
  blob(ctx, x, y, 18, 8, female ? '#17131b' : '#111820');
  blob(ctx, x + 16, y + 5, 13, 7, female ? '#ff75df' : '#74e6ff');
  blob(ctx, x - 10, y + 8, 9, 6, '#05070a');
  blob(ctx, x + 2, y - 9, 10, 5, '#d8c4a4');
  ctx.fillStyle = '#071018';
  ctx.font = '900 8px system-ui';
  ctx.fillText('clothes', x - 18, y + 22);
  ctx.restore();
}

function drawHangingTowel(ctx, x, y, female) {
  ctx.save();
  ctx.globalAlpha = .96;
  roundRect(ctx, x - 10, y - 30, 20, 46, 7, female ? '#f4b5dd' : '#a8e9ff');
  ctx.strokeStyle = 'rgba(7,16,24,.55)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, x - 10, y - 30, 20, 46, 7, '', true);
  ctx.fillStyle = '#071018';
  ctx.font = '900 7px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('TOWEL', x, y + 28);
  ctx.textAlign = 'left';
  ctx.restore();
}

function drawVehicleContrastLabels(ctx, state) {
  if (state.floor !== 3) return;
  for (const vehicle of objects.filter(o => o.floor === 3 && ['car', 'bike', 'motorbike', 'atv'].includes(o.kind))) {
    if (state.objectState?.vehicleInUse === vehicle.id) continue;
    drawVehicleTag(ctx, vehicle.x + vehicle.w / 2, vehicle.y + vehicle.h / 2, vehicleShortLabel(vehicle));
  }
  const active = state.vehicleDeparture || state.vehicleReturn;
  if (active) drawVehicleTag(ctx, active.x + active.w / 2, active.y + active.h / 2, vehicleShortLabel(active));
}

function vehicleShortLabel(vehicle) {
  if (vehicle.vehicleId === 'car_1' || vehicle.id === 'car_1') return 'SUV';
  if (vehicle.vehicleId === 'car_2' || vehicle.id === 'car_2') return 'CONV';
  if (vehicle.vehicleKind === 'bike' || vehicle.kind === 'bike') return 'BIKE';
  if (vehicle.vehicleKind === 'motorbike' || vehicle.kind === 'motorbike') return 'MOTO';
  if (vehicle.vehicleKind === 'atv' || vehicle.kind === 'atv') return 'ATV';
  return 'CAR';
}

function drawVehicleTag(ctx, x, y, text) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 10px system-ui';
  const w = Math.max(40, text.length * 9 + 18);
  roundRect(ctx, x - w / 2, y - 11, w, 22, 7, '#f1c66a');
  ctx.strokeStyle = '#071018';
  ctx.lineWidth = 3;
  roundRect(ctx, x - w / 2, y - 11, w, 22, 7, '', true);
  ctx.fillStyle = '#071018';
  ctx.fillText(text, x, y + 1);
  ctx.restore();
}

function drawCalendarSkipRecap(ctx, state) {
  const recap = state.skipRecap;
  if (!recap || recap.visibleT <= 0) return;
  const x = PLAY_W - 382;
  const y = 92;
  const w = 360;
  const h = Math.min(230, 92 + (recap.days?.length || 0) * 24);
  ctx.save();
  ctx.fillStyle = 'rgba(8,10,15,.88)';
  roundRect(ctx, x, y, w, h, 14);
  ctx.strokeStyle = 'rgba(116,230,255,.68)';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 14, '', true);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 15px system-ui';
  ctx.fillText('Time Skip Recap', x + 16, y + 24);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '800 12px system-ui';
  ctx.fillText(`${recap.message || 'Skipped time'} • now ${formatTime(state.time)}`, x + 16, y + 44);
  const barX = x + 16;
  const barY = y + 58;
  const barW = w - 32;
  roundRect(ctx, barX, barY, barW, 10, 5, 'rgba(248,251,255,.18)');
  const pulse = .65 + Math.sin(performance.now() / 140) * .18;
  roundRect(ctx, barX, barY, barW * pulse, 10, 5, '#f1c66a');
  let yy = y + 88;
  for (const day of (recap.days || []).slice(0, 5)) {
    ctx.fillStyle = day.checked ? '#90d68c' : '#b6c1d2';
    ctx.font = '900 16px system-ui';
    ctx.fillText(day.checked ? '✓' : '•', x + 18, yy);
    ctx.fillStyle = '#f8fbff';
    ctx.font = '800 12px system-ui';
    ctx.fillText(day.label, x + 42, yy);
    if (day.events?.length) {
      ctx.fillStyle = '#f1c66a';
      ctx.font = '700 10px system-ui';
      ctx.fillText(day.events.slice(0, 2).join(', '), x + 42, yy + 14);
      yy += 10;
    }
    yy += 24;
  }
  ctx.restore();
}

function blob(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, Math.sin(x + y) * .2, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = '#071018';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r, fill = '', stroke = false) {
  if (fill) ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}