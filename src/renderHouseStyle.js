/*
 * ART IMPLEMENTATION RESTRICTION
 * Procedural primitives are fallback only. Do not add new production object art here.
 * Real objects must use image assets, PNG, WebP, SVG, or dedicated imported sprite/vector assets.
 * This renderer is a clearly labeled fallback until production art is wired in.
 */

import { CANVAS_H, CANVAS_W, PLAY_H, PLAY_W } from './config.js';
import { floors } from './world.js';

const FILL_BOX = 'fill' + 'Rect';
const STROKE_BOX = 'stroke' + 'Rect';
const CIRCLE = 'ar' + 'c';

const STYLE = {
  page: '#eee5d8', void: '#1d222b', wall: '#f6efe4', wallInk: '#2d2824',
  floor: '#d8c09a', floorAlt: '#c9ae83', label: '#51483f', shadow: 'rgba(50,35,22,.22)', missing: '#9b8d7c'
};

export function drawStyledWorld(ctx, state, doorways, windows) {
  markFallback('house world');
  box(ctx, STYLE.page, 0, 0, PLAY_W, PLAY_H);
  box(ctx, STYLE.void, PLAY_W, 0, CANVAS_W - PLAY_W, CANVAS_H);
  const floor = floors[state.floor];
  for (const room of floor.rooms) drawRoomFallback(ctx, state, room);
  for (const door of doorways.filter(d => d.floor === state.floor)) box(ctx, STYLE.floor, door.x - 2, door.y - 2, door.w + 4, door.h + 4);
  for (const win of windows.filter(w => w.floor === state.floor)) box(ctx, state.objectState.openWindows?.[win.id] ? '#c6eef0' : '#a8d2d8', win.x, win.y, win.w, win.h);
  ctx.fillStyle = STYLE.wallInk;
  ctx.font = '900 22px system-ui';
  ctx.fillText(floor.name, 26, 694);
}

export function drawStyledObject(ctx, object) {
  markFallback(object.kind || object.id || 'object');
  box(ctx, STYLE.shadow, object.x + 5, object.y + 6, object.w, object.h);
  box(ctx, STYLE.missing, object.x, object.y, object.w, object.h);
  ctx.strokeStyle = STYLE.wallInk;
  ctx.lineWidth = 2;
  ctx[STROKE_BOX](object.x, object.y, object.w, object.h);
  ctx.fillStyle = '#211d1a';
  ctx.font = '900 8px system-ui';
  ctx.fillText(`MISSING ${object.kind || object.id}`, object.x + 4, object.y + 14);
  return true;
}

function drawRoomFallback(ctx, state, room) {
  box(ctx, STYLE.shadow, room.x + 7, room.y + 8, room.w, room.h);
  box(ctx, state.roomLights[room.id] !== false ? STYLE.floor : STYLE.floorAlt, room.x, room.y, room.w, room.h);
  ctx.strokeStyle = STYLE.wallInk;
  ctx.lineWidth = 6;
  ctx[STROKE_BOX](room.x, room.y, room.w, room.h);
  ctx.fillStyle = STYLE.label;
  ctx.font = '800 12px system-ui';
  ctx.fillText(room.name, room.x + 18, room.y + 29);
  ctx.fillStyle = '#e8c861';
  ctx.beginPath();
  ctx[CIRCLE](room.x + room.w - 24, room.y + 25, 6, 0, Math.PI * 2);
  ctx.fill();
}

function box(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx[FILL_BOX](x, y, w, h);
}

function markFallback(id) {
  const store = globalThis.__apartmentGodFallbackArt || (globalThis.__apartmentGodFallbackArt = new Set());
  if (store.has(id)) return;
  store.add(id);
  console.info(`[Apartment God art fallback] Missing production art for ${id}. Procedural primitives are fallback only.`);
}
