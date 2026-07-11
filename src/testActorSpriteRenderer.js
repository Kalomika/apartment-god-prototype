import { TEST_ACTOR_ID, resolveTestActorPose } from './testActorPoseManifest.js';

const PALETTE = {
  ink: '#071018',
  outlineSoft: 'rgba(7,16,24,.52)',
  skin: '#5a372f',
  skinLit: '#7a4a3d',
  hair: '#05070a',
  shirt: '#172235',
  shirtLit: '#263f63',
  shirtTrim: '#74e6ff',
  pants: '#111820',
  pantsLit: '#27313b',
  shoe: '#05070a',
  sock: '#d7dde7',
  blanket: '#24324a',
  pillow: '#dfe6ef',
  prop: '#dfe6ea',
  warm: '#f1c66a',
  book: '#efe7dc',
  phone: '#a8e9ff',
  plate: '#f4eee6',
  shadow: 'rgba(0,0,0,.24)'
};

export function isTestActorSpriteReady(entity) {
  return entity?.id === TEST_ACTOR_ID && entity?.type === 'person';
}

export function drawTestActorSprite(ctx, entity) {
  if (!isTestActorSpriteReady(entity)) return false;
  const poseState = resolveTestActorPose(entity);
  if (!poseState) return false;

  const t = performance.now() / 1000;
  const moving = Boolean(entity.path?.length);
  const poseId = moving && !entity.actionT ? 'walk' : poseState.poseId;

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
    case 'workout_stretch': drawWorkout(ctx, t); break;
    case 'pet_interaction': drawPetInteraction(ctx, t); break;
    case 'cuddle_bed': drawSleep(ctx, t, true); break;
    case 'reaction': drawReactionPose(ctx, t); break;
    default: drawIdle(ctx, t); break;
  }

  drawPoseBadge(ctx, poseState);
  ctx.restore();
  return true;
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
  const breathe = Math.sin(t * 2.2) * 0.8;
  shadow(ctx, 0, 11, 34, 45);
  drawLeg(ctx, -9, 13, -12, 39, 8, 0.03);
  drawLeg(ctx, 9, 13, 12, 39, 8, -0.03);
  drawTorso(ctx, 34, 28, 44 + breathe);
  drawArm(ctx, -17, -7, -28, 13 + breathe, 7);
  drawArm(ctx, 17, -7, 28, 13 - breathe, 7);
  hand(ctx, -28, 13 + breathe);
  hand(ctx, 28, 13 - breathe);
  drawHead(ctx, 0, -36 + breathe * 0.2);
}

function drawWalk(ctx, t) {
  const frame = Math.floor(t * 10) % 4;
  const cycle = [-1, 0.45, 1, -0.45][frame];
  const settle = Math.abs(cycle) * 1.2;
  shadow(ctx, 0, 11 + settle, 35, 45 - settle);
  drawLeg(ctx, -8, 13, -12 - cycle * 5, 38 + Math.max(cycle, 0) * 4, 8, -0.08);
  drawLeg(ctx, 8, 13, 12 + cycle * 5, 38 + Math.max(-cycle, 0) * 4, 8, 0.08);
  drawTorso(ctx, 34, 28, 44 - settle * 0.5);
  drawArm(ctx, -17, -8, -28 + cycle * 6, 13 - cycle * 7, 7);
  drawArm(ctx, 17, -8, 28 - cycle * 6, 13 + cycle * 7, 7);
  hand(ctx, -28 + cycle * 6, 13 - cycle * 7);
  hand(ctx, 28 - cycle * 6, 13 + cycle * 7);
  drawHead(ctx, cycle * 0.8, -36 - settle * 0.3);
}

function drawChairSit(ctx, t) {
  const breathe = Math.sin(t * 1.9) * 0.6;
  shadow(ctx, 0, 12, 36, 32);
  chairHint(ctx);
  drawBentLeg(ctx, -11, 11, -23, 32, -0.15);
  drawBentLeg(ctx, 11, 11, 23, 32, 0.15);
  drawTorso(ctx, 34, 29, 36 + breathe);
  drawArm(ctx, -16, -6, -23, 16, 7);
  drawArm(ctx, 16, -6, 23, 16, 7);
  hand(ctx, -23, 16);
  hand(ctx, 23, 16);
  drawHead(ctx, 0, -34);
}

