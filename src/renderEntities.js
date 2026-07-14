import { COLORS } from './config.js';
import { roundRect } from './renderHelpers.js';
import { drawTestActorSprite } from './testActorSpriteRenderer.js';

const INK = '#071018';
const SKIN = '#3a241f';
const SKIN_LIT = '#5a372f';
const CYAN = '#74e6ff';
const MAGENTA = '#ff75df';
const DOG_COAT = '#f6f2e8';
const DOG_SHADE = '#d8d0c0';
const CLOTH = { resident: '#111820', girlfriend: '#17131b', pjResident: '#24324a', pjGirlfriend: '#3a2438' };

export function drawEntities(ctx, state) {
  for (const e of state.entities.filter(e => !e.hidden && e.floor === state.floor)) drawEntity(ctx, e, state.selectedId === e.id);
}

function drawEntity(ctx, e, selected) {
  ctx.save();
  ctx.translate(e.x, e.y);
  if (selected) {
    ctx.strokeStyle = COLORS.active;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 4, e.type === 'dog' ? 28 : 31, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.save();
  ctx.scale(e.type === 'dog' ? .95 : .90, e.type === 'dog' ? .95 : .90);
  if (e.type === 'dog') { ctx.rotate(heading(e)); drawDog(ctx, e); }
  else if (!drawTestActorSprite(ctx, e)) { ctx.rotate(heading(e)); drawPerson(ctx, e); }
  ctx.restore();
  if (e.actionT > 0) drawActionBar(ctx, e);
  if (e.reaction?.t > 0) drawReactionBubble(ctx, e.reaction, e.type);
  if (e.bubble && e.bubbleT > 0) drawBubble(ctx, e.bubble, e.reaction?.style || 'speech');
  ctx.restore();
}

function activityText(e) {
  return `${String(e.currentActionId || '').toLowerCase()} ${String(e.action || '').toLowerCase()} ${String(e.pose || '').toLowerCase()}`;
}

function isMoving(e) {
  const action = String(e.action || '').toLowerCase();
  const pose = String(e.pose || '').toLowerCase();
  return Boolean(e.path?.length) || Boolean(e.target) || pose === 'walk' || action.includes('heading') || action.includes('walking to') || action.includes('going to');
}

function heading(e) {
  const moving = isMoving(e) && !e.actionT;
  const action = activityText(e);
  const dx = e.vx || (e.target ? e.target.x - e.x : 0);
  const dy = e.vy || (e.target ? e.target.y - e.y : 0);
  if (moving && Math.abs(dx) + Math.abs(dy) >= 0.01) {
    e.lastHeading = Math.atan2(dy, dx) + Math.PI / 2;
    return e.lastHeading;
  }
  if (!moving && ['tv', 'couch', 'watch', 'desk', 'study', 'read', 'eat', 'table', 'sleep', 'nap', 'shower', 'wash dog', 'arcade', 'console', 'game', 'darts', 'cook', 'stove', 'treadmill', 'lift weights', 'weight', 'heavy bag', 'pool', 'swim', 'soccer', 'pee', 'toilet'].some(t => action.includes(t))) return 0;
  if (Math.abs(dx) + Math.abs(dy) < 0.01) return e.lastHeading ?? 0;
  e.lastHeading = Math.atan2(dy, dx) + Math.PI / 2;
  return e.lastHeading;
}

function drawPerson(ctx, e) {
  const action = String(e.action || '').toLowerCase();
  const pose = String(e.pose || '').toLowerCase();
  const key = activityText(e);
  const female = e.id === 'girlfriend';
  const accent = female ? MAGENTA : CYAN;
  const cloth = female ? CLOTH.girlfriend : CLOTH.resident;

  if (isMoving(e) && !e.actionT) return drawWalkPose(ctx, female, cloth, accent, isNorthHeading(e));
  if (pose === 'shower' || e.currentActionId === 'shower') return drawShowerSequence(ctx, e, female, accent);
  if (pose === 'pee_stand' || e.currentActionId === 'pee_stand') return drawStandingPeePose(ctx, female, cloth, accent);
  if (pose === 'toilet_sit' || e.currentActionId === 'toilet') return drawSeatedPose(ctx, female, cloth, accent, action, key, true);
  if (pose === 'wash_dog' || key.includes('wash dog')) return drawWashDogPose(ctx, female, cloth, accent);
  if (pose === 'sleep' || key.includes('sleep') || key.includes('nap') || key.includes('waking up') || key.includes('bed together')) return drawSleepPose(ctx, e, female, accent);
  if (key.includes('lift_weights') || key.includes('lift weights') || key.includes('weight bench')) return drawLiftWeightsPose(ctx, female, cloth, accent);
  if (key.includes('heavy_bag') || key.includes('heavy bag')) return drawHeavyBagPose(ctx, female, cloth, accent);
  if (key.includes('treadmill')) return drawTreadmillPose(ctx, female, cloth, accent);
  if (key.includes('swim')) return drawSwimPose(ctx, female, cloth, accent);
  if (key.includes('soccer')) return drawSoccerPose(ctx, female, cloth, accent);
  if (key.includes('pool_solo') || key.includes('pool_together') || key.includes('pool table') || pose === 'pool') return drawPoolCuePose(ctx, female, cloth, accent);
  if (key.includes('cook') || key.includes('stove')) return drawCookingPose(ctx, female, cloth, accent);
  if (key.includes('clean') || key.includes('trash') || key.includes('vacuum') || key.includes('brush') || key.includes('groom')) return drawCleaningPose(ctx, female, cloth, accent);
  if (isSitting(key)) return drawSeatedPose(ctx, female, cloth, accent, action, key, shouldDrawBackFacingSeat(key));
  return drawIdlePose(ctx, female, cloth, accent);
}

function isNorthHeading(e) {
  const a = ((e.lastHeading || 0) + Math.PI * 2) % (Math.PI * 2);
  return a < Math.PI / 4 || a > Math.PI * 7 / 4;
}

function shouldDrawBackFacingSeat(key) {
  return ['sit', 'tv', 'watch', 'desk', 'study', 'read', 'phone', 'game', 'console', 'arcade', 'darts', 'shop', 'eat', 'table', 'relax'].some(t => key.includes(t));
}

function isSitting(key) {
  return ['sit', 'tv', 'watch', 'desk', 'study', 'read', 'phone', 'game', 'console', 'arcade', 'darts', 'shop', 'eat', 'table', 'relax'].some(t => key.includes(t));
}

function drawIdlePose(ctx, female, cloth, accent) { humanCore(ctx, female, cloth, accent, Math.sin(performance.now() / 620) * .65, false, false); }

function drawWalkPose(ctx, female, cloth, accent, backFacing = false) {
  const step = [-1, .45, 1, -.45][Math.floor(performance.now() / 115) % 4];
  if (backFacing) return drawNorthWalkPose(ctx, female, cloth, accent, step);
  ell(ctx, 0, 10, 34, 43, 'rgba(0,0,0,.22)');
  leg(ctx, -8, 13, -12 - step * 5, 36 + Math.max(step, 0) * 4, cloth, -.08);
  leg(ctx, 8, 13, 12 + step * 5, 36 + Math.max(-step, 0) * 4, cloth, .08);
  torso(ctx, female, cloth, accent, 42);
  arm(ctx, -16, -8, -28 + step * 5, 10 - step * 6, cloth);
  arm(ctx, 16, -8, 28 - step * 5, 10 + step * 6, cloth);
  hand(ctx, -28 + step * 5, 10 - step * 6, accent);
  hand(ctx, 28 - step * 5, 10 + step * 6, accent);
  head(ctx, female, 0, -37);
}

function drawNorthWalkPose(ctx, female, cloth, accent, step) {
  ell(ctx, 0, 10, 34, 43, 'rgba(0,0,0,.22)');
  leg(ctx, -8, 12, -12 - step * 5, 37 + Math.max(step, 0) * 4, cloth, -.08);
  leg(ctx, 8, 12, 12 + step * 5, 37 + Math.max(-step, 0) * 4, cloth, .08);
  backTorso(ctx, female, cloth, accent, 43);
  arm(ctx, -16, -7, -27 + step * 5, 12 - step * 6, cloth);
  arm(ctx, 16, -7, 27 - step * 5, 12 + step * 6, cloth);
  ell(ctx, 0, -38, female ? 17 : 18, female ? 18 : 16, '#05070a', INK, 2.5);
  ell(ctx, 0, -31, female ? 12 : 11, female ? 8 : 7, '#05070a');
  line(ctx, -12, -24, 12, -24, 'rgba(255,255,255,.10)', 1.3);
}

function drawSeatedPose(ctx, female, cloth, accent, action, key, backFacing = false) {
  const tap = Math.sin(performance.now() / 95);
  if (backFacing) return drawBackSeatedPose(ctx, female, cloth, accent, key, tap);
  ell(ctx, 0, 12, 36, 32, 'rgba(0,0,0,.20)');
  bentLeg(ctx, -10, 12, -23, 31, cloth, -.18);
  bentLeg(ctx, 10, 12, 23, 31, cloth, .18);
  torso(ctx, female, cloth, accent, 36);
  if (key.includes('tv') || key.includes('watch')) {
    arm(ctx, -17, -6, -30, 14, cloth); arm(ctx, 17, -6, 30, 14, cloth); hand(ctx, -30, 14, accent); hand(ctx, 30, 14, accent); glowQuad(ctx, -42, -50, 42, -50, 26, 12, -26, 12, accent, .18);
  } else if (key.includes('arcade') || key.includes('console')) {
    arm(ctx, -17, -6, -27, 22 + tap * 2, cloth); arm(ctx, 17, -6, 27, 22 - tap * 2, cloth); hand(ctx, -27, 22 + tap * 2, accent); hand(ctx, 27, 22 - tap * 2, accent); gameController(ctx, 0, 30, accent); glowQuad(ctx, -34, -58, 34, -58, 44, 18, -44, 18, accent, .16);
  } else if (key.includes('desk') || key.includes('study') || key.includes('game') || key.includes('shop')) {
    arm(ctx, -17, -6, -23, 24 + tap, cloth); arm(ctx, 17, -6, 23, 24 - tap, cloth); hand(ctx, -23, 24 + tap, accent); hand(ctx, 23, 24 - tap, accent); laptop(ctx, 0, 35, accent);
  } else if (key.includes('read')) {
    arm(ctx, -17, -6, -25, 23, cloth); arm(ctx, 17, -6, 25, 23, cloth); hand(ctx, -25, 23, accent); hand(ctx, 25, 23, accent); book(ctx, 0, 31);
  } else if (key.includes('phone')) {
    arm(ctx, -17, -6, -27, 15, cloth); arm(ctx, 17, -6, 25, 8, cloth); hand(ctx, -27, 15, accent); phone(ctx, 25, 8); glowQuad(ctx, 1, -22, 35, -18, 48, 22, 13, 24, accent, .16);
  } else if (key.includes('eat') || key.includes('table')) {
    const bite = Math.max(0, Math.sin(performance.now() / 170));
    arm(ctx, -17, -6, -25, 17, cloth); arm(ctx, 17, -6, 18, 16 - bite * 4, cloth); hand(ctx, -25, 17, accent); hand(ctx, 18, 16 - bite * 4, accent); plate(ctx, 0, 34);
  } else {
    arm(ctx, -17, -6, -25, 16, cloth); arm(ctx, 17, -6, 25, 16, cloth); hand(ctx, -25, 16, accent); hand(ctx, 25, 16, accent);
  }
  head(ctx, female, 0, -35);
}

function drawBackSeatedPose(ctx, female, cloth, accent, key, tap) {
  ell(ctx, 0, 13, 37, 31, 'rgba(0,0,0,.20)');
  bentLeg(ctx, -10, 12, -24, 32, cloth, -.18);
  bentLeg(ctx, 10, 12, 24, 32, cloth, .18);
  backTorso(ctx, female, cloth, accent, 36);
  if (key.includes('desk') || key.includes('study') || key.includes('shop') || key.includes('game')) {
    arm(ctx, -16, -7, -24, 24 + tap, cloth); arm(ctx, 16, -7, 24, 24 - tap, cloth); laptop(ctx, 0, 35, accent);
  } else if (key.includes('arcade') || key.includes('console')) {
    arm(ctx, -16, -7, -28, 22 + tap * 2, cloth); arm(ctx, 16, -7, 28, 22 - tap * 2, cloth); gameController(ctx, 0, 30, accent);
  } else if (key.includes('read')) {
    arm(ctx, -16, -7, -25, 23, cloth); arm(ctx, 16, -7, 25, 23, cloth); book(ctx, 0, 31);
  } else if (key.includes('eat') || key.includes('table')) {
    arm(ctx, -16, -7, -25, 20, cloth); arm(ctx, 16, -7, 22, 20, cloth); plate(ctx, 0, 34);
  } else {
    arm(ctx, -16, -7, -28, 15, cloth); arm(ctx, 16, -7, 28, 15, cloth);
  }
  ell(ctx, 0, -36, female ? 17 : 18, female ? 18 : 16, '#05070a', INK, 2.5);
  ell(ctx, 0, -29, female ? 12 : 11, female ? 8 : 7, '#05070a');
}

function drawStandingPeePose(ctx, female, cloth, accent) {
  ell(ctx, 0, 10, 34, 43, 'rgba(0,0,0,.22)');
  leg(ctx, -8, 13, -12, 38, cloth, -.08); leg(ctx, 8, 13, 12, 38, cloth, .08);
  torso(ctx, female, cloth, accent, 42);
  arm(ctx, -16, -8, -24, 12, cloth); arm(ctx, 16, -8, 20, 18, cloth); hand(ctx, -24, 12, accent); hand(ctx, 20, 18, accent);
  head(ctx, female, 0, -37);
}

function drawSleepPose(ctx, e, female, accent) {
  const waking = String(e.action || '').toLowerCase().includes('waking');
  const blanket = female ? '#9f6b8e' : '#60718f';
  const pajama = female ? CLOTH.pjGirlfriend : CLOTH.pjResident;
  const breathe = Math.sin(performance.now() / 820) * 1.2;
  ctx.save();
  ell(ctx, 2, 6, 45, 24, 'rgba(0,0,0,.20)');
  roundRect(ctx, -42, -22, 30, 44, 13, '#dfe6ef');
  ell(ctx, -28, 0, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.3);
  hair(ctx, female, -28, 0);
  line(ctx, -32, 5, -25, 5, '#f0d7bd', 1);
  roundRect(ctx, -8, -18, 66, 36 + breathe, 15, pajama);
  ctx.strokeStyle = INK; ctx.lineWidth = 2; roundRect(ctx, -8, -18, 66, 36 + breathe, 15, '', true);
  line(ctx, -3, -6, 21, -18, pajama, 7); hand(ctx, 22, -18, accent);
  line(ctx, -3, 6, 21, 18, pajama, 7); hand(ctx, 22, 18, accent);
  ctx.globalAlpha = .96;
  roundRect(ctx, 4, -24, 74, 50, 16, blanket);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255,255,255,.20)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(12, -11); ctx.quadraticCurveTo(33, -3, 69, -10); ctx.moveTo(12, 11); ctx.quadraticCurveTo(33, 20, 69, 10); ctx.stroke();
  if (waking) phone(ctx, 41, -30);
  ctx.restore();
  if (!waking) drawZs(ctx, accent);
}

