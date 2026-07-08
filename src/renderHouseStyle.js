/*
 * ART IMPLEMENTATION RESTRICTION
 * Procedural primitives are fallback only. Do not add new production object art here.
 * Real objects must use image assets, PNG, WebP, SVG, or dedicated imported sprite/vector assets.
 * This Canvas visual pass is temporary playable fallback while production assets are integrated.
 */

import { CANVAS_H, CANVAS_W, PLAY_H, PLAY_W } from './config.js';
import { floors } from './world.js';

const STYLE = {
  page: '#e9e0d3',
  void: '#1f2430',
  wall: '#f7f2e9',
  wallEdge: '#c7b8a5',
  floor: '#d8c4a4',
  floorAlt: '#ccb58f',
  label: '#5b5149',
  ink: '#403832',
  shadow: 'rgba(57,42,27,.18)',
  cream: '#f8f2e8',
  wood: '#9f704a',
  wood2: '#c3915e',
  teal: '#7ea4a0',
  green: '#789477',
  blue: '#93adb5',
  linen: '#efe7dc',
  dark: '#47423e',
  metal: '#bcc5c4',
  glass: '#a8d3db',
  terracotta: '#b66d55'
};

export function drawStyledWorld(ctx, state, doorways, windows) {
  ctx.fillStyle = STYLE.page;
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  ctx.fillStyle = STYLE.void;
  ctx.fillRect(PLAY_W, 0, CANVAS_W - PLAY_W, CANVAS_H);

  const floor = floors[state.floor];
  for (const room of floor.rooms) drawRoom(ctx, state, room);
  drawStyledDoorways(ctx, state, doorways);
  drawStyledWindows(ctx, state, windows);
  drawFloorLabel(ctx, floor.name);
}

