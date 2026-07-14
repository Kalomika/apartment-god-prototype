import { COLORS } from './config.js';
import { roundRect } from './renderHelpers.js';

const INK = '#071018';
const SKIN = '#3a241f';
const SKIN_LIT = '#5a372f';
const HAIR = '#05070a';
const CYAN = '#74e6ff';
const MAGENTA = '#ff75df';
const CLOTH = { resident: '#111820', girlfriend: '#17131b', lab_test_subject: '#102833' };

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
  const moving = Array.isArray(actor.path) && actor.path.length > 0 && Number(actor.actionT || 0) <= 0;

  ctx.save();
  ctx.translate(actor.x, actor.y);
  if (selected) drawSelectionRing(ctx);
  drawGroundShadow(ctx, moving);
  drawStaticTopDownBody(ctx, female, cloth, accent, key);
  if (actor.carrying === 'towel' || key.includes('towel')) drawTowelWrap(ctx, female);
  if (actor.actionT > 0) drawActionBar(ctx, actor);
  if (actor.reaction?.t > 0) drawReactionBubble(ctx, actor.reaction);
  if (actor.bubble && actor.bubbleT > 0) drawBubble(ctx, actor.bubble, actor.reaction?.style || 'speech');
  ctx.restore();
}

function drawSelectionRing(ctx) {
  ctx.strokeStyle = COLORS.active;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 5, 26, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawGroundShadow(ctx, moving) {
  ellipse(ctx, 0, 12, moving ? 25 : 23, moving ? 14 : 13, 'rgba(0,0,0,.22)');
}

function drawStaticTopDownBody(ctx, female, cloth, accent, key) {
  const sleep = key.includes('sleep') || key.includes('nap') || key.includes('waking') || key.includes('bed together');
  if (sleep) return drawTopDownSleep(ctx, female, accent);

  // Stage one of the animation rebuild: no walk cycle, no side-view puppeting.
  // This is a static true top-down bridge so the old procedural animation system can be replaced one approved state at a time.
  const shoulderW = female ? 35 : 39;
  const torsoW = female ? 30 : 34;
  const torsoH = 42;

  // Legs read as top-down lower body mass, not side-view legs.
  roundRect(ctx, -15, 9, 12, 31, 7, cloth);
  roundRect(ctx, 3, 9, 12, 31, 7, cloth);
  ellipse(ctx, -9, 42, 6, 5, HAIR, INK, 1);
  ellipse(ctx, 9, 42, 6, 5, HAIR, INK, 1);

  // Shoulders and torso are seen from above.
  ctx.beginPath();
  ctx.moveTo(-shoulderW / 2, -14);
  ctx.quadraticCurveTo(-torsoW / 2 - 7, 5, -torsoW / 2, 25);
  ctx.lineTo(torsoW / 2, 25);
  ctx.quadraticCurveTo(torsoW / 2 + 7, 5, shoulderW / 2, -14);
  ctx.closePath();
  ctx.fillStyle = cloth;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Shoulder plane highlight. This is the main top-down read.
  ellipse(ctx, 0, -12, shoulderW / 2, 8, 'rgba(255,255,255,.10)');
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-12, -7);
  ctx.quadraticCurveTo(0, -1, 12, -7);
  ctx.stroke();

  // Arms rest beside the torso until approved activity poses are rebuilt.
  limb(ctx, -17, -6, -25, 18, cloth, 7);
  limb(ctx, 17, -6, 25, 18, cloth, 7);
  hand(ctx, -25, 18, accent);
  hand(ctx, 25, 18, accent);

  drawTopDownHead(ctx, female, 0, -34);
  drawActivityPropBridge(ctx, key, accent);
}