function drawShowerSequence(ctx, e, female, accent) {
  const total = Math.max(1, e.actionTotal || e.actionT || 1);
  const pct = Math.max(0, Math.min(1, 1 - (e.actionT || 0) / total));
  clothesPile(ctx, female, Math.min(1, pct * 5));
  const open = pct < .18 ? pct / .18 : pct > .82 ? (1 - pct) / .18 : 1;
  roundRect(ctx, -34, -46, 68, 86, 10, 'rgba(16,22,31,.94)');
  roundRect(ctx, -28, -39, 56, 71, 8, 'rgba(128,185,194,.42)');
  roundRect(ctx, -28 + open * 32, -39, 25, 71, 6, 'rgba(231,244,247,.82)');
  if (pct < .18) { arm(ctx, -12, -15, 31, -22, female ? CLOTH.girlfriend : CLOTH.resident); hand(ctx, 31, -22, accent); }
  ctx.fillStyle = accent; ctx.font = '900 7px system-ui'; ctx.fillText(pct < .18 ? 'SLIDE OPEN' : pct > .82 ? 'SLIDE SHUT' : 'SHOWERING', -28, -51);
}

function drawWashDogPose(ctx, female, cloth, accent) {
  const scrub = Math.sin(performance.now() / 95) * 4;
  roundRect(ctx, 24, 10, 60, 34, 16, 'rgba(125,164,160,.50)');
  ell(ctx, 52, 27, 22, 13, DOG_COAT, INK, 1.8); ell(ctx, 69, 21, 11, 8, DOG_COAT, INK, 1.5); ell(ctx, 78, 20, 4, 3, INK, INK, 1);
  for (let i = 0; i < 5; i++) ell(ctx, 39 + i * 6, 12 + Math.sin(i) * 3, 5, 4, 'rgba(235,250,255,.75)');
  bentLeg(ctx, -13, 13, -30, 29, cloth, -.35); bentLeg(ctx, 8, 13, 20, 31, cloth, .18); torso(ctx, female, cloth, accent, 35);
  arm(ctx, -17, -7, -28, 12, cloth); arm(ctx, 17, -7, 46 + scrub, 19, cloth); hand(ctx, -28, 12, accent); hand(ctx, 46 + scrub, 19, accent); head(ctx, female, 0, -34);
}

