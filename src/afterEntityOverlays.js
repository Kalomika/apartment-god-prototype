import { PLAY_W } from './config.js';
import { objects, roomAt } from './world.js';
import { formatTime } from './renderHelpers.js';

export function drawAfterEntityOverlays(ctx, state) {
  drawWardrobeOverlays(ctx, state);
  drawShowerPrivacyOverlays(ctx, state);
  drawDeskChairBackOverlays(ctx, state);
  drawSleepHeadOrientationFixes(ctx, state);
  drawUpgradedDogOverlays(ctx, state);
  drawReadableVanitySinks(ctx, state);
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
  const showering = (state.entities || []).filter(e => !e.hidden && e.floor === state.floor && isActiveShower(e) && !actorIsMoving(e));
  for (const actor of showering) {
    const shower = objects.find(o => o.id === actor.showerObjectId) || nearestShower(actor, state.floor);
    if (!shower || !isNearObject(actor, shower, 92)) continue;
    ctx.save();
    drawFloorClothesPile(ctx, shower.x + shower.w + 22, shower.y + shower.h - 18, actor.id === 'girlfriend');
    drawHangingTowel(ctx, shower.x - 18, shower.y + shower.h - 18, actor.id === 'girlfriend');
    ctx.restore();
  }
}

function isActiveShower(entity) {
  return entity.actionT > 0 && (entity.currentActionId === 'shower' || entity.pose === 'shower');
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
  ctx.restore();
}

function drawHangingTowel(ctx, x, y, female) {
  ctx.save();
  ctx.globalAlpha = .96;
  roundRect(ctx, x - 10, y - 30, 20, 46, 7, female ? '#f4b5dd' : '#f3f1ea');
  ctx.strokeStyle = 'rgba(7,16,24,.55)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, x - 10, y - 30, 20, 46, 7, '', true);
  ctx.restore();
}

function drawDeskChairBackOverlays(ctx, state) {
  for (const actor of state.entities || []) {
    if (actor.hidden || actor.floor !== state.floor || actor.type !== 'person' || actorIsMoving(actor)) continue;
    const action = String(actor.action || '').toLowerCase();
    const pose = String(actor.pose || '').toLowerCase();
    if (!action.includes('desk') && !action.includes('laptop') && !action.includes('study') && !action.includes('work') && !pose.includes('desk')) continue;
    ctx.save();
    roundRect(ctx, actor.x - 25, actor.y + 6, 50, 28, 10, '#26313b');
    roundRect(ctx, actor.x - 19, actor.y + 10, 38, 18, 8, '#6e7b86');
    line(ctx, actor.x - 18, actor.y + 28, actor.x - 26, actor.y + 42, '#1c252b', 3);
    line(ctx, actor.x + 18, actor.y + 28, actor.x + 26, actor.y + 42, '#1c252b', 3);
    ctx.restore();
  }
}

