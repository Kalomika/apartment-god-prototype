import { objects } from './world.js';

const FLOOR = '#d8c4a4';
const GLASS = 'rgba(168,211,219,.68)';
const DARK = '#071018';
const WATER = '#a8d3db';
const CERAMIC = '#ece5d8';
const METAL = '#cfd9dc';

export function drawBathBedStateOverlays(ctx, state) {
  drawStaticInactiveShowers(ctx, state);
  drawReadableSinks(ctx, state);
  drawReadableToilets(ctx, state);
  drawUnmadeBedOverlay(ctx, state);
  drawPanicRoom(ctx, state);
}

export function drawBathBedAfterEntityOverlays(ctx, state) {
  drawStandingPeeStreams(ctx, state);
}

function drawStaticInactiveShowers(ctx, state) {
  for (const shower of objects.filter(o => o.floor === state.floor && o.kind === 'shower')) {
    if (isActiveShower(state, shower)) continue;
    ctx.save();
    clearShowerSteam(ctx, shower);
    round(ctx, shower.x - 3, shower.y - 3, shower.w + 6, shower.h + 6, 11, 'rgba(16,22,31,.94)');
    round(ctx, shower.x + 6, shower.y + 8, shower.w - 12, shower.h - 16, 8, 'rgba(128,185,194,.40)');
    round(ctx, shower.x + shower.w - 27, shower.y + 8, 22, shower.h - 16, 6, 'rgba(231,244,247,.86)');
    line(ctx, shower.x + 12, shower.y + 15, shower.x + shower.w - 14, shower.y + shower.h - 13, 'rgba(255,255,255,.25)', 1.5);
    ctx.restore();
  }
}

function isActiveShower(state, shower) {
  return (state.entities || []).some(e => {
    if (e.hidden || e.floor !== shower.floor || e.actionT <= 0) return false;
    if (e.currentActionId !== 'shower' && e.pose !== 'shower') return false;
    if (e.showerObjectId && e.showerObjectId !== shower.id) return false;
    return e.showerObjectId === shower.id || nearObject(e, shower, 44);
  });
}

function drawReadableSinks(ctx, state) {
  for (const sink of objects.filter(o => o.floor === state.floor && o.kind === 'sink')) {
    ctx.save();
    if (sink.vanity === 'double') drawDoubleVanity(ctx, sink);
    else drawSingleSink(ctx, sink);
    ctx.restore();
  }
}

