const OUTLINE = '#071018';
const WHITE = '#f3eadb';
const WHITE_LIT = '#fff8ea';
const WHITE_SHADE = '#d1c4ad';
const BROWN = '#8b5a34';
const BROWN_DARK = '#4c2f1f';
const EAR = '#5b3828';
const SHADOW = 'rgba(0,0,0,.22)';
const BALL = '#5aa04c';
const WATER = '#65b9d4';
const BOWL = '#50585b';
const PINK = '#dd6c6c';

export function drawDogSpriteOverlay(ctx, state) {
  for (const dog of (state.entities || []).filter(e => !e.hidden && e.floor === state.floor && e.type === 'dog')) {
    const direction = resolveDogDirection(dog);
    const stateKey = resolveDogState(dog);
    drawTopDownDog(ctx, dog, direction, stateKey, state);
  }
}

function drawTopDownDog(ctx, dog, direction, stateKey, state) {
  const moving = Array.isArray(dog.path) && dog.path.length > 0;
  const gait = moving ? Math.floor(performance.now() / 135) % 4 : 0;
  const selected = state.selectedId === dog.id;
  const bob = moving ? Math.sin(performance.now() / 120) * .55 : 0;

  ctx.save();
  ctx.translate(dog.x, dog.y + bob);
  if (selected) drawSelectionRing(ctx);
  ctx.rotate(directionAngle(direction));
  ctx.scale(.74, .74);

  if (stateKey === 'curl_sleep') drawSleepingDog(ctx);
  else if (stateKey === 'sit') drawSittingDog(ctx, stateKey);
  else if (stateKey === 'lie' || stateKey === 'play_bow') drawLowDog(ctx, stateKey, gait);
  else drawStandingDog(ctx, stateKey, gait);

  ctx.restore();
  drawDogUi(ctx, dog);
}

function resolveDogState(dog) {
  const key = `${dog.currentActionId || ''} ${dog.action || ''} ${dog.pose || ''} ${dog.carrying || ''}`.toLowerCase();
  const moving = Array.isArray(dog.path) && dog.path.length > 0;
  if (key.includes('sleep') || key.includes('dog bed') || key.includes('rest')) return 'curl_sleep';
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
  const dx = Number.isFinite(dog.vx) && Math.abs(dog.vx) > .01 ? dog.vx : target ? target.x - dog.x : 0;
  const dy = Number.isFinite(dog.vy) && Math.abs(dog.vy) > .01 ? dog.vy : target ? target.y - dog.y : 0;
  if (Math.abs(dx) + Math.abs(dy) < .01) return dog.lastDogDirection || 'south';
  const direction = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'west' : 'east') : (dy < 0 ? 'north' : 'south');
  dog.lastDogDirection = direction;
  return direction;
}

// Base dog is drawn facing east: head at +X, tail at -X.
function directionAngle(direction) {
  return { east: 0, south: Math.PI / 2, west: Math.PI, north: -Math.PI / 2 }[direction] ?? 0;
}

function drawStandingDog(ctx, stateKey, gait) {
  const run = stateKey === 'run';
  const step = [-1, .55, 1, -.55][gait % 4];
  const stride = run ? 6 : 3.8;

  ellipse(ctx, 0, 8, 34, 15, SHADOW);
  drawTail(ctx, stateKey, 0);
  drawLeg(ctx, -12 - step * stride, -12, run ? -4 : -2);
  drawLeg(ctx, -10 + step * stride, 12, run ? 4 : 2);
  drawLeg(ctx, 11 + step * stride, -12, run ? 5 : 3);
  drawLeg(ctx, 12 - step * stride, 12, run ? -5 : -3);
  drawBody(ctx, 0, 0, 40, 24);
  drawHead(ctx, 29, 0, stateKey);
  drawAccessory(ctx, 42, 0, stateKey);
}

function drawSittingDog(ctx, stateKey) {
  ellipse(ctx, -2, 9, 31, 15, SHADOW);
  drawTail(ctx, stateKey, -2);
  drawLeg(ctx, -10, -12, -1, 10);
  drawLeg(ctx, -10, 12, 1, 10);
  drawLeg(ctx, 15, -9, 2, 9);
  drawLeg(ctx, 15, 9, -2, 9);
  drawBody(ctx, -2, 0, 34, 25);
  drawHead(ctx, 25, 0, stateKey);
}

function drawLowDog(ctx, stateKey, gait) {
  ellipse(ctx, -1, 9, 36, 14, SHADOW);
  drawTail(ctx, stateKey, -1);
  drawLeg(ctx, -13, -13, -4, 9);
  drawLeg(ctx, -13, 13, 4, 9);
  drawLeg(ctx, 14, -13, 5, 9);
  drawLeg(ctx, 14, 13, -5, 9);
  drawBody(ctx, -1, 0, 43, 23);
  drawHead(ctx, 31, 0, stateKey);
}