function drawSleepHeadOrientationFixes(ctx, state) {
  for (const actor of state.entities || []) {
    if (actor.hidden || actor.floor !== state.floor || actor.type !== 'person') continue;
    if (!isSleeping(actor)) continue;
    const female = actor.id === 'girlfriend';
    ctx.save();
    roundRect(ctx, actor.x - 52, actor.y - 22, 34, 44, 12, '#e5edf4');
    roundRect(ctx, actor.x - 42, actor.y - 19, 28, 38, 11, 'rgba(229,237,244,.96)');
    ctx.fillStyle = '#3a241f';
    ctx.strokeStyle = '#071018';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(actor.x - 29, actor.y, female ? 18 : 17, female ? 13 : 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#05070a';
    ctx.beginPath();
    ctx.ellipse(actor.x - 37, actor.y - 1, female ? 11 : 10, female ? 14 : 12, 0, 0, Math.PI * 2);
    ctx.fill();
    line(ctx, actor.x - 22, actor.y + 1, actor.x - 15, actor.y + 1, '#f0d7bd', 1.1);
    ctx.restore();
  }
}

function isSleeping(actor) {
  const action = String(actor.action || '').toLowerCase();
  const pose = String(actor.pose || '').toLowerCase();
  return pose.includes('sleep') || action.includes('sleep') || action.includes('nap') || action.includes('waking') || action.includes('bed together');
}

function drawUpgradedDogOverlays(ctx, state) {
  for (const dog of state.entities || []) {
    if (dog.hidden || dog.floor !== state.floor || dog.type !== 'dog') continue;
    ctx.save();
    ctx.translate(dog.x, dog.y);
    ctx.rotate(dogHeading(dog));
    drawTopDownDog(ctx, dog);
    ctx.restore();
  }
}

function dogHeading(dog) {
  const target = dog.path?.[0] || dog.target;
  const dx = dog.vx || (target ? target.x - dog.x : 0);
  const dy = dog.vy || (target ? target.y - dog.y : 0);
  if (Math.abs(dx) + Math.abs(dy) > 0.01) {
    dog.lastHeading = Math.atan2(dy, dx) + Math.PI / 2;
    return dog.lastHeading;
  }
  return dog.lastHeading || 0;
}

function drawTopDownDog(ctx, dog) {
  const action = String(dog.action || '').toLowerCase();
  const resting = action.includes('dog bed') || action.includes('rest') || action.includes('sleep');
  const moving = Boolean(dog.path?.length) || Boolean(dog.target) || action.includes('fetch') || action.includes('ball');
  const step = resting ? 0 : moving ? [-1, .5, 1, -.5][Math.floor(performance.now() / 110) % 4] : Math.sin(performance.now() / 600) * .18;
  const coat = '#e7dfcf';
  const shade = '#b9a98f';
  ctx.save();
  ctx.globalAlpha = 0.99;
  ctx.fillStyle = 'rgba(0,0,0,.26)';
  ctx.beginPath();
  ctx.ellipse(0, 10, resting ? 38 : 34, resting ? 18 : 21, 0, 0, Math.PI * 2);
  ctx.fill();
  dogLeg(ctx, -13, 8, -21 - step * 4, 30, 5.5, coat);
  dogLeg(ctx, 12, 8, 20 + step * 4, 30, 5.5, coat);
  dogLeg(ctx, -15, -9, -28 + step * 5, -28, 5, coat);
  dogLeg(ctx, 15, -9, 28 - step * 5, -28, 5, coat);
  ctx.beginPath(); ctx.ellipse(0, 0, 31, 18, 0, 0, Math.PI * 2); ctx.fillStyle = coat; ctx.fill(); ctx.strokeStyle = '#071018'; ctx.lineWidth = 2.3; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-7, 2, 14, 10, 0, 0, Math.PI * 2); ctx.fillStyle = shade; ctx.globalAlpha = .34; ctx.fill(); ctx.globalAlpha = .99;
  ctx.beginPath(); ctx.ellipse(25, -12, 15, 11, 0, 0, Math.PI * 2); ctx.fillStyle = coat; ctx.fill(); ctx.strokeStyle = '#071018'; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(18, -22, 5, 11, -.25, 0, Math.PI * 2); ctx.fillStyle = shade; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(31, -24, 5, 10, .25, 0, Math.PI * 2); ctx.fillStyle = shade; ctx.fill(); ctx.stroke();
  circle(ctx, 37, -12, 4.5, '#071018');
  roundRect(ctx, 10, -18, 22, 4, 2, '#44c7df');
  ctx.strokeStyle = '#071018'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-28, -2); ctx.quadraticCurveTo(-48, -16 - step * 4, -55, -1 - step * 2); ctx.stroke();
  ctx.restore();
}

function dogLeg(ctx, x1, y1, x2, y2, width, color) { line(ctx, x1, y1, x2, y2, color, width); line(ctx, x1, y1, x2, y2, '#071018', 1.2); }

function drawReadableVanitySinks(ctx, state) {
  for (const sink of objects.filter(o => o.floor === state.floor && o.kind === 'sink')) {
    ctx.save();
    if (sink.vanity === 'double') drawDoubleVanity(ctx, sink);
    else drawReadableSink(ctx, sink);
    ctx.restore();
  }
}

function drawReadableSink(ctx, sink) {
  roundRect(ctx, sink.x - 3, sink.y - 3, sink.w + 6, sink.h + 6, 9, '#5f6c6d');
  roundRect(ctx, sink.x + 4, sink.y + 5, sink.w - 8, sink.h - 10, 8, '#ece5d8');
  ctx.fillStyle = '#a8d3db';
  ctx.beginPath();
  ctx.ellipse(sink.x + sink.w / 2, sink.y + sink.h / 2 + 2, Math.max(12, sink.w * .28), Math.max(7, sink.h * .22), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#66737b'; ctx.lineWidth = 1.5; ctx.stroke();
  circle(ctx, sink.x + sink.w / 2, sink.y + sink.h / 2 + 2, 3, '#4e5964');
}

function drawDoubleVanity(ctx, sink) {
  roundRect(ctx, sink.x - 4, sink.y - 4, sink.w + 8, sink.h + 8, 8, '#5f5145');
  roundRect(ctx, sink.x + 4, sink.y + 6, sink.w - 8, sink.h - 12, 7, '#8f765f');
  for (const y of [sink.y + sink.h * .32, sink.y + sink.h * .68]) {
    ctx.fillStyle = '#ece5d8';
    ctx.beginPath(); ctx.ellipse(sink.x + sink.w * .58, y, 14, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#66737b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#a8d3db'; ctx.beginPath(); ctx.ellipse(sink.x + sink.w * .58, y, 8, 13, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, sink.x + sink.w * .58, y, 2.8, '#4e5964');
    line(ctx, sink.x + 8, y - 15, sink.x + 8, y + 15, '#cfd9dc', 3);
  }
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
  ctx.restore();
}

function blob(ctx, x, y, rx, ry, fill) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, Math.sin(x + y) * .2, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = '#071018'; ctx.lineWidth = 1.5; ctx.stroke(); }
function roundRect(ctx, x, y, w, h, r, fill = '', stroke = false) { if (fill) ctx.fillStyle = fill; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r)); else ctx.rect(x, y, Math.max(1, w), Math.max(1, h)); if (fill) ctx.fill(); if (stroke) ctx.stroke(); }
function line(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function circle(ctx, x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