function drawSingleSink(ctx, sink) {
  round(ctx, sink.x - 3, sink.y - 3, sink.w + 6, sink.h + 6, 7, '#5f5145');
  round(ctx, sink.x + 4, sink.y + 5, sink.w - 8, sink.h - 10, 6, '#8f765f');
  ctx.fillStyle = CERAMIC;
  ctx.beginPath();
  ctx.ellipse(sink.x + sink.w / 2, sink.y + sink.h / 2 + 2, Math.max(12, sink.w * .30), Math.max(8, sink.h * .24), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#66737b'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = WATER;
  ctx.beginPath(); ctx.ellipse(sink.x + sink.w / 2, sink.y + sink.h / 2 + 2, Math.max(7, sink.w * .18), Math.max(4, sink.h * .12), 0, 0, Math.PI * 2); ctx.fill();
  circle(ctx, sink.x + sink.w / 2, sink.y + sink.h / 2 + 2, 2.8, '#4e5964');
  drawSinkHandle(ctx, sink);
}

function drawDoubleVanity(ctx, sink) {
  round(ctx, sink.x - 4, sink.y - 4, sink.w + 8, sink.h + 8, 8, '#5f5145');
  round(ctx, sink.x + 5, sink.y + 7, sink.w - 10, sink.h - 14, 7, '#8f765f');
  const eastFacing = sink.facing === 'east';
  for (const y of [sink.y + sink.h * .32, sink.y + sink.h * .68]) {
    ctx.fillStyle = CERAMIC;
    ctx.beginPath();
    ctx.ellipse(eastFacing ? sink.x + sink.w * .60 : sink.x + sink.w / 2, y, eastFacing ? 14 : 16, eastFacing ? 19 : 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#66737b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = WATER;
    ctx.beginPath(); ctx.ellipse(eastFacing ? sink.x + sink.w * .60 : sink.x + sink.w / 2, y, eastFacing ? 8 : 10, eastFacing ? 12 : 5, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, eastFacing ? sink.x + sink.w * .60 : sink.x + sink.w / 2, y, 2.8, '#4e5964');
    if (sink.handleSide === 'west' || sink.facing === 'east') line(ctx, sink.x + 8, y - 15, sink.x + 8, y + 15, METAL, 3);
    else line(ctx, sink.x + sink.w / 2 - 8, y - 13, sink.x + sink.w / 2 + 8, y - 13, METAL, 3);
  }
}

function drawSinkHandle(ctx, sink) {
  if (sink.facing === 'west') line(ctx, sink.x + sink.w - 8, sink.y + 8, sink.x + sink.w - 8, sink.y + sink.h - 8, METAL, 3);
  else if (sink.facing === 'east') line(ctx, sink.x + 8, sink.y + 8, sink.x + 8, sink.y + sink.h - 8, METAL, 3);
  else line(ctx, sink.x + sink.w / 2 - 8, sink.y + 8, sink.x + sink.w / 2 + 8, sink.y + 8, METAL, 3);
}

function drawReadableToilets(ctx, state) {
  for (const toilet of objects.filter(o => o.floor === state.floor && o.kind === 'toilet')) {
    ctx.save();
    const west = toilet.facing === 'west';
    if (west) {
      round(ctx, toilet.x + toilet.w - 13, toilet.y + 6, 13, toilet.h - 12, 5, CERAMIC);
      ctx.fillStyle = CERAMIC;
      ctx.beginPath(); ctx.ellipse(toilet.x + toilet.w * .46, toilet.y + toilet.h / 2 + 2, 17, 21, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#66737b'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = WATER;
      ctx.beginPath(); ctx.ellipse(toilet.x + toilet.w * .42, toilet.y + toilet.h / 2 + 2, 9, 12, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      round(ctx, toilet.x + 6, toilet.y, toilet.w - 12, 16, 5, CERAMIC);
      ctx.fillStyle = CERAMIC;
      ctx.beginPath(); ctx.ellipse(toilet.x + toilet.w / 2, toilet.y + 34, 16, 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#66737b'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = WATER;
      ctx.beginPath(); ctx.ellipse(toilet.x + toilet.w / 2, toilet.y + 35, 9, 11, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}

function drawUnmadeBedOverlay(ctx, state) {
  if (state.objectState?.bedMade !== false) return;
  const bed = objects.find(o => o.floor === state.floor && o.kind === 'bed' && o.id === 'bed');
  if (!bed) return;
  ctx.save();
  ctx.fillStyle = 'rgba(96,113,143,.90)';
  ctx.beginPath();
  ctx.moveTo(bed.x + 102, bed.y + 20);
  ctx.quadraticCurveTo(bed.x + 162, bed.y - 1, bed.x + bed.w - 30, bed.y + 35);
  ctx.quadraticCurveTo(bed.x + bed.w - 48, bed.y + 70, bed.x + 112, bed.y + 62);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(159,107,142,.88)';
  ctx.beginPath();
  ctx.moveTo(bed.x + 104, bed.y + bed.h - 26);
  ctx.quadraticCurveTo(bed.x + 174, bed.y + bed.h + 4, bed.x + bed.w - 24, bed.y + bed.h - 38);
  ctx.quadraticCurveTo(bed.x + bed.w - 58, bed.y + bed.h - 74, bed.x + 112, bed.y + bed.h - 62);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPanicRoom(ctx, state) {
  if (state.floor !== 1) return;
  ctx.save();
  round(ctx, 474, 530, 222, 144, 8, 'rgba(96,90,80,.52)');
  round(ctx, 480, 536, 210, 132, 6, 'rgba(46,52,56,.30)');
  round(ctx, 470, 582, 28, 62, 6, '#31363a');
  line(ctx, 484, 590, 484, 636, '#9ea7aa', 3);
  label(ctx, 'PANIC ROOM', 512, 548);
  label(ctx, 'STEEL DOOR', 506, 566);
  round(ctx, 522, 574, 48, 30, 6, '#202830');
  circle(ctx, 546, 589, 6, '#f1c66a');
  round(ctx, 642, 550, 38, 92, 6, '#202830');
  line(ctx, 650, 568, 672, 568, '#74e6ff', 2);
  line(ctx, 650, 590, 672, 590, '#74e6ff', 2);
  line(ctx, 650, 612, 672, 612, '#74e6ff', 2);
  round(ctx, 548, 626, 92, 32, 6, '#6f5c45');
  label(ctx, 'EMERGENCY SUPPLIES', 550, 646);
  ctx.restore();
}

function drawStandingPeeStreams(ctx, state) {
  for (const actor of state.entities || []) {
    if (actor.hidden || actor.floor !== state.floor || actor.currentActionId !== 'pee_stand' || actor.actionT <= 0) continue;
    const toilet = objects.find(o => o.id === actor.toiletObjectId) || nearestToilet(actor);
    if (!toilet) continue;
    const bowl = toilet.facing === 'west'
      ? { x: toilet.x + toilet.w * .42, y: toilet.y + toilet.h / 2 + 2 }
      : { x: toilet.x + toilet.w / 2, y: toilet.y + 35 };
    ctx.save();
    line(ctx, actor.x + 2, actor.y + 12, bowl.x, bowl.y, 'rgba(241,198,106,.78)', 2);
    ctx.restore();
  }
}

function nearestToilet(actor) {
  return objects.filter(o => o.floor === actor.floor && o.kind === 'toilet').sort((a, b) => nearDist(actor, a) - nearDist(actor, b))[0] || null;
}

function clearShowerSteam(ctx, shower) {
  round(ctx, shower.x - 12, shower.y - 16, shower.w + 32, shower.h + 38, 0, FLOOR);
}

function nearObject(actor, obj, pad = 32) {
  return actor.x >= obj.x - pad && actor.x <= obj.x + obj.w + pad && actor.y >= obj.y - pad && actor.y <= obj.y + obj.h + pad;
}

function nearDist(actor, obj) {
  return Math.hypot(actor.x - (obj.x + obj.w / 2), actor.y - (obj.y + obj.h / 2));
}

function label(ctx, text, x, y) {
  ctx.fillStyle = 'rgba(7,16,24,.72)';
  ctx.font = '900 9px system-ui';
  ctx.fillText(text, x, y);
}

function round(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fillStyle = fill;
  ctx.fill();
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

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}
