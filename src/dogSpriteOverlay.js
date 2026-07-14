const OUTLINE = '#071018';
const COAT = '#e9ddc8';
const COAT_LIT = '#fff4df';
const COAT_SHADE = '#b99a69';
const DARK_PATCH = '#473421';
const EAR = '#6a4a31';
const SHADOW = 'rgba(0,0,0,.22)';
const BALL = '#5aa04c';
const WATER = '#65b9d4';
const BOWL = '#50585b';
const PINK = '#dd6c6c';

export function drawDogSpriteOverlay(ctx, state) {
  for (const dog of (state.entities || []).filter(e => !e.hidden && e.floor === state.floor && e.type === 'dog')) {
    const direction = resolveDogDirection(dog);
    const stateKey = resolveDogState(dog);
    drawShapeDog(ctx, dog, direction, stateKey, state);
  }
}

function drawShapeDog(ctx, dog, direction, stateKey, state) {
  const moving = Array.isArray(dog.path) && dog.path.length > 0;
  const tick = Math.floor(performance.now() / 140);
  const gait = moving ? tick % 4 : Math.floor(performance.now() / 520) % 3;
  const angle = directionAngle(direction);
  const bob = moving ? Math.sin(performance.now() / 120) * .75 : 0;
  const selected = state.selectedId === dog.id;

  ctx.save();
  ctx.translate(dog.x, dog.y + bob);
  if (selected) drawSelectionRing(ctx);
  ctx.rotate(angle);
  ctx.scale(.56, .56);
  if (stateKey === 'curl_sleep') drawCurlSleepDog(ctx);
  else drawStandingDog(ctx, stateKey, gait);
  ctx.restore();
  drawDogUi(ctx, dog);
}

function drawSelectionRing(ctx) {
  ctx.strokeStyle = '#f1c66a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 5, 22, 16, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawDogUi(ctx, dog) {
  ctx.save();
  ctx.translate(dog.x, dog.y);
  if (dog.actionT > 0) drawActionBar(ctx, dog);
  if (dog.reaction?.t > 0) drawBubble(ctx, String(dog.reaction.text || '').slice(0, 36), dog.reaction.style || 'thought');
  if (dog.bubble && dog.bubbleT > 0) drawBubble(ctx, String(dog.bubble || '').slice(0, 36), dog.reaction?.style || 'speech');
  ctx.restore();
}

function resolveDogState(dog) {
  const key = `${String(dog.currentActionId || '').toLowerCase()} ${String(dog.action || '').toLowerCase()} ${String(dog.pose || '').toLowerCase()} ${String(dog.carrying || '').toLowerCase()}`;
  const moving = Array.isArray(dog.path) && dog.path.length > 0;
  if (key.includes('sleep') || key.includes('rest') || key.includes('dog bed')) return 'curl_sleep';
  if (key.includes('eat') || key.includes('food') || key.includes('bowl')) return 'eat';
  if (key.includes('drink') || key.includes('water')) return 'drink';
  if (key.includes('fetch') || key.includes('ball') || key.includes('carry')) return 'fetch';
  if (key.includes('bark')) return 'bark';
  if (key.includes('alert')) return 'alert';
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
  return { south: 0, north: Math.PI, east: -Math.PI / 2, west: Math.PI / 2 }[direction] ?? 0;
}

function drawStandingDog(ctx, stateKey, gait) {
  const run = stateKey === 'run';
  const lie = stateKey === 'lie';
  const play = stateKey === 'play_bow';
  const sit = stateKey === 'sit';
  const bodyY = lie ? -4 : play ? -6 : sit ? 0 : -7;
  const headY = lie ? 25 : play ? 31 : sit ? 29 : 25;
  const rearY = lie ? -30 : play ? -26 : -35;

  ellipse(ctx, 0, 14, 28, 13, SHADOW);
  drawTail(ctx, stateKey, rearY);
  drawLegs(ctx, gait, stateKey, run, sit, lie, play);
  ellipse(ctx, 0, bodyY, 23, lie ? 35 : 34, COAT_SHADE, OUTLINE, 3);
  drawBackPatch(ctx, bodyY);
  ellipse(ctx, 0, bodyY + 19, 19, 11, COAT_LIT);
  drawEars(ctx, headY, stateKey);
  ellipse(ctx, 0, headY, 17, 15, COAT_LIT, OUTLINE, 3);
  ellipse(ctx, 0, headY + 8, 11, 7, COAT);
  drawFace(ctx, headY, stateKey);
  drawDogAccessory(ctx, headY, stateKey);
}

function drawTail(ctx, stateKey, rearY) {
  const wag = stateKey === 'run' || stateKey === 'happy' || stateKey === 'idle' ? .18 : 0;
  const swing = Math.sin(performance.now() / 105) * wag;
  ctx.save();
  ctx.rotate(swing);
  line(ctx, 0, rearY + 2, 3, rearY - 26, OUTLINE, 7);
  line(ctx, 0, rearY + 2, 3, rearY - 26, COAT_LIT, 4);
  ctx.restore();
}

