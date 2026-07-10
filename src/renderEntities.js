import { COLORS } from './config.js';
import { roundRect } from './renderHelpers.js';

const INK = '#071018';
const SKIN = '#3a241f';
const SKIN_LIT = '#5a372f';
const CLOTH_M = '#111820';
const CLOTH_F = '#17131b';
const PAJAMA_M = '#24324a';
const PAJAMA_F = '#3a2438';
const SWIM_M = '#1b5b82';
const SWIM_F = '#6b2a70';
const CYAN = '#74e6ff';
const MAGENTA = '#ff75df';
const DOG_COAT = '#f6f2e8';
const DOG_SHADE = '#d8d0c0';

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
    ctx.arc(0, 4, e.type === 'dog' ? 30 : 34, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.save();
  ctx.rotate(heading(e));
  if (e.type === 'dog') drawDog(ctx, e);
  else drawPerson(ctx, e);
  ctx.restore();

  if (e.actionT > 0) drawActionBar(ctx, e);
  if (e.bubble && e.bubbleT > 0) drawBubble(ctx, e.bubble);
  ctx.restore();
}

function heading(e) {
  const action = String(e.action || '').toLowerCase();
  const pose = String(e.pose || '').toLowerCase();
  if (action.includes('tv') || action.includes('couch') || action.includes('watch')) return 0;
  if (action.includes('fridge') || action.includes('snack') || action.includes('meal')) return 0;
  if (action.includes('desk') || action.includes('study') || action.includes('read')) return 0;
  if (['sleep', 'nap', 'shower', 'swim', 'heavy bag', 'lift weights', 'treadmill'].some(t => action.includes(t) || pose.includes(t))) return e.lastHeading ?? 0;
  const dx = e.vx || (e.target ? e.target.x - e.x : 0);
  const dy = e.vy || (e.target ? e.target.y - e.y : 0);
  if (Math.abs(dx) + Math.abs(dy) < 0.01) return e.lastHeading ?? 0;
  e.lastHeading = Math.atan2(dy, dx) + Math.PI / 2;
  return e.lastHeading;
}

function drawPerson(ctx, e) {
  const action = String(e.action || '').toLowerCase();
  const pose = String(e.pose || '').toLowerCase();
  const moving = Boolean(e.path?.length) || pose === 'walk' || action.includes('walk') || action.includes('run');
  const step = moving ? [-1, .45, 1, -.45][Math.floor(performance.now() / 120) % 4] : Math.sin(performance.now() / 700) * .12;
  const female = e.id === 'girlfriend';
  const accent = female ? MAGENTA : CYAN;
  const cloth = female ? CLOTH_F : CLOTH_M;

  if (pose === 'shower' || action.includes('shower')) return drawShowerPrivacy(ctx, female, accent);
  if (pose.includes('swim') || action.includes('swim')) return drawSwimPose(ctx, female, accent);
  if (pose === 'heavy_bag' || action.includes('heavy bag')) return drawBoxingPose(ctx, female, cloth, accent);
  if (pose === 'lift_weights' || action.includes('lift weights')) return drawLiftPose(ctx, female, cloth, accent);
  if (pose === 'treadmill' || action.includes('treadmill')) return drawTreadmillPose(ctx, female, cloth, accent);

  if (pose === 'sleep' || action.includes('sleep') || action.includes('nap') || action.includes('waking up')) {
    ctx.save();
    ctx.rotate(-Math.PI / 2 + .08);
    drawHumanBody(ctx, female, female ? PAJAMA_F : PAJAMA_M, accent, 0, true, true);
    drawSleepCover(ctx, female, action.includes('waking'));
    ctx.restore();
    drawZs(ctx, accent);
    return;
  }

  if (pose === 'sit' || action.includes('tv') || action.includes('desk') || action.includes('phone') || action.includes('game') || action.includes('ordering') || action.includes('read') || action.includes('study') || action.includes('eat')) {
    if (action.includes('tv') || action.includes('watch')) drawSeatedBackPose(ctx, female, cloth, accent);
    else drawHumanBody(ctx, female, cloth, accent, step * .25, true, false);
    if (action.includes('desk') || action.includes('study')) drawTypingHands(ctx, accent);
    if (action.includes('eat')) drawSmallPlate(ctx);
    if (action.includes('read')) drawBook(ctx);
    if (action.includes('phone')) drawPhoneGlow(ctx, accent);
    return;
  }

  drawHumanBody(ctx, female, cloth, accent, step, false, false);

  if (action.includes('dance') || action.includes('music')) {
    ctx.fillStyle = accent;
    ctx.font = '900 15px system-ui';
    ctx.fillText('♪', 25, -35);
  }
}

