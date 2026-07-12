import { PLAY_W } from './config.js';
import { objects, roomAt } from './world.js';
import { formatTime } from './renderHelpers.js';

export function drawAfterEntityOverlays(ctx, state) {
  drawWardrobeOverlays(ctx, state);
  drawShowerPrivacyOverlays(ctx, state);
  drawSeatedFacingOverlays(ctx, state);
  drawVehicleContrastLabels(ctx, state);
  drawCalendarSkipRecap(ctx, state);
}

function actorIsMoving(actor) {
  const action = String(actor.action || '').toLowerCase();
  const pose = String(actor.pose || '').toLowerCase();
  return Boolean(actor.path?.length) || Boolean(actor.target) || pose === 'walk' || action.includes('heading') || action.includes('walking to');
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
    roundRect(ctx, actor.x - 14, actor.y - 8, 28, 10, 5, color, true);
    ctx.restore();
  }
}

function drawShowerPrivacyOverlays(ctx, state) {
  const showering = (state.entities || []).filter(e => !e.hidden && e.floor === state.floor && isShowering(e) && !actorIsMoving(e));
  for (const actor of showering) {
    const shower = nearestShower(actor, state.floor);
    if (!shower || !isNearObject(actor, shower, 92)) continue;
    ctx.save();
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

function isNearObject(actor, obj, radius) { return distanceToObject(actor, obj) <= radius; }
function distanceToObject(actor, obj) { return Math.hypot(actor.x - (obj.x + obj.w / 2), actor.y - (obj.y + obj.h / 2)); }

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

function drawSeatedFacingOverlays(ctx, state) {
  for (const actor of state.entities || []) {
    if (actor.hidden || actor.floor !== state.floor || actor.type !== 'person' || actorIsMoving(actor)) continue;
    const target = seatedFacingTarget(actor, state);
    if (!target) continue;
    const tx = target.x + target.w / 2;
    const ty = target.y + target.h / 2;
    const angle = Math.atan2(ty - actor.y, tx - actor.x);
    ctx.save();
    ctx.translate(actor.x, actor.y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.globalAlpha = .9;
    ctx.fillStyle = 'rgba(116,230,255,.12)';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(-22, -48);
    ctx.lineTo(22, -48);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#05070a';
    ctx.strokeStyle = '#071018';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -29, 15, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1c66a';
    ctx.font = '900 7px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('VIEW', 0, -49);
    ctx.restore();
  }
}

function seatedFacingTarget(actor, state) {
  const action = String(actor.action || '').toLowerCase();
  const pose = String(actor.pose || '').toLowerCase();
  const seated = pose === 'sit' || action.includes('watch') || action.includes('tv') || action.includes('couch') || action.includes('relax') || action.includes('console') || action.includes('game') || action.includes('desk') || action.includes('read') || action.includes('eat');
  if (!seated) return null;
  if (action.includes('watch') || action.includes('tv') || action.includes('couch') || action.includes('relax')) return firstObject(state.floor, ['bedroom_tv', 'tv', 'lab_motion_screen', 'game_console']);
  if (action.includes('console') || action.includes('game')) return firstObject(state.floor, ['game_console', 'lab_game_console', 'arcade_machine']);
  if (action.includes('desk') || action.includes('read') || action.includes('study')) return firstObject(state.floor, ['desk', 'lab_laptop_desk', 'bookshelf']);
  if (action.includes('eat')) return firstObject(state.floor, ['dining_table']);
  return null;
}

function firstObject(floor, ids) { return ids.map(id => objects.find(o => o.id === id && o.floor === floor)).find(Boolean) || null; }

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
  roundRect(ctx, x, y, w, h, 14, 'rgba(8,10,15,.88)');
  ctx.strokeStyle = 'rgba(116,230,255,.68)';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 14, '', true);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 15px system-ui';
  ctx.fillText('Time Skip Recap', x + 16, y + 24);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '800 12px system-ui';
  ctx.fillText(`${recap.message || 'Skipped time'} • now ${formatTime(state.time)}`, x + 16, y + 44);
  let yy = y + 88;
  for (const day of (recap.days || []).slice(0, 5)) {
    ctx.fillStyle = day.checked ? '#90d68c' : '#b6c1d2';
    ctx.font = '900 16px system-ui';
    ctx.fillText(day.checked ? '✓' : '•', x + 18, yy);
    ctx.fillStyle = '#f8fbff';
    ctx.font = '800 12px system-ui';
    ctx.fillText(day.label, x + 42, yy);
    if (day.events?.length) { ctx.fillStyle = '#f1c66a'; ctx.font = '700 10px system-ui'; ctx.fillText(day.events.slice(0, 2).join(', '), x + 42, yy + 14); yy += 10; }
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
