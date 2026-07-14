import { COLORS } from './config.js';
import { roundRect } from './renderHelpers.js';
import { getObject } from './world.js';

const INK = '#071018';
const SKIN = '#3a241f';
const SKIN_LIT = '#5a372f';
const HAIR = '#05070a';
const CYAN = '#74e6ff';
const MAGENTA = '#ff75df';
const DOG_COAT = '#f6f2e8';
const DOG_SHADE = '#d8d0c0';
const CLOTH = {
  resident: '#111820',
  girlfriend: '#17131b',
  lab_test_subject: '#102833',
  pjResident: '#24324a',
  pjGirlfriend: '#3a2438'
};

const lastRenderPositions = new WeakMap();

export function drawEntities(ctx, state) {
  for (const entity of state.entities.filter(e => !e.hidden && e.floor === state.floor)) {
    if (entity.type === 'dog') continue;
    drawTopDownActor(ctx, entity, state.selectedId === entity.id);
  }
}

function drawTopDownActor(ctx, actor, selected) {
  const female = actor.id === 'girlfriend';
  const accent = female ? MAGENTA : CYAN;
  const cloth = CLOTH[actor.id] || CLOTH.resident;
  const key = `${actor.currentActionId || ''} ${actor.action || ''} ${actor.pose || ''}`.toLowerCase();
  const sleeping = isBedSleepKey(key);
  const movedThisFrame = movedSinceLastRender(actor);
  const moving = isMoving(actor, key) || movedThisFrame;
  const anchor = renderAnchor(actor, key);

  ctx.save();
  ctx.translate(anchor.x, anchor.y);
  if (selected) drawSelectionRing(ctx, actor.type);
  rememberHeading(actor, key, moving);
  drawGroundShadow(ctx, moving, sleeping);
  drawPerson(ctx, actor, female, cloth, accent, key, moving);
  if (actor.carrying === 'towel' || key.includes('towel')) drawTowelWrap(ctx, female);
  if (actor.actionT > 0) drawActionBar(ctx, actor);
  if (actor.reaction?.t > 0) drawReactionBubble(ctx, actor.reaction);
  if (actor.bubble && actor.bubbleT > 0) drawBubble(ctx, actor.bubble, actor.reaction?.style || 'speech');
  ctx.restore();
}

function renderAnchor(actor, key) {
  if (isBedSleepKey(key)) {
    const bed = getObject(actor.sleepObjectId || 'bed');
    if (bed && bed.floor === actor.floor) {
      const lane = actor.id === 'girlfriend' ? 0.64 : 0.38;
      if (bed.facing === 'east' || bed.headboard === 'west') return { x: bed.x + bed.w * 0.56, y: bed.y + bed.h * lane };
      if (bed.facing === 'west' || bed.headboard === 'east') return { x: bed.x + bed.w * 0.44, y: bed.y + bed.h * lane };
      return { x: bed.x + bed.w * lane, y: bed.y + bed.h * 0.55 };
    }
  }
  return { x: actor.x, y: actor.y };
}

function isBedSleepKey(key) {
  if (!key) return false;
  if (key.includes('bed together') || key.includes('bed_together') || key.includes('king bed') || key.includes('waking')) return true;
  if (key.includes('sleep') && !key.includes('dog')) return true;
  if (key.includes('nap') && !key.includes('dog')) return true;
  return false;
}

function movedSinceLastRender(actor) {
  if (Number(actor.actionT || 0) > 0 || isBedSleepKey(`${actor.currentActionId || ''} ${actor.action || ''} ${actor.pose || ''}`.toLowerCase())) return false;
  const last = lastRenderPositions.get(actor);
  const current = { x: Number(actor.x || 0), y: Number(actor.y || 0) };
  lastRenderPositions.set(actor, current);
  if (!last) return false;
  return Math.hypot(current.x - last.x, current.y - last.y) > 0.15;
}

function isMoving(actor, key) {
  const busy = Number(actor.actionT || 0) > 0;
  const walkPose = String(actor.pose || '').toLowerCase() === 'walk';
  if (busy && !walkPose) return false;
  return Boolean(actor.path?.length) || Boolean(actor.target) || walkPose || key.includes('walking to') || key.includes('heading') || key.includes('walk') || key.includes('going to');
}