function drawCouchSit(ctx, t) {
  const breathe = Math.sin(t * 1.5) * 0.5;
  couchPad(ctx);
  shadow(ctx, 0, 13, 40, 31);
  drawBentLeg(ctx, -12, 12, -27, 30, -0.24);
  drawBentLeg(ctx, 12, 12, 27, 30, 0.24);
  drawTorso(ctx, 36, 30, 35 + breathe);
  drawArm(ctx, -18, -5, -30, 13, 7);
  drawArm(ctx, 18, -5, 30, 13, 7);
  hand(ctx, -30, 13);
  hand(ctx, 30, 13);
  drawHead(ctx, 0, -34);
}

function drawTvWatch(ctx, t) {
  drawCouchSit(ctx, t);
  ctx.save();
  ctx.globalAlpha = 0.22 + Math.sin(t * 3) * 0.05;
  ctx.fillStyle = PALETTE.shirtTrim;
  ctx.beginPath();
  ctx.moveTo(-40, -48);
  ctx.lineTo(40, -48);
  ctx.lineTo(24, 10);
  ctx.lineTo(-24, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  rr(ctx, -12, 14, 24, 9, 4, '#151a22', PALETTE.ink, 1.5);
}

function drawDeskWork(ctx, t, laptop) {
  const tap = Math.sin(t * 12);
  deskSurface(ctx);
  shadow(ctx, 0, 13, 34, 34);
  drawBentLeg(ctx, -10, 12, -22, 31, -0.12);
  drawBentLeg(ctx, 10, 12, 22, 31, 0.12);
  drawTorso(ctx, 34, 28, 35);
  drawArm(ctx, -16, -5, -22, 25 + tap * 1.5, 7);
  drawArm(ctx, 16, -5, 22, 25 - tap * 1.5, 7);
  hand(ctx, -22, 25 + tap * 1.5);
  hand(ctx, 22, 25 - tap * 1.5);
  if (laptop) laptopProp(ctx, 0, 37, t);
  else rr(ctx, -26, 32, 52, 12, 4, '#202a35', PALETTE.outlineSoft, 1);
  drawHead(ctx, 0, -34);
}

function drawLaptopLap(ctx, t) {
  drawCouchSit(ctx, t);
  laptopProp(ctx, 0, 23, t);
}

function drawReading(ctx, t) {
  const page = Math.sin(t * 2.5) * 1.5;
  chairHint(ctx);
  shadow(ctx, 0, 12, 36, 32);
  drawBentLeg(ctx, -12, 12, -24, 31, -0.15);
  drawBentLeg(ctx, 12, 12, 24, 31, 0.15);
  drawTorso(ctx, 34, 28, 35);
  bookProp(ctx, 0, 26 + page);
  drawArm(ctx, -16, -6, -25, 22 + page, 7);
  drawArm(ctx, 16, -6, 25, 22 - page, 7);
  hand(ctx, -25, 22 + page);
  hand(ctx, 25, 22 - page);
  drawHead(ctx, 0, -34);
}

function drawPhoneUse(ctx, t) {
  drawChairSit(ctx, t);
  ctx.save();
  ctx.globalAlpha = 0.26 + Math.sin(t * 5) * 0.05;
  ctx.fillStyle = PALETTE.phone;
  ctx.beginPath();
  ctx.moveTo(5, -18);
  ctx.lineTo(30, -16);
  ctx.lineTo(39, 22);
  ctx.lineTo(16, 24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  rr(ctx, 20, 3, 15, 25, 4, '#10141b', PALETTE.ink, 1.5);
  rr(ctx, 23, 6, 9, 17, 2, PALETTE.phone, '', 0);
}

function drawEating(ctx, t) {
  const bite = Math.max(0, Math.sin(t * 5));
  tableEdge(ctx);
  shadow(ctx, 0, 13, 35, 33);
  drawBentLeg(ctx, -10, 12, -22, 32, -0.12);
  drawBentLeg(ctx, 10, 12, 22, 32, 0.12);
  drawTorso(ctx, 34, 28, 35);
  plate(ctx, 0, 36);
  drawArm(ctx, -16, -5, -24, 29, 7);
  drawArm(ctx, 16, -5, 18, 25 - bite * 12, 7);
  hand(ctx, -24, 29);
  hand(ctx, 18, 25 - bite * 12);
  drawHead(ctx, 0, -34);
}

function drawCoffee(ctx, t) {
  const sip = Math.max(0, Math.sin(t * 3));
  shadow(ctx, 0, 11, 34, 43);
  drawLeg(ctx, -9, 13, -12, 39, 8, 0.03);
  drawLeg(ctx, 9, 13, 12, 39, 8, -0.03);
  drawTorso(ctx, 34, 28, 43);
  drawArm(ctx, -17, -7, -29, 13, 7);
  drawArm(ctx, 17, -7, 20, 4 - sip * 18, 7);
  hand(ctx, -29, 13);
  mug(ctx, 21, 5 - sip * 18);
  drawHead(ctx, 0, -36);
}

function drawSleep(ctx, t, awake) {
  const breathe = Math.sin(t * 1.4) * 1.2;
  ctx.save();
  ctx.rotate(-Math.PI / 2);
  rr(ctx, -42, -24, 92, 50, 18, 'rgba(0,0,0,.20)', '', 0);
  rr(ctx, -42, -26, 34, 52, 13, PALETTE.pillow, PALETTE.outlineSoft, 1.5);
  drawLeg(ctx, -8, 8, -11, 34, 7, 0);
  drawLeg(ctx, 8, 8, 11, 34, 7, 0);
  drawTorso(ctx, 32, 27, 38 + breathe);
  drawArm(ctx, -15, -6, -25, 14, 7);
  drawArm(ctx, 15, -6, awake ? 27 : 22, awake ? -2 : 14, 7);
  hand(ctx, -25, 14);
  hand(ctx, awake ? 27 : 22, awake ? -2 : 14);
  drawHead(ctx, -24, -35);
  ctx.save();
  ctx.globalAlpha = awake ? 0.78 : 0.92;
  rr(ctx, -3, -16, 58, 50, 16, PALETTE.blanket, PALETTE.ink, 2);
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(7, -4);
  ctx.quadraticCurveTo(24, 4 + breathe, 44, -2);
  ctx.moveTo(11, 16);
  ctx.quadraticCurveTo(25, 24, 48, 17);
  ctx.stroke();
  ctx.restore();
  if (awake) phoneMini(ctx, 29, -18);
  ctx.restore();
}

function drawFloorLounge(ctx, t) {
  ctx.save();
  ctx.rotate(0.55);
  shadow(ctx, 0, 13, 46, 35);
  drawLeg(ctx, -10, 14, -22, 42, 8, -0.25);
  drawLeg(ctx, 10, 14, 27, 36, 8, 0.2);
  drawTorso(ctx, 35, 29, 36);
  drawArm(ctx, -17, -7, -34, 4, 7);
  drawArm(ctx, 17, -7, 27, 20, 7);
  hand(ctx, -34, 4);
  hand(ctx, 27, 20);
  bookProp(ctx, 13, 31);
  drawHead(ctx, 0, -35);
  ctx.restore();
}

function drawPoolTableUse(ctx, t) {
  const aim = Math.sin(t * 1.8) * 2;
  shadow(ctx, 0, 12, 36, 43);
  drawLeg(ctx, -10, 14, -24, 40, 8, -0.3);
  drawLeg(ctx, 10, 14, 18, 38, 8, 0.1);
  drawTorso(ctx, 35, 28, 41);
  line(ctx, -38, 8 + aim, 54, -11 + aim, '#c8a66b', 4);
  drawArm(ctx, -16, -6, -36, 8 + aim, 7);
  drawArm(ctx, 16, -6, 31, -6 + aim, 7);
  hand(ctx, -36, 8 + aim);
  hand(ctx, 31, -6 + aim);
  drawHead(ctx, 0, -36);
}

function drawConsoleGame(ctx, t) {
  const twitch = Math.sin(t * 9) * 1.4;
  drawCouchSit(ctx, t);
  rr(ctx, -16, 12, 32, 13, 6, '#111820', PALETTE.ink, 1.5);
  circle(ctx, -6, 19, 2.3, PALETTE.shirtTrim);
  circle(ctx, 7, 18 + twitch, 2.3, PALETTE.warm);
}

function drawCooking(ctx, t) {
  const stir = Math.sin(t * 4) * 5;
  counterEdge(ctx);
  shadow(ctx, 0, 12, 34, 42);
  drawLeg(ctx, -9, 13, -13, 39, 8, -0.02);
  drawLeg(ctx, 9, 13, 13, 39, 8, 0.02);
  drawTorso(ctx, 34, 28, 42);
  pan(ctx, 13, 31);
  drawArm(ctx, -17, -7, -25, 24, 7);
  drawArm(ctx, 17, -7, 24 + stir, 22, 7);
  hand(ctx, -25, 24);
  hand(ctx, 24 + stir, 22);
  drawHead(ctx, 0, -36);
}

function drawCleaning(ctx, t) {
  const wipe = Math.sin(t * 6) * 8;
  shadow(ctx, 0, 12, 34, 42);
  drawLeg(ctx, -9, 13, -14, 40, 8, -0.04);
  drawLeg(ctx, 9, 13, 13, 39, 8, 0.04);
  drawTorso(ctx, 34, 28, 42);
  drawArm(ctx, -17, -7, -31, 14, 7);
  drawArm(ctx, 17, -7, 29 + wipe, 17, 7);
  hand(ctx, -31, 14);
  clothRag(ctx, 29 + wipe, 17);
  drawHead(ctx, 0, -36);
}

function drawChanging(ctx, t) {
  drawIdle(ctx, t);
  rr(ctx, -35, 2, 20, 35, 7, '#4a1f26', PALETTE.ink, 1.5);
  rr(ctx, 20, 1, 18, 32, 7, '#665744', PALETTE.ink, 1.5);
}

function drawWorkout(ctx, t) {
  const stretch = Math.sin(t * 5) * 6;
  shadow(ctx, 0, 13, 38, 44);
  drawLeg(ctx, -10, 14, -28, 37 + stretch, 8, -0.28);
  drawLeg(ctx, 10, 14, 28, 37 - stretch, 8, 0.28);
  drawTorso(ctx, 35, 28, 41);
  drawArm(ctx, -17, -8, -38, -13 - stretch, 7);
  drawArm(ctx, 17, -8, 38, -13 + stretch, 7);
  hand(ctx, -38, -13 - stretch);
  hand(ctx, 38, -13 + stretch);
  drawHead(ctx, 0, -36);
}

function drawPetInteraction(ctx, t) {
  const pat = Math.sin(t * 5) * 3;
  shadow(ctx, -2, 13, 38, 34);
  drawBentLeg(ctx, -14, 12, -31, 26, -0.35);
  drawBentLeg(ctx, 8, 12, 22, 31, 0.18);
  drawTorso(ctx, 34, 28, 35);
  drawArm(ctx, -16, -7, -29, 12, 7);
  drawArm(ctx, 16, -7, 37, 22 + pat, 7);
  hand(ctx, -29, 12);
  hand(ctx, 37, 22 + pat);
  dogRestingCue(ctx, 49, 31);
  drawHead(ctx, 0, -34);
}

function drawReactionPose(ctx, t) {
  const jolt = Math.sin(t * 14) * 2;
  shadow(ctx, 0, 11, 34, 43);
  drawLeg(ctx, -9, 13, -18, 38, 8, -0.16);
  drawLeg(ctx, 9, 13, 18, 38, 8, 0.16);
  drawTorso(ctx, 35, 28, 42);
  drawArm(ctx, -17, -7, -39, -13 + jolt, 7);
  drawArm(ctx, 17, -7, 39, -13 - jolt, 7);
  hand(ctx, -39, -13 + jolt);
  hand(ctx, 39, -13 - jolt);
  drawHead(ctx, 0, -37 + jolt);
}

function drawTorso(ctx, shoulder, hip, height) {
  ctx.beginPath();
  ctx.moveTo(-shoulder / 2, -13);
  ctx.quadraticCurveTo(-shoulder * 0.45, -2, -hip / 2, height * 0.38);
  ctx.lineTo(hip / 2, height * 0.38);
  ctx.quadraticCurveTo(shoulder * 0.45, -2, shoulder / 2, -13);
  ctx.closePath();
  ctx.fillStyle = PALETTE.shirt;
  ctx.fill();
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = PALETTE.shirtLit;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-shoulder * 0.28, -8);
  ctx.lineTo(-hip * 0.18, height * 0.27);
  ctx.moveTo(shoulder * 0.28, -8);
  ctx.lineTo(hip * 0.18, height * 0.27);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.shirtTrim;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-8, -10);
  ctx.quadraticCurveTo(0, -2, 8, -10);
  ctx.stroke();
}