function drawLiftWeightsPose(ctx, female, cloth, accent) { const rep = (Math.sin(performance.now() / 260) + 1) / 2; roundRect(ctx, -12, -26, 24, 78, 8, 'rgba(39,49,59,.58)'); ell(ctx, 0, 10, 37, 38, 'rgba(0,0,0,.20)'); ctx.save(); ctx.rotate(-Math.PI / 2); leg(ctx, -8, 10, -10, 35, cloth, 0); leg(ctx, 8, 10, 10, 35, cloth, 0); torso(ctx, female, cloth, accent, 36); head(ctx, female, -24, -35); const y = -34 - rep * 18; line(ctx, -48, y, 48, y, '#dfe6ea', 4); circle(ctx, -54, y, 9, '#343b46'); circle(ctx, 54, y, 9, '#343b46'); arm(ctx, -15, -6, -34, y, cloth); arm(ctx, 15, -6, 34, y, cloth); hand(ctx, -34, y, accent); hand(ctx, 34, y, accent); ctx.restore(); }
function drawHeavyBagPose(ctx, female, cloth, accent) { const hit = Math.max(0, Math.sin(performance.now() / 180)); roundRect(ctx, 47 + hit * 4, -35, 20, 72, 10, '#27313b'); line(ctx, 57, -48, 57, -35, '#dfe6ea', 3); ell(ctx, -6, 12, 35, 42, 'rgba(0,0,0,.20)'); leg(ctx, -12, 14, -27, 39, cloth, -.3); leg(ctx, 10, 14, 22, 38, cloth, .16); torso(ctx, female, cloth, accent, 42); arm(ctx, -17, -7, -34, 6, cloth); arm(ctx, 17, -7, 43 + hit * 12, -8, cloth); glove(ctx, -34, 6, accent); glove(ctx, 43 + hit * 12, -8, accent); head(ctx, female, 0, -36); if (hit > .78) burst(ctx, 67, -8, '#f1c66a'); }
function drawTreadmillPose(ctx, female, cloth, accent) { const c = [-1, .45, 1, -.45][Math.floor(performance.now() / 90) % 4]; roundRect(ctx, -36, -6, 72, 70, 11, 'rgba(20,24,31,.70)'); line(ctx, -30, 18, 30, 18, accent, 2); line(ctx, -24, -2, 24, -2, '#dfe6ea', 3); ell(ctx, 0, 19, 31, 35, 'rgba(0,0,0,.20)'); leg(ctx, -8, 13, -12 - c * 6, 38 + Math.max(c, 0) * 6, cloth, -.08); leg(ctx, 8, 13, 12 + c * 6, 38 + Math.max(-c, 0) * 6, cloth, .08); torso(ctx, female, cloth, accent, 40); arm(ctx, -16, -8, -27, 7 - c * 5, cloth); arm(ctx, 16, -8, 27, 7 + c * 5, cloth); hand(ctx, -27, 7 - c * 5, accent); hand(ctx, 27, 7 + c * 5, accent); head(ctx, female, 0, -36); }
function drawSwimPose(ctx, female, cloth, accent) { const stroke = Math.sin(performance.now() / 160); for (let i = 0; i < 4; i++) line(ctx, -46 + i * 30, 24 + Math.sin(i + stroke) * 4, -28 + i * 30, 20 + Math.cos(i + stroke) * 4, 'rgba(168,233,255,.55)', 2); ell(ctx, 0, 10, 36, 24, 'rgba(0,0,0,.12)'); torso(ctx, female, cloth, accent, 30); arm(ctx, -16, -6, -38, -20 + stroke * 8, cloth); arm(ctx, 16, -6, 38, -20 - stroke * 8, cloth); hand(ctx, -38, -20 + stroke * 8, accent); hand(ctx, 38, -20 - stroke * 8, accent); leg(ctx, -8, 14, -19 - stroke * 7, 34, cloth, -.2); leg(ctx, 8, 14, 19 + stroke * 7, 34, cloth, .2); head(ctx, female, 0, -35); }
function drawSoccerPose(ctx, female, cloth, accent) { const kick = Math.max(0, Math.sin(performance.now() / 210)); ell(ctx, 0, 12, 35, 43, 'rgba(0,0,0,.20)'); leg(ctx, -9, 13, -18, 39, cloth, -.18); leg(ctx, 9, 13, 24 + kick * 9, 35 - kick * 8, cloth, .28); torso(ctx, female, cloth, accent, 42); arm(ctx, -17, -7, -33, 8, cloth); arm(ctx, 17, -7, 32, 9, cloth); hand(ctx, -33, 8, accent); hand(ctx, 32, 9, accent); ball(ctx, 43, 34 - kick * 9); head(ctx, female, 0, -36); }
function drawPoolCuePose(ctx, female, cloth, accent) { const aim = Math.sin(performance.now() / 520) * 2; ell(ctx, 0, 12, 36, 43, 'rgba(0,0,0,.20)'); leg(ctx, -10, 14, -24, 40, cloth, -.3); leg(ctx, 10, 14, 18, 38, cloth, .1); torso(ctx, female, cloth, accent, 41); line(ctx, -38, 8 + aim, 54, -11 + aim, '#c8a66b', 4); arm(ctx, -16, -6, -36, 8 + aim, cloth); arm(ctx, 16, -6, 31, -6 + aim, cloth); hand(ctx, -36, 8 + aim, accent); hand(ctx, 31, -6 + aim, accent); head(ctx, female, 0, -36); }
function drawCookingPose(ctx, female, cloth, accent) { const stir = Math.sin(performance.now() / 250) * 5; counter(ctx); ell(ctx, 0, 12, 34, 42, 'rgba(0,0,0,.20)'); leg(ctx, -8, 14, -12, 38, cloth, -.03); leg(ctx, 8, 14, 12, 38, cloth, .03); torso(ctx, female, cloth, accent, 42); pan(ctx, 13, 31); arm(ctx, -17, -7, -25, 24, cloth); arm(ctx, 17, -7, 24 + stir, 22, cloth); hand(ctx, -25, 24, accent); hand(ctx, 24 + stir, 22, accent); head(ctx, female, 0, -36); }
function drawCleaningPose(ctx, female, cloth, accent) { const wipe = Math.sin(performance.now() / 130) * 8; ell(ctx, 0, 12, 34, 42, 'rgba(0,0,0,.20)'); leg(ctx, -9, 13, -12, 39, cloth, .03); leg(ctx, 9, 13, 12, 39, cloth, -.03); torso(ctx, female, cloth, accent, 42); arm(ctx, -17, -7, -31, 14, cloth); arm(ctx, 17, -7, 29 + wipe, 17, cloth); hand(ctx, -31, 14, accent); rag(ctx, 29 + wipe, 17); head(ctx, female, 0, -36); }