function rememberHeading(actor, key, moving) {
  const dx = actor.vx || (actor.target ? actor.target.x - actor.x : 0);
  const dy = actor.vy || (actor.target ? actor.target.y - actor.y : 0);
  if (moving && Math.abs(dx) + Math.abs(dy) >= 0.01) actor.lastHeading = Math.atan2(dy, dx) + Math.PI / 2;
  else if (!moving && ['tv', 'couch', 'watch', 'desk', 'study', 'read', 'eat', 'table', 'sleep', 'nap', 'shower', 'wash dog', 'brush', 'tooth', 'toilet', 'pee', 'lift', 'treadmill', 'heavy bag'].some(t => key.includes(t))) actor.lastHeading = 0;
  return actor.lastHeading || 0;
}

function drawSelectionRing(ctx, type) {
  ctx.strokeStyle = COLORS.active;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 5, type === 'dog' ? 30 : 34, type === 'dog' ? 24 : 26, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawGroundShadow(ctx, moving, sleeping) {
  if (sleeping) return ellipse(ctx, 4, 12, 48, 25, 'rgba(0,0,0,.20)');
  ellipse(ctx, 0, 12, moving ? 36 : 31, moving ? 18 : 15, 'rgba(0,0,0,.22)');
}

function drawPerson(ctx, actor, female, cloth, accent, key, moving) {
  if (moving) return drawWalkPose(ctx, female, cloth, accent);
  if (key.includes('pee_stand') || key.includes('pee standing')) return drawStandingPeePose(ctx, female, cloth, accent);
  if (key.includes('toilet_sit') || (key.includes('toilet') && !key.includes('no route'))) return drawToiletPose(ctx, female, cloth, accent);
  if (key.includes('brush_teeth') || key.includes('brush teeth') || key.includes('tooth')) return drawBrushTeethPose(ctx, female, cloth, accent);
  if (key.includes('lift_weights') || key.includes('lift weights')) return drawLiftPose(ctx, female, cloth, accent);
  if (key.includes('treadmill')) return drawTreadmillPose(ctx, female, cloth, accent);
  if (key.includes('heavy_bag') || key.includes('heavy bag')) return drawBoxingPose(ctx, female, cloth, accent);
  if (key.includes('shower')) return drawShowerPose(ctx, female, accent);
  if (key.includes('wash_dog') || key.includes('wash dog')) return drawWashDogPose(ctx, female, cloth, accent);
  if (isBedSleepKey(key)) return drawSleepPose(ctx, actor, female, accent);
  if (isSitting(key)) return drawSeatedPose(ctx, female, cloth, accent, key);
  drawIdlePose(ctx, female, cloth, accent);
}

function isSitting(key) {
  return ['sit', 'tv', 'watch', 'desk', 'study', 'read', 'phone', 'game', 'shop', 'eat', 'table', 'relax', 'console', 'arcade', 'pool'].some(t => key.includes(t));
}

function drawIdlePose(ctx, female, cloth, accent) {
  humanCore(ctx, female, cloth, accent, Math.sin(performance.now() / 620) * 0.65, false);
}

function drawWalkPose(ctx, female, cloth, accent) {
  const step = [-1.25, 0.65, 1.25, -0.65][Math.floor(performance.now() / 105) % 4];
  ellipse(ctx, 0, 10, 36, 44, 'rgba(0,0,0,.22)');
  leg(ctx, -8, 13, -13 - step * 6, 36 + Math.max(step, 0) * 5, cloth, -0.08);
  leg(ctx, 8, 13, 13 + step * 6, 36 + Math.max(-step, 0) * 5, cloth, 0.08);
  torso(ctx, female, cloth, accent, 42);
  arm(ctx, -16, -8, -29 + step * 6, 10 - step * 7, cloth);
  arm(ctx, 16, -8, 29 - step * 6, 10 + step * 7, cloth);
  hand(ctx, -29 + step * 6, 10 - step * 7, accent);
  hand(ctx, 29 - step * 6, 10 + step * 7, accent);
  head(ctx, female, 0, -37);
  motionTicks(ctx, step, accent);
}

function motionTicks(ctx, step, accent) {
  ctx.save();
  ctx.globalAlpha = 0.28;
  line(ctx, -31, 32 + Math.abs(step) * 2, -43, 38, accent, 1.4);
  line(ctx, 31, 32 + Math.abs(step) * 2, 43, 38, accent, 1.4);
  ctx.restore();
}

function drawSeatedPose(ctx, female, cloth, accent, key) {
  const tap = Math.sin(performance.now() / 95);
  ellipse(ctx, 0, 12, 36, 32, 'rgba(0,0,0,.20)');
  bentLeg(ctx, -10, 12, -23, 31, cloth, -0.18);
  bentLeg(ctx, 10, 12, 23, 31, cloth, 0.18);
  torso(ctx, female, cloth, accent, 36);
  if (key.includes('tv') || key.includes('watch')) {
    arm(ctx, -17, -6, -30, 14, cloth); arm(ctx, 17, -6, 30, 14, cloth); hand(ctx, -30, 14, accent); hand(ctx, 30, 14, accent);
    glowQuad(ctx, -42, -50, 42, -50, 26, 12, -26, 12, accent, 0.18);
  } else if (key.includes('desk') || key.includes('study') || key.includes('game') || key.includes('shop')) {
    arm(ctx, -17, -6, -23, 24 + tap, cloth); arm(ctx, 17, -6, 23, 24 - tap, cloth); hand(ctx, -23, 24 + tap, accent); hand(ctx, 23, 24 - tap, accent);
    laptop(ctx, 0, 31);
  } else if (key.includes('read')) {
    arm(ctx, -17, -6, -24, 22, cloth); arm(ctx, 17, -6, 24, 22, cloth); hand(ctx, -24, 22, accent); hand(ctx, 24, 22, accent);
    book(ctx, 0, 29);
  } else if (key.includes('phone')) {
    arm(ctx, -16, -6, -8, 24, cloth); arm(ctx, 16, -6, 8, 24, cloth); hand(ctx, -8, 24, accent); hand(ctx, 8, 24, accent);
    phone(ctx, 0, 29);
  } else if (key.includes('eat') || key.includes('table')) {
    arm(ctx, -17, -6, -18, 23, cloth); arm(ctx, 17, -6, 18, 23, cloth); hand(ctx, -18, 23, accent); hand(ctx, 18, 23, accent);
    plate(ctx, 0, 32);
  } else {
    arm(ctx, -17, -6, -28, 13, cloth); arm(ctx, 17, -6, 28, 13, cloth); hand(ctx, -28, 13, accent); hand(ctx, 28, 13, accent);
  }
  head(ctx, female, 0, -35);
}

function drawLiftPose(ctx, female, cloth, accent) {
  const pump = Math.sin(performance.now() / 135) * 6;
  ellipse(ctx, 0, 14, 42, 25, 'rgba(0,0,0,.24)');
  torso(ctx, female, cloth, accent, 38);
  head(ctx, female, 0, -35);
  line(ctx, -37, -24 + pump, 37, -24 + pump, '#1f2630', 5);
  ellipse(ctx, -45, -24 + pump, 7, 14, '#2a3140', INK, 2);
  ellipse(ctx, 45, -24 + pump, 7, 14, '#2a3140', INK, 2);
  arm(ctx, -15, -9, -32, -24 + pump, cloth); arm(ctx, 15, -9, 32, -24 + pump, cloth);
  hand(ctx, -32, -24 + pump, accent); hand(ctx, 32, -24 + pump, accent);
  bentLeg(ctx, -10, 12, -22, 31, cloth, -0.2);
  bentLeg(ctx, 10, 12, 22, 31, cloth, 0.2);
}

function drawTreadmillPose(ctx, female, cloth, accent) {
  const step = [-1, 0.65, 1, -0.65][Math.floor(performance.now() / 95) % 4];
  roundRect(ctx, -34, 22, 68, 18, 7, '#242b35');
  line(ctx, -28, 20, -20, -12, '#9fa6ad', 3); line(ctx, 28, 20, 20, -12, '#9fa6ad', 3); line(ctx, -24, -12, 24, -12, '#9fa6ad', 3);
  leg(ctx, -8, 12, -17 - step * 6, 35, cloth, -0.12); leg(ctx, 8, 12, 17 + step * 6, 35, cloth, 0.12);
  torso(ctx, female, cloth, accent, 41);
  arm(ctx, -15, -7, -23, -12, cloth); arm(ctx, 15, -7, 23, -12, cloth); hand(ctx, -23, -12, accent); hand(ctx, 23, -12, accent);
  head(ctx, female, 0, -37);
}

function drawBoxingPose(ctx, female, cloth, accent) {
  const jab = Math.sin(performance.now() / 130) > 0 ? 1 : -1;
  humanCore(ctx, female, cloth, accent, 0, false);
  const gloveX = jab > 0 ? 39 : -39;
  const gloveY = -6;
  ellipse(ctx, gloveX, gloveY, 8, 7, accent, INK, 2);
  ctx.fillStyle = '#f1c66a'; ctx.font = '900 8px system-ui'; ctx.fillText('BAG', gloveX + (jab > 0 ? 5 : -25), gloveY - 12);
}

function drawShowerPose(ctx, female, accent) {
  ellipse(ctx, 0, 13, 34, 38, 'rgba(0,0,0,.18)');
  roundRect(ctx, -15, -5, 30, 39, 10, female ? '#f3badf' : '#f3f1ea');
  head(ctx, female, 0, -35);
  ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath();
  for (let i = 0; i < 4; i++) { ctx.moveTo(-23 + i * 15, -55); ctx.lineTo(-29 + i * 14, -31); }
  ctx.stroke();
}

function drawStandingPeePose(ctx, female, cloth, accent) {
  ellipse(ctx, 0, 10, 34, 43, 'rgba(0,0,0,.22)');
  leg(ctx, -8, 13, -12, 38, cloth, -0.08);
  leg(ctx, 8, 13, 12, 38, cloth, 0.08);
  torso(ctx, female, cloth, accent, 42);
  arm(ctx, -16, -8, -24, 12, cloth);
  arm(ctx, 16, -8, 20, 18, cloth);
  hand(ctx, -24, 12, accent);
  hand(ctx, 20, 18, accent);
  head(ctx, female, 0, -37);
  ctx.save();
  ctx.globalAlpha = 0.55;
  line(ctx, 0, 33, 0, 47, '#e0d7aa', 1.4);
  ctx.restore();
}

function drawToiletPose(ctx, female, cloth, accent) {
  ellipse(ctx, 0, 18, 38, 23, 'rgba(0,0,0,.18)');
  roundRect(ctx, -20, 14, 40, 26, 10, '#e8edf2');
  bentLeg(ctx, -10, 10, -23, 30, cloth, -0.16);
  bentLeg(ctx, 10, 10, 23, 30, cloth, 0.16);
  torso(ctx, female, cloth, accent, 35);
  arm(ctx, -16, -7, -26, 14, cloth);
  arm(ctx, 16, -7, 26, 14, cloth);
  hand(ctx, -26, 14, accent);
  hand(ctx, 26, 14, accent);
  head(ctx, female, 0, -34);
}

function drawBrushTeethPose(ctx, female, cloth, accent) {
  const scrub = Math.sin(performance.now() / 80) * 4;
  ellipse(ctx, 0, 10, 34, 43, 'rgba(0,0,0,.20)');
  leg(ctx, -8, 13, -12, 37, cloth, -0.08);
  leg(ctx, 8, 13, 12, 37, cloth, 0.08);
  torso(ctx, female, cloth, accent, 42);
  arm(ctx, -16, -8, -26, 13, cloth);
  arm(ctx, 16, -8, 7 + scrub, -25, cloth);
  hand(ctx, -26, 13, accent);
  hand(ctx, 7 + scrub, -25, accent);
  head(ctx, female, 0, -37);
  line(ctx, 3 + scrub, -22, 14 + scrub, -22, '#f4f7fb', 2.2);
  ctx.save();
  ctx.globalAlpha = 0.45;
  ellipse(ctx, 24, -19, 4, 3, '#d9fbff');
  ellipse(ctx, 29, -16, 3, 2, '#d9fbff');
  ctx.restore();
}

function drawWashDogPose(ctx, female, cloth, accent) {
  const scrub = Math.sin(performance.now() / 120) * 5;
  bentLeg(ctx, -10, 10, -24, 30, cloth, -0.2); bentLeg(ctx, 10, 10, 22, 30, cloth, 0.2);
  torso(ctx, female, cloth, accent, 35);
  arm(ctx, -17, -7, -22 + scrub, 22, cloth); arm(ctx, 17, -7, 23 + scrub, 22, cloth);
  hand(ctx, -22 + scrub, 22, accent); hand(ctx, 23 + scrub, 22, accent);
  head(ctx, female, 0, -34);
  ellipse(ctx, 0, 36, 28, 13, DOG_COAT, INK, 2);
  ellipse(ctx, 20, 30, 10, 8, DOG_COAT, INK, 2);
  ellipse(ctx, -12, 24, 4, 6, DOG_SHADE, INK, 1);
  for (let i = 0; i < 4; i++) ellipse(ctx, -17 + i * 10, 18 + Math.sin(i + scrub) * 2, 4, 3, 'rgba(235,250,255,.75)');
}

function drawSleepPose(ctx, actor, female, accent) {
  const waking = `${actor.action || ''}`.toLowerCase().includes('waking');
  const pj = female ? CLOTH.pjGirlfriend : CLOTH.pjResident;
  const blanket = female ? '#9f6b8e' : '#60718f';
  ctx.save();
  ctx.rotate(-Math.PI / 2 + 0.08);
  ellipse(ctx, 3, 8, 46, 24, 'rgba(0,0,0,.18)');
  limb(ctx, -10, 14, -19, 33, 8, pj); limb(ctx, 10, 14, 19, 33, 8, pj);
  torso(ctx, female, pj, accent, 42);
  arm(ctx, -16, -8, -26, 8, pj); arm(ctx, 16, -8, 26, 8, pj);
  hand(ctx, -26, 8, accent); hand(ctx, 26, 8, accent);
  roundRect(ctx, waking ? -6 : -4, 0, waking ? 60 : 66, waking ? 35 : 42, 15, blanket);
  ctx.strokeStyle = 'rgba(255,255,255,.20)'; ctx.lineWidth = 2; ctx.beginPath();
  ctx.moveTo(4, 9); ctx.quadraticCurveTo(25, 18, 50, 9); ctx.moveTo(6, 24); ctx.quadraticCurveTo(28, 33, 55, 24); ctx.stroke();
  head(ctx, female, -21, -8);
  ctx.restore();
  drawZs(ctx, accent);
}

function humanCore(ctx, female, cloth, accent, step, seated) {
  ellipse(ctx, 0, 8, 34, 45, 'rgba(0,0,0,.22)');
  leg(ctx, -8, 14, -12 - step * 3, seated ? 28 : 38 + Math.abs(step) * 2, cloth, -0.08);
  leg(ctx, 8, 14, 12 + step * 3, seated ? 28 : 38 - Math.abs(step) * 2, cloth, 0.08);
  torso(ctx, female, cloth, accent, seated ? 36 : 44);
  arm(ctx, -16, -8, -28, 10 - step * 4, cloth);
  arm(ctx, 16, -8, 28, 10 + step * 4, cloth);
  hand(ctx, -29, 12 - step * 4, accent);
  hand(ctx, 29, 12 + step * 4, accent);
  head(ctx, female, 0, -37);
}

function torso(ctx, female, cloth, accent, h) {
  const shoulder = female ? 29 : 34;
  const hip = female ? 24 : 28;
  ctx.beginPath();
  ctx.moveTo(-shoulder / 2, -11);
  ctx.quadraticCurveTo(-shoulder * 0.48, 0, -hip / 2, h * 0.45);
  ctx.lineTo(hip / 2, h * 0.45);
  ctx.quadraticCurveTo(shoulder * 0.48, 0, shoulder / 2, -11);
  ctx.closePath();
  ctx.fillStyle = cloth;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-shoulder * 0.30, -7);
  ctx.lineTo(-hip * 0.23, h * 0.34);
  ctx.moveTo(shoulder * 0.30, -7);
  ctx.lineTo(hip * 0.23, h * 0.34);
  ctx.stroke();
}