function drawHead(ctx, x, y) {
  ell(ctx, x, y + 12, 8, 7, PALETTE.skin, PALETTE.ink, 2);
  ell(ctx, x, y, 15, 16, PALETTE.skin, PALETTE.ink, 2.5);
  ell(ctx, x, y + 2, 10, 10, PALETTE.skinLit, '', 0);
  ctx.fillStyle = PALETTE.hair;
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, y - 5, 17, 11, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ell(ctx, x - 14, y + 1, 4, 6, PALETTE.hair, PALETTE.ink, 1);
  ell(ctx, x + 14, y + 1, 4, 6, PALETTE.hair, PALETTE.ink, 1);
  line(ctx, x - 4, y + 4, x + 4, y + 4, '#f0d7bd', 1);
}

function drawArm(ctx, x1, y1, x2, y2, width) {
  limb(ctx, x1, y1, x2, y2, width, PALETTE.shirt);
}

function drawLeg(ctx, x1, y1, x2, y2, width, rot) {
  limb(ctx, x1, y1, x2, y2, width, PALETTE.pants);
  shoe(ctx, x2, y2 + 3, rot);
}

function drawBentLeg(ctx, x1, y1, x2, y2, rot) {
  limb(ctx, x1, y1, x2, y2 - 6, 8, PALETTE.pants);
  limb(ctx, x2 - Math.sign(x2 || 1) * 3, y2 - 6, x2, y2 + 7, 8, PALETTE.pantsLit);
  shoe(ctx, x2, y2 + 10, rot);
}

