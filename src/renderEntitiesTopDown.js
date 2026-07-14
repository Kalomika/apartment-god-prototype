import { COLORS } from './config.js';
import { roundRect } from './renderHelpers.js';

const DOG_ATLAS = new Image();
DOG_ATLAS.src = new URL('../assets/sprites/characters/dog/top_down_dog_atlas.svg', import.meta.url).href;

const INK = '#071018';
const SKIN = '#3a241f';
const SKIN_LIT = '#5a372f';
const HAIR = '#05070a';
const CYAN = '#74e6ff';
const MAGENTA = '#ff75df';
const CLOTH = {
  resident: '#111820',
  girlfriend: '#17131b',
  lab_test_subject: '#102833'
};

export function drawEntities(ctx, state) {
  for (const entity of state.entities.filter(e => !e.hidden && e.floor === state.floor)) {
    drawEntity(ctx, entity, state.selectedId === entity.id);
  }
}

function drawEntity(ctx, entity, selected) {
  const direction = resolveDirection(entity);
  ctx.save();
  ctx.translate(entity.x, entity.y);
  if (selected) drawSelectionRing(ctx, entity.type === 'dog' ? 31 : 29);
  if (entity.type === 'dog') drawDogSprite(ctx, direction, entity);
  else drawPerson(ctx, entity, direction);
  if (entity.actionT > 0) drawActionBar(ctx, entity);
  if (entity.bubble && entity.bubbleT > 0) drawBubble(ctx, entity.bubble);
  ctx.restore();
}

function resolveDirection(entity) {
  const moving = Array.isArray(entity.path) && entity.path.length > 0;
  let dx = 0;
  let dy = 0;
  if (moving) {
    dx = entity.path[0].x - entity.x;
    dy = entity.path[0].y - entity.y;
  } else if (Number.isFinite(entity.lastMoveDx) || Number.isFinite(entity.lastMoveDy)) {
    dx = entity.lastMoveDx || 0;
    dy = entity.lastMoveDy || 0;
  }

  if (moving && Math.hypot(dx, dy) > 1) {
    const dir = Math.abs(dy) >= Math.abs(dx) ? (dy < 0 ? 'north' : 'south') : (dx < 0 ? 'west' : 'east');
    entity.lastDirection = dir;
    return dir;
  }

  const key = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
  if (key.includes('eat') || key.includes('dining') || key.includes('table')) return 'north';
  if (key.includes('desk') || key.includes('laptop') || key.includes('computer') || key.includes('study')) return 'north';
  if (key.includes('tv') || key.includes('watch') || key.includes('couch')) return 'north';
  if (key.includes('toilet') || key.includes('pee')) return 'west';
  if (key.includes('shower')) return 'south';
  if (key.includes('sleep') || key.includes('waking') || key.includes('bed')) return 'east';
  return entity.lastDirection || 'south';
}