function head(ctx, female, x, y) {
  ellipse(ctx, x, y + 12, 8, 7, SKIN, INK, 2);
  ellipse(ctx, x, y, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.5);
  ellipse(ctx, x, y + 2, female ? 10 : 11, female ? 11 : 10, SKIN_LIT);
  hair(ctx, female, x, y);
  eye(ctx, x - 5, y + 1);
  eye(ctx, x + 5, y + 1);
  line(ctx, x - 4, y + 6, x + 4, y + 6, '#f0d7bd', 1);
}

function hair(ctx, female, x, y) {
  ctx.fillStyle = HAIR;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (female) {
    ctx.ellipse(x, y - 6, 19, 15, 0, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill(); ctx.stroke();
    ellipse(ctx, x - 15, y + 3, 5, 9, HAIR, INK, 1);
    ellipse(ctx, x + 15, y + 3, 5, 9, HAIR, INK, 1);
  } else {
    ctx.ellipse(x, y - 6, 16, 11, 0, Math.PI, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }
}

function eye(ctx, x, y) { ellipse(ctx, x, y, 1.8, 1.2, '#f3d4b7'); ellipse(ctx, x, y, 0.8, 0.8, INK); }
function arm(ctx, x1, y1, x2, y2, fill) { limb(ctx, x1, y1, x2, y2, 7, fill); }
function leg(ctx, x1, y1, x2, y2, fill, rot = 0) { limb(ctx, x1, y1, x2, y2, 8, fill); shoe(ctx, x2, y2 + 3, rot); }
function bentLeg(ctx, x1, y1, x2, y2, fill, rot) { limb(ctx, x1, y1, x2, y2, 9, fill); shoe(ctx, x2, y2 + 3, rot); }
function limb(ctx, x1, y1, x2, y2, width, fill) { line(ctx, x1, y1, x2, y2, INK, width + 3); line(ctx, x1, y1, x2, y2, fill, width); }
function shoe(ctx, x, y, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); roundRect(ctx, -7, -3, 14, 8, 4, HAIR); ctx.restore(); }
function hand(ctx, x, y, accent) { ellipse(ctx, x, y, 4.5, 4.5, SKIN, INK, 1.2); ctx.fillStyle = accent; ctx.fillRect(x - 2, y - 2, 4, 1); }
function book(ctx, x, y) { roundRect(ctx, x - 18, y - 8, 36, 16, 4, '#efe7dc'); line(ctx, x, y - 7, x, y + 7, '#8b6f53', 1.2); }
function laptop(ctx, x, y) { roundRect(ctx, x - 20, y - 9, 40, 17, 4, '#10141b'); roundRect(ctx, x - 14, y - 6, 28, 8, 2, '#9fd7df'); }
function phone(ctx, x, y) { roundRect(ctx, x - 6, y - 11, 12, 22, 3, '#10141b'); roundRect(ctx, x - 4, y - 8, 8, 15, 2, '#9fd7df'); }
function plate(ctx, x, y) { ellipse(ctx, x, y, 13, 6, '#efe7dc', INK, 1); ellipse(ctx, x + 2, y, 5, 3, '#b66d55'); }
function drawTowelWrap(ctx, female) { roundRect(ctx, -13, 3, 26, 28, 9, female ? '#f3badf' : '#f3f1ea'); line(ctx, -10, 9, 10, 9, 'rgba(7,16,24,.28)', 1.2); }
function drawZs(ctx, accent) { ctx.fillStyle = accent; ctx.font = '900 12px system-ui'; ctx.fillText('Z', 24, -46); ctx.font = '900 9px system-ui'; ctx.fillText('z', 38, -58); }
function glowQuad(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color, alpha) { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath(); ctx.fill(); ctx.restore(); }
function drawActionBar(ctx, e) { const total = Math.max(1, Number(e.actionTotal || e.actionT || 1)); const pct = Math.max(0, Math.min(1, 1 - Number(e.actionT || 0) / total)); roundRect(ctx, -42, 50, 84, 10, 5, 'rgba(10,12,18,.86)'); roundRect(ctx, -40, 52, 80 * pct, 6, 4, '#f1c66a'); const label = String(e.action || 'Working').slice(0, 24); const w = Math.max(78, label.length * 6.2 + 18); roundRect(ctx, -w / 2, 63, w, 18, 7, 'rgba(248,251,255,.88)'); ctx.strokeStyle = 'rgba(7,16,24,.38)'; ctx.lineWidth = 1; roundRect(ctx, -w / 2, 63, w, 18, 7, '', true); ctx.fillStyle = INK; ctx.font = '900 9px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, 0, 76); ctx.textAlign = 'left'; }
function drawReactionBubble(ctx, reaction) { const text = String(reaction.text || '').slice(0, 42); if (!text) return; drawBubble(ctx, text, reaction.style || 'thought'); }
function drawBubble(ctx, text, style = 'speech') { const w = Math.max(72, text.length * 9 + 22); const y = -86; roundRect(ctx, -w / 2, y, w, 32, 12, style === 'thought' ? '#e9f2ff' : '#f8fbff'); ctx.fillStyle = '#10141b'; ctx.font = '900 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text, 0, y + 21); ctx.textAlign = 'left'; }
function ellipse(ctx, x, y, rx, ry, fill, stroke = '', width = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke && width) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); } }
function line(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