function limb(ctx, x1, y1, x2, y2, width, fill) {
  ctx.strokeStyle = PALETTE.ink;
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
  ell(ctx, x, y, 4.8, 4.3, PALETTE.skin, PALETTE.ink, 1.4);
}

function shoe(ctx, x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ell(ctx, 0, 0, 5, 8, PALETTE.shoe, PALETTE.ink, 1);
  ctx.restore();
}

function shadow(ctx, x, y, rx, ry) {
  ell(ctx, x, y, rx, ry, PALETTE.shadow, '', 0);
}

function chairHint(ctx) {
  rr(ctx, -25, -8, 50, 54, 18, 'rgba(20,24,31,.36)', 'rgba(116,230,255,.28)', 1.2);
}

function couchPad(ctx) {
  rr(ctx, -44, -14, 88, 54, 18, 'rgba(38,49,65,.42)', 'rgba(116,230,255,.18)', 1.2);
  line(ctx, -28, 8, 28, 8, 'rgba(255,255,255,.12)', 2);
}

function deskSurface(ctx) {
  rr(ctx, -48, 28, 96, 24, 7, 'rgba(16,22,31,.76)', 'rgba(116,230,255,.28)', 1.5);
}

function tableEdge(ctx) {
  rr(ctx, -50, 31, 100, 28, 8, 'rgba(54,38,28,.78)', 'rgba(241,198,106,.22)', 1.5);
}

