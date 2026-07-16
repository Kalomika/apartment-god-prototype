const DOG_ATLAS = new Image();
DOG_ATLAS.decoding = 'async';
DOG_ATLAS.src = `${new URL('../assets/sprites/characters/dog/top_down_dog_atlas.svg', import.meta.url).href}?v=20260716-mature-top-down-anatomy`;

const FRAME = 128;
const FRAME_MAP = { north: 0, south: 1, east: 2, west: 3 };
const OUTLINE = '#071018';

export function drawDogSpriteOverlay(ctx, state) {
  for (const dog of (state.entities || []).filter(e => !e.hidden && e.floor === state.floor && e.type === 'dog')) {
    drawDogAtlasFrame(ctx, dog, resolveDogDirection(dog), state.selectedId === dog.id);
    drawDogUi(ctx, dog);
  }
}

function drawDogAtlasFrame(ctx, dog, direction, selected) {
  if (!DOG_ATLAS.complete || DOG_ATLAS.naturalWidth === 0) return;
  const moving = Array.isArray(dog.path) && dog.path.length > 0;
  const frame = FRAME_MAP[direction] ?? 1;
  const bob = moving ? Math.sin(performance.now() / 150) * .7 : 0;
  ctx.save();
  ctx.translate(dog.x, dog.y + bob);
  drawGroundShadow(ctx, moving);
  if (selected) drawSelectionRing(ctx);
  ctx.drawImage(DOG_ATLAS, frame * FRAME, 0, FRAME, FRAME, -40, -48, 80, 80);
  ctx.restore();
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

function drawGroundShadow(ctx, moving) {
  ctx.save();
  ctx.fillStyle = moving ? 'rgba(20,24,30,.17)' : 'rgba(20,24,30,.21)';
  ctx.beginPath();
  ctx.ellipse(0, 21, moving ? 27 : 29, moving ? 13 : 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSelectionRing(ctx) {
  ctx.strokeStyle = '#f1c66a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 3, 33, 23, 0, 0, Math.PI * 2);
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
  round(ctx, -34, 37, 68, 8, 5, 'rgba(10,12,18,.84)');
  round(ctx, -32, 39, 64 * pct, 4, 3, '#f1c66a');
}

function drawBubble(ctx, text, style = 'speech') {
  if (!text) return;
  const w = Math.max(58, text.length * 7 + 18);
  const y = -62;
  round(ctx, -w / 2, y, w, 24, 10, style === 'thought' ? '#e9f2ff' : '#f8fbff');
  ctx.fillStyle = OUTLINE;
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