function drawSelectionRing(ctx, radius) {
  ctx.strokeStyle = COLORS.active;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 4, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPerson(ctx, entity, direction) {
  const key = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
  const female = entity.id === 'girlfriend';
  const accent = female ? MAGENTA : CYAN;
  const cloth = CLOTH[entity.id] || CLOTH.resident;
  const moving = Array.isArray(entity.path) && entity.path.length > 0;
  const seated = !moving && isSeated(key);
  const sleeping = key.includes('sleep') || key.includes('waking') || key.includes('bed together');

  if (sleeping) return drawSleep(ctx, female, accent);
  if (seated) drawSeatBase(ctx, key);
  if (key.includes('pee_stand')) drawPeeStream(ctx, direction);

  ctx.save();
  if (direction === 'east') ctx.rotate(Math.PI / 2);
  if (direction === 'west') ctx.rotate(-Math.PI / 2);
  if (direction === 'south') ctx.rotate(Math.PI);
  drawHumanNorthBase(ctx, female, cloth, accent, { seated, moving, key });
  ctx.restore();

  if (entity.carrying === 'towel' || key.includes('towel')) drawTowelWrap(ctx, direction, female);
  if (key.includes('eat') || key.includes('table')) drawPlateProp(ctx);
  if (key.includes('desk') || key.includes('laptop') || key.includes('study')) drawLaptopProp(ctx);
  if (key.includes('read')) drawBookProp(ctx);
}

function drawHumanNorthBase(ctx, female, cloth, accent, state) {
  const step = state.moving ? Math.sin(performance.now() / 90) : 0;
  ellipse(ctx, 0, 13, 22, 12, 'rgba(0,0,0,.22)');

  // Feet and legs are short top-down markers, not side-view limbs.
  limb(ctx, -7, 12, -10 - step * 4, 28, cloth, 7);
  limb(ctx, 7, 12, 10 + step * 4, 28, cloth, 7);
  shoe(ctx, -10 - step * 4, 30);
  shoe(ctx, 10 + step * 4, 30);

  // Compact torso seen from above.
  ctx.beginPath();
  ctx.moveTo(-17, -11);
  ctx.quadraticCurveTo(-20, 8, -11, 21);
  ctx.lineTo(11, 21);
  ctx.quadraticCurveTo(20, 8, 17, -11);
  ctx.closePath();
  ctx.fillStyle = cloth;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-10, -6);
  ctx.lineTo(-6, 16);
  ctx.moveTo(10, -6);
  ctx.lineTo(6, 16);
  ctx.stroke();

  const handY = state.seated ? 14 : 8;
  limb(ctx, -16, -6, -25 - step * 3, handY + step * 3, cloth, 6);
  limb(ctx, 16, -6, 25 + step * 3, handY - step * 3, cloth, 6);
  hand(ctx, -25 - step * 3, handY + step * 3, accent);
  hand(ctx, 25 + step * 3, handY - step * 3, accent);

  // Back/top of head. This is the north-facing base. South/east/west are made by rotation.
  ellipse(ctx, 0, -31, female ? 15 : 16, female ? 16 : 15, SKIN, INK, 2.4);
  ellipse(ctx, 0, -37, female ? 17 : 16, female ? 12 : 10, HAIR, INK, 1.5);
  if (female) {
    ellipse(ctx, -13, -29, 6, 12, HAIR, INK, 1.2);
    ellipse(ctx, 13, -29, 6, 12, HAIR, INK, 1.2);
  }
  ctx.fillStyle = SKIN_LIT;
  ctx.globalAlpha = .45;
  ctx.beginPath();
  ctx.ellipse(5, -28, 6, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawDogSprite(ctx, direction, dog) {
  if (!DOG_ATLAS.complete || DOG_ATLAS.naturalWidth === 0) return;
  const frame = { south: 0, north: 1, east: 2, west: 3 }[direction] ?? 0;
  const wobble = Array.isArray(dog.path) && dog.path.length ? Math.sin(performance.now() / 120) * 1.5 : 0;
  ctx.save();
  ctx.translate(0, wobble);
  ctx.drawImage(DOG_ATLAS, frame * 128, 0, 128, 128, -35, -43, 70, 70);
  ctx.restore();
}

function drawSeatBase(ctx, key) {
  const chairColor = key.includes('eat') || key.includes('dining') || key.includes('table') ? '#344552' : '#26313b';
  roundRect(ctx, -25, 9, 50, 31, 10, chairColor);
  roundRect(ctx, -18, 13, 36, 19, 8, '#6e7b86');
  line(ctx, -19, 33, -29, 45, '#1c252b', 3);
  line(ctx, 19, 33, 29, 45, '#1c252b', 3);
}

function drawTowelWrap(ctx, direction, female) {
  ctx.save();
  if (direction === 'east') ctx.rotate(Math.PI / 2);
  if (direction === 'west') ctx.rotate(-Math.PI / 2);
  if (direction === 'south') ctx.rotate(Math.PI);
  roundRect(ctx, -13, 3, 26, 29, 9, female ? '#f3badf' : '#f3f1ea');
  line(ctx, -10, 9, 10, 9, 'rgba(7,16,24,.28)', 1.2);
  ctx.restore();
}

function drawPeeStream(ctx, direction) {
  ctx.save();
  if (direction === 'east') ctx.rotate(Math.PI / 2);
  if (direction === 'west') ctx.rotate(-Math.PI / 2);
  if (direction === 'south') ctx.rotate(Math.PI);
  line(ctx, 0, 22, 0, 44, 'rgba(168,233,255,.65)', 2);
  ctx.restore();
}

function drawPlateProp(ctx) {
  ellipse(ctx, 0, 39, 13, 7, '#efe7dc', INK, 1.2);
  ellipse(ctx, 3, 39, 5, 3, '#b66d55');
}

function drawLaptopProp(ctx) {
  roundRect(ctx, -22, 33, 44, 18, 4, '#10141b');
  roundRect(ctx, -17, 36, 34, 10, 2, '#9fd7df');
}

function drawBookProp(ctx) {
  roundRect(ctx, -19, 34, 38, 16, 4, '#efe7dc');
  line(ctx, 0, 35, 0, 49, '#8b6f53', 1.2);
}

function drawSleep(ctx, female, accent) {
  const blanket = female ? '#9f6b8e' : '#60718f';
  ellipse(ctx, 2, 6, 45, 24, 'rgba(0,0,0,.20)');
  roundRect(ctx, -42, -22, 30, 44, 13, '#dfe6ef');
  ellipse(ctx, -28, 0, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.3);
  ellipse(ctx, -35, 0, female ? 9 : 8, female ? 14 : 12, HAIR);
  roundRect(ctx, -8, -18, 66, 36, 15, female ? '#3a2438' : '#24324a');
  roundRect(ctx, 4, -24, 74, 50, 16, blanket);
  ctx.fillStyle = accent;
  ctx.font = '900 10px system-ui';
  ctx.fillText('z', 26, -39);
}

function isSeated(key) {
  return ['sit', 'tv', 'watch', 'desk', 'study', 'read', 'phone', 'game', 'console', 'arcade', 'darts', 'shop', 'eat', 'table', 'relax'].some(t => key.includes(t));
}

function drawActionBar(ctx, e) {
  if (!e.actionTotal || e.actionTotal < e.actionT) e.actionTotal = e.actionT;
  const pct = Math.max(0, Math.min(1, 1 - e.actionT / Math.max(1, e.actionTotal)));
  roundRect(ctx, -42, 42, 84, 10, 5, 'rgba(10,12,18,.86)');
  roundRect(ctx, -40, 44, 80 * pct, 6, 4, '#f1c66a');
  const label = String(e.action || 'Working').slice(0, 22);
  const w = Math.max(76, label.length * 6.2 + 18);
  roundRect(ctx, -w / 2, 55, w, 18, 7, 'rgba(248,251,255,.88)');
  ctx.strokeStyle = 'rgba(7,16,24,.38)';
  ctx.lineWidth = 1;
  roundRect(ctx, -w / 2, 55, w, 18, 7, '', true);
  ctx.fillStyle = '#071018';
  ctx.font = '900 9px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(label, 0, 68);
  ctx.textAlign = 'left';
}

function drawBubble(ctx, text) {
  const w = Math.max(72, text.length * 11 + 24);
  roundRect(ctx, -w / 2, -86, w, 34, 12, '#f8fbff');
  ctx.fillStyle = '#10141b';
  ctx.font = '900 15px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, -64);
  ctx.textAlign = 'left';
}

function limb(ctx, x1, y1, x2, y2, color, width = 6) {
  line(ctx, x1, y1, x2, y2, INK, width + 3);
  line(ctx, x1, y1, x2, y2, color, width);
}

function hand(ctx, x, y, accent) {
  ellipse(ctx, x, y, 4.5, 4.5, SKIN, INK, 1.2);
  ctx.fillStyle = accent;
  ctx.fillRect(x - 2, y - 2, 4, 1);
}

function shoe(ctx, x, y) { ellipse(ctx, x, y, 5, 7, HAIR, INK, 1); }
function ellipse(ctx, x, y, rx, ry, fill, stroke = '', width = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke && width) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); } }
function line(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