function counterEdge(ctx) {
  rr(ctx, -48, 29, 96, 25, 7, 'rgba(36,43,49,.78)', 'rgba(116,230,255,.22)', 1.5);
}

function laptopProp(ctx, x, y, t) {
  rr(ctx, x - 21, y - 11, 42, 21, 4, '#121821', PALETTE.ink, 1.5);
  rr(ctx, x - 17, y - 8, 34, 12, 3, 'rgba(116,230,255,.46)', '', 0);
  ctx.globalAlpha = 0.35 + Math.sin(t * 7) * 0.05;
  rr(ctx, x - 24, y + 8, 48, 6, 2, PALETTE.prop, '', 0);
  ctx.globalAlpha = 1;
}

function bookProp(ctx, x, y) {
  rr(ctx, x - 24, y - 10, 48, 20, 5, PALETTE.book, PALETTE.ink, 1.5);
  line(ctx, x, y - 8, x, y + 9, '#8b6f53', 1.2);
  line(ctx, x - 16, y - 3, x - 5, y - 3, '#b78f65', 1);
  line(ctx, x + 5, y + 3, x + 16, y + 3, '#b78f65', 1);
}

function plate(ctx, x, y) {
  ell(ctx, x, y, 15, 8, PALETTE.plate, PALETTE.ink, 1.2);
  ell(ctx, x + 2, y, 6, 3, '#b66d55', '', 0);
  circle(ctx, x - 6, y - 1, 2.2, '#76b66d');
}