function humanCore(ctx, female, cloth, accent, step, seated, backFacing = false) { if (backFacing) return drawBackSeatedPose(ctx, female, cloth, accent, 'sit', step); ell(ctx, 0, 8, 34, 45, 'rgba(0,0,0,.22)'); leg(ctx, -8, 14, -12 - step * 3, seated ? 28 : 38 + Math.abs(step) * 2, cloth, -.08); leg(ctx, 8, 14, 12 + step * 3, seated ? 28 : 38 - Math.abs(step) * 2, cloth, .08); torso(ctx, female, cloth, accent, seated ? 36 : 44); arm(ctx, -16, -8, -28, 10 - step * 4, cloth); arm(ctx, 16, -8, 28, 10 + step * 4, cloth); hand(ctx, -29, 12 - step * 4, accent); hand(ctx, 29, 12 + step * 4, accent); head(ctx, female, 0, -37); }
function torso(ctx, female, cloth, accent, h) { const shoulder = female ? 29 : 34, hip = female ? 24 : 28; ctx.beginPath(); ctx.moveTo(-shoulder / 2, -11); ctx.quadraticCurveTo(-shoulder * .48, 0, -hip / 2, h * .45); ctx.lineTo(hip / 2, h * .45); ctx.quadraticCurveTo(shoulder * .48, 0, shoulder / 2, -11); ctx.closePath(); ctx.fillStyle = cloth; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-shoulder * .30, -7); ctx.lineTo(-hip * .23, h * .34); ctx.moveTo(shoulder * .30, -7); ctx.lineTo(hip * .23, h * .34); ctx.stroke(); }
function backTorso(ctx, female, cloth, accent, h) { const shoulder = female ? 30 : 35, hip = female ? 25 : 29; ctx.beginPath(); ctx.moveTo(-shoulder / 2, -11); ctx.quadraticCurveTo(-shoulder * .50, 0, -hip / 2, h * .45); ctx.lineTo(hip / 2, h * .45); ctx.quadraticCurveTo(shoulder * .50, 0, shoulder / 2, -11); ctx.closePath(); ctx.fillStyle = cloth; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = accent; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-shoulder * .32, -4); ctx.quadraticCurveTo(0, 4, shoulder * .32, -4); ctx.moveTo(-hip * .26, h * .28); ctx.lineTo(hip * .26, h * .28); ctx.stroke(); }
function head(ctx, female, x, y) { ell(ctx, x, y + 12, 8, 7, SKIN, INK, 2); ell(ctx, x, y, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.5); ell(ctx, x, y + 2, female ? 10 : 11, female ? 11 : 10, SKIN_LIT); hair(ctx, female, x, y); line(ctx, x - 4, y + 4, x + 4, y + 4, '#f0d7bd', 1); }
function hair(ctx, female, x, y) { ctx.fillStyle = '#05070a'; ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.beginPath(); if (female) { ctx.ellipse(x, y - 4, 19, 20, 0, Math.PI * .85, Math.PI * 2.15); ctx.fill(); ctx.stroke(); ell(ctx, x - 15, y + 3, 5, 9, '#05070a', INK, 1); ell(ctx, x + 15, y + 3, 5, 9, '#05070a', INK, 1); } else { ctx.ellipse(x, y - 6, 16, 11, 0, Math.PI, Math.PI * 2); ctx.fill(); ctx.stroke(); } }
function arm(ctx, x1, y1, x2, y2, fill) { limb(ctx, x1, y1, x2, y2, 7, fill); }
function leg(ctx, x1, y1, x2, y2, fill, rot = 0) { limb(ctx, x1, y1, x2, y2, 8, fill); shoe(ctx, x2, y2 + 3, rot); }
function bentLeg(ctx, x1, y1, x2, y2, fill, rot) { limb(ctx, x1, y1, x2, y2 - 6, 8, fill); limb(ctx, x2 - Math.sign(x2 || 1) * 3, y2 - 6, x2, y2 + 7, 8, '#27313b'); shoe(ctx, x2, y2 + 10, rot); }
function limb(ctx, x1, y1, x2, y2, width, fill) { ctx.strokeStyle = INK; ctx.lineWidth = width + 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.strokeStyle = fill; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function hand(ctx, x, y, accent) { ell(ctx, x, y, 4.5, 4.5, SKIN, INK, 1.5); ctx.fillStyle = accent; ctx.fillRect(x - 2, y - 2, 4, 1); }
function glove(ctx, x, y, accent) { ell(ctx, x, y, 7, 6, accent, INK, 1.5); }
function shoe(ctx, x, y, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ell(ctx, 0, 0, 5, 8, '#05070a', INK, 1); ctx.restore(); }
function clothesPile(ctx, female, alpha = 1) { ctx.save(); ctx.translate(-38, 36); ctx.globalAlpha = .25 + alpha * .75; ell(ctx, 0, 2, 16, 7, 'rgba(0,0,0,.18)'); ctx.save(); ctx.rotate(-.10); roundRect(ctx, -18, -9, 34, 13, 4, female ? CLOTH.girlfriend : CLOTH.resident); roundRect(ctx, -18, 5, 28, 10, 4, '#293342'); ctx.restore(); ctx.save(); ctx.rotate(.18); roundRect(ctx, 0, -13, 24, 12, 4, female ? MAGENTA : CYAN); ctx.restore(); ell(ctx, -18, -4, 7, 4, '#05070a', INK, 1); ell(ctx, 19, 7, 8, 5, '#05070a', INK, 1); ctx.restore(); }
function laptop(ctx, x, y, accent) { roundRect(ctx, x - 21, y - 11, 42, 21, 4, '#121821'); roundRect(ctx, x - 17, y - 8, 34, 12, 3, accent); roundRect(ctx, x - 24, y + 8, 48, 6, 2, '#dfe6ea'); }
function gameController(ctx, x, y, accent) { roundRect(ctx, x - 21, y - 9, 42, 18, 8, '#10141b'); circle(ctx, x - 10, y, 3, accent); circle(ctx, x + 10, y, 3, '#f1c66a'); line(ctx, x - 4, y, x + 4, y, '#dfe6ea', 1.5); }
function book(ctx, x, y) { roundRect(ctx, x - 21, y - 9, 42, 18, 4, '#efe7dc'); line(ctx, x, y - 8, x, y + 8, '#8b6f53', 1); }
function phone(ctx, x, y) { roundRect(ctx, x - 6, y - 11, 12, 22, 3, '#10141b'); roundRect(ctx, x - 4, y - 8, 8, 15, 2, '#a8e9ff'); }
function plate(ctx, x, y) { ell(ctx, x, y, 13, 6, '#efe7dc', INK, 1); ell(ctx, x + 2, y, 5, 3, '#b66d55'); }
function counter(ctx) { roundRect(ctx, -48, 29, 96, 25, 7, 'rgba(36,43,49,.78)'); }
function pan(ctx, x, y) { ell(ctx, x, y, 17, 9, '#222b31', INK, 1.4); line(ctx, x - 16, y + 1, x - 34, y + 5, '#38434d', 4); circle(ctx, x + 4, y - 1, 4, '#f1c66a'); }
function rag(ctx, x, y) { ell(ctx, x, y, 9, 6, '#a8e9ff', INK, 1); }
function ball(ctx, x, y) { ell(ctx, x, y, 8, 8, '#f8fbff', INK, 1.4); line(ctx, x - 5, y, x + 5, y, INK, 1); line(ctx, x, y - 5, x, y + 5, INK, 1); }
function burst(ctx, x, y, color) { for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; line(ctx, x + Math.cos(a) * 5, y + Math.sin(a) * 5, x + Math.cos(a) * 14, y + Math.sin(a) * 14, color, 2); } }
function glowQuad(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color, alpha) { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath(); ctx.fill(); ctx.restore(); }
function drawZs(ctx, accent) { ctx.fillStyle = accent; ctx.font = '900 12px system-ui'; ctx.fillText('Z', 24, -46); ctx.font = '900 9px system-ui'; ctx.fillText('z', 38, -58); }
function drawDog(ctx, e) { const action = String(e.action || '').toLowerCase(); const pose = String(e.pose || '').toLowerCase(); const washing = action.includes('washed') || action.includes('wash') || pose.includes('wash'); const resting = !washing && (action.includes('dog bed') || action.includes('dog rest') || pose.includes('dog_rest')); const moving = Boolean(e.path?.length) || Boolean(e.target) || action.includes('fetch'); const step = resting || washing ? 0 : moving ? [-1, .5, 1, -.5][Math.floor(performance.now() / 110) % 4] : Math.sin(performance.now() / 600) * .15; ell(ctx, 1, 6, 36, resting ? 20 : 23, 'rgba(0,0,0,.22)'); if (washing) { roundRect(ctx, -31, -10, 68, 37, 18, 'rgba(125,164,160,.46)'); for (let i = 0; i < 6; i++) ell(ctx, -19 + i * 11, -15 + Math.sin(i) * 3, 5, 4, 'rgba(235,250,255,.78)'); } if (resting) { ell(ctx, 0, 1, 28, 17, DOG_COAT, INK, 2); ell(ctx, 18, -8, 12, 9, DOG_COAT, INK, 2); ell(ctx, 29, -9, 5, 4, INK, INK, 1); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-15, 4, 13, .2, Math.PI * 1.3); ctx.stroke(); return; } limb(ctx, -12, 8, -17 - step * 3, 25, 5.5, DOG_COAT); limb(ctx, 9, 8, 14 + step * 3, 25, 5.5, DOG_COAT); limb(ctx, -14, -7, -22 + step * 4, -20, 5, DOG_COAT); limb(ctx, 14, -7, 22 - step * 4, -20, 5, DOG_COAT); ell(ctx, 0, 0, 24, 15, DOG_COAT, INK, 2); ell(ctx, 18, -10, 13, 10, DOG_COAT, INK, 2); ell(ctx, 29, -11, 6, 4, INK, INK, 1); ell(ctx, 12, -17, 5, 10, DOG_SHADE, INK, 1.5); ell(ctx, 23, -19, 5, 9, DOG_SHADE, INK, 1.5); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-20, -3); ctx.quadraticCurveTo(-37, -17 - step * 5, -42, -4 - step * 2); ctx.stroke(); ctx.fillStyle = CYAN; ctx.fillRect(-10, -17, 20, 3); }
function drawActionBar(ctx, e) { if (!e.actionTotal || e.actionTotal < e.actionT) e.actionTotal = e.actionT; const pct = Math.max(0, Math.min(1, 1 - e.actionT / Math.max(1, e.actionTotal))); roundRect(ctx, -42, 42, 84, 10, 5, 'rgba(10,12,18,.86)'); roundRect(ctx, -40, 44, 80 * pct, 6, 4, '#f1c66a'); const label = String(e.action || 'Working').slice(0, 20); const w = Math.max(76, label.length * 6.2 + 18); roundRect(ctx, -w / 2, 55, w, 18, 7, 'rgba(248,251,255,.88)'); ctx.strokeStyle = 'rgba(7,16,24,.38)'; ctx.lineWidth = 1; roundRect(ctx, -w / 2, 55, w, 18, 7, '', true); ctx.fillStyle = '#071018'; ctx.font = '900 9px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, 0, 68); ctx.textAlign = 'left'; }
function drawReactionBubble(ctx, reaction, entityType) { const t = performance.now() / 1000; const pulse = Math.sin(t * 12) * 3; const bob = Math.sin(t * 6) * 4; const y = entityType === 'dog' ? -82 : -100; ctx.save(); ctx.translate(0, y + bob); ctx.lineWidth = 3; ctx.strokeStyle = reaction.type === 'privacy' ? '#ff75df' : reaction.type === 'noise' ? '#f1c66a' : '#74e6ff'; ctx.fillStyle = reaction.style === 'thought' ? 'rgba(245,248,255,.90)' : 'rgba(255,248,225,.96)'; drawJaggedBurst(ctx, pulse); ctx.fillStyle = '#10141b'; ctx.font = '900 16px system-ui'; ctx.textAlign = 'center'; ['!', '?', '…'].forEach((s, i) => ctx.fillText(s, -12 + i * 12, 5)); ctx.textAlign = 'left'; ctx.restore(); }
function drawJaggedBurst(ctx, pulse) { ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; const r = (i % 2 ? 29 : 42) + pulse; const x = Math.cos(a) * r; const y = Math.sin(a) * r * .62; if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
function drawBubble(ctx, text, style = 'speech') { const w = Math.max(72, text.length * 12 + 24); roundRect(ctx, -w / 2, -86, w, 34, 12, style === 'thought' ? '#eef7ff' : '#f8fbff'); ctx.fillStyle = '#10141b'; ctx.font = '900 16px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text, 0, -64); ctx.textAlign = 'left'; }
function ell(ctx, x, y, rx, ry, fill, stroke = '', lineWidth = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke && lineWidth > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); } }
function line(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function circle(ctx, x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
