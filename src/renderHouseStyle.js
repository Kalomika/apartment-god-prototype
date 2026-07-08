/*
 * ART IMPLEMENTATION RESTRICTION
 * Procedural primitives are fallback only. Do not add new production object art here.
 * Real objects must use image assets, PNG, WebP, SVG, or dedicated imported sprite/vector assets.
 * This Canvas visual pass is temporary playable fallback while production assets are integrated.
 */

import { CANVAS_H, CANVAS_W, PLAY_H, PLAY_W } from './config.js';
import { floors } from './world.js';

const STYLE = {
  page: '#e9e0d3', void: '#1f2430', wall: '#f7f2e9', wallEdge: '#c7b8a5', floor: '#d8c4a4', floorAlt: '#ccb58f',
  label: '#5b5149', ink: '#403832', shadow: 'rgba(57,42,27,.18)', cream: '#f8f2e8', wood: '#9f704a', wood2: '#c3915e',
  teal: '#7ea4a0', green: '#789477', blue: '#93adb5', linen: '#efe7dc', metal: '#bcc5c4', glass: '#a8d3db', terracotta: '#b66d55',
  cyberWall: '#141b25', cyberWallEdge: '#334457', cyberFloor: '#263241', cyberFloorAlt: '#202a37', cyan: '#74e6ff', magenta: '#ff75df', amber: '#f1c66a'
};

export function drawStyledWorld(ctx, state, doorways, windows) {
  ctx.fillStyle = state.floor === 1 ? '#101722' : STYLE.page;
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  ctx.fillStyle = STYLE.void;
  ctx.fillRect(PLAY_W, 0, CANVAS_W - PLAY_W, CANVAS_H);
  const floor = floors[state.floor];
  for (const room of floor.rooms) drawRoom(ctx, state, room);
  drawWindowLightAndShadow(ctx, state, windows);
  drawStyledDoorways(ctx, state, doorways);
  drawStyledWindows(ctx, state, windows);
  drawFloorLabel(ctx, floor.name, state.floor);
}

function drawRoom(ctx, state, room) {
  const lit = state.roomLights[room.id] !== false;
  if (state.floor === 1) return drawUpstairsRoom(ctx, room, lit);
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
  circle(ctx, room.x + room.w - 24, room.y + 25, 6, ctx.fillStyle);
  ctx.restore();
}

function drawUpstairsRoom(ctx, room, lit) {
  const palette = upstairsPalette(room.id, lit);
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.34)';
  rounded(ctx, room.x + 8, room.y + 10, room.w, room.h, 8, true, false);
  ctx.fillStyle = palette.wall;
  rounded(ctx, room.x, room.y, room.w, room.h, 6, true, false);
  ctx.strokeStyle = palette.edge;
  ctx.lineWidth = 5;
  rounded(ctx, room.x, room.y, room.w, room.h, 6, false, true);
  ctx.fillStyle = palette.floor;
  rounded(ctx, room.x + 14, room.y + 14, room.w - 28, room.h - 28, 3, true, false);
  drawUpstairsFloorTexture(ctx, room);
  drawUpstairsRoomDetails(ctx, room, palette, lit);
  ctx.fillStyle = palette.text;
  ctx.font = '800 11px system-ui';
  ctx.fillText(room.name.toUpperCase(), room.x + 20, room.y + 30);
  circle(ctx, room.x + room.w - 24, room.y + 25, 5, lit ? palette.light : '#667182');
  ctx.restore();
}

function upstairsPalette(roomId, lit) {
  const base = lit ? STYLE.cyberFloor : STYLE.cyberFloorAlt;
  const common = { wall: STYLE.cyberWall, edge: STYLE.cyberWallEdge, floor: base, text: '#9fb4c8', light: STYLE.cyan };
  if (roomId === 'bedroom') return { ...common, floor: lit ? '#273244' : '#1f2836', text: '#b7bfd0', light: STYLE.magenta };
  if (roomId === 'office') return { ...common, floor: lit ? '#223143' : '#1b2633', text: '#9edff0', light: STYLE.cyan };
  if (roomId === 'bath2') return { ...common, floor: lit ? '#22384a' : '#1b2a36', text: '#b7e7ee', light: '#c9f7ff' };
  if (roomId === 'hall') return { ...common, floor: lit ? '#242f3c' : '#1b2430', text: '#94a8b9', light: STYLE.cyan };
  return { ...common, floor: lit ? '#263241' : '#1f2935', text: '#aebdca', light: STYLE.amber };
}

