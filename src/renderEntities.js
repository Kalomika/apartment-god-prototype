import { COLORS } from './config.js';
import { roundRect } from './renderHelpers.js';
import { getObject } from './world.js';
import { drawModularActor } from './character/actorSpriteBridge.js';

// Modular (Fire Pro-layered, 8-direction, faceless) character rendering. Safe: any failure or
// not-yet-rasterized sprite falls back to the original procedural renderer below.
const MODULAR_ACTORS = true;

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
  lab_test_subject: '#111820',
  lab_test_woman: '#1f8f78',
  pjResident: '#24324a',
  pjGirlfriend: '#3a2438'
};

const lastRenderPositions = new WeakMap();

export function drawEntities(ctx, state) {
  for (const entity of state.entities.filter(e => !e.hidden && e.floor === state.floor)) {
    if (entity.type === 'dog') {
      if (entity.labOnly) drawLabDogEntity(ctx, entity, state.selectedId === entity.id);
      continue;
    }
    drawTopDownActor(ctx, entity, state.selectedId === entity.id);
  }
}

function drawLabDogEntity(ctx, dog, selected) {
  ctx.save();
  ctx.translate(dog.x, dog.y);
  if (selected) drawSelectionRing(ctx, 'dog');
  const moving = Boolean(dog.path?.length) || Boolean(dog.target);
  const dx = dog.vx || (dog.target ? dog.target.x - dog.x : 0);
  const dy = dog.vy || (dog.target ? dog.target.y - dog.y : 0);
  if (moving && Math.abs(dx) + Math.abs(dy) >= 0.01) dog.lastHeading = Math.atan2(dy, dx) + Math.PI / 2;
  ctx.rotate(dog.lastHeading || 0);
  drawDogFlat(ctx, moving);
  if (dog.actionT > 0) drawActionBar(ctx, dog);
  if (dog.bubble && dog.bubbleT > 0) drawBubble(ctx, dog.bubble, 'thought');
  ctx.restore();
}