function drawHumanBody(ctx, female, cloth, accent, step, seated, pajama = false) {
  const shoulder = female ? 29 : 34;
  const hip = female ? 24 : 28;
  const torsoH = seated ? female ? 36 : 40 : female ? 42 : 46;

  ell(ctx, 0, 8, 34, 45, 'rgba(0,0,0,.22)', '', 0);

  limb(ctx, -hip * .28, 15, -12 - step * 4, seated ? 28 : 35 + Math.abs(step) * 3, 8, cloth);
  limb(ctx, hip * .28, 15, 12 + step * 4, seated ? 28 : 35 - Math.abs(step) * 2, 8, cloth);
  shoe(ctx, -12 - step * 4, seated ? 31 : 39 + Math.abs(step) * 3, -.08);
  shoe(ctx, 12 + step * 4, seated ? 31 : 39 - Math.abs(step) * 2, .08);

  torso(ctx, shoulder, hip, torsoH, cloth, accent);

  limb(ctx, -shoulder * .47, -8, -28, 10 - step * 5, 7, cloth);
  limb(ctx, shoulder * .47, -8, 28, 10 + step * 5, 7, cloth);
  hand(ctx, -29, 12 - step * 5, accent);
  hand(ctx, 29, 12 + step * 5, accent);

  ell(ctx, 0, -24, 8, 7, SKIN, INK, 2);
  ell(ctx, 0, -37, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.5);
  ell(ctx, 0, -34, female ? 10 : 11, female ? 11 : 10, SKIN_LIT, '', 0);
  hair(ctx, female);

  ctx.strokeStyle = '#f0d7bd';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-4, -34);
  ctx.lineTo(4, -34);
  ctx.stroke();

  if (pajama) {
    ctx.fillStyle = accent;
    ctx.font = '900 7px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('PJ', 0, 11);
    ctx.textAlign = 'left';
  }
}

function drawSeatedBackPose(ctx, female, cloth, accent) {
  ell(ctx, 0, 10, 34, 31, 'rgba(0,0,0,.20)', '', 0);
  limb(ctx, -11, 12, -20, 33, 8, cloth);
  limb(ctx, 11, 12, 20, 33, 8, cloth);
  shoe(ctx, -21, 36, -.2);
  shoe(ctx, 21, 36, .2);
  roundRect(ctx, -19, -12, 38, 42, 14, cloth);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  roundRect(ctx, -19, -12, 38, 42, 14, false, true);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, -5);
  ctx.lineTo(-10, 24);
  ctx.moveTo(10, -5);
  ctx.lineTo(10, 24);
  ctx.stroke();
  limb(ctx, -20, 0, -30, 18, 7, cloth);
  limb(ctx, 20, 0, 30, 18, 7, cloth);
  ell(ctx, 0, -28, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.5);
  hair(ctx, female);
  ctx.fillStyle = 'rgba(255,255,255,.12)';
  ctx.fillRect(-13, -7, 26, 3);
}