function mug(ctx, x, y) {
  rr(ctx, x - 5, y - 6, 11, 13, 4, PALETTE.warm, PALETTE.ink, 1.2);
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + 7, y, 5, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
}

function phoneMini(ctx, x, y) {
  rr(ctx, x - 6, y - 11, 12, 22, 3, '#10141b', PALETTE.ink, 1);
  rr(ctx, x - 4, y - 8, 8, 15, 2, PALETTE.phone, '', 0);
}

function pan(ctx, x, y) {
  ell(ctx, x, y, 17, 9, '#222b31', PALETTE.ink, 1.4);
  line(ctx, x - 16, y + 1, x - 34, y + 5, '#38434d', 4);
  circle(ctx, x + 4, y - 1, 4, PALETTE.warm);
}

function clothRag(ctx, x, y) {
  ell(ctx, x, y, 9, 6, PALETTE.phone, PALETTE.ink, 1);
}

function dogRestingCue(ctx, x, y) {
  ell(ctx, x, y, 23, 15, '#f6f2e8', PALETTE.ink, 1.8);
  ell(ctx, x + 20, y - 6, 10, 8, '#f6f2e8', PALETTE.ink, 1.5);
  ell(ctx, x + 28, y - 7, 4, 3, PALETTE.ink, PALETTE.ink, 1);
  line(ctx, x - 17, y + 4, x - 29, y + 9, PALETTE.ink, 3);
}

function drawPoseBadge(ctx, poseState) {
  if (poseState.definition?.status !== 'FALLBACK_FIRST_PASS') return;
  ctx.save();
  ctx.globalAlpha = 0.72;
  rr(ctx, -25, 47, 50, 10, 4, 'rgba(16,22,31,.82)', 'rgba(241,198,106,.45)', 1);
  ctx.fillStyle = PALETTE.warm;
  ctx.font = '700 6px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('fallback pose', 0, 55);
  ctx.textAlign = 'left';
  ctx.restore();
}

function rr(ctx, x, y, w, h, r, fill, stroke = '', lineWidth = 0) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
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

function ell(ctx, x, y, rx, ry, fill, stroke = '', lineWidth = 0) {
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

function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function circle(ctx, x, y, r, fill, stroke = '', lineWidth = 0) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
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