function drawTopDownActor(ctx, actor, selected) {
  const female = actor.id === 'girlfriend' || actor.id === 'lab_test_woman';
  const labStyle = Boolean(actor.labOnly);
  const accent = female ? MAGENTA : CYAN;
  const cloth = CLOTH[actor.id] || (female ? CLOTH.girlfriend : CLOTH.resident);
  const key = `${actor.currentActionId || ''} ${actor.action || ''} ${actor.pose || ''}`.toLowerCase();
  const sleeping = isBedSleepKey(key);
  const movedThisFrame = movedSinceLastRender(actor);
  const moving = isMoving(actor, key) || movedThisFrame;
  const anchor = renderAnchor(actor, key);

  ctx.save();
  ctx.translate(anchor.x, anchor.y);
  if (selected) drawSelectionRing(ctx, actor.type);
  rememberHeading(actor, key, moving);

  let drewModular = false;
  if (MODULAR_ACTORS) {
    // upright, self-facing modular sprite (own soft shadow); no ctx.rotate so 8-way facing reads
    try { drewModular = drawModularActor(ctx, actor, female, key, moving); } catch { drewModular = false; }
  }
  if (!drewModular) {
    ctx.save();
    if (!sleeping) ctx.rotate(actor.lastHeading || 0);
    drawGroundShadow(ctx, moving, sleeping, labStyle);
    drawPerson(ctx, actor, female, cloth, accent, key, moving, labStyle);
    if (actor.carrying === 'towel' || key.includes('towel')) drawTowelWrap(ctx, female, labStyle);
    ctx.restore();
  }
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

function drawGroundShadow(ctx, moving, sleeping, labStyle = false) {
  if (sleeping) return ellipse(ctx, 4, 12, 48, 25, 'rgba(0,0,0,.20)');
  ellipse(ctx, 0, 12, moving ? 36 : 31, moving ? 18 : 15, labStyle ? 'rgba(0,0,0,.16)' : 'rgba(0,0,0,.22)');
}

function drawPerson(ctx, actor, female, cloth, accent, key, moving, labStyle) {
  if (moving) return labStyle ? drawLabWalkPose(ctx, female, cloth, accent) : drawWalkPose(ctx, female, cloth, accent);
  if (labStyle) return drawLabProofPose(ctx, actor, female, cloth, accent, key);
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
  return drawIdlePose(ctx, female, cloth, accent);
}

function isSitting(key) {
  return ['sit', 'tv', 'watch', 'desk', 'study', 'read', 'phone', 'game', 'shop', 'eat', 'table', 'relax', 'console', 'arcade', 'pool'].some(t => key.includes(t));
}

function drawLabProofPose(ctx, actor, female, cloth, accent, key) {
  if (key.includes('phone')) return drawLabPropPose(ctx, female, cloth, accent, 'phone');
  if (key.includes('read') || key.includes('paper') || actor.id === 'lab_test_woman') return drawLabPropPose(ctx, female, cloth, accent, 'paper');
  if (key.includes('coffee') || key.includes('drink')) return drawLabPropPose(ctx, female, cloth, accent, 'cup');
  drawLabIdlePose(ctx, female, cloth, accent, actor.id === 'lab_test_subject' ? 'hands_low' : 'paper');
}

function drawLabIdlePose(ctx, female, cloth, accent, variant = 'hands_low') {
  const breathe = Math.sin(performance.now() / 720) * 0.7;
  legsFlat(ctx, female, 0, cloth);
  torsoFlat(ctx, female, cloth, accent, 42 + breathe);
  if (variant === 'paper') {
    armFlat(ctx, -15, -6, -22, 20, cloth, true);
    armFlat(ctx, 15, -6, 20, 18, cloth, true);
    paper(ctx, 0, 30, '#f1f0eb');
  } else {
    armFlat(ctx, -15, -7, -27, 16, cloth, true);
    armFlat(ctx, 15, -7, 27, 16, cloth, true);
    handFlat(ctx, -27, 16, accent);
    handFlat(ctx, 27, 16, accent);
  }
  headFlat(ctx, female, 0, -36, accent);
}

function drawLabPropPose(ctx, female, cloth, accent, prop) {
  legsFlat(ctx, female, 0, cloth);
  torsoFlat(ctx, female, cloth, accent, 42);
  if (prop === 'phone') {
    armFlat(ctx, -15, -7, -25, 16, cloth, true);
    armFlat(ctx, 15, -7, 18, 5, cloth, true);
    handFlat(ctx, -25, 16, accent);
    phone(ctx, 19, 5);
  } else if (prop === 'cup') {
    armFlat(ctx, -15, -7, -27, 16, cloth, true);
    armFlat(ctx, 15, -7, 18, 7, cloth, true);
    handFlat(ctx, -27, 16, accent);
    cup(ctx, 19, 7);
  } else {
    armFlat(ctx, -15, -7, -22, 20, cloth, true);
    armFlat(ctx, 15, -7, 22, 20, cloth, true);
    paper(ctx, 0, 30, '#f1f0eb');
  }
  headFlat(ctx, female, 0, -36, accent);
}

function drawLabWalkPose(ctx, female, cloth, accent) {
  const step = [-1, 0.55, 1, -0.55][Math.floor(performance.now() / 130) % 4];
  legsFlat(ctx, female, step, cloth);
  torsoFlat(ctx, female, cloth, accent, 42);
  armFlat(ctx, -15, -7, -26 + step * 5, 14 - step * 5, cloth, true);
  armFlat(ctx, 15, -7, 26 - step * 5, 14 + step * 5, cloth, true);
  handFlat(ctx, -26 + step * 5, 14 - step * 5, accent);
  handFlat(ctx, 26 - step * 5, 14 + step * 5, accent);
  headFlat(ctx, female, 0, -36, accent);
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
}

function drawSeatedPose(ctx, female, cloth, accent, key) {
  const tap = Math.sin(performance.now() / 95);
  ellipse(ctx, 0, 12, 36, 32, 'rgba(0,0,0,.20)');
  bentLeg(ctx, -10, 12, -23, 31, cloth, -0.18);
  bentLeg(ctx, 10, 12, 23, 31, cloth, 0.18);
  torso(ctx, female, cloth, accent, 36);
  if (key.includes('tv') || key.includes('watch')) {
    arm(ctx, -17, -6, -30, 14, cloth); arm(ctx, 17, -6, 30, 14, cloth); hand(ctx, -30, 14, accent); hand(ctx, 30, 14, accent); glowQuad(ctx, -42, -50, 42, -50, 26, 12, -26, 12, accent, 0.18);
  } else if (key.includes('desk') || key.includes('study') || key.includes('game') || key.includes('shop')) {
    arm(ctx, -17, -6, -23, 24 + tap, cloth); arm(ctx, 17, -6, 23, 24 - tap, cloth); hand(ctx, -23, 24 + tap, accent); hand(ctx, 23, 24 - tap, accent); laptop(ctx, 0, 31);
  } else if (key.includes('read')) {
    arm(ctx, -17, -6, -24, 22, cloth); arm(ctx, 17, -6, 24, 22, cloth); hand(ctx, -24, 22, accent); hand(ctx, 24, 22, accent); book(ctx, 0, 29);
  } else if (key.includes('phone')) {
    arm(ctx, -16, -6, -8, 24, cloth); arm(ctx, 16, -6, 8, 24, cloth); hand(ctx, -8, 24, accent); hand(ctx, 8, 24, accent); phone(ctx, 0, 29);
  } else if (key.includes('eat') || key.includes('table')) {
    arm(ctx, -17, -6, -18, 23, cloth); arm(ctx, 17, -6, 18, 23, cloth); hand(ctx, -18, 23, accent); hand(ctx, 18, 23, accent); plate(ctx, 0, 32);
  } else {
    arm(ctx, -17, -6, -28, 13, cloth); arm(ctx, 17, -6, 28, 13, cloth); hand(ctx, -28, 13, accent); hand(ctx, 28, 13, accent);
  }
  head(ctx, female, 0, -35);
}

function drawLiftPose(ctx, female, cloth, accent) {
  const pump = Math.sin(performance.now() / 135) * 6;
  torso(ctx, female, cloth, accent, 38);
  head(ctx, female, 0, -35);
  line(ctx, -37, -24 + pump, 37, -24 + pump, '#1f2630', 5);
  ellipse(ctx, -45, -24 + pump, 7, 14, '#2a3140', INK, 2);
  ellipse(ctx, 45, -24 + pump, 7, 14, '#2a3140', INK, 2);
  arm(ctx, -15, -9, -32, -24 + pump, cloth); arm(ctx, 15, -9, 32, -24 + pump, cloth);
  hand(ctx, -32, -24 + pump, accent); hand(ctx, 32, -24 + pump, accent);
  bentLeg(ctx, -10, 12, -22, 31, cloth, -0.2); bentLeg(ctx, 10, 12, 22, 31, cloth, 0.2);
}

function drawTreadmillPose(ctx, female, cloth, accent) {
  const step = [-1, 0.65, 1, -0.65][Math.floor(performance.now() / 95) % 4];
  roundRect(ctx, -34, 22, 68, 18, 7, '#242b35');
  line(ctx, -28, 20, -20, -12, '#9fa6ad', 3); line(ctx, 28, 20, 20, -12, '#9fa6ad', 3); line(ctx, -24, -12, 24, -12, '#9fa6ad', 3);
  leg(ctx, -8, 12, -17 - step * 6, 35, cloth, -0.12); leg(ctx, 8, 12, 17 + step * 6, 35, cloth, 0.12);
  torso(ctx, female, cloth, accent, 41); arm(ctx, -15, -7, -23, -12, cloth); arm(ctx, 15, -7, 23, -12, cloth); hand(ctx, -23, -12, accent); hand(ctx, 23, -12, accent); head(ctx, female, 0, -37);
}

function drawBoxingPose(ctx, female, cloth, accent) {
  humanCore(ctx, female, cloth, accent, 0, false);
  ellipse(ctx, 39, -6, 8, 7, accent, INK, 2);
}

function drawShowerPose(ctx, female, accent) {
  ellipse(ctx, 0, 13, 34, 38, 'rgba(0,0,0,.18)');
  roundRect(ctx, -15, -5, 30, 39, 10, female ? '#f3badf' : '#f3f1ea');
  head(ctx, female, 0, -36);
  for (let i = 0; i < 4; i++) line(ctx, -20 + i * 12, -20, -26 + i * 12, 30, 'rgba(168,233,255,.30)', 2);
  ellipse(ctx, 26, 4, 5, 14, accent, '', 0);
}

function drawWashDogPose(ctx, female, cloth, accent) {
  drawDogFlat(ctx, false, 42, 22, 0.72);
  bentLeg(ctx, -10, 12, -24, 32, cloth, -0.2); bentLeg(ctx, 10, 12, 20, 31, cloth, 0.14);
  torso(ctx, female, cloth, accent, 35); arm(ctx, -15, -6, -27, 16, cloth); arm(ctx, 15, -6, 42, 17, cloth); hand(ctx, -27, 16, accent); hand(ctx, 42, 17, accent); head(ctx, female, 0, -34);
}

function drawStandingPeePose(ctx, female, cloth, accent) { humanCore(ctx, female, cloth, accent, 0, false); line(ctx, 13, 19, 24, 28, 'rgba(116,230,255,.30)', 2); }
function drawToiletPose(ctx, female, cloth, accent) { drawSeatedPose(ctx, female, cloth, accent, 'sit toilet'); }
function drawBrushTeethPose(ctx, female, cloth, accent) { drawLabPropPose(ctx, female, cloth, accent, 'cup'); }

function drawSleepPose(ctx, actor, female, accent) {
  const blanket = female ? '#9f6b8e' : '#60718f';
  ctx.save();
  ctx.rotate(-Math.PI / 2);
  ellipse(ctx, 2, 6, 45, 24, 'rgba(0,0,0,.20)');
  roundRect(ctx, -42, -22, 30, 44, 13, '#dfe6ef');
  ellipse(ctx, -28, 0, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.3);
  hair(ctx, female, -28, 0);
  roundRect(ctx, -8, -18, 66, 36, 15, female ? CLOTH.pjGirlfriend : CLOTH.pjResident);
  line(ctx, -3, -6, 21, -18, female ? CLOTH.pjGirlfriend : CLOTH.pjResident, 7);
  line(ctx, -3, 6, 21, 18, female ? CLOTH.pjGirlfriend : CLOTH.pjResident, 7);
  roundRect(ctx, 4, -24, 74, 50, 16, blanket);
  if (String(actor.action || '').toLowerCase().includes('waking')) phone(ctx, 41, -30);
  ctx.restore();
}

function humanCore(ctx, female, cloth, accent, step, seated) {
  leg(ctx, -8, 14, -12 - step * 3, seated ? 28 : 38 + Math.abs(step) * 2, cloth, -0.08);
  leg(ctx, 8, 14, 12 + step * 3, seated ? 28 : 38 - Math.abs(step) * 2, cloth, 0.08);
  torso(ctx, female, cloth, accent, seated ? 36 : 44);
  arm(ctx, -16, -8, -28, 10 - step * 4, cloth); arm(ctx, 16, -8, 28, 10 + step * 4, cloth);
  hand(ctx, -29, 12 - step * 4, accent); hand(ctx, 29, 12 + step * 4, accent); head(ctx, female, 0, -37);
}

function torso(ctx, female, cloth, accent, h) {
  const shoulder = female ? 29 : 34, hip = female ? 24 : 28;
  ctx.beginPath();
  ctx.moveTo(-shoulder / 2, -11);
  ctx.quadraticCurveTo(-shoulder * 0.48, 0, -hip / 2, h * 0.45);
  ctx.lineTo(hip / 2, h * 0.45);
  ctx.quadraticCurveTo(shoulder * 0.48, 0, shoulder / 2, -11);
  ctx.closePath();
  ctx.fillStyle = cloth; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
  line(ctx, -shoulder * 0.30, -7, -hip * 0.23, h * 0.34, accent, 1.4);
  line(ctx, shoulder * 0.30, -7, hip * 0.23, h * 0.34, accent, 1.4);
}

function torsoFlat(ctx, female, cloth, accent, h) {
  const shoulder = female ? 31 : 35;
  const hip = female ? 27 : 29;
  ctx.beginPath();
  ctx.moveTo(-shoulder / 2, -12);
  ctx.quadraticCurveTo(-shoulder * 0.50, -2, -hip / 2, h * 0.43);
  ctx.lineTo(hip / 2, h * 0.43);
  ctx.quadraticCurveTo(shoulder * 0.50, -2, shoulder / 2, -12);
  ctx.closePath();
  ctx.fillStyle = cloth;
  ctx.fill();
  ctx.globalAlpha = 0.9;
  line(ctx, 0, -9, 0, h * 0.17, accent, 2.2);
  ctx.globalAlpha = 1;
}

function head(ctx, female, x, y) {
  ellipse(ctx, x, y + 12, 8, 7, SKIN, INK, 2);
  ellipse(ctx, x, y, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.5);
  ellipse(ctx, x, y + 2, female ? 10 : 11, female ? 11 : 10, SKIN_LIT);
  hair(ctx, female, x, y);
}

function headFlat(ctx, female, x, y, accent) {
  if (female) {
    ellipse(ctx, x, y - 2, 16, 18, '#5c3528');
    ellipse(ctx, x, y - 18, 11, 10, '#5c3528');
  } else {
    ellipse(ctx, x, y - 4, 16, 15, HAIR);
  }
  ctx.beginPath();
  ctx.moveTo(x - 12, y + 4);
  ctx.quadraticCurveTo(x, y + 13, x + 12, y + 4);
  ctx.lineTo(x + 8, y + 14);
  ctx.quadraticCurveTo(x, y + 19, x - 8, y + 14);
  ctx.closePath();
  ctx.fillStyle = SKIN_LIT;
  ctx.fill();
  if (!female) line(ctx, x - 8, y + 13, x + 8, y + 13, 'rgba(255,230,210,.22)', 1.2);
  if (!female) line(ctx, x - 7, y + 6, x + 7, y + 6, accent, 1.1);
}

function hair(ctx, female, x, y) {
  ctx.fillStyle = female ? '#08050a' : HAIR;
  ctx.beginPath();
  ctx.ellipse(x, y - 5, female ? 16 : 17, female ? 12 : 11, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  if (female) ellipse(ctx, x + 8, y - 1, 6, 11, '#08050a');
}

function legsFlat(ctx, female, step, cloth) {
  const spread = female ? 7 : 8;
  legFlat(ctx, -spread, 11, -spread - step * 4, 39 + Math.max(step, 0) * 3, cloth);
  legFlat(ctx, spread, 11, spread + step * 4, 39 + Math.max(-step, 0) * 3, cloth);
}

function leg(ctx, x1, y1, x2, y2, cloth, rot) { capsule(ctx, x1, y1, x2, y2, 8, cloth, INK, 2); ellipse(ctx, x2, y2 + 2, 5, 9, '#05070a', '', 0); }
function legFlat(ctx, x1, y1, x2, y2, cloth) { capsule(ctx, x1, y1, x2, y2, 7.2, cloth, '', 0); ellipse(ctx, x2, y2 + 3, 4.8, 8.5, '#05070a'); }
function bentLeg(ctx, x1, y1, x2, y2, cloth) { capsule(ctx, x1, y1, (x1 + x2) / 2, y2 - 12, 8, cloth, INK, 2); capsule(ctx, (x1 + x2) / 2, y2 - 12, x2, y2, 8, cloth, INK, 2); ellipse(ctx, x2, y2 + 2, 5, 9, '#05070a'); }
function arm(ctx, x1, y1, x2, y2, cloth) { capsule(ctx, x1, y1, x2, y2, 6.2, cloth, INK, 2); }
function armFlat(ctx, x1, y1, x2, y2, cloth) { capsule(ctx, x1, y1, x2, y2, 6.2, cloth, '', 0); }
function hand(ctx, x, y, accent) { ellipse(ctx, x, y, 5, 5, SKIN_LIT, INK, 1.4); if (accent) ellipse(ctx, x, y, 2.2, 2.2, accent); }
function handFlat(ctx, x, y, accent) { ellipse(ctx, x, y, 4.6, 4.6, SKIN_LIT); if (accent) ellipse(ctx, x, y, 1.7, 1.7, accent); }

function drawDogFlat(ctx, moving, ox = 0, oy = 0, s = 1) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(s, s);
  const step = moving ? [-1, 1][Math.floor(performance.now() / 150) % 2] : 0;
  ellipse(ctx, 0, 8, 35, 17, 'rgba(0,0,0,.14)');
  ellipse(ctx, 0, 0, 42, 21, DOG_COAT);
  ellipse(ctx, 18, -2, 16, 13, DOG_COAT);
  ellipse(ctx, 23, -9, 5, 8, DOG_SHADE);
  ellipse(ctx, 23, 5, 5, 8, DOG_SHADE);
  ellipse(ctx, 29, -2, 3.3, 2.6, INK);
  capsule(ctx, -12, -10, -18 - step * 3, -21, 5, DOG_SHADE, '', 0);
  capsule(ctx, 8, -10, 11 + step * 3, -22, 5, DOG_SHADE, '', 0);
  capsule(ctx, -12, 10, -17 + step * 3, 22, 5, DOG_SHADE, '', 0);
  capsule(ctx, 8, 10, 12 - step * 3, 22, 5, DOG_SHADE, '', 0);
  line(ctx, -21, 0, -35, -7, DOG_COAT, 6);
  ctx.restore();
}

function drawTowelWrap(ctx, female, labStyle) { roundRect(ctx, -23, 3, 46, 34, 12, labStyle ? 'rgba(233,243,244,.74)' : 'rgba(235,250,255,.72)'); }
function laptop(ctx, x, y) { roundRect(ctx, x - 24, y - 8, 48, 18, 3, '#202a35'); roundRect(ctx, x - 18, y - 20, 36, 13, 3, '#5aaeca'); }
function book(ctx, x, y) { roundRect(ctx, x - 18, y - 10, 36, 20, 3, '#efe7dc'); line(ctx, x, y - 9, x, y + 9, '#c9bfae', 1); }
function paper(ctx, x, y, fill) { roundRect(ctx, x - 17, y - 12, 34, 24, 3, fill); line(ctx, x - 9, y - 4, x + 9, y - 4, '#cfc7ba', 1); line(ctx, x - 9, y + 3, x + 7, y + 3, '#cfc7ba', 1); }
function phone(ctx, x, y) { roundRect(ctx, x - 5, y - 9, 10, 18, 3, '#111820'); roundRect(ctx, x - 3, y - 6, 6, 11, 2, '#74e6ff'); }
function cup(ctx, x, y) { ellipse(ctx, x, y, 6, 5, '#efe7dc', '#b9aea0', 1); ellipse(ctx, x, y - 1, 3.5, 2.5, '#5b3a2c'); }
function plate(ctx, x, y) { ellipse(ctx, x, y, 17, 10, '#f4eee6', '#d0c5b8', 1); ellipse(ctx, x + 3, y - 1, 5, 4, '#b2684f'); }
function glowQuad(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color, alpha) { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath(); ctx.fill(); ctx.restore(); }

function drawActionBar(ctx, entity) {
  const total = Math.max(1, entity.actionTotal || entity.actionT || 1);
  const pct = Math.max(0, Math.min(1, (entity.actionT || 0) / total));
  roundRect(ctx, -24, 45, 48, 6, 3, 'rgba(7,16,24,.55)');
  roundRect(ctx, -23, 46, 46 * pct, 4, 2, COLORS.active);
}

function drawBubble(ctx, text, style = 'speech') {
  const y = -72;
  const message = String(text || '').slice(0, 26);
  const w = Math.max(42, Math.min(150, message.length * 7 + 18));
  roundRect(ctx, -w / 2, y - 20, w, 24, 10, style === 'thought' ? 'rgba(244,247,251,.90)' : 'rgba(255,255,255,.92)');
  ctx.fillStyle = '#10141d';
  ctx.font = '800 10px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(message, 0, y - 5);
}

function drawReactionBubble(ctx, reaction) {
  const t = Math.max(0, reaction.t || 0);
  const pulse = 1 + Math.sin(performance.now() / 80) * 0.04;
  ctx.save();
  ctx.translate(25, -56);
  ctx.scale(pulse, pulse);
  ellipse(ctx, 0, 0, 20 + t, 15 + t * 0.5, 'rgba(255,255,255,.90)', COLORS.active, 2);
  ctx.fillStyle = '#111820';
  ctx.font = '900 13px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(String(reaction.symbol || '!').slice(0, 2), 0, 4);
  ctx.restore();
}

function capsule(ctx, x1, y1, x2, y2, r, fill, stroke = INK, lineWidth = 1.5) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = fill;
  ctx.lineWidth = r * 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  if (stroke && lineWidth > 0) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

function ellipse(ctx, x, y, rx, ry, fill, stroke = '', lineWidth = 1) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke && lineWidth > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function line(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}