function drawSleepCover(ctx, female, waking = false) {
  const blanket = female ? '#9f6b8e' : '#60718f';
  ctx.save();
  ctx.globalAlpha = .94;
  if (waking) {
    roundRect(ctx, -14, -6, 58, 33, 13, blanket);
    ctx.fillStyle = 'rgba(255,255,255,.22)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(22, -10, 44, 8);
    ctx.quadraticCurveTo(22, 14, 4, 19);
    ctx.fill();
  } else {
    roundRect(ctx, -18, -8, 62, 38, 14, blanket);
    ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.quadraticCurveTo(10, 5, 30, -2);
    ctx.moveTo(-3, 16);
    ctx.quadraticCurveTo(14, 22, 38, 16);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPhoneGlow(ctx, accent) {
  ctx.save();
  ctx.fillStyle = 'rgba(116,230,255,.18)';
  ctx.beginPath();
  ctx.moveTo(-20, -20);
  ctx.lineTo(20, -20);
  ctx.lineTo(36, 28);
  ctx.lineTo(-36, 28);
  ctx.closePath();
  ctx.fill();
  roundRect(ctx, 14, 4, 16, 28, 4, '#10141b');
  roundRect(ctx, 17, 7, 10, 20, 3, '#a8e9ff');
  ctx.fillStyle = accent;
  ctx.fillRect(18, 29, 8, 2);
  ctx.restore();
}

function drawShowerPrivacy(ctx, female, accent) {
  const t = performance.now() / 300;
  drawClothesPile(ctx, female);
  for (let i = 0; i < 7; i++) {
    const x = Math.sin(t + i) * 18 + (i % 2 ? 6 : -6);
    const y = -8 + i * 5 + Math.cos(t * .7 + i) * 4;
    ell(ctx, x, y, 20 + i * 1.5, 13, `rgba(235,250,255,${.30 - i * .018})`, '', 0);
  }
  for (let y = -20; y <= 18; y += 13) for (let x = -18; x <= 18; x += 13) roundRect(ctx, x, y, 10, 10, 2, accent);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255,255,255,.75)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -5, 28, .25, Math.PI * 1.75);
  ctx.stroke();
}

function drawClothesPile(ctx, female) {
  const cloth = female ? CLOTH_F : CLOTH_M;
  ell(ctx, -33, 32, 13, 7, cloth, INK, 1.5);
  ell(ctx, -22, 28, 10, 6, female ? MAGENTA : CYAN, INK, 1);
  ell(ctx, -38, 24, 7, 5, '#05070a', INK, 1);
}

function drawSwimPose(ctx, female, accent) {
  const suit = female ? SWIM_F : SWIM_M;
  const kick = Math.sin(performance.now() / 110);
  ell(ctx, 0, 11, 42, 28, 'rgba(60,170,210,.28)', '', 0);
  limb(ctx, -8, 10, -26, 26 + kick * 5, 7, SKIN);
  limb(ctx, 8, 10, 26, 26 - kick * 5, 7, SKIN);
  limb(ctx, -13, -6, -32, -14 - kick * 8, 6, SKIN);
  limb(ctx, 13, -6, 32, -14 + kick * 8, 6, SKIN);
  torso(ctx, female ? 27 : 32, female ? 23 : 27, 36, suit, accent);
  ell(ctx, 0, -33, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.5);
  hair(ctx, female);
  ctx.strokeStyle = 'rgba(255,255,255,.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 2, 35, .2, Math.PI * 1.1);
  ctx.stroke();
}

function drawBoxingPose(ctx, female, cloth, accent) {
  const jab = Math.max(0, Math.sin(performance.now() / 105));
  drawHumanBodyBaseShadow(ctx);
  limb(ctx, -10, 18, -18, 42, 8, cloth);
  limb(ctx, 10, 18, 17, 40, 8, cloth);
  shoe(ctx, -18, 46, -.2);
  shoe(ctx, 17, 44, .2);
  torso(ctx, female ? 29 : 34, female ? 24 : 28, female ? 40 : 44, cloth, accent);
  limb(ctx, -15, -8, -34, -6, 7, cloth);
  limb(ctx, 15, -8, 30 + jab * 18, -12, 7, cloth);
  glove(ctx, -36, -6, accent);
  glove(ctx, 34 + jab * 18, -12, accent);
  ell(ctx, 0, -37, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.5);
  hair(ctx, female);
}

