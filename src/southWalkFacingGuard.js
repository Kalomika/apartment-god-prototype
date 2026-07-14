const INK = '#071018';
const SKIN = '#3a241f';
const SKIN_LIT = '#5a372f';
const HAIR = '#05070a';
const CYAN = '#74e6ff';
const MAGENTA = '#ff75df';
const CLOTH = { resident: '#111820', girlfriend: '#17131b' };

export function drawSouthWalkFacingGuard(ctx, state) {
  for (const actor of (state.entities || [])) {
    if (!shouldCorrectSouthWalk(actor, state.floor)) continue;
    drawFrontWalkOverlay(ctx, actor);
  }
}

function shouldCorrectSouthWalk(actor, floor) {
  if (actor.hidden || actor.floor !== floor || actor.type !== 'person') return false;
  if (actor.actionT > 0) return false;
  const target = Array.isArray(actor.path) && actor.path.length > 0 ? actor.path[0] : actor.target;
  if (!target) return false;
  const dx = target.x - actor.x;
  const dy = target.y - actor.y;
  return dy > 1 && Math.abs(dy) >= Math.abs(dx);
}

function drawFrontWalkOverlay(ctx, actor) {
  const female = actor.id === 'girlfriend';
  const accent = female ? MAGENTA : CYAN;
  const cloth = female ? CLOTH.girlfriend : CLOTH.resident;
  const step = [-1, .45, 1, -.45][Math.floor(performance.now() / 115) % 4];

  ctx.save();
  ctx.translate(actor.x, actor.y);
  ctx.scale(.90, .90);

  // Opaque cleanup footprint to hide the wrongly rotated/back-facing vertical body beneath this guard.
  ellipse(ctx, 0, 0, 38, 58, 'rgba(216,196,164,.96)');
  ellipse(ctx, 0, 10, 34, 43, 'rgba(0,0,0,.22)');

  leg(ctx, -8, 13, -12 - step * 5, 36 + Math.max(step, 0) * 4, cloth, -.08);
  leg(ctx, 8, 13, 12 + step * 5, 36 + Math.max(-step, 0) * 4, cloth, .08);
  torso(ctx, female, cloth, accent, 42);
  arm(ctx, -16, -8, -28 + step * 5, 10 - step * 6, cloth);
  arm(ctx, 16, -8, 28 - step * 5, 10 + step * 6, cloth);
  hand(ctx, -28 + step * 5, 10 - step * 6, accent);
  hand(ctx, 28 - step * 5, 10 + step * 6, accent);
  head(ctx, female, 0, -37);

  ctx.restore();
}

function torso(ctx, female, cloth, accent, h) {
  const shoulder = female ? 29 : 34;
  const hip = female ? 24 : 28;
  ctx.beginPath();
  ctx.moveTo(-shoulder / 2, -11);
  ctx.quadraticCurveTo(-shoulder * .48, 0, -hip / 2, h * .45);
  ctx.lineTo(hip / 2, h * .45);
  ctx.quadraticCurveTo(shoulder * .48, 0, shoulder / 2, -11);
  ctx.closePath();
  ctx.fillStyle = cloth;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-shoulder * .30, -7);
  ctx.lineTo(-hip * .23, h * .34);
  ctx.moveTo(shoulder * .30, -7);
  ctx.lineTo(hip * .23, h * .34);
  ctx.stroke();
}

function head(ctx, female, x, y) {
  ellipse(ctx, x, y + 12, 8, 7, SKIN, INK, 2);
  ellipse(ctx, x, y, female ? 15 : 16, female ? 17 : 16, SKIN, INK, 2.5);
  ellipse(ctx, x, y + 2, female ? 10 : 11, female ? 11 : 10, SKIN_LIT);
  hair(ctx, female, x, y);
  line(ctx, x - 4, y + 4, x + 4, y + 4, '#f0d7bd', 1);
}

function hair(ctx, female, x, y) {
  ctx.fillStyle = HAIR;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (female) {
    ctx.ellipse(x, y - 4, 19, 20, 0, Math.PI * .85, Math.PI * 2.15);
    ctx.fill();
    ctx.stroke();
    ellipse(ctx, x - 15, y + 3, 5, 9, HAIR, INK, 1);
    ellipse(ctx, x + 15, y + 3, 5, 9, HAIR, INK, 1);
  } else {
    ctx.ellipse(x, y - 6, 16, 11, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function arm(ctx, x1, y1, x2, y2, fill) { limb(ctx, x1, y1, x2, y2, 7, fill); }
function leg(ctx, x1, y1, x2, y2, fill, rot = 0) { limb(ctx, x1, y1, x2, y2, 8, fill); shoe(ctx, x2, y2 + 3, rot); }
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
function hand(ctx, x, y, accent) {
  ellipse(ctx, x, y, 4.5, 4.5, SKIN, INK, 1.5);
  ctx.fillStyle = accent;
  ctx.fillRect(x - 2, y - 2, 4, 1);
}
function shoe(ctx, x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ellipse(ctx, 0, 0, 5, 8, HAIR, INK, 1);
  ctx.restore();
}
function ellipse(ctx, x, y, rx, ry, fill, stroke = '', lineWidth = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke && lineWidth > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
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