function drawLegs(ctx, gait, stateKey, run, sit, lie, play) {
  if (sit) {
    for (const [x, y, rx, ry] of [[-15,9,6,12],[15,9,6,12],[-13,25,6,10],[13,25,6,10]]) ellipse(ctx, x, y, rx, ry, COAT, OUTLINE, 2);
    return;
  }
  if (lie || play) {
    for (const [x, y] of [[-18,27],[18,27],[-18,-30],[18,-30]]) ellipse(ctx, x, y, 6, 14, COAT, OUTLINE, 2);
    return;
  }
  const step = [-1, .45, 1, -.45][gait % 4];
  const rearStep = -step;
  const spread = run ? 1.22 : .92;
  const points = [
    [-10 - step * 4 * spread, 18 + Math.max(step, 0) * 3],
    [10 + step * 4 * spread, 18 + Math.max(-step, 0) * 3],
    [-11 - rearStep * 3.5 * spread, -26 + Math.max(rearStep, 0) * 2],
    [11 + rearStep * 3.5 * spread, -26 + Math.max(-rearStep, 0) * 2]
  ];
  for (const [x, y] of points) ellipse(ctx, x, y, 5, run ? 13 : 11, COAT, OUTLINE, 2);
}

function drawBackPatch(ctx, bodyY) {
  ctx.beginPath();
  ctx.moveTo(-17, bodyY - 17);
  ctx.bezierCurveTo(-10, bodyY - 29, 13, bodyY - 29, 18, bodyY - 15);
  ctx.lineTo(18, bodyY + 8);
  ctx.bezierCurveTo(5, bodyY + 13, -8, bodyY + 10, -18, bodyY + 5);
  ctx.closePath();
  ctx.fillStyle = DARK_PATCH;
  ctx.fill();
}

function drawEars(ctx, headY, stateKey) {
  const lift = stateKey === 'alert' || stateKey === 'bark' ? -4 : 0;
  ellipse(ctx, -15, headY + lift, 6, 15, EAR, OUTLINE, 2, -.15);
  ellipse(ctx, 15, headY + lift, 6, 15, EAR, OUTLINE, 2, .15);
}

function drawFace(ctx, headY, stateKey) {
  if (stateKey === 'sad') {
    line(ctx, -8, headY - 1, -4, headY - 2, OUTLINE, 1.6);
    line(ctx, 4, headY - 2, 8, headY - 1, OUTLINE, 1.6);
  } else {
    ellipse(ctx, -6, headY, 1.8, 1.8, OUTLINE);
    ellipse(ctx, 6, headY, 1.8, 1.8, OUTLINE);
  }
  ellipse(ctx, 0, headY + 9, 3.4, 2.8, OUTLINE);
  if (stateKey === 'happy') ellipse(ctx, 0, headY + 17, 3.2, 5.5, PINK, OUTLINE, .8);
  if (stateKey === 'bark') ellipse(ctx, 0, headY + 16, 5, 5.5, '#28140f', OUTLINE, .9);
}

function drawDogAccessory(ctx, headY, stateKey) {
  if (stateKey === 'eat') drawBowl(ctx, 0, headY + 28, '#9a6a34');
  if (stateKey === 'drink') drawBowl(ctx, 0, headY + 28, WATER);
  if (stateKey === 'fetch') {
    ellipse(ctx, 0, headY + 25, 8, 8, BALL, OUTLINE, 2);
    line(ctx, -4, headY + 22, 4, headY + 28, '#b7e082', 1.5);
  }
  if (stateKey === 'bark') {
    line(ctx, 25, headY - 5, 36, headY - 12, OUTLINE, 2.2);
    line(ctx, 28, headY + 6, 41, headY + 6, OUTLINE, 2.2);
  }
  if (stateKey === 'alert') {
    line(ctx, -5, -47, -8, -59, OUTLINE, 2.2);
    line(ctx, 5, -47, 9, -59, OUTLINE, 2.2);
    ellipse(ctx, -10, -64, 2.4, 2.4, OUTLINE);
    ellipse(ctx, 11, -64, 2.4, 2.4, OUTLINE);
  }
}

function drawBowl(ctx, x, y, fill) {
  ellipse(ctx, x, y, 16, 7, BOWL, OUTLINE, 2);
  ellipse(ctx, x, y - 1.5, 11, 4, fill);
}

function drawCurlSleepDog(ctx) {
  ellipse(ctx, 0, 7, 30, 23, SHADOW);
  ellipse(ctx, 0, 0, 31, 26, COAT_SHADE, OUTLINE, 3, -.35);
  ellipse(ctx, 7, -4, 20, 15, DARK_PATCH, null, 0, -.35);
  ellipse(ctx, -15, 7, 17, 13, COAT_LIT, OUTLINE, 2, -.15);
  ellipse(ctx, -21, 4, 6, 10, EAR, OUTLINE, 2, -.7);
  line(ctx, 14, 12, 27, 21, OUTLINE, 5);
  line(ctx, 14, 12, 27, 21, COAT_LIT, 3);
  ellipse(ctx, -19, 11, 1.8, 1.8, OUTLINE);
}

function drawActionBar(ctx, dog) {
  const total = Math.max(1, Number(dog.actionTotal || dog.actionT || 1));
  const pct = Math.max(0, Math.min(1, 1 - Number(dog.actionT || 0) / total));
  round(ctx, -34, 34, 68, 8, 5, 'rgba(10,12,18,.84)');
  round(ctx, -32, 36, 64 * pct, 4, 3, '#f1c66a');
}

function drawBubble(ctx, text, style = 'speech') {
  if (!text) return;
  const w = Math.max(58, text.length * 7 + 18);
  const y = -58;
  round(ctx, -w / 2, y, w, 24, 10, style === 'thought' ? '#e9f2ff' : '#f8fbff');
  ctx.fillStyle = '#10141b';
  ctx.font = '900 10px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, y + 16);
  ctx.textAlign = 'left';
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