function drawUpstairsFloorTexture(ctx, room) {
  ctx.save();
  ctx.globalAlpha = .18;
  for (let y = room.y + 38; y < room.y + room.h - 20; y += 34) line(ctx, room.x + 22, y, room.x + room.w - 22, y + ((Math.floor(y / 17) % 2) ? 2 : -2), '#8ea3b7', 1);
  ctx.globalAlpha = .10;
  for (let x = room.x + 42; x < room.x + room.w - 28; x += 54) line(ctx, x, room.y + 18, x, room.y + room.h - 18, '#000', 1);
  ctx.restore();
  ctx.save();
  if (room.id === 'bedroom') rounded(ctx, room.x + 54, room.y + 232, 210, 70, 18, true, false, 'rgba(60,44,70,.55)');
  if (room.id === 'office') {
    rounded(ctx, room.x + 52, room.y + 212, 178, 82, 12, true, false, 'rgba(15,28,42,.46)');
    for (let x = room.x + 78; x < room.x + 220; x += 28) line(ctx, x, room.y + 228, x + 24, room.y + 286, 'rgba(116,230,255,.18)', 1);
  }
  if (room.id === 'bath2') {
    ctx.globalAlpha = .32;
    for (let x = room.x + 24; x < room.x + room.w - 20; x += 24) line(ctx, x, room.y + 20, x, room.y + room.h - 20, '#b5d6df', 1);
    for (let y = room.y + 24; y < room.y + room.h - 18; y += 24) line(ctx, room.x + 20, y, room.x + room.w - 20, y, '#b5d6df', 1);
  }
  if (room.id === 'hall') rounded(ctx, room.x + 46, room.y + 42, room.w - 92, 42, 18, true, false, 'rgba(20,29,39,.58)');
  if (room.id === 'stairs2') rounded(ctx, room.x + 34, room.y + 36, room.w - 68, 72, 10, true, false, 'rgba(7,12,18,.34)');
  ctx.restore();
}

function drawUpstairsRoomDetails(ctx, room, palette, lit) {
  ctx.save();
  const stripAlpha = lit ? .72 : .28;
  if (room.id === 'bedroom') {
    neonLine(ctx, room.x + 24, room.y + room.h - 24, room.x + room.w - 24, room.y + room.h - 24, STYLE.magenta, 2, stripAlpha);
    neonLine(ctx, room.x + room.w - 18, room.y + 66, room.x + room.w - 18, room.y + 190, STYLE.cyan, 2, .38);
    rounded(ctx, room.x + 312, room.y + 82, 104, 18, 8, true, false, 'rgba(255,117,223,.12)');
  }
  if (room.id === 'office') {
    neonLine(ctx, room.x + 24, room.y + room.h - 24, room.x + room.w - 24, room.y + room.h - 24, STYLE.cyan, 2, stripAlpha);
    neonLine(ctx, room.x + 22, room.y + 58, room.x + 22, room.y + 190, STYLE.magenta, 2, .34);
    rounded(ctx, room.x + room.w - 72, room.y + 70, 38, 150, 5, true, false, 'rgba(7,12,18,.28)');
    for (let y = room.y + 88; y < room.y + 210; y += 22) line(ctx, room.x + room.w - 66, y, room.x + room.w - 40, y, 'rgba(116,230,255,.18)', 2);
  }
  if (room.id === 'bath2') {
    neonLine(ctx, room.x + 18, room.y + 18, room.x + room.w - 18, room.y + 18, '#c9f7ff', 2, .55);
    rounded(ctx, room.x + 26, room.y + 194, room.w - 52, 46, 8, true, false, 'rgba(201,247,255,.08)');
  }
  if (room.id === 'hall') neonLine(ctx, room.x + 58, room.y + 63, room.x + room.w - 58, room.y + 63, STYLE.cyan, 2, .62);
  if (room.id === 'stairs2') {
    neonLine(ctx, room.x + 50, room.y + 54, room.x + room.w - 50, room.y + 54, STYLE.cyan, 2, .48);
    neonLine(ctx, room.x + 50, room.y + 94, room.x + room.w - 50, room.y + 94, STYLE.magenta, 2, .30);
  }
  ctx.restore();
}

