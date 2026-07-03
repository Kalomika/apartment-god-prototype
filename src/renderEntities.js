import { COLORS } from './config.js';
import { roundRect } from './renderHelpers.js';

const INK = '#071018';
const PAPER = '#fbfbf7';
const PAPER_DIM = '#e9e6dc';
const HAIR = '#05070a';
const DOG_COAT = '#fbfbf7';
const DOG_SHADE = '#e5e0d5';
const GUIDE = 'rgba(7,16,24,.16)';

const FACING_STEP = (Math.PI * 2) / 8;

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
  const dx = e.vx || (e.target ? e.target.x - e.x : 0);
  const dy = e.vy || (e.target ? e.target.y - e.y : 0);
  if (Math.abs(dx) + Math.abs(dy) < 0.01) return e.lastHeading ?? 0;
  const raw = Math.atan2(dy, dx) + Math.PI / 2;
  const quantized = Math.round(raw / FACING_STEP) * FACING_STEP;
  e.lastHeading = quantized;
  e.facing8 = directionName(quantized);
  return quantized;
}

function directionName(angle) {
  const normalized = ((Math.round(angle / FACING_STEP) % 8) + 8) % 8;
  return ['down', 'down-left', 'left', 'up-left', 'up', 'up-right', 'right', 'down-right'][normalized];
}

function drawPerson(ctx, e) {
  const action = String(e.action || '').toLowerCase();
  const moving = Boolean(e.path?.length) || e.pose === 'walk' || action.includes('walk') || action.includes('run');
  const step = moving ? [-1, .45, 1, -.45][Math.floor(performance.now() / 120) % 4] : Math.sin(performance.now() / 700) * .12;
  const female = e.id === 'girlfriend';

  if (e.pose === 'sleep' || action.includes('sleep') || action.includes('nap')) {
    ctx.save();
    ctx.rotate(-Math.PI / 2 + .08);
    drawHumanBody(ctx, female, 0, true);
    ctx.restore();
    return;
  }

  if (e.pose === 'sit' || action.includes('tv') || action.includes('desk') || action.includes('phone') || action.includes('game') || action.includes('ordering')) {
    drawHumanBody(ctx, female, step * .25, true);
    return;
  }

  drawHumanBody(ctx, female, step, false);

  if (action.includes('dance') || action.includes('music')) {
    ctx.fillStyle = INK;
    ctx.font = '900 15px system-ui';
    ctx.fillText('♪', 25, -35);
  }
}

function drawHumanBody(ctx, female, step, seated) {
  const shoulder = female ? 29 : 34;
  const hip = female ? 24 : 28;
  const torsoH = seated ? female ? 36 : 40 : female ? 42 : 46;

  ell(ctx, 0, 8, 34, 45, GUIDE, '', 0);

  limb(ctx, -hip * .28, 15, -12 - step * 4, seated ? 28 : 35 + Math.abs(step) * 3, 8, PAPER_DIM);
  limb(ctx, hip * .28, 15, 12 + step * 4, seated ? 28 : 35 - Math.abs(step) * 2, 8, PAPER_DIM);
  shoe(ctx, -12 - step * 4, seated ? 31 : 39 + Math.abs(step) * 3, -.08);
  shoe(ctx, 12 + step * 4, seated ? 31 : 39 - Math.abs(step) * 2, .08);

  torso(ctx, shoulder, hip, torsoH, female);

  limb(ctx, -shoulder * .47, -8, -28, 10 - step * 5, 7, PAPER_DIM);
  limb(ctx, shoulder * .47, -8, 28, 10 + step * 5, 7, PAPER_DIM);
  hand(ctx, -29, 12 - step * 5);
  hand(ctx, 29, 12 + step * 5);

  ell(ctx, 0, -24, 8, 7, PAPER, INK, 2);
  ell(ctx, 0, -37, female ? 15 : 16, female ? 17 : 16, PAPER, INK, 2.5);
  hair(ctx, female);

  ctx.strokeStyle = INK;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-4, -34);
  ctx.lineTo(4, -34);
  ctx.stroke();
}

function drawDog(ctx, e) {
  const action = String(e.action || '').toLowerCase();
  const moving = Boolean(e.path?.length) || action.includes('fetch');
  const step = moving ? [-1, .5, 1, -.5][Math.floor(performance.now() / 110) % 4] : Math.sin(performance.now() / 600) * .15;

  ell(ctx, 1, 6, 36, 23, GUIDE, '', 0);
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

  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-10, -17);
  ctx.lineTo(10, -17);
  ctx.moveTo(-6, -12);
  ctx.lineTo(6, -12);
  ctx.stroke();
}

function torso(ctx, shoulder, hip, torsoH, female) {
  ctx.beginPath();
  ctx.moveTo(-shoulder / 2, -11);
  ctx.lineTo(shoulder / 2, -11);
  ctx.lineTo(hip / 2, torsoH * .45);
  ctx.lineTo(-hip / 2, torsoH * .45);
  ctx.closePath();
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-shoulder * .32, -7);
  ctx.lineTo(-hip * .25, torsoH * .34);
  ctx.moveTo(shoulder * .32, -7);
  ctx.lineTo(hip * .25, torsoH * .34);
  if (female) {
    ctx.moveTo(-shoulder * .18, 1);
    ctx.lineTo(shoulder * .18, 1);
  }
  ctx.stroke();
}

function hair(ctx, female) {
  ctx.fillStyle = HAIR;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (female) {
    ctx.ellipse(0, -41, 19, 20, 0, Math.PI * .85, Math.PI * 2.15);
    ctx.fill();
    ctx.stroke();
    ell(ctx, -15, -34, 5, 9, HAIR, INK, 1);
    ell(ctx, 15, -34, 5, 9, HAIR, INK, 1);
  } else {
    ctx.ellipse(0, -43, 16, 11, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function limb(ctx, x1, y1, x2, y2, width, fill) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = width + 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.strokeStyle = fill;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function hand(ctx, x, y) {
  ell(ctx, x, y, 4.5, 4.5, PAPER, INK, 1.5);
}

function shoe(ctx, x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ell(ctx, 0, 0, 5, 8, PAPER_DIM, INK, 1);
  ctx.restore();
}

function drawActionBar(ctx, e) {
  if (!e.actionTotal || e.actionTotal < e.actionT) e.actionTotal = e.actionT;
  const pct = Math.max(0, Math.min(1, 1 - e.actionT / Math.max(1, e.actionTotal)));
  roundRect(ctx, -38, 42, 76, 10, 5, 'rgba(10,12,18,.82)');
  roundRect(ctx, -36, 44, 72 * pct, 6, 4, '#f1c66a');
  ctx.fillStyle = '#f8fbff';
  ctx.font = '800 9px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(String(e.action || 'Working').slice(0, 16), 0, 63);
  ctx.textAlign = 'left';
}

function drawBubble(ctx, text) {
  const w = Math.max(72, text.length * 12 + 24);
  roundRect(ctx, -w / 2, -86, w, 34, 12, '#f8fbff');
  ctx.fillStyle = '#10141b';
  ctx.font = '900 16px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, -64);
  ctx.textAlign = 'left';
}

function ell(ctx, x, y, rx, ry, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke && lineWidth > 0) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}