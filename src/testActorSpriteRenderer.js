import { isTestActor, resolveTestActorPose } from './testActorPoseManifest.js';

const P = {
  ink: '#071018', soft: 'rgba(7,16,24,.52)', skin: '#5a372f', skinLit: '#7a4a3d', hair: '#05070a',
  shirt: '#172235', shirtLit: '#263f63', trim: '#74e6ff', pants: '#111820', pantsLit: '#27313b',
  shoe: '#05070a', blanket: '#24324a', pillow: '#dfe6ef', prop: '#dfe6ea', warm: '#f1c66a',
  book: '#efe7dc', phone: '#a8e9ff', plate: '#f4eee6', bag: '#27313b', shadow: 'rgba(0,0,0,.24)'
};

export function isTestActorSpriteReady(entity) {
  return isTestActor(entity);
}

export function drawTestActorSprite(ctx, entity) {
  if (!isTestActorSpriteReady(entity)) return false;
  const poseState = resolveTestActorPose(entity);
  if (!poseState) return false;

  const t = performance.now() / 1000;
  const poseId = exactContactPose(entity) || (Boolean(entity.path?.length) && !entity.actionT ? 'walk' : poseState.poseId);

  ctx.save();
  ctx.rotate(headingFor(entity, poseId));
  switch (poseId) {
    case 'walk': drawWalk(ctx, t); break;
    case 'chair_sit': drawChairSit(ctx, t); break;
    case 'couch_sit': drawCouchSit(ctx, t); break;
    case 'tv_watch': drawTvWatch(ctx, t); break;
    case 'desk_sit': drawDeskWork(ctx, t, false); break;
    case 'laptop_desk_work': drawDeskWork(ctx, t, true); break;
    case 'laptop_lap': drawLaptopLap(ctx, t); break;
    case 'reading': drawReading(ctx, t); break;
    case 'phone_use': drawPhoneUse(ctx, t); break;
    case 'eating_table': drawEating(ctx, t); break;
    case 'coffee_drink': drawCoffee(ctx, t); break;
    case 'sleep_bed': drawSleep(ctx, t, false); break;
    case 'lying_bed_awake': drawSleep(ctx, t, true); break;
    case 'floor_lounging': drawFloorLounge(ctx, t); break;
    case 'pool_table_use': drawPoolTableUse(ctx, t); break;
    case 'console_game': drawConsoleGame(ctx, t); break;
    case 'cooking': drawCooking(ctx, t); break;
    case 'cleaning': drawCleaning(ctx, t); break;
    case 'changing_clothes': drawChanging(ctx, t); break;
    case 'lift_weights': drawLiftWeights(ctx, t); break;
    case 'heavy_bag': drawHeavyBag(ctx, t); break;
    case 'treadmill_run': drawTreadmillRun(ctx, t); break;
    case 'soccer_kick': drawSoccerKick(ctx, t); break;
    case 'pet_interaction': drawPetInteraction(ctx, t); break;
    case 'cuddle_bed': drawSleep(ctx, t, true); break;
    case 'reaction': drawReactionPose(ctx, t); break;
    default: drawIdle(ctx, t); break;
  }
  if (poseState.definition?.status === 'FALLBACK_FIRST_PASS') fallbackBadge(ctx);
  ctx.restore();
  return true;
}

function exactContactPose(entity) {
  if (!entity.actionT && !entity.currentActionId) return '';
  const id = String(entity.currentActionId || '').toLowerCase();
  const action = String(entity.action || '').toLowerCase();
  if (id === 'lift_weights' || action.includes('lift weights')) return 'lift_weights';
  if (id === 'heavy_bag' || action.includes('heavy bag') || action.includes('hit heavy bag')) return 'heavy_bag';
  if (id === 'treadmill' || action.includes('treadmill')) return 'treadmill_run';
  if (id === 'soccer_practice' || id === 'soccer_match' || action.includes('soccer')) return 'soccer_kick';
  return '';
}

function headingFor(entity, poseId) {
  if (!['idle', 'walk', 'reaction'].includes(poseId)) return 0;
  const dx = entity.vx || (entity.target ? entity.target.x - entity.x : 0);
  const dy = entity.vy || (entity.target ? entity.target.y - entity.y : 0);
  if (Math.abs(dx) + Math.abs(dy) < 0.01) return entity.lastHeading ?? 0;
  entity.lastHeading = Math.atan2(dy, dx) + Math.PI / 2;
  return entity.lastHeading;
}

function drawIdle(ctx, t) {
  const b = Math.sin(t * 2.2) * 0.8;
  shadow(ctx, 0, 11, 34, 45); legsStanding(ctx, 0); torso(ctx, 34, 28, 44 + b);
  arm(ctx, -17, -7, -28, 13 + b); arm(ctx, 17, -7, 28, 13 - b); hand(ctx, -28, 13 + b); hand(ctx, 28, 13 - b); head(ctx, 0, -36);
}

function drawWalk(ctx, t) {
  const c = [-1, .45, 1, -.45][Math.floor(t * 10) % 4];
  shadow(ctx, 0, 12, 35, 44); leg(ctx, -8, 13, -12 - c * 5, 38 + Math.max(c, 0) * 4, -0.08); leg(ctx, 8, 13, 12 + c * 5, 38 + Math.max(-c, 0) * 4, 0.08);
  torso(ctx, 34, 28, 43); arm(ctx, -17, -8, -28 + c * 6, 13 - c * 7); arm(ctx, 17, -8, 28 - c * 6, 13 + c * 7); hand(ctx, -28 + c * 6, 13 - c * 7); hand(ctx, 28 - c * 6, 13 + c * 7); head(ctx, c * 0.8, -36);
}

function drawChairSit(ctx, t) {
  const b = Math.sin(t * 1.9) * 0.6;
  chairHint(ctx); shadow(ctx, 0, 12, 36, 32); bentLeg(ctx, -11, 11, -23, 32, -0.15); bentLeg(ctx, 11, 11, 23, 32, 0.15);
  torso(ctx, 34, 29, 36 + b); arm(ctx, -16, -6, -23, 16); arm(ctx, 16, -6, 23, 16); hand(ctx, -23, 16); hand(ctx, 23, 16); head(ctx, 0, -34);
}

function drawCouchSit(ctx, t) {
  couchPad(ctx); shadow(ctx, 0, 13, 40, 31); bentLeg(ctx, -12, 12, -27, 30, -0.24); bentLeg(ctx, 12, 12, 27, 30, 0.24);
  torso(ctx, 36, 30, 35 + Math.sin(t * 1.5) * 0.5); arm(ctx, -18, -5, -30, 13); arm(ctx, 18, -5, 30, 13); hand(ctx, -30, 13); hand(ctx, 30, 13); head(ctx, 0, -34);
}

function drawTvWatch(ctx, t) { drawCouchSit(ctx, t); glowQuad(ctx, -40, -48, 40, -48, 24, 10, -24, 10, P.trim, .22); rr(ctx, -12, 14, 24, 9, 4, '#151a22', P.ink, 1.5); }
function drawLaptopLap(ctx, t) { drawCouchSit(ctx, t); laptop(ctx, 0, 23, t); }

function drawDeskWork(ctx, t, hasLaptop) {
  const tap = Math.sin(t * 12);
  desk(ctx); shadow(ctx, 0, 13, 34, 34); bentLeg(ctx, -10, 12, -22, 31, -0.12); bentLeg(ctx, 10, 12, 22, 31, 0.12);
  torso(ctx, 34, 28, 35); arm(ctx, -16, -5, -22, 25 + tap * 1.5); arm(ctx, 16, -5, 22, 25 - tap * 1.5); hand(ctx, -22, 25 + tap * 1.5); hand(ctx, 22, 25 - tap * 1.5);
  if (hasLaptop) laptop(ctx, 0, 37, t); else rr(ctx, -26, 32, 52, 12, 4, '#202a35', P.soft, 1); head(ctx, 0, -34);
}

function drawReading(ctx, t) {
  const p = Math.sin(t * 2.5) * 1.5;
  chairHint(ctx); shadow(ctx, 0, 12, 36, 32); bentLeg(ctx, -12, 12, -24, 31, -0.15); bentLeg(ctx, 12, 12, 24, 31, 0.15); torso(ctx, 34, 28, 35);
  book(ctx, 0, 26 + p); arm(ctx, -16, -6, -25, 22 + p); arm(ctx, 16, -6, 25, 22 - p); hand(ctx, -25, 22 + p); hand(ctx, 25, 22 - p); head(ctx, 0, -34);
}

function drawPhoneUse(ctx, t) { drawChairSit(ctx, t); glowQuad(ctx, 5, -18, 30, -16, 39, 22, 16, 24, P.phone, .28); phone(ctx, 27, 15); }

function drawEating(ctx, t) {
  const bite = Math.max(0, Math.sin(t * 5));
  table(ctx); shadow(ctx, 0, 13, 35, 33); bentLeg(ctx, -10, 12, -22, 32, -0.12); bentLeg(ctx, 10, 12, 22, 32, 0.12); torso(ctx, 34, 28, 35);
  plate(ctx, 0, 36); arm(ctx, -16, -5, -24, 29); arm(ctx, 16, -5, 18, 25 - bite * 12); hand(ctx, -24, 29); hand(ctx, 18, 25 - bite * 12); head(ctx, 0, -34);
}

function drawCoffee(ctx, t) {
  const sip = Math.max(0, Math.sin(t * 3));
  shadow(ctx, 0, 11, 34, 43); legsStanding(ctx, 0); torso(ctx, 34, 28, 43); arm(ctx, -17, -7, -29, 13); arm(ctx, 17, -7, 20, 4 - sip * 18); hand(ctx, -29, 13); mug(ctx, 21, 5 - sip * 18); head(ctx, 0, -36);
}

function drawSleep(ctx, t, awake) {
  const b = Math.sin(t * 1.4) * 1.2;
  ctx.save(); ctx.rotate(-Math.PI / 2); rr(ctx, -42, -24, 92, 50, 18, 'rgba(0,0,0,.20)', '', 0); rr(ctx, -42, -26, 34, 52, 13, P.pillow, P.soft, 1.5);
  leg(ctx, -8, 8, -11, 34, 0); leg(ctx, 8, 8, 11, 34, 0); torso(ctx, 32, 27, 38 + b); arm(ctx, -15, -6, -25, 14); arm(ctx, 15, -6, awake ? 27 : 22, awake ? -2 : 14); hand(ctx, -25, 14); hand(ctx, awake ? 27 : 22, awake ? -2 : 14); head(ctx, -24, -35);
  rr(ctx, -3, -16, 58, 50, 16, P.blanket, P.ink, 2); if (awake) phone(ctx, 29, -18); ctx.restore();
}

function drawFloorLounge(ctx, t) { ctx.save(); ctx.rotate(0.55); shadow(ctx, 0, 13, 46, 35); leg(ctx, -10, 14, -22, 42, -0.25); leg(ctx, 10, 14, 27, 36, 0.2); torso(ctx, 35, 29, 36); arm(ctx, -17, -7, -34, 4); arm(ctx, 17, -7, 27, 20); hand(ctx, -34, 4); hand(ctx, 27, 20); book(ctx, 13, 31); head(ctx, 0, -35); ctx.restore(); }

function drawPoolTableUse(ctx, t) {
  const aim = Math.sin(t * 1.8) * 2;
  shadow(ctx, 0, 12, 36, 43); leg(ctx, -10, 14, -24, 40, -0.3); leg(ctx, 10, 14, 18, 38, 0.1); torso(ctx, 35, 28, 41); line(ctx, -38, 8 + aim, 54, -11 + aim, '#c8a66b', 4); arm(ctx, -16, -6, -36, 8 + aim); arm(ctx, 16, -6, 31, -6 + aim); hand(ctx, -36, 8 + aim); hand(ctx, 31, -6 + aim); head(ctx, 0, -36);
}

function drawConsoleGame(ctx, t) { const tw = Math.sin(t * 9) * 1.4; drawCouchSit(ctx, t); rr(ctx, -16, 12, 32, 13, 6, '#111820', P.ink, 1.5); dot(ctx, -6, 19, 2.3, P.trim); dot(ctx, 7, 18 + tw, 2.3, P.warm); }

function drawCooking(ctx, t) {
  const stir = Math.sin(t * 4) * 5;
  counter(ctx); shadow(ctx, 0, 12, 34, 42); legsStanding(ctx, 0); torso(ctx, 34, 28, 42); pan(ctx, 13, 31); arm(ctx, -17, -7, -25, 24); arm(ctx, 17, -7, 24 + stir, 22); hand(ctx, -25, 24); hand(ctx, 24 + stir, 22); head(ctx, 0, -36);
}

function drawCleaning(ctx, t) {
  const wipe = Math.sin(t * 6) * 8;
  shadow(ctx, 0, 12, 34, 42); legsStanding(ctx, 0); torso(ctx, 34, 28, 42); arm(ctx, -17, -7, -31, 14); arm(ctx, 17, -7, 29 + wipe, 17); hand(ctx, -31, 14); rag(ctx, 29 + wipe, 17); head(ctx, 0, -36);
}

function drawChanging(ctx, t) { drawIdle(ctx, t); rr(ctx, -35, 2, 20, 35, 7, '#4a1f26', P.ink, 1.5); rr(ctx, 20, 1, 18, 32, 7, '#665744', P.ink, 1.5); }

function drawLiftWeights(ctx, t) {
  const rep = (Math.sin(t * 3.8) + 1) / 2;
  rr(ctx, -12, -25, 24, 75, 8, 'rgba(39,49,59,.58)', P.soft, 1.2);
  shadow(ctx, 0, 10, 37, 38);
  ctx.save(); ctx.rotate(-Math.PI / 2);
  leg(ctx, -8, 10, -10, 35, 0); leg(ctx, 8, 10, 10, 35, 0); torso(ctx, 33, 28, 36); head(ctx, -24, -35);
  const y = -34 - rep * 18;
  line(ctx, -48, y, 48, y, P.prop, 4); dot(ctx, -54, y, 9, '#343b46'); dot(ctx, 54, y, 9, '#343b46');
  arm(ctx, -15, -6, -34, y); arm(ctx, 15, -6, 34, y); hand(ctx, -34, y); hand(ctx, 34, y);
  ctx.restore();
}

function drawHeavyBag(ctx, t) {
  const hit = Math.max(0, Math.sin(t * 5.5));
  rr(ctx, 47 + hit * 4, -35, 20, 72, 10, P.bag, P.ink, 2); line(ctx, 57, -48, 57, -35, P.prop, 3);
  shadow(ctx, -6, 12, 35, 42); leg(ctx, -12, 14, -27, 39, -0.3); leg(ctx, 10, 14, 22, 38, 0.16); torso(ctx, 35, 28, 42);
  arm(ctx, -17, -7, -34, 6); arm(ctx, 17, -7, 43 + hit * 12, -8); glove(ctx, -34, 6); glove(ctx, 43 + hit * 12, -8); head(ctx, 0, -36);
  if (hit > .78) burst(ctx, 67, -8, P.warm);
}

function drawTreadmillRun(ctx, t) {
  const c = [-1, .45, 1, -.45][Math.floor(t * 12) % 4];
  rr(ctx, -36, -6, 72, 70, 11, 'rgba(20,24,31,.70)', P.soft, 1.5); line(ctx, -30, 18, 30, 18, P.trim, 2); line(ctx, -24, -2, 24, -2, P.prop, 3);
  shadow(ctx, 0, 19, 31, 35); leg(ctx, -8, 13, -12 - c * 6, 38 + Math.max(c, 0) * 6, -0.08); leg(ctx, 8, 13, 12 + c * 6, 38 + Math.max(-c, 0) * 6, 0.08);
  torso(ctx, 33, 27, 40); arm(ctx, -16, -8, -27, 7 - c * 5); arm(ctx, 16, -8, 27, 7 + c * 5); hand(ctx, -27, 7 - c * 5); hand(ctx, 27, 7 + c * 5); head(ctx, 0, -36);
}

function drawSoccerKick(ctx, t) {
  const kick = Math.max(0, Math.sin(t * 4));
  shadow(ctx, 0, 12, 35, 43); leg(ctx, -9, 13, -18, 39, -0.18); leg(ctx, 9, 13, 24 + kick * 9, 35 - kick * 8, 0.28); torso(ctx, 34, 28, 42); arm(ctx, -17, -7, -33, 8); arm(ctx, 17, -7, 32, 9); hand(ctx, -33, 8); hand(ctx, 32, 9); ball(ctx, 43, 34 - kick * 9); head(ctx, 0, -36);
}