function drawFloorGrain(ctx, room) {
  ctx.save();
  ctx.globalAlpha = .13;
  ctx.strokeStyle = '#8b6f53';
  ctx.lineWidth = 1;
  for (let y = room.y + 36; y < room.y + room.h - 18; y += 28) line(ctx, room.x + 18, y, room.x + room.w - 18, y + ((Math.floor(y) % 2) ? 3 : -2), '#8b6f53', 1);
  ctx.restore();
}

function drawWindowLightAndShadow(ctx, state, windows) {
  const minutes = ((state.time % 1440) + 1440) % 1440;
  const daylight = Math.max(0, Math.min(1, Math.sin(((minutes - 360) / 780) * Math.PI)));
  if (daylight <= 0.03) return;
  const progress = Math.max(0, Math.min(1, (minutes - 360) / 780));
  const drift = (progress - .5) * 170;
  const beamLength = 110 + daylight * 110;
  for (const win of windows.filter(w => w.floor === state.floor)) {
    const open = state.objectState.openWindows?.[win.id];
    const width = Math.max(44, win.w);
    const x1 = win.x;
    const x2 = win.x + width;
    const y = win.y + win.h + 8;
    ctx.save();
    ctx.globalAlpha = (.10 + daylight * .14) * (open ? 1.15 : 1);
    ctx.fillStyle = state.floor === 1 ? STYLE.cyan : '#f1c66a';
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.lineTo(x2 + drift + 26, y + beamLength);
    ctx.lineTo(x1 + drift - 26, y + beamLength);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = .08 * daylight;
    ctx.fillStyle = '#4a3828';
    ctx.beginPath();
    ctx.moveTo(x1 + drift - 20, y + beamLength * .55);
    ctx.lineTo(x2 + drift + 20, y + beamLength * .55);
    ctx.lineTo(x2 + drift + 42, y + beamLength * .95);
    ctx.lineTo(x1 + drift + 2, y + beamLength * .95);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawStyledDoorways(ctx, state, doorways) {
  for (const d of doorways.filter(x => x.floor === state.floor)) {
    const gap = doorwayGapRect(d);
    ctx.save();
    ctx.fillStyle = state.floor === 1 ? '#242f3c' : STYLE.floor;
    ctx.fillRect(gap.x, gap.y, gap.w, gap.h);
    ctx.fillStyle = state.floor === 1 ? 'rgba(116,230,255,.10)' : 'rgba(139,111,83,.08)';
    ctx.fillRect(gap.x, gap.y, gap.w, gap.h);
    if (state.floor === 1) {
      const horizontal = gap.w >= gap.h;
      if (horizontal) neonLine(ctx, gap.x + 8, gap.y + gap.h / 2, gap.x + gap.w - 8, gap.y + gap.h / 2, STYLE.cyan, 1.5, .42);
      else neonLine(ctx, gap.x + gap.w / 2, gap.y + 8, gap.x + gap.w / 2, gap.y + gap.h - 8, STYLE.cyan, 1.5, .42);
    }
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
    if (state.floor === 1) {
      rounded(ctx, w.x - 3, w.y - 5, w.w + 6, w.h + 11, 4, true, false, '#09111c');
      rounded(ctx, w.x, w.y - 2, w.w, w.h + 5, 3, true, false, openWindows[w.id] ? '#bff7ff' : '#32556a');
      ctx.strokeStyle = openWindows[w.id] ? 'rgba(116,230,255,.95)' : 'rgba(116,230,255,.48)';
      ctx.lineWidth = 2;
      rounded(ctx, w.x - 1, w.y - 3, w.w + 2, w.h + 7, 3, false, true);
      neonLine(ctx, w.x + 8, w.y + 2, w.x + w.w - 8, w.y + 2, openWindows[w.id] ? '#d6fbff' : STYLE.cyan, 2, openWindows[w.id] ? .85 : .35);
    } else {
      ctx.fillStyle = openWindows[w.id] ? '#c4edf1' : '#b9d4d8';
      rounded(ctx, w.x, w.y - 2, w.w, w.h + 5, 2, true, false);
      ctx.strokeStyle = '#f7f2e9';
      ctx.lineWidth = 2;
      rounded(ctx, w.x - 1, w.y - 3, w.w + 2, w.h + 7, 2, false, true);
    }
    ctx.restore();
  }
}

function drawFloorLabel(ctx, name, floor) {
  ctx.fillStyle = floor === 1 ? '#b7e7ee' : STYLE.ink;
  ctx.font = '800 22px system-ui';
  ctx.fillText(name, 26, 694);
}

export function drawStyledObject(ctx, o, state) {
  if (o.styleAs === 'door') return true;
  ctx.save(); ctx.fillStyle = o.floor === 1 ? 'rgba(0,0,0,.28)' : STYLE.shadow; rounded(ctx, o.x + 5, o.y + 6, o.w, o.h, 10, true, false); ctx.restore();
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
  if (o.kind === 'pool_table') return drawPoolTable(ctx, o, state), true;
  if (o.kind === 'arcade') return drawArcade(ctx, o), true;
  if (o.kind === 'game_console') return drawConsole(ctx, o), true;
  if (o.kind === 'dartboard') return drawDartboard(ctx, o), true;
  if (o.kind === 'outdoor_trash') return drawOutdoorTrash(ctx, o), true;
  if (o.kind === 'treadmill') return drawTreadmill(ctx, o), true;
  if (o.kind === 'weight_bench') return drawWeightBench(ctx, o), true;
  if (o.kind === 'heavy_bag') return drawHeavyBag(ctx, o), true;
  if (o.kind === 'swim_pool') return drawPool(ctx, o), true;
  if (o.kind === 'kennel') return drawKennel(ctx, o), true;
  if (o.kind === 'car') return drawCar(ctx, o, state), true;
  if (o.kind === 'bike') return drawBike(ctx, o), true;
  if (o.kind === 'motorbike') return drawMotorbike(ctx, o), true;
  if (o.kind === 'atv') return drawAtv(ctx, o), true;
  if (o.kind === 'garage_door') return drawGarageDoor(ctx, o, state), true;
  return false;
}

function drawCouch(ctx, o) { const up = o.facing !== 'down'; rounded(ctx, o.x, o.y, o.w, o.h, 18, true, false, STYLE.teal); rounded(ctx, o.x + 3, up ? o.y + o.h - 20 : o.y + 3, o.w - 6, 17, 10, true, false, '#4e6662'); rounded(ctx, o.x + 8, up ? o.y + 9 : o.y + 21, o.w * .42, o.h - 30, 13, true, false, '#93b8b3'); rounded(ctx, o.x + o.w * .52, up ? o.y + 9 : o.y + 21, o.w * .40, o.h - 30, 13, true, false, '#93b8b3'); rounded(ctx, o.x + 4, o.y + 13, 15, o.h - 24, 10, true, false, '#6f8f8a'); rounded(ctx, o.x + o.w - 19, o.y + 13, 15, o.h - 24, 10, true, false, '#6f8f8a'); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(o.x + 24, up ? o.y + 9 : o.y + o.h - 15, o.w - 48, 4); stroke(ctx, o, '#4e6662', 2, 18); }
function drawTv(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, o.wallMounted ? 3 : 5, true, false, '#3a3531'); rounded(ctx, o.x + 7, o.y + 5, o.w - 14, o.h - 10, 3, true, false, state.tv.on ? '#83bfc8' : '#262320'); if (o.wallMounted) { ctx.fillStyle = '#6b6258'; ctx.fillRect(o.x + o.w * .15, o.y - 4, o.w * .70, 4); } }
function drawStereo(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#574b44'); circle(ctx, o.x + 14, o.y + 17, 9, '#2a2826'); circle(ctx, o.x + o.w - 14, o.y + 17, 9, '#2a2826'); ctx.fillStyle = state.music ? '#e5bc58' : '#c8bdad'; ctx.font = '900 13px system-ui'; ctx.fillText(state.music ? '♪' : 'ST', o.x + 24, o.y + 22); }
function drawFridge(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, STYLE.cream); stroke(ctx, o, '#c6beb3', 2, 8); ctx.strokeStyle = '#d5c9bc'; ctx.beginPath(); ctx.moveTo(o.x + 8, o.y + o.h * .42); ctx.lineTo(o.x + o.w - 8, o.y + o.h * .42); ctx.stroke(); ctx.fillStyle = STYLE.glass; ctx.fillRect(o.x + 9, o.y + 20, 5, 44); if (state.objectState.fridgeOpen) rounded(ctx, o.x + o.w - 2, o.y + 10, 38, o.h - 20, 4, true, false, '#fffdf6'); }
function drawStove(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false, '#b9b4aa'); for (let i = 0; i < 4; i++) circle(ctx, o.x + 18 + (i % 2) * 34, o.y + 17 + Math.floor(i / 2) * 26, 9, '#655f59', false); if (state.objectState.stovePan) { ellipse(ctx, o.x + 39, o.y + 35, 22, 13, '#3c3835'); line(ctx, o.x + 56, o.y + 34, o.x + 78, o.y + 28, '#3c3835', 3); } }
function drawSink(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#c7c4bd'); rounded(ctx, o.x + 9, o.y + 8, o.w - 18, o.h - 16, 10, true, false, '#b6d3d7'); circle(ctx, o.x + o.w / 2, o.y + 15, 3, '#7f7870'); }
function drawTrash(ctx, o, level) { rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false, level > 80 ? '#a26b5c' : '#8e968d'); rounded(ctx, o.x + 5, o.y + 4, o.w - 10, 8, 4, true, false, '#6f756e'); }
function drawShower(ctx, o) { if (o.floor === 1) return drawCyberShower(ctx, o); rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#d7e4e2'); rounded(ctx, o.x + 8, o.y + 8, o.w - 16, o.h - 16, 6, true, false, '#9fcbd3'); stroke(ctx, { x: o.x + 8, y: o.y + 8, w: o.w - 16, h: o.h - 16 }, '#f8f2e8', 2, 6); }
function drawToilet(ctx, o) { if (o.floor === 1) return drawCyberToilet(ctx, o); rounded(ctx, o.x + 4, o.y, o.w - 8, 20, 5, true, false, STYLE.cream); ellipse(ctx, o.x + o.w / 2, o.y + 39, 19, 16, STYLE.cream); ellipse(ctx, o.x + o.w / 2, o.y + 39, 10, 8, '#cbd7d6'); }
function drawDoor(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 2, true, false, STYLE.wood); if (state.objectState.doorOpen) rounded(ctx, o.x + o.w, o.y + 8, 15, o.h - 16, 2, true, false, STYLE.wood2); }
function drawStairs(ctx, o) { if (o.floor === 1) return drawCyberStairs(ctx, o); rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#b3a28c'); ctx.strokeStyle = '#f3eadf'; ctx.lineWidth = 2; for (let y = o.y + 12; y < o.y + o.h; y += 14) line(ctx, o.x + 12, y, o.x + o.w - 12, y, '#f3eadf', 2); ctx.fillStyle = STYLE.ink; ctx.font = '900 9px system-ui'; ctx.fillText(o.toFloor === 2 ? 'BASE' : o.toFloor === 1 ? 'UP' : 'MAIN', o.x + 10, o.y + o.h - 10); }
function drawBed(ctx, o) { if (o.floor === 1) return drawCyberBed(ctx, o); rounded(ctx, o.x, o.y, o.w, o.h, 17, true, false, '#b9a287'); rounded(ctx, o.x + 14, o.y + 10, o.w - 28, o.h - 20, 15, true, false, STYLE.linen); rounded(ctx, o.x + 18, o.y + 12, 54, 34, 12, true, false, '#fffaf2'); rounded(ctx, o.x + 78, o.y + 18, o.w - 96, o.h - 34, 14, true, false, '#d6c7b5'); }
function drawDesk(ctx, o) { if (o.floor === 1) return drawCyberDesk(ctx, o); rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false, '#b78556'); rounded(ctx, o.x + 32, o.y + 9, 54, 36, 4, true, false, '#4b4641'); rounded(ctx, o.x + 39, o.y + 15, 40, 17, 2, true, false, '#b9d4d8'); line(ctx, o.x + 48, o.y + 39, o.x + 74, o.y + 39, '#ede4d7', 2); rounded(ctx, o.x + 43, o.y + o.h + 9, 42, 32, 12, true, false, '#6f6157'); rounded(ctx, o.x + 48, o.y + o.h + 14, 32, 16, 8, true, false, '#8c7a6d'); }
function drawBowl(ctx, o) { ellipse(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 2, o.h / 2, STYLE.terracotta); ellipse(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 3, o.h / 3, '#8a4639'); }
function drawLight(ctx, o, state) { if (o.floor === 1) return drawCyberLight(ctx, o, state); circle(ctx, o.x + o.w / 2, o.y + o.h / 2, 11, state.roomLights ? '#e8c35a' : '#9b948a'); }
function drawBookshelf(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false, '#9d704d'); for (let y = o.y + 14; y < o.y + o.h - 8; y += 24) line(ctx, o.x + 8, y, o.x + o.w - 8, y, '#d4b083', 5); }
function drawPoolTable(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 18, true, false, '#8b6b49'); rounded(ctx, o.x + 14, o.y + 14, o.w - 28, o.h - 28, 12, true, false, '#557d67'); for (const [px, py] of [[16,16],[o.w/2,12],[o.w-16,16],[16,o.h-16],[o.w/2,o.h-12],[o.w-16,o.h-16]]) circle(ctx, o.x + px, o.y + py, 7, '#2c2622'); drawPoolCues(ctx, o); if (!state.poolGame || state.poolGame.tableId !== o.id) drawDefaultPoolRack(ctx, o); }
function drawPoolCues(ctx, o) { line(ctx, o.x + 28, o.y + o.h - 19, o.x + o.w - 32, o.y + 22, '#d6b27a', 3); line(ctx, o.x + 34, o.y + 24, o.x + o.w - 44, o.y + o.h - 18, '#d6b27a', 3); }
function drawDefaultPoolRack(ctx, o) { const cy = o.y + o.h * .5; const startX = o.x + o.w * .62; const gap = 15; const colors = ['#f1c66a','#ff75df','#74e6ff','#90d68c','#f08b57','#a98bff','#f8fbff','#e06767','#74c0a8','#d2b064']; circle(ctx, o.x + o.w * .30, cy, 6, '#f8fbff'); ctx.strokeStyle = '#d6b27a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(startX - 13, cy - 36); ctx.lineTo(startX + 60, cy); ctx.lineTo(startX - 13, cy + 36); ctx.closePath(); ctx.stroke(); let index = 0; for (let row = 0; row < 4; row++) for (let col = 0; col <= row; col++) circle(ctx, startX + row * gap, cy + (col - row / 2) * gap, 7, colors[index++ % colors.length]); }
function drawArcade(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#5d4b5d'); rounded(ctx, o.x + 8, o.y + 10, o.w - 16, 28, 4, true, false, '#2a2728'); rounded(ctx, o.x + 14, o.y + 16, o.w - 28, 12, 2, true, false, '#9ecbd1'); }
function drawConsole(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 11, true, false, '#7b7068'); rounded(ctx, o.x + 16, o.y + 10, o.w - 32, 28, 6, true, false, '#363330'); rounded(ctx, o.x + 32, o.y + 16, o.w - 64, 14, 3, true, false, '#9ecbd1'); }
function drawDartboard(ctx, o) { circle(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 2, '#2c2824'); circle(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 3, '#efe7dc', false); circle(ctx, o.x + o.w / 2, o.y + o.h / 2, 4, '#b66d55'); }
function drawOutdoorTrash(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 9, true, false, '#6b8b73'); rounded(ctx, o.x + 8, o.y + 8, o.w - 16, 10, 4, true, false, '#4c6453'); }
function drawTreadmill(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 12, true, false, '#686660'); rounded(ctx, o.x + 14, o.y + 12, o.w - 28, o.h - 24, 8, true, false, '#2e2d2b'); }
function drawWeightBench(ctx, o) { rounded(ctx, o.x, o.y + 12, o.w, 24, 10, true, false, '#6c6159'); line(ctx, o.x + 8, o.y + 6, o.x + o.w - 8, o.y + 6, '#f1e9de', 4); }
function drawHeavyBag(ctx, o) { line(ctx, o.x + o.w / 2, o.y, o.x + o.w / 2, o.y + 16, '#b99d70', 2); rounded(ctx, o.x + 6, o.y + 16, o.w - 12, o.h - 20, 16, true, false, '#7b4e46'); }
function drawPool(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 28, true, false, '#d3c6ad'); rounded(ctx, o.x + 12, o.y + 12, o.w - 24, o.h - 24, 22, true, false, '#74bac4'); ctx.strokeStyle = 'rgba(255,255,255,.55)'; for (let y = o.y + 40; y < o.y + o.h; y += 36) { ctx.beginPath(); ctx.moveTo(o.x + 24, y); ctx.quadraticCurveTo(o.x + o.w / 2, y - 20, o.x + o.w - 24, y); ctx.stroke(); } }
function drawKennel(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 14, true, false, '#8b654c'); ctx.fillStyle = '#3a332d'; ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h - 16, 20, Math.PI, 0); ctx.fill(); }
function drawGarageDoor(ctx, o, state) { rounded(ctx, o.x, o.y, o.w, o.h, 2, true, false, state.objectState.garageDoorOpen ? '#c8b28f' : '#6f665d'); for (let x = o.x + 10; x < o.x + o.w - 4; x += 30) line(ctx, x, o.y + 4, x + 10, o.y + o.h - 4, 'rgba(255,255,255,.25)', 2); }
function drawCar(ctx, o, state) { const flash = state.vehicleDeparture?.vehicleId === o.id ? state.vehicleDeparture.remoteFlashT : state.vehicleReturn?.vehicleId === o.id ? state.vehicleReturn.remoteFlashT : 0; const down = o.facing === 'down'; rounded(ctx, o.x, o.y, o.w, o.h, 24, true, false, o.id === 'car_2' ? '#9b3e35' : '#d9d7cc'); rounded(ctx, o.x + o.w * .18, o.y + o.h * .18, o.w * .64, o.h * .64, 16, true, false, '#d7e2e1'); ctx.strokeStyle = '#5c666c'; ctx.lineWidth = 2; ctx.strokeRect(o.x + o.w * .28, o.y + o.h * .26, o.w * .44, o.h * .34); const frontY = down ? o.y + o.h - 20 : o.y + 10; const rearY = down ? o.y + 10 : o.y + o.h - 20; ctx.fillStyle = flash > 0 ? '#fff3a6' : '#f7f2e9'; ctx.fillRect(o.x + o.w * .2, frontY, 18, 10); ctx.fillRect(o.x + o.w * .66, frontY, 18, 10); ctx.fillStyle = flash > 0 ? '#ff615c' : '#b66d55'; ctx.fillRect(o.x + o.w * .2, rearY, 18, 8); ctx.fillRect(o.x + o.w * .66, rearY, 18, 8); }
function drawBike(ctx, o) { circle(ctx, o.x + 18, o.y + 18, 14, '#6a625c', false); circle(ctx, o.x + o.w - 18, o.y + o.h - 18, 14, '#6a625c', false); line(ctx, o.x + 18, o.y + 18, o.x + o.w - 18, o.y + o.h - 18, '#6a625c', 4); }
function drawMotorbike(ctx, o) { rounded(ctx, o.x + 10, o.y + 8, o.w - 20, o.h - 16, 16, true, false, '#5d5a54'); rounded(ctx, o.x + 12, o.y + 30, o.w - 24, 36, 10, true, false, '#9ecbd1'); circle(ctx, o.x + o.w / 2, o.y + 16, 12, '#6a625c', false); circle(ctx, o.x + o.w / 2, o.y + o.h - 16, 12, '#6a625c', false); }
function drawAtv(ctx, o) { rounded(ctx, o.x, o.y, o.w, o.h, 12, true, false, '#789477'); circle(ctx, o.x + 12, o.y + 22, 10, '#333', false); circle(ctx, o.x + o.w - 12, o.y + 22, 10, '#333', false); circle(ctx, o.x + 12, o.y + o.h - 22, 10, '#333', false); circle(ctx, o.x + o.w - 12, o.y + o.h - 22, 10, '#333', false); }

