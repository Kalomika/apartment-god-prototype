import { PLAY_W } from './config.js';
import { objects, roomAt } from './world.js';
import { formatTime } from './renderHelpers.js';

export function drawAfterEntityOverlays(ctx, state) {
  drawWardrobeOverlays(ctx, state);
  drawShowerPrivacyOverlays(ctx, state);
  drawCorrectSeatedPoseOverlays(ctx, state);
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

function drawCorrectSeatedPoseOverlays(ctx, state) {
  for (const actor of state.entities || []) {
    if (actor.hidden || actor.floor !== state.floor || actor.type !== 'person' || actorIsMoving(actor)) continue;
    const target = seatedFacingTarget(actor, state);
    if (!target) continue;
    const action = String(actor.action || '').toLowerCase();
    const tableMode = action.includes('eat') || action.includes('table') || action.includes('dining table');
    const seatedAction = tableMode || action.includes('couch') || action.includes('relax') || action.includes('watch') || action.includes('tv') || action.includes('desk') || action.includes('read') || action.includes('study') || action.includes('console') || action.includes('game');
    if (seatedAction) drawBackFacingSeatedActor(ctx, actor, target, { tableMode });
    else drawFacingGuide(ctx, actor, target);
  }
}

function drawBackFacingSeatedActor(ctx, actor, target, options = {}) {
  const tx = target.x + target.w / 2;
  const ty = target.y + target.h / 2;
  const angle = Math.atan2(ty - actor.y, tx - actor.x) + Math.PI / 2;
  const female = actor.id === 'girlfriend';
  const cloth = female ? '#17131b' : '#111820';
  const accent = female ? '#ff75df' : '#74e6ff';
  ctx.save();
  ctx.translate(actor.x, actor.y);
  ctx.rotate(angle);

  ctx.globalAlpha = .98;
  ctx.fillStyle = 'rgba(0,0,0,.36)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 34, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = cloth;
  ctx.strokeStyle = '#071018';
  ctx.lineWidth = 3;
  roundRect(ctx, -19, -8, 38, 42, 14, cloth, true);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.6;
  line(ctx, -8, -2, -8, 26, accent, 1.6);
  line(ctx, 8, -2, 8, 26, accent, 1.6);

  bentLeg(ctx, -12, 18, -28, 38, cloth, -.25);
  bentLeg(ctx, 12, 18, 28, 38, cloth, .25);
  if (options.tableMode) {
    arm(ctx, -17, -3, -23, -20, cloth);
    arm(ctx, 17, -3, 23, -20, cloth);
    tableHand(ctx, -23, -20, accent);
    tableHand(ctx, 23, -20, accent);
  } else {
    arm(ctx, -17, -3, -31, 18, cloth);
    arm(ctx, 17, -3, 31, 18, cloth);
  }

  ctx.fillStyle = '#05070a';
  ctx.strokeStyle = '#071018';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, -25, female ? 16 : 17, female ? 18 : 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = options.tableMode ? 'rgba(241,198,106,.13)' : 'rgba(116,230,255,.16)';
  ctx.beginPath();
  ctx.moveTo(0, -21);
  ctx.lineTo(-24, -52);
  ctx.lineTo(24, -52);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function tableHand(ctx, x, y, accent) {
  ctx.fillStyle = '#3a241f';
  ctx.strokeStyle = '#071018';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, y, 4.5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.fillRect(x - 2, y - 2, 4, 1);
}

function drawFacingGuide(ctx, actor, target) {
  const tx = target.x + target.w / 2;
  const ty = target.y + target.h / 2;
  const angle = Math.atan2(ty - actor.y, tx - actor.x);
  ctx.save();
  ctx.translate(actor.x, actor.y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.globalAlpha = .42;
  ctx.fillStyle = 'rgba(116,230,255,.12)';
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(-22, -48);
  ctx.lineTo(22, -48);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function seatedFacingTarget(actor, state) {
  const action = String(actor.action || '').toLowerCase();
  const pose = String(actor.pose || '').toLowerCase();
  const seated = pose === 'sit' || action.includes('watch') || action.includes('tv') || action.includes('couch') || action.includes('relax') || action.includes('console') || action.includes('game') || action.includes('desk') || action.includes('read') || action.includes('eat') || action.includes('table');
  if (!seated) return null;
  if (action.includes('eat') || action.includes('table') || action.includes('dining table')) return firstObject(state.floor, ['dining_table']);
  if (action.includes('watch') || action.includes('tv') || action.includes('couch') || action.includes('relax')) return firstObject(state.floor, ['bedroom_tv', 'tv', 'lab_motion_screen', 'game_console']);
  if (action.includes('console') || action.includes('game')) return firstObject(state.floor, ['game_console', 'lab_game_console', 'arcade_machine']);
  if (action.includes('desk') || action.includes('read') || action.includes('study')) return firstObject(state.floor, ['desk', 'lab_laptop_desk', 'bookshelf']);
  return null;
}

function firstObject(floor, ids) { return ids.map(id => objects.find(o => o.id === id && o.floor === floor)).find(Boolean) || null; }

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

function bentLeg(ctx, x1, y1, x2, y2, color, lean = 0) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo((x1 + x2) / 2 + lean * 18, (y1 + y2) / 2, x2, y2);
  ctx.stroke();
  ctx.strokeStyle = '#071018';
  ctx.lineWidth = 2.2;
  ctx.stroke();
}

function arm(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.strokeStyle = '#071018';
  ctx.lineWidth = 1.8;
  ctx.stroke();
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

function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
