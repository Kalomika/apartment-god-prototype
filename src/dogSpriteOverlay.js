const OUTLINE = '#071018';
const CREAM = '#f2ead8';
const CREAM_LIT = '#fff7e8';
const TAN = '#b57435';
const TAN_LIT = '#d09a55';
const DARK = '#40301f';
const EAR = '#6d4a2c';
const SHADOW = 'rgba(0,0,0,.25)';
const BALL = '#5aa04c';
const WATER = '#65b9d4';
const BOWL = '#50585b';
const PINK = '#dd6c6c';

export function drawDogSpriteOverlay(ctx, state) {
  for (const dog of (state.entities || []).filter(e => !e.hidden && e.floor === state.floor && e.type === 'dog')) {
    const direction = resolveDogDirection(dog);
    const stateKey = resolveDogState(dog, state);
    drawShapeDog(ctx, dog, direction, stateKey, state);
  }
}

function drawShapeDog(ctx, dog, direction, stateKey, state) {
  const moving = Array.isArray(dog.path) && dog.path.length > 0;
  const tick = Math.floor(performance.now() / 130);
  const gait = moving ? tick % 4 : Math.floor(performance.now() / 460) % 3;
  const angle = directionAngle(direction);
  const bob = moving ? Math.sin(performance.now() / 105) * 1.4 : 0;

  ctx.save();
  ctx.translate(dog.x, dog.y + bob);
  ctx.rotate(angle);
  if (stateKey === 'curl_sleep') drawCurlSleepDog(ctx);
  else drawStandingDog(ctx, stateKey, gait, state);
  ctx.restore();
}

function resolveDogState(dog, state) {
  const key = `${String(dog.currentActionId || '').toLowerCase()} ${String(dog.action || '').toLowerCase()} ${String(dog.pose || '').toLowerCase()} ${String(dog.carrying || '').toLowerCase()}`;
  const moving = Array.isArray(dog.path) && dog.path.length > 0;
  if (key.includes('sleep') || key.includes('rest') || key.includes('dog bed')) return 'curl_sleep';
  if (key.includes('eat') || key.includes('food') || key.includes('bowl')) return 'eat';
  if (key.includes('drink') || key.includes('water')) return 'drink';
  if (key.includes('fetch') || key.includes('ball') || state.fetch?.ball) return 'fetch';
  if (key.includes('bark') || key.includes('alert')) return 'bark';
  if (key.includes('sad')) return 'sad';
  if (key.includes('happy')) return 'happy';
  if (key.includes('sit')) return 'sit';
  if (key.includes('lie')) return 'lie';
  if (key.includes('play')) return 'play_bow';
  if (moving) return Math.hypot(dog.vx || 0, dog.vy || 0) > 115 ? 'run' : 'walk';
  return 'idle';
}

function resolveDogDirection(dog) {
  const target = Array.isArray(dog.path) && dog.path.length > 0 ? dog.path[0] : dog.target;
  const dx = Number.isFinite(dog.vx) && Math.abs(dog.vx) > 0.01 ? dog.vx : target ? target.x - dog.x : 0;
  const dy = Number.isFinite(dog.vy) && Math.abs(dog.vy) > 0.01 ? dog.vy : target ? target.y - dog.y : 0;
  if (Math.abs(dx) + Math.abs(dy) < 0.01) return dog.lastDogDirection || 'south';
  const direction = Math.abs(dy) >= Math.abs(dx) ? (dy < 0 ? 'north' : 'south') : (dx < 0 ? 'west' : 'east');
  dog.lastDogDirection = direction;
  return direction;
}

function directionAngle(direction) {
  return { south: 0, north: Math.PI, east: Math.PI / 2, west: -Math.PI / 2 }[direction] ?? 0;
}

function drawStandingDog(ctx, stateKey, gait, state) {
  const run = stateKey === 'run';
  const lie = stateKey === 'lie';
  const play = stateKey === 'play_bow';
  const sit = stateKey === 'sit';
  const scaleY = lie ? 1.16 : play ? 1.08 : sit ? .94 : 1;
  const bodyY = lie ? -5 : play ? -6 : sit ? 0 : -6;
  const headY = lie ? 25 : play ? 31 : sit ? 31 : 28;
  const rearY = lie ? -35 : play ? -28 : -39;

  ellipse(ctx, 0, 18, 31, 15, SHADOW);
  drawTail(ctx, gait, stateKey, rearY);
  drawLegs(ctx, gait, stateKey, run, sit, lie, play);
  ellipse(ctx, 0, bodyY, 25, 37 * scaleY, TAN, OUTLINE, 3);
  drawBackPatch(ctx, bodyY, scaleY);
  round(ctx, -18, bodyY + 21, 36, 13, 9, CREAM_LIT);
  drawEars(ctx, headY, stateKey);
  ellipse(ctx, 0, headY, 20, stateKey === 'bark' ? 18 : 17, TAN_LIT, OUTLINE, 3);
  round(ctx, -7, headY - 18, 14, 31, 7, CREAM_LIT);
  ellipse(ctx, 0, headY + 11, 14, 10, CREAM_LIT);
  drawFace(ctx, headY, stateKey);
  drawDogAccessory(ctx, headY, stateKey, state);
}