function drawSleepingDog(ctx) {
  ellipse(ctx, 0, 9, 29, 17, SHADOW);
  ellipse(ctx, -1, 0, 32, 22, WHITE, OUTLINE, 2.5, -.18);
  ellipse(ctx, -5, -2, 16, 12, BROWN, null, 0, -.18);
  ellipse(ctx, 15, 6, 13, 11, BROWN, OUTLINE, 2, .15);
  ellipse(ctx, 21, -1, 5, 8, EAR, OUTLINE, 1.6, -.15);
  line(ctx, -26, 4, -37, 11, OUTLINE, 5);
  line(ctx, -26, 4, -37, 11, WHITE_LIT, 3);
  ellipse(ctx, 19, 9, 1.6, 1.6, OUTLINE);
}

function drawBody(ctx, x, y, rx, ry) {
  ellipse(ctx, x, y, rx, ry, WHITE, OUTLINE, 3);
  ellipse(ctx, x - 8, y - 4, 15, 11, BROWN, null, 0, -.15);
  ellipse(ctx, x + 6, y + 5, 11, 8, WHITE_LIT, null, 0, .1);
  line(ctx, x - rx + 8, y + ry - 3, x + rx - 6, y + ry - 4, WHITE_SHADE, 1.2);
}

function drawHead(ctx, x, y, stateKey) {
  ellipse(ctx, x, y, 16, 14, BROWN, OUTLINE, 3);
  ellipse(ctx, x + 10, y, 10, 8, BROWN, OUTLINE, 2);
  ellipse(ctx, x + 18, y, 3.8, 3.2, OUTLINE);
  ellipse(ctx, x - 4, y - 12, 7, 9, EAR, OUTLINE, 2, -.15);
  ellipse(ctx, x - 4, y + 12, 7, 9, EAR, OUTLINE, 2, .15);
  ellipse(ctx, x + 4, y - 5, 2.1, 2.1, OUTLINE);
  ellipse(ctx, x + 4, y + 5, 2.1, 2.1, OUTLINE);
  if (stateKey === 'happy') ellipse(ctx, x + 14, y + 8, 3, 5, PINK, OUTLINE, 1, .25);
  if (stateKey === 'bark') ellipse(ctx, x + 17, y, 5.2, 5.2, '#25140e', OUTLINE, 1);
  if (stateKey === 'sad') {
    line(ctx, x + 1, y - 6, x + 7, y - 4, OUTLINE, 1.5);
    line(ctx, x + 1, y + 6, x + 7, y + 4, OUTLINE, 1.5);
  }
}

function drawLeg(ctx, x, y, offset = 0, len = 12) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(offset * Math.PI / 70);
  ellipse(ctx, 0, 0, len, 5.5, WHITE, OUTLINE, 2);
  ellipse(ctx, len - 3, 0, 4.6, 4.8, WHITE_LIT, OUTLINE, 1.5);
  ctx.restore();
}

function drawTail(ctx, stateKey, y = 0) {
  const wag = stateKey === 'walk' || stateKey === 'run' || stateKey === 'happy' || stateKey === 'idle' ? Math.sin(performance.now() / 115) * .18 : 0;
  ctx.save();
  ctx.rotate(wag);
  line(ctx, -36, y, -54, y - 7, OUTLINE, 6);
  line(ctx, -36, y, -54, y - 7, WHITE_LIT, 3.4);
  ctx.restore();
}

function drawAccessory(ctx, x, y, stateKey) {
  if (stateKey === 'fetch') {
    ellipse(ctx, x + 13, y, 7.5, 7.5, BALL, OUTLINE, 2);
    line(ctx, x + 9, y - 3, x + 17, y + 4, '#b7e082', 1.5);
  }
  if (stateKey === 'eat') drawBowl(ctx, x + 18, y, '#9a6a34');
  if (stateKey === 'drink') drawBowl(ctx, x + 18, y, WATER);
  if (stateKey === 'bark') {
    line(ctx, x + 23, y - 7, x + 36, y - 15, OUTLINE, 2.2);
    line(ctx, x + 25, y + 7, x + 39, y + 10, OUTLINE, 2.2);
  }
  if (stateKey === 'alert') {
    line(ctx, x + 14, y - 13, x + 20, y - 26, OUTLINE, 2.2);
    line(ctx, x + 14, y + 13, x + 20, y + 26, OUTLINE, 2.2);
    ellipse(ctx, x + 22, y - 30, 2.5, 2.5, OUTLINE);
    ellipse(ctx, x + 22, y + 30, 2.5, 2.5, OUTLINE);
  }
}

function drawBowl(ctx, x, y, fill) {
  ellipse(ctx, x, y, 15, 8, BOWL, OUTLINE, 2);
  ellipse(ctx, x, y - 1, 10, 4, fill);
}

function drawSelectionRing(ctx) {
  ctx.strokeStyle = '#f1c66a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 3, 31, 21, 0, 0, Math.PI * 2);
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

function drawActionBar(ctx, dog) {
  const total = Math.max(1, Number(dog.actionTotal || dog.actionT || 1));
  const pct = Math.max(0, Math.min(1, 1 - Number(dog.actionT || 0) / total));
  round(ctx, -34, 35, 68, 8, 5, 'rgba(10,12,18,.84)');
  round(ctx, -32, 37, 64 * pct, 4, 3, '#f1c66a');
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