function drawCyberBed(ctx, o) {
  rounded(ctx, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 18, true, false, '#101722');
  rounded(ctx, o.x, o.y, o.w, o.h, 18, true, false, '#2b3544');
  rounded(ctx, o.x + 13, o.y + 12, o.w - 26, o.h - 22, 15, true, false, '#3b4658');
  rounded(ctx, o.x + 18, o.y + 14, 54, 36, 12, true, false, '#d7d0c7');
  rounded(ctx, o.x + 76, o.y + 18, o.w - 94, o.h - 36, 14, true, false, '#46546a');
  line(ctx, o.x + 86, o.y + 26, o.x + o.w - 28, o.y + 68, 'rgba(255,255,255,.18)', 2);
  neonLine(ctx, o.x + 18, o.y + o.h - 14, o.x + o.w - 18, o.y + o.h - 14, STYLE.magenta, 2, .62);
  stroke(ctx, o, '#6e7e91', 2, 18);
}
function drawCyberDesk(ctx, o) {
  rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#2a3440');
  rounded(ctx, o.x + 7, o.y + 7, o.w - 14, o.h - 14, 5, true, false, '#394657');
  rounded(ctx, o.x + 32, o.y + 9, 56, 36, 4, true, false, '#101722');
  rounded(ctx, o.x + 39, o.y + 15, 42, 18, 2, true, false, '#8beeff');
  neonLine(ctx, o.x + 41, o.y + 38, o.x + 80, o.y + 38, STYLE.cyan, 2, .65);
  rounded(ctx, o.x + 43, o.y + o.h + 9, 42, 32, 12, true, false, '#1e2834');
  rounded(ctx, o.x + 49, o.y + o.h + 14, 30, 16, 8, true, false, '#455569');
  line(ctx, o.x + 12, o.y + o.h - 10, o.x + 34, o.y + o.h + 16, 'rgba(116,230,255,.38)', 2);
  stroke(ctx, o, '#6e7e91', 2, 8);
}
function drawCyberShower(ctx, o) {
  rounded(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#172636');
  rounded(ctx, o.x + 7, o.y + 7, o.w - 14, o.h - 14, 6, true, false, 'rgba(142,232,245,.30)');
  rounded(ctx, o.x + 13, o.y + 13, o.w - 26, o.h - 26, 5, true, false, 'rgba(52,92,112,.55)');
  circle(ctx, o.x + o.w - 16, o.y + 18, 4, '#c9f7ff');
  line(ctx, o.x + 12, o.y + o.h - 18, o.x + o.w - 12, o.y + 18, 'rgba(255,255,255,.24)', 2);
  neonLine(ctx, o.x + 8, o.y + 8, o.x + 8, o.y + o.h - 8, STYLE.cyan, 2, .5);
  stroke(ctx, o, '#8ccedb', 2, 8);
}
function drawCyberToilet(ctx, o) {
  rounded(ctx, o.x + 4, o.y, o.w - 8, 20, 5, true, false, '#c7d3d7');
  rounded(ctx, o.x + 9, o.y + 5, o.w - 18, 9, 4, true, false, '#8aa6ad');
  ellipse(ctx, o.x + o.w / 2, o.y + 40, 19, 16, '#d5e1e4');
  ellipse(ctx, o.x + o.w / 2, o.y + 40, 10, 8, '#537283');
  neonLine(ctx, o.x + 10, o.y + 24, o.x + o.w - 10, o.y + 24, STYLE.cyan, 1.5, .32);
}
function drawCyberStairs(ctx, o) {
  rounded(ctx, o.x, o.y, o.w, o.h, 9, true, false, '#1b2532');
  rounded(ctx, o.x + 8, o.y + 8, o.w - 16, o.h - 16, 6, true, false, '#2b3543');
  for (let y = o.y + 14; y < o.y + o.h - 6; y += 13) {
    line(ctx, o.x + 14, y, o.x + o.w - 14, y, '#748293', 2);
    neonLine(ctx, o.x + 17, y + 3, o.x + o.w - 17, y + 3, STYLE.cyan, 1, .28);
  }
  ctx.fillStyle = '#b7e7ee';
  ctx.font = '900 9px system-ui';
  ctx.fillText('DOWN', o.x + 12, o.y + o.h - 10);
  stroke(ctx, o, '#52657a', 2, 9);
}
function drawCyberLight(ctx, o, state) {
  const on = state.roomLights?.[o.room] !== false;
  rounded(ctx, o.x - 2, o.y - 2, o.w + 4, o.h + 4, 7, true, false, '#121b26');
  circle(ctx, o.x + o.w / 2, o.y + o.h / 2, 10, on ? '#d7fbff' : '#5e6873');
  if (on) neonLine(ctx, o.x + 4, o.y + o.h / 2, o.x + o.w - 4, o.y + o.h / 2, STYLE.cyan, 2, .65);
}

function neonLine(ctx, x1, y1, x2, y2, color, width = 2, alpha = .6) {
  ctx.save();
  ctx.globalAlpha = alpha * .32;
  line(ctx, x1, y1, x2, y2, color, width + 6);
  ctx.globalAlpha = alpha;
  line(ctx, x1, y1, x2, y2, color, width);
  ctx.restore();
}
function rounded(ctx, x, y, w, h, r, fill, stroke, color) { if (color) ctx.fillStyle = color; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r)); else ctx.rect(x, y, Math.max(1, w), Math.max(1, h)); if (fill) ctx.fill(); if (stroke) ctx.stroke(); }
function stroke(ctx, o, color, width = 2, r = 8) { ctx.strokeStyle = color; ctx.lineWidth = width; rounded(ctx, o.x, o.y, o.w, o.h, r, false, true); }
function circle(ctx, x, y, r, color, fill = true) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = color; ctx.fill(); } else { ctx.strokeStyle = color; ctx.stroke(); } }
function ellipse(ctx, x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function line(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