function drawTail(ctx, gait, stateKey, rearY) {
  const wag = stateKey === 'run' ? .24 : stateKey === 'idle' ? .1 : 0;
  const swing = Math.sin(performance.now() / 95) * wag;
  ctx.save();
  ctx.rotate(swing);
  ctx.beginPath();
  ctx.moveTo(0, rearY + 2);
  ctx.quadraticCurveTo(8, rearY - 20, 5, rearY - 35);
  ctx.quadraticCurveTo(0, rearY - 40, -5, rearY - 35);
  ctx.quadraticCurveTo(-7, rearY - 20, 0, rearY + 2);
  ctx.fillStyle = CREAM_LIT;
  ctx.fill();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawLegs(ctx, gait, stateKey, run, sit, lie, play) {
  if (sit) {
    for (const [x, y, rx, ry] of [[-19,9,8,15],[19,9,8,15],[-17,29,7,12],[17,29,7,12]]) ellipse(ctx, x, y, rx, ry, CREAM, OUTLINE, 2);
    return;
  }
  if (lie || play) {
    for (const [x, y] of [[-22,30],[22,30],[-22,-36],[22,-36]]) ellipse(ctx, x, y, 7, 17, CREAM, OUTLINE, 2);
    return;
  }
  const step = [-1, .45, 1, -.45][gait % 4];
  const rearStep = -step;
  const spread = run ? 1.35 : 1;
  const points = [
    [-12 - step * 5 * spread, 21 + Math.max(step, 0) * 4],
    [12 + step * 5 * spread, 21 + Math.max(-step, 0) * 4],
    [-13 - rearStep * 4 * spread, -29 + Math.max(rearStep, 0) * 3],
    [13 + rearStep * 4 * spread, -29 + Math.max(-rearStep, 0) * 3]
  ];
  for (const [x, y] of points) ellipse(ctx, x, y, 6, run ? 16 : 13, CREAM, OUTLINE, 2);
}

function drawBackPatch(ctx, bodyY, scaleY) {
  ctx.beginPath();
  ctx.moveTo(-20, bodyY - 18 * scaleY);
  ctx.bezierCurveTo(-12, bodyY - 30 * scaleY, 14, bodyY - 30 * scaleY, 21, bodyY - 15 * scaleY);
  ctx.lineTo(20, bodyY + 11 * scaleY);
  ctx.bezierCurveTo(4, bodyY + 17 * scaleY, -9, bodyY + 13 * scaleY, -21, bodyY + 8 * scaleY);
  ctx.closePath();
  ctx.fillStyle = DARK;
  ctx.fill();
}

function drawEars(ctx, headY, stateKey) {
  const lift = stateKey === 'alert' || stateKey === 'bark' ? -4 : 0;
  ellipse(ctx, -19, headY + lift, 8, 20, EAR, OUTLINE, 2, -.2);
  ellipse(ctx, 19, headY + lift, 8, 20, EAR, OUTLINE, 2, .2);
}

function drawFace(ctx, headY, stateKey) {
  if (stateKey === 'sad') {
    line(ctx, -11, headY - 1, -5, headY - 3, OUTLINE, 2);
    line(ctx, 5, headY - 3, 11, headY - 1, OUTLINE, 2);
  } else {
    ellipse(ctx, -8, headY, 2.5, 2.5, OUTLINE);
    ellipse(ctx, 8, headY, 2.5, 2.5, OUTLINE);
  }
  ellipse(ctx, 0, headY + 13, 5, 4, OUTLINE);
  if (stateKey === 'happy') ellipse(ctx, 0, headY + 23, 5, 8, PINK, OUTLINE, 1);
  if (stateKey === 'bark') ellipse(ctx, 0, headY + 21, 7, 8, '#28140f', OUTLINE, 1);
}

function drawDogAccessory(ctx, headY, stateKey, state) {
  if (stateKey === 'eat') drawBowl(ctx, 0, headY + 37, '#9a6a34');
  if (stateKey === 'drink') drawBowl(ctx, 0, headY + 37, WATER);
  if (stateKey === 'fetch') {
    ellipse(ctx, 0, headY + 36, 11, 11, BALL, OUTLINE, 2);
    line(ctx, -6, headY + 33, 6, headY + 39, '#b7e082', 2);
  }
  if (stateKey === 'bark') {
    line(ctx, 31, headY - 6, 44, headY - 15, OUTLINE, 3);
    line(ctx, 35, headY + 9, 51, headY + 9, OUTLINE, 3);
  }
  if (stateKey === 'alert') {
    line(ctx, -6, -54, -10, -69, OUTLINE, 3);
    line(ctx, 6, -54, 11, -69, OUTLINE, 3);
    ellipse(ctx, -12, -75, 3, 3, OUTLINE);
    ellipse(ctx, 13, -75, 3, 3, OUTLINE);
  }
}

function drawBowl(ctx, x, y, fill) {
  ellipse(ctx, x, y, 20, 9, BOWL, OUTLINE, 2);
  ellipse(ctx, x, y - 2, 14, 5, fill);
}

function drawCurlSleepDog(ctx) {
  ellipse(ctx, 0, 8, 34, 26, SHADOW);
  ellipse(ctx, 0, 0, 36, 30, TAN, OUTLINE, 3, -.35);
  ellipse(ctx, 8, -4, 24, 18, DARK, null, 0, -.35);
  ellipse(ctx, -18, 8, 20, 16, CREAM_LIT, OUTLINE, 2, -.15);
  ellipse(ctx, -25, 5, 8, 12, EAR, OUTLINE, 2, -.7);
  line(ctx, 16, 14, 32, 24, CREAM_LIT, 7);
  line(ctx, 17, 15, 31, 23, OUTLINE, 2);
  ellipse(ctx, -23, 13, 2, 2, OUTLINE);
}

function round(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill, stroke = null, width = 1, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  }
}

function line(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