function drawRoom(ctx, state, room) {
  const lit = state.roomLights[room.id] !== false;
  ctx.save();
  ctx.fillStyle = STYLE.shadow;
  rounded(ctx, room.x + 6, room.y + 8, room.w, room.h, 3, true, false);
  ctx.fillStyle = STYLE.wall;
  rounded(ctx, room.x, room.y, room.w, room.h, 3, true, false);
  ctx.strokeStyle = STYLE.wallEdge;
  ctx.lineWidth = 5;
  rounded(ctx, room.x, room.y, room.w, room.h, 3, false, true);
  ctx.fillStyle = lit ? STYLE.floor : STYLE.floorAlt;
  rounded(ctx, room.x + 12, room.y + 12, room.w - 24, room.h - 24, 2, true, false);
  drawFloorGrain(ctx, room);
  ctx.fillStyle = STYLE.label;
  ctx.font = '700 12px system-ui';
  ctx.fillText(room.name, room.x + 18, room.y + 29);
  ctx.fillStyle = lit ? '#f0c95e' : '#9d9488';
  ctx.beginPath();
  ctx.arc(room.x + room.w - 24, room.y + 25, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFloorGrain(ctx, room) {
  ctx.save();
  ctx.globalAlpha = .13;
  ctx.strokeStyle = '#8b6f53';
  ctx.lineWidth = 1;
  const top = room.y + 36;
  const bottom = room.y + room.h - 18;
  for (let y = top; y < bottom; y += 28) {
    ctx.beginPath();
    ctx.moveTo(room.x + 18, y);
    ctx.lineTo(room.x + room.w - 18, y + ((Math.floor(y) % 2) ? 3 : -2));
    ctx.stroke();
  }
  ctx.restore();
}

function drawStyledDoorways(ctx, state, doorways) {
  for (const d of doorways.filter(x => x.floor === state.floor)) {
    const gap = doorwayGapRect(d);
    ctx.save();
    ctx.fillStyle = STYLE.floor;
    ctx.fillRect(gap.x, gap.y, gap.w, gap.h);
    ctx.fillStyle = 'rgba(139,111,83,.10)';
    ctx.fillRect(gap.x, gap.y, gap.w, gap.h);
    ctx.strokeStyle = '#7f756a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (d.w >= d.h) {
      const y = d.y + d.h / 2;
      ctx.moveTo(d.x + 8, y);
      ctx.lineTo(d.x + d.w - 8, y);
      ctx.moveTo(d.x + 8, y);
      ctx.arc(d.x + 8, y, Math.min(30, Math.max(18, d.w / 3)), -Math.PI / 2, 0);
    } else {
      const x = d.x + d.w / 2;
      ctx.moveTo(x, d.y + 8);
      ctx.lineTo(x, d.y + d.h - 8);
      ctx.moveTo(x, d.y + 8);
      ctx.arc(x, d.y + 8, Math.min(30, Math.max(18, d.h / 3)), 0, Math.PI / 2);
    }
    ctx.stroke();
    ctx.restore();
  }
}

function doorwayGapRect(d) {
  const alongPad = 14;
  const wallCut = 22;
  if (d.w >= d.h) {
    const h = Math.max(44, d.h + wallCut * 2);
    return { x: d.x - alongPad, y: d.y + d.h / 2 - h / 2, w: d.w + alongPad * 2, h };
  }
  const w = Math.max(44, d.w + wallCut * 2);
  return { x: d.x + d.w / 2 - w / 2, y: d.y - alongPad, w, h: d.h + alongPad * 2 };
}

function drawStyledWindows(ctx, state, windows) {
  const openWindows = state.objectState.openWindows || {};
  for (const w of windows.filter(x => x.floor === state.floor)) {
    ctx.save();
    ctx.fillStyle = openWindows[w.id] ? '#c4edf1' : '#b9d4d8';
    rounded(ctx, w.x, w.y - 2, w.w, w.h + 5, 2, true, false);
    ctx.strokeStyle = '#f7f2e9';
    ctx.lineWidth = 2;
    rounded(ctx, w.x - 1, w.y - 3, w.w + 2, w.h + 7, 2, false, true);
    ctx.restore();
  }
}

function drawFloorLabel(ctx, name) {
  ctx.fillStyle = STYLE.ink;
  ctx.font = '800 22px system-ui';
  ctx.fillText(name, 26, 694);
}

export function drawStyledObject(ctx, o, state) {
  ctx.save();
  ctx.fillStyle = STYLE.shadow;
  rounded(ctx, o.x + 5, o.y + 6, o.w, o.h, 10, true, false);
  ctx.restore();
  if (o.kind === 'couch') return drawCouch(ctx, o), true;
  if (o.kind === 'tv') return drawTv(ctx, o, state), true;
  if (o.kind === 'stereo') return drawStereo(ctx, o, state), true;
  if (o.kind === 'fridge') return drawFridge(ctx, o, state), true;
  if (o.kind === 'stove') return drawStove(ctx, o, state), true;
  if (o.kind === 'sink') return drawSink(ctx, o), true;
  if (o.kind === 'trash_can') return drawTrash(ctx, o, state.garbage?.kitchen || 0), true;
  if (o.kind === 'shower') return drawShower(ctx, o), true;
  if (o.kind === 'toilet') return drawToilet(ctx, o), true;
  if (o.kind === 'door') return drawDoor(ctx, o, state), true;
  if (o.kind === 'stairs') return drawStairs(ctx, o), true;
  if (o.kind === 'bed') return drawBed(ctx, o), true;
  if (o.kind === 'desk') return drawDesk(ctx, o), true;
  if (o.kind === 'dog_bowl') return drawBowl(ctx, o), true;
  if (o.kind === 'light') return drawLight(ctx, o, state), true;
  if (o.kind === 'bookshelf') return drawBookshelf(ctx, o), true;
  if (o.kind === 'workout') return drawWorkout(ctx, o), true;
  if (o.kind === 'pool_table') return drawPoolTable(ctx, o, state), true;
  if (o.kind === 'arcade') return drawArcade(ctx, o), true;
  if (o.kind === 'game_console') return drawConsole(ctx, o), true;
  if (o.kind === 'dartboard') return drawDartboard(ctx, o), true;
  if (o.kind === 'outdoor_trash') return drawOutdoorTrash(ctx, o, state.garbage?.bagsOutside || 0), true;
  if (o.kind === 'treadmill') return drawTreadmill(ctx, o), true;
  if (o.kind === 'weight_bench') return drawWeightBench(ctx, o), true;
  if (o.kind === 'heavy_bag') return drawHeavyBag(ctx, o), true;
  if (o.kind === 'swim_pool') return drawPool(ctx, o), true;
  if (o.kind === 'kennel') return drawKennel(ctx, o), true;
  if (o.kind === 'car') return drawCar(ctx, o, state), true;
  if (o.kind === 'bike') return drawBike(ctx, o), true;
  if (o.kind === 'motorbike') return drawMotorbike(ctx, o), true;
  return false;
}

function drawCouch(ctx, o) {
  rounded(ctx, o.x, o.y, o.w, o.h, 18, true, false, STYLE.teal);
  rounded(ctx, o.x + 3, o.y + 3, o.w - 6, 16, 10, true, false, '#5f7975');
  rounded(ctx, o.x + 8, o.y + 21, o.w * .42, o.h - 28, 13, true, false, '#93b8b3');
  rounded(ctx, o.x + o.w * .52, o.y + 21, o.w * .40, o.h - 28, 13, true, false, '#93b8b3');
  rounded(ctx, o.x + 4, o.y + 16, 15, o.h - 20, 10, true, false, '#6f8f8a');
  rounded(ctx, o.x + o.w - 19, o.y + 16, 15, o.h - 20, 10, true, false, '#6f8f8a');
  stroke(ctx, o, '#4e6662', 2, 18);
}
function drawTv(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 5, true, false, '#3a3531'); rounded(ctx, o.x + 7, o.y + 5, o.w - 14, o.h - 10, 3, true, false, state.tv.on ? '#83bfc8' : '#262320'); ctx.fillStyle = '#7b6c5a'; ctx.fillRect(o.x + o.w * .42, o.y + o.h, o.w * .16, 8); }
function drawStereo(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#574b44'); circle(ctx, o.x + 14, o.y + 17, 9, '#2a2826'); circle(ctx, o.x + o.w - 14, o.y + 17, 9, '#2a2826'); ctx.fillStyle = state.music ? '#e5bc58' : '#c8bdad'; ctx.font = '900 13px system-ui'; ctx.fillText(state.music ? '♪' : 'ST', o.x + 24, o.y + 22); }
function drawFridge(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, STYLE.cream); stroke(ctx, o, '#c6beb3', 2, 8); ctx.strokeStyle = '#d5c9bc'; ctx.beginPath(); ctx.moveTo(o.x + 8, o.y + o.h * .42); ctx.lineTo(o.x + o.w - 8, o.y + o.h * .42); ctx.stroke(); ctx.fillStyle = STYLE.glass; ctx.fillRect(o.x + 9, o.y + 20, 5, 44); if (state.objectState.fridgeOpen) rounded(ctx, o.x + o.w - 2, o.y + 10, 38, o.h - 20, 4, true, false, '#fffdf6'); }
function drawStove(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false, '#b9b4aa'); for (let i = 0; i < 4; i++) circle(ctx, o.x + 18 + (i % 2) * 34, o.y + 17 + Math.floor(i / 2) * 26, 9, '#655f59', false); if (state.objectState.stovePan) { ellipse(ctx, o.x + 39, o.y + 35, 22, 13, '#3c3835'); line(ctx, o.x + 56, o.y + 34, o.x + 78, o.y + 28, '#3c3835', 3); } }
function drawSink(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#c7c4bd'); rounded(ctx, o.x + 9, o.y + 8, o.w - 18, o.h - 16, 10, true, false, '#b6d3d7'); circle(ctx, o.x + o.w / 2, o.y + 15, 3, '#7f7870'); }
function drawTrash(ctx, o, level) { rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false, level > 80 ? '#a26b5c' : '#8e968d'); rounded(ctx, o.x + 5, o.y + 4, o.w - 10, 8, 4, true, false, '#6f756e'); }
function drawShower(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#d7e4e2'); rounded(ctx, o.x + 8, o.y + 8, o.w - 16, o.h - 16, 6, true, false, '#9fcbd3'); stroke(ctx, { x: o.x + 8, y: o.y + 8, w: o.w - 16, h: o.h - 16 }, '#f8f2e8', 2, 6); }
function drawToilet(ctx, o) { rounded(ctx, o.x + 4, o.y, o.w - 8, 20, 5, true, false, STYLE.cream); ellipse(ctx, o.x + o.w / 2, o.y + 39, 19, 16, STYLE.cream); ellipse(ctx, o.x + o.w / 2, o.y + 39, 10, 8, '#cbd7d6'); }
function drawDoor(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 2, true, false, STYLE.wood); if (state.objectState.doorOpen) rounded(ctx, o.x + o.w, o.y + 8, 15, o.h - 16, 2, true, false, STYLE.wood2); }
function drawStairs(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#b3a28c'); ctx.strokeStyle = '#f3eadf'; ctx.lineWidth = 2; for (let y = o.y + 12; y < o.y + o.h; y += 14) line(ctx, o.x + 12, y, o.x + o.w - 12, y, '#f3eadf', 2); ctx.fillStyle = STYLE.ink; ctx.font = '900 9px system-ui'; ctx.fillText(o.toFloor === 4 ? 'YARD' : o.toFloor === 3 ? 'GAR' : o.toFloor === 2 ? 'BASE' : o.toFloor === 1 ? 'UP' : 'MAIN', o.x + 10, o.y + o.h - 10); }
function drawBed(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 17, true, false, '#b9a287'); rounded(ctx, o.x + 14, o.y + 10, o.w - 28, o.h - 20, 15, true, false, STYLE.linen); rounded(ctx, o.x + 18, o.y + 12, 54, 34, 12, true, false, '#fffaf2'); rounded(ctx, o.x + 78, o.y + 18, o.w - 96, o.h - 34, 14, true, false, '#d6c7b5'); }
function drawDesk(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false, '#b78556'); rounded(ctx, o.x + 32, o.y + 9, 54, 36, 4, true, false, '#4b4641'); rounded(ctx, o.x + 39, o.y + 15, 40, 17, 2, true, false, '#b9d4d8'); line(ctx, o.x + 48, o.y + 39, o.x + 74, o.y + 39, '#ede4d7', 2); rounded(ctx, o.x + 43, o.y + o.h + 9, 42, 32, 12, true, false, '#6f6157'); rounded(ctx, o.x + 48, o.y + o.h + 14, 32, 16, 8, true, false, '#8c7a6d'); rounded(ctx, o.x + 46, o.y + o.h + 31, 36, 9, 5, true, false, '#514942'); }
function drawBowl(ctx, o) { ellipse(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 2, o.h / 2, STYLE.terracotta); ellipse(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 3, o.h / 3, '#8a4639'); }
function drawLight(ctx, o, state) { circle(ctx, o.x + o.w / 2, o.y + o.h / 2, 11, state.roomLights ? '#e8c35a' : '#9b948a'); }
function drawBookshelf(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false, '#9d704d'); for (let y = o.y + 14; y < o.y + o.h - 8; y += 24) { line(ctx, o.x + 8, y, o.x + o.w - 8, y, '#d4b083', 5); ctx.fillStyle = '#7ea4a0'; ctx.fillRect(o.x + 12, y + 7, 10, 14); ctx.fillStyle = '#c78b76'; ctx.fillRect(o.x + 27, y + 7, 9, 14); ctx.fillStyle = '#d2b064'; ctx.fillRect(o.x + 42, y + 7, 12, 14); } }
function drawWorkout(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#78766d'); line(ctx, o.x + 12, o.y + 22, o.x + o.w - 12, o.y + 22, STYLE.cream, 4); }
function drawPoolTable(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 18, true, false, '#8b6b49'); rounded(ctx, o.x + 14, o.y + 14, o.w - 28, o.h - 28, 12, true, false, '#557d67'); for (const [px, py] of [[16,16],[o.w/2,12],[o.w-16,16],[16,o.h-16],[o.w/2,o.h-12],[o.w-16,o.h-16]]) circle(ctx, o.x + px, o.y + py, 7, '#2c2622'); drawPoolCues(ctx, o); if (!state.poolGame || state.poolGame.tableId !== o.id) drawDefaultPoolRack(ctx, o); }
function drawPoolCues(ctx, o) { ctx.save(); ctx.strokeStyle = '#d6b27a'; ctx.lineWidth = 3; ctx.lineCap = 'round'; line(ctx, o.x + 28, o.y + o.h - 19, o.x + o.w - 32, o.y + 22, '#d6b27a', 3); line(ctx, o.x + 34, o.y + 24, o.x + o.w - 44, o.y + o.h - 18, '#d6b27a', 3); ctx.restore(); }
function drawDefaultPoolRack(ctx, o) { const cy = o.y + o.h * .5; const balls = [[o.x + o.w * .30, cy, '#f8fbff'], [o.x + o.w * .58, cy, '#f1c66a'], [o.x + o.w * .64, cy - 15, '#ff75df'], [o.x + o.w * .64, cy + 15, '#74e6ff'], [o.x + o.w * .70, cy - 30, '#90d68c'], [o.x + o.w * .70, cy, '#f08b57'], [o.x + o.w * .70, cy + 30, '#a98bff']]; ctx.strokeStyle = '#d6b27a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x + o.w * .54, cy - 42); ctx.lineTo(o.x + o.w * .76, cy); ctx.lineTo(o.x + o.w * .54, cy + 42); ctx.closePath(); ctx.stroke(); for (const [x, y, color] of balls) circle(ctx, x, y, color === '#f8fbff' ? 6 : 7, color); }
function drawArcade(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#5d4b5d'); rounded(ctx, o.x + 8, o.y + 10, o.w - 16, 28, 4, true, false, '#2a2728'); rounded(ctx, o.x + 14, o.y + 16, o.w - 28, 12, 2, true, false, '#9ecbd1'); circle(ctx, o.x + 18, o.y + 52, 5, '#b66d55'); }
function drawConsole(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 11, true, false, '#7b7068'); rounded(ctx, o.x + 16, o.y + 10, o.w - 32, 28, 6, true, false, '#363330'); rounded(ctx, o.x + 32, o.y + 16, o.w - 64, 14, 3, true, false, '#9ecbd1'); }
function drawDartboard(ctx, o) { circle(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 2, '#2c2824'); circle(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 3, '#efe7dc', false); circle(ctx, o.x + o.w / 2, o.y + o.h / 2, 4, '#b66d55'); }
function drawOutdoorTrash(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 9, true, false, '#6b8b73'); rounded(ctx, o.x + 8, o.y + 8, o.w - 16, 10, 4, true, false, '#4c6453'); }
function drawTreadmill(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 12, true, false, '#686660'); rounded(ctx, o.x + 14, o.y + 12, o.w - 28, o.h - 24, 8, true, false, '#2e2d2b'); }
function drawWeightBench(ctx, o) { rounded(ctx, o.x, o.y + 12, o.w, 24, 10, true, false, '#6c6159'); line(ctx, o.x + 8, o.y + 6, o.x + o.w - 8, o.y + 6, '#f1e9de', 4); }
function drawHeavyBag(ctx, o) { line(ctx, o.x + o.w / 2, o.y, o.x + o.w / 2, o.y + 16, '#b99d70', 2); rounded(ctx, o.x + 6, o.y + 16, o.w - 12, o.h - 20, 16, true, false, '#7b4e46'); }
function drawPool(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 28, true, false, '#d3c6ad'); rounded(ctx, o.x + 12, o.y + 12, o.w - 24, o.h - 24, 22, true, false, '#74bac4'); ctx.strokeStyle = 'rgba(255,255,255,.55)'; for (let y = o.y + 40; y < o.y + o.h; y += 36) { ctx.beginPath(); ctx.moveTo(o.x + 24, y); ctx.quadraticCurveTo(o.x + o.w / 2, y - 20, o.x + o.w - 24, y); ctx.stroke(); } }
function drawKennel(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 14, true, false, '#8b654c'); ctx.fillStyle = '#3a332d'; ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h - 16, 20, Math.PI, 0); ctx.fill(); }
function drawCar(ctx, o, state) { const night = (state.time % 1440) >= 18 * 60 || (state.time % 1440) < 6 * 60; rounded(ctx, o.x, o.y, o.w, o.h, 24, true, false, '#6f7c83'); rounded(ctx, o.x + o.w * .18, o.y + o.h * .18, o.w * .64, o.h * .64, 16, true, false, '#d7e2e1'); ctx.strokeStyle = '#5c666c'; ctx.lineWidth = 2; ctx.strokeRect(o.x + o.w * .28, o.y + o.h * .26, o.w * .44, o.h * .34); ctx.fillStyle = night ? '#e8c35a' : '#f7f2e9'; ctx.fillRect(o.x + o.w * .2, o.y + 10, 18, 10); ctx.fillRect(o.x + o.w * .66, o.y + 10, 18, 10); ctx.fillStyle = '#b66d55'; ctx.fillRect(o.x + o.w * .2, o.y + o.h - 20, 18, 8); ctx.fillRect(o.x + o.w * .66, o.y + o.h - 20, 18, 8); }
function drawBike(ctx, o) { circle(ctx, o.x + 18, o.y + 18, 14, '#6a625c', false); circle(ctx, o.x + o.w - 18, o.y + 18, 14, '#6a625c', false); line(ctx, o.x + 18, o.y + 18, o.x + 46, o.y + 8, '#6a625c', 4); line(ctx, o.x + 46, o.y + 8, o.x + o.w - 18, o.y + 18, '#6a625c', 4); }
function drawMotorbike(ctx, o) { rounded(ctx, o.x + 20, o.y + 8, o.w - 40, o.h - 16, 16, true, false, '#5d5a54'); rounded(ctx, o.x + 44, o.y + 16, 34, 8, 4, true, false, '#9ecbd1'); circle(ctx, o.x + 18, o.y + o.h - 12, 12, '#6a625c', false); circle(ctx, o.x + o.w - 18, o.y + o.h - 12, 12, '#6a625c', false); }

function rounded(ctx, x, y, w, h, r, fill, stroke, color) {
  if (color) ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
function stroke(ctx, o, color, width = 2, r = 8) { ctx.strokeStyle = color; ctx.lineWidth = width; rounded(ctx, o.x, o.y, o.w, o.h, r, false, true); }
function circle(ctx, x, y, r, color, fill = true) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = color; ctx.fill(); } else { ctx.strokeStyle = color; ctx.stroke(); } }
function ellipse(ctx, x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function line(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