function drawPetInteraction(ctx, t) {
  const pat = Math.sin(t * 5) * 3;
  shadow(ctx, -2, 13, 38, 34); bentLeg(ctx, -14, 12, -31, 26, -0.35); bentLeg(ctx, 8, 12, 22, 31, 0.18); torso(ctx, 34, 28, 35); arm(ctx, -16, -7, -29, 12); arm(ctx, 16, -7, 37, 22 + pat); hand(ctx, -29, 12); hand(ctx, 37, 22 + pat); dogCue(ctx, 49, 31); head(ctx, 0, -34);
}

function drawReactionPose(ctx, t) { const j = Math.sin(t * 14) * 2; shadow(ctx, 0, 11, 34, 43); leg(ctx, -9, 13, -18, 38, -0.16); leg(ctx, 9, 13, 18, 38, 0.16); torso(ctx, 35, 28, 42); arm(ctx, -17, -7, -39, -13 + j); arm(ctx, 17, -7, 39, -13 - j); hand(ctx, -39, -13 + j); hand(ctx, 39, -13 - j); head(ctx, 0, -37 + j); }

function legsStanding(ctx, sway) { leg(ctx, -9, 13, -12 - sway, 39, 0.03); leg(ctx, 9, 13, 12 + sway, 39, -0.03); }
function torso(ctx, shoulder, hip, height) { ctx.beginPath(); ctx.moveTo(-shoulder / 2, -13); ctx.quadraticCurveTo(-shoulder * .45, -2, -hip / 2, height * .38); ctx.lineTo(hip / 2, height * .38); ctx.quadraticCurveTo(shoulder * .45, -2, shoulder / 2, -13); ctx.closePath(); ctx.fillStyle = P.shirt; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.stroke(); line(ctx, -shoulder * .28, -8, -hip * .18, height * .27, P.shirtLit, 2); line(ctx, shoulder * .28, -8, hip * .18, height * .27, P.shirtLit, 2); }
function head(ctx, x, y) { ell(ctx, x, y + 12, 8, 7, P.skin, P.ink, 2); ell(ctx, x, y, 15, 16, P.skin, P.ink, 2.5); ell(ctx, x, y + 2, 10, 10, P.skinLit, '', 0); ctx.fillStyle = P.hair; ctx.beginPath(); ctx.ellipse(x, y - 5, 17, 11, 0, Math.PI, Math.PI * 2); ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.stroke(); ell(ctx, x - 14, y + 1, 4, 6, P.hair, P.ink, 1); ell(ctx, x + 14, y + 1, 4, 6, P.hair, P.ink, 1); line(ctx, x - 4, y + 4, x + 4, y + 4, '#f0d7bd', 1); }
function arm(ctx, x1, y1, x2, y2) { limb(ctx, x1, y1, x2, y2, 7, P.shirt); }
function leg(ctx, x1, y1, x2, y2, rot = 0) { limb(ctx, x1, y1, x2, y2, 8, P.pants); shoe(ctx, x2, y2 + 3, rot); }
function bentLeg(ctx, x1, y1, x2, y2, rot) { limb(ctx, x1, y1, x2, y2 - 6, 8, P.pants); limb(ctx, x2 - Math.sign(x2 || 1) * 3, y2 - 6, x2, y2 + 7, 8, P.pantsLit); shoe(ctx, x2, y2 + 10, rot); }
function limb(ctx, x1, y1, x2, y2, w, fill) { ctx.strokeStyle = P.ink; ctx.lineWidth = w + 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.strokeStyle = fill; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function hand(ctx, x, y) { ell(ctx, x, y, 4.8, 4.3, P.skin, P.ink, 1.4); }
function glove(ctx, x, y) { ell(ctx, x, y, 7, 6, P.trim, P.ink, 1.5); }
function shoe(ctx, x, y, r) { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ell(ctx, 0, 0, 5, 8, P.shoe, P.ink, 1); ctx.restore(); }
function shadow(ctx, x, y, rx, ry) { ell(ctx, x, y, rx, ry, P.shadow, '', 0); }
function chairHint(ctx) { rr(ctx, -25, -8, 50, 54, 18, 'rgba(20,24,31,.36)', 'rgba(116,230,255,.28)', 1.2); }
function couchPad(ctx) { rr(ctx, -44, -14, 88, 54, 18, 'rgba(38,49,65,.42)', 'rgba(116,230,255,.18)', 1.2); line(ctx, -28, 8, 28, 8, 'rgba(255,255,255,.12)', 2); }
function desk(ctx) { rr(ctx, -48, 28, 96, 24, 7, 'rgba(16,22,31,.76)', 'rgba(116,230,255,.28)', 1.5); }
function table(ctx) { rr(ctx, -50, 31, 100, 28, 8, 'rgba(54,38,28,.78)', 'rgba(241,198,106,.22)', 1.5); }
function counter(ctx) { rr(ctx, -48, 29, 96, 25, 7, 'rgba(36,43,49,.78)', 'rgba(116,230,255,.22)', 1.5); }
function laptop(ctx, x, y, t) { rr(ctx, x - 21, y - 11, 42, 21, 4, '#121821', P.ink, 1.5); rr(ctx, x - 17, y - 8, 34, 12, 3, `rgba(116,230,255,${.42 + Math.sin(t * 7) * .05})`, '', 0); rr(ctx, x - 24, y + 8, 48, 6, 2, P.prop, '', 0); }
function book(ctx, x, y) { rr(ctx, x - 24, y - 10, 48, 20, 5, P.book, P.ink, 1.5); line(ctx, x, y - 8, x, y + 9, '#8b6f53', 1.2); }
function plate(ctx, x, y) { ell(ctx, x, y, 15, 8, P.plate, P.ink, 1.2); ell(ctx, x + 2, y, 6, 3, '#b66d55', '', 0); dot(ctx, x - 6, y - 1, 2.2, '#76b66d'); }
function mug(ctx, x, y) { rr(ctx, x - 5, y - 6, 11, 13, 4, P.warm, P.ink, 1.2); ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x + 7, y, 5, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
function phone(ctx, x, y) { rr(ctx, x - 6, y - 11, 12, 22, 3, '#10141b', P.ink, 1); rr(ctx, x - 4, y - 8, 8, 15, 2, P.phone, '', 0); }
function pan(ctx, x, y) { ell(ctx, x, y, 17, 9, '#222b31', P.ink, 1.4); line(ctx, x - 16, y + 1, x - 34, y + 5, '#38434d', 4); dot(ctx, x + 4, y - 1, 4, P.warm); }
function rag(ctx, x, y) { ell(ctx, x, y, 9, 6, P.phone, P.ink, 1); }
function ball(ctx, x, y) { ell(ctx, x, y, 8, 8, '#f8fbff', P.ink, 1.4); line(ctx, x - 5, y, x + 5, y, P.ink, 1); line(ctx, x, y - 5, x, y + 5, P.ink, 1); }
function dogCue(ctx, x, y) { ell(ctx, x, y, 23, 15, '#f6f2e8', P.ink, 1.8); ell(ctx, x + 20, y - 6, 10, 8, '#f6f2e8', P.ink, 1.5); ell(ctx, x + 28, y - 7, 4, 3, P.ink, P.ink, 1); }
function burst(ctx, x, y, color) { for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; line(ctx, x + Math.cos(a) * 5, y + Math.sin(a) * 5, x + Math.cos(a) * 14, y + Math.sin(a) * 14, color, 2); } }
function glowQuad(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color, alpha) { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath(); ctx.fill(); ctx.restore(); }
function fallbackBadge(ctx) { rr(ctx, -25, 47, 50, 10, 4, 'rgba(16,22,31,.82)', 'rgba(241,198,106,.45)', 1); ctx.fillStyle = P.warm; ctx.font = '700 6px system-ui'; ctx.textAlign = 'center'; ctx.fillText('fallback pose', 0, 55); ctx.textAlign = 'left'; }
function rr(ctx, x, y, w, h, r, fill, stroke = '', lineWidth = 0) { const q = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + q, y); ctx.lineTo(x + w - q, y); ctx.quadraticCurveTo(x + w, y, x + w, y + q); ctx.lineTo(x + w, y + h - q); ctx.quadraticCurveTo(x + w, y + h, x + w - q, y + h); ctx.lineTo(x + q, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - q); ctx.lineTo(x, y + q); ctx.quadraticCurveTo(x, y, x + q, y); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke && lineWidth > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); } }
function ell(ctx, x, y, rx, ry, fill, stroke = '', lineWidth = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke && lineWidth > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); } }
function line(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function dot(ctx, x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