function drawLiftPose(ctx, female, cloth, accent) {
  const rep = Math.max(0, Math.sin(performance.now() / 180));
  drawHumanBodyBaseShadow(ctx);
  limb(ctx, -10, 18, -20, 35, 8, cloth);
  limb(ctx, 10, 18, 20, 35, 8, cloth);
  torso(ctx, female ? 28 : 33, female ? 24 : 28, 36, cloth, accent);
  const y = -34 - rep * 18;
  line(ctx, -42, y, 42, y, '#dfe6ea', 4);
  circle(ctx, -47, y, 8, '#343b46');
  circle(ctx, 47, y, 8, '#343b46');
  limb(ctx, -14, -8, -34, y, 7, cloth);
  limb(ctx, 14, -8, 34, y, 7, cloth);
  hand(ctx, -34, y, accent);
  hand(ctx, 34, y, accent);
  ell(ctx, 0, -37, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.5);
  hair(ctx, female);
}

function drawTreadmillPose(ctx, female, cloth, accent) {
  const step = [-1, .45, 1, -.45][Math.floor(performance.now() / 95) % 4];
  roundRect(ctx, -33, 24, 66, 18, 8, 'rgba(20,24,31,.65)');
  drawHumanBody(ctx, female, cloth, accent, step * 1.4, false, false);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-30, 20);
  ctx.lineTo(30, 20);
  ctx.stroke();
}

function drawTypingHands(ctx, accent) { ctx.fillStyle = accent; ctx.fillRect(-18, 25, 10, 3); ctx.fillRect(8, 25, 10, 3); }
function drawSmallPlate(ctx) { ell(ctx, 0, 31, 13, 6, '#efe7dc', INK, 1); ell(ctx, 2, 31, 5, 3, '#b66d55', '', 0); }
function drawBook(ctx) { roundRect(ctx, -21, 24, 42, 18, 4, '#efe7dc'); line(ctx, 0, 25, 0, 41, '#8b6f53', 1); }
function drawZs(ctx, accent) { ctx.fillStyle = accent; ctx.font = '900 12px system-ui'; ctx.fillText('Z', 24, -46); ctx.font = '900 9px system-ui'; ctx.fillText('z', 38, -58); }
function drawHumanBodyBaseShadow(ctx) { ell(ctx, 0, 8, 34, 45, 'rgba(0,0,0,.22)', '', 0); }
function glove(ctx, x, y, accent) { ell(ctx, x, y, 7, 6, accent, INK, 1.5); }

function drawDog(ctx, e) {
  const action = String(e.action || '').toLowerCase();
  const resting = action.includes('dog bed') || action.includes('dog rest') || String(e.pose || '').includes('dog_rest');
  const moving = Boolean(e.path?.length) || action.includes('fetch');
  const step = resting ? 0 : moving ? [-1, .5, 1, -.5][Math.floor(performance.now() / 110) % 4] : Math.sin(performance.now() / 600) * .15;
  ell(ctx, 1, 6, 36, resting ? 20 : 23, 'rgba(0,0,0,.22)', '', 0);
  if (resting) {
    ell(ctx, 0, 1, 28, 17, DOG_COAT, INK, 2);
    ell(ctx, 18, -8, 12, 9, DOG_COAT, INK, 2);
    ell(ctx, 29, -9, 5, 4, INK, INK, 1);
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-15, 4, 13, .2, Math.PI * 1.3); ctx.stroke();
    return;
  }
  limb(ctx, -12, 8, -17 - step * 3, 25, 5.5, DOG_COAT);
  limb(ctx, 9, 8, 14 + step * 3, 25, 5.5, DOG_COAT);
  limb(ctx, -14, -7, -22 + step * 4, -20, 5, DOG_COAT);
  limb(ctx, 14, -7, 22 - step * 4, -20, 5, DOG_COAT);
  ell(ctx, 0, 0, 24, 15, DOG_COAT, INK, 2);
  ell(ctx, 18, -10, 13, 10, DOG_COAT, INK, 2);
  ell(ctx, 29, -11, 6, 4, INK, INK, 1);
  ell(ctx, 12, -17, 5, 10, DOG_SHADE, INK, 1.5);
  ell(ctx, 23, -19, 5, 9, DOG_SHADE, INK, 1.5);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-20, -3);
  ctx.quadraticCurveTo(-37, -17 - step * 5, -42, -4 - step * 2);
  ctx.stroke();
  ctx.fillStyle = CYAN;
  ctx.fillRect(-10, -17, 20, 3);
}