function drawTopDownHead(ctx, female, x, y) {
  // True top-down target: crown of head dominates, with only a small hint of face plane.
  ellipse(ctx, x, y, female ? 18 : 17, female ? 19 : 17, SKIN, INK, 2.5);
  ellipse(ctx, x + 4, y + 4, female ? 9 : 8, female ? 8 : 7, SKIN_LIT);
  if (female) {
    ellipse(ctx, x, y - 3, 21, 18, HAIR, INK, 1.5);
    ellipse(ctx, x - 15, y + 5, 6, 12, HAIR, INK, 1.2);
    ellipse(ctx, x + 15, y + 5, 6, 12, HAIR, INK, 1.2);
  } else {
    ctx.fillStyle = HAIR;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(x, y - 7, 17, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function drawActivityPropBridge(ctx, key, accent) {
  if (key.includes('eat') || key.includes('table')) {
    ellipse(ctx, 0, 46, 13, 7, '#efe7dc', INK, 1.1);
    ellipse(ctx, 4, 45, 5, 3, '#b66d55');
  } else if (key.includes('desk') || key.includes('computer') || key.includes('study') || key.includes('shop')) {
    roundRect(ctx, -19, 35, 38, 15, 4, '#10141b');
    roundRect(ctx, -14, 38, 28, 7, 2, '#9fd7df');
  } else if (key.includes('read')) {
    roundRect(ctx, -17, 35, 34, 15, 4, '#efe7dc');
    line(ctx, 0, 36, 0, 49, '#8b6f53', 1.2);
  } else if (key.includes('game') || key.includes('arcade') || key.includes('console')) {
    roundRect(ctx, -17, 35, 34, 13, 6, '#171b25');
    ellipse(ctx, -8, 41, 3, 3, accent);
    ellipse(ctx, 8, 41, 3, 3, '#f1c66a');
  }
}

function drawTopDownSleep(ctx, female, accent) {
  ellipse(ctx, 3, 8, 45, 24, 'rgba(0,0,0,.20)');
  roundRect(ctx, -42, -22, 31, 44, 13, '#dfe6ef');
  ellipse(ctx, -29, 0, female ? 17 : 16, female ? 18 : 16, SKIN, INK, 2.3);
  ellipse(ctx, -34, -3, female ? 11 : 9, female ? 14 : 10, HAIR);
  roundRect(ctx, -7, -22, 69, 44, 16, female ? '#3a2438' : '#24324a');
  roundRect(ctx, 3, -25, 74, 50, 17, female ? '#9f6b8e' : '#60718f');
  ctx.fillStyle = accent;
  ctx.font = '900 10px system-ui';
  ctx.fillText('z', 28, -39);
}

function drawTowelWrap(ctx, female) {
  roundRect(ctx, -13, 3, 26, 28, 9, female ? '#f3badf' : '#f3f1ea');
  line(ctx, -10, 9, 10, 9, 'rgba(7,16,24,.28)', 1.2);
}

function drawActionBar(ctx, e) {
  const total = Math.max(1, Number(e.actionTotal || e.actionT || 1));
  const pct = Math.max(0, Math.min(1, 1 - Number(e.actionT || 0) / total));
  roundRect(ctx, -42, 50, 84, 10, 5, 'rgba(10,12,18,.86)');
  roundRect(ctx, -40, 52, 80 * pct, 6, 4, '#f1c66a');
  const label = String(e.action || 'Working').slice(0, 24);
  const w = Math.max(78, label.length * 6.2 + 18);
  roundRect(ctx, -w / 2, 63, w, 18, 7, 'rgba(248,251,255,.88)');
  ctx.strokeStyle = 'rgba(7,16,24,.38)';
  ctx.lineWidth = 1;
  roundRect(ctx, -w / 2, 63, w, 18, 7, '', true);
  ctx.fillStyle = '#071018';
  ctx.font = '900 9px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(label, 0, 76);
  ctx.textAlign = 'left';
}

function drawReactionBubble(ctx, reaction) {
  const text = String(reaction.text || '').slice(0, 42);
  if (!text) return;
  drawBubble(ctx, text, reaction.style || 'thought');
}

function drawBubble(ctx, text, style = 'speech') {
  const w = Math.max(72, text.length * 9 + 22);
  const y = -86;
  roundRect(ctx, -w / 2, y, w, 32, 12, style === 'thought' ? '#e9f2ff' : '#f8fbff');
  ctx.fillStyle = '#10141b';
  ctx.font = '900 12px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, y + 21);
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

function ellipse(ctx, x, y, rx, ry, fill, stroke = '', width = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke && width) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}

function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