function torso(ctx, shoulder, hip, torsoH, cloth, accent) {
  ctx.beginPath();
  ctx.moveTo(-shoulder / 2, -11);
  ctx.lineTo(shoulder / 2, -11);
  ctx.lineTo(hip / 2, torsoH * .45);
  ctx.lineTo(-hip / 2, torsoH * .45);
  ctx.closePath();
  ctx.fillStyle = cloth;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-shoulder * .32, -7);
  ctx.lineTo(-hip * .25, torsoH * .34);
  ctx.moveTo(shoulder * .32, -7);
  ctx.lineTo(hip * .25, torsoH * .34);
  ctx.stroke();
}

function hair(ctx, female) {
  ctx.fillStyle = '#05070a';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (female) {
    ctx.ellipse(0, -41, 19, 20, 0, Math.PI * .85, Math.PI * 2.15);
    ctx.fill(); ctx.stroke(); ell(ctx, -15, -34, 5, 9, '#05070a', INK, 1); ell(ctx, 15, -34, 5, 9, '#05070a', INK, 1);
  } else {
    ctx.ellipse(0, -43, 16, 11, 0, Math.PI, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }
}

function limb(ctx, x1, y1, x2, y2, width, fill) { ctx.strokeStyle = INK; ctx.lineWidth = width + 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.strokeStyle = fill; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function hand(ctx, x, y, accent) { ell(ctx, x, y, 4.5, 4.5, SKIN, INK, 1.5); ctx.fillStyle = accent; ctx.fillRect(x - 2, y - 2, 4, 1); }
function shoe(ctx, x, y, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ell(ctx, 0, 0, 5, 8, '#05070a', INK, 1); ctx.restore(); }

function drawActionBar(ctx, e) {
  if (!e.actionTotal || e.actionTotal < e.actionT) e.actionTotal = e.actionT;
  const pct = Math.max(0, Math.min(1, 1 - e.actionT / Math.max(1, e.actionTotal)));
  roundRect(ctx, -42, 42, 84, 10, 5, 'rgba(10,12,18,.86)');
  roundRect(ctx, -40, 44, 80 * pct, 6, 4, '#f1c66a');
  const label = String(e.action || 'Working').slice(0, 20);
  const w = Math.max(76, label.length * 6.2 + 18);
  roundRect(ctx, -w / 2, 55, w, 18, 7, 'rgba(248,251,255,.88)');
  ctx.strokeStyle = 'rgba(7,16,24,.38)';
  ctx.lineWidth = 1;
  roundRect(ctx, -w / 2, 55, w, 18, 7, false, true);
  ctx.fillStyle = '#071018';
  ctx.font = '900 9px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(label, 0, 68);
  ctx.textAlign = 'left';
}

function drawBubble(ctx, text) { const w = Math.max(72, text.length * 12 + 24); roundRect(ctx, -w / 2, -86, w, 34, 12, '#f8fbff'); ctx.fillStyle = '#10141b'; ctx.font = '900 16px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text, 0, -64); ctx.textAlign = 'left'; }
function ell(ctx, x, y, rx, ry, fill, stroke, lineWidth) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke && lineWidth > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); } }
function line(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function circle(ctx, x, y, r, color) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); }